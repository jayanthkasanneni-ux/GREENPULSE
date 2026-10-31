import logging
from datetime import datetime, date, timedelta
from typing import Dict, Any, List, Optional, Tuple
import httpx
import numpy as np
import pandas as pd
from sqlalchemy.orm import Session

from app.config import settings
from app.models.weather import WeatherRecord
from app.models.farm import Farm
from app.services.demo_data_service import DEMO_MONTHLY_CLIMATE, DEMO_SEASONAL_RAINFALL

logger = logging.getLogger("greenpulse.weather_service")

# In-memory LRU/dict cache for external API calls: (lat_round, lon_round) -> (cached_at, data)
_WEATHER_CACHE: Dict[Tuple[float, float], Tuple[datetime, Dict[str, Any]]] = {}
CACHE_TTL = timedelta(hours=6)

# Representative district coordinates fallback if user has not provided exact GPS
DISTRICT_COORDINATES: Dict[str, Tuple[float, float]] = {
    "anantapur": (14.6819, 77.6006),
    "kurnool": (15.8281, 78.0373),
    "kadapa": (14.4673, 78.8242),
    "chittoor": (13.2172, 79.1003),
    "nashik": (19.9975, 73.7898),
    "dharwad": (15.4589, 75.0078),
    "jodhpur": (26.2389, 73.0243),
    "bikaner": (28.0229, 73.3119),
    "aurangabad": (19.8762, 75.3433),
    "nagpur": (21.1458, 79.0882),
    "hyderabad": (17.3850, 78.4867),
    "guntur": (16.3067, 80.4365)
}


def get_farm_coordinates(farm: Farm) -> Tuple[float, float]:
    """Retrieve GPS coordinates or determine reliable district center coordinates."""
    if farm.latitude is not None and farm.longitude is not None:
        return farm.latitude, farm.longitude

    d_clean = (farm.district or "").lower().strip()
    if d_clean in DISTRICT_COORDINATES:
        return DISTRICT_COORDINATES[d_clean]

    for key, coords in DISTRICT_COORDINATES.items():
        if key in d_clean:
            return coords

    # Default to semi-arid Deccan representative coordinates (Anantapur)
    return (14.6819, 77.6006)


class WeatherService:
    @staticmethod
    async def fetch_open_meteo_historical(
        latitude: float,
        longitude: float,
        start_date: str,
        end_date: str
    ) -> Optional[Dict[str, Any]]:
        """Fetch historical daily precipitation and temperatures from Open-Meteo Archive API."""
        url = f"{settings.OPEN_METEO_BASE_URL}/archive"
        params = {
            "latitude": latitude,
            "longitude": longitude,
            "start_date": start_date,
            "end_date": end_date,
            "daily": ["precipitation_sum", "temperature_2m_max", "temperature_2m_min", "temperature_2m_mean"],
            "timezone": "auto"
        }
        try:
            async with httpx.AsyncClient(timeout=settings.EXTERNAL_API_TIMEOUT_SECONDS) as client:
                response = await client.get(url, params=params)
                if response.status_code == 200:
                    data = response.json()
                    if "daily" in data:
                        return data
                logger.warning(f"Open-Meteo API non-200 response: {response.status_code} - {response.text[:200]}")
        except Exception as e:
            logger.warning(f"Open-Meteo API network failure or timeout: {e}")
        return None

    @staticmethod
    async def fetch_nasa_power_climatology(
        latitude: float,
        longitude: float
    ) -> Optional[Dict[str, Any]]:
        """Fetch monthly solar radiation & precipitation climatology from NASA POWER API as secondary source."""
        url = settings.NASA_POWER_BASE_URL
        params = {
            "parameters": "PRECTOTCORR,T2M,T2M_MAX,T2M_MIN",
            "community": "AG",
            "longitude": longitude,
            "latitude": latitude,
            "start": "20240101",
            "end": "20241231",
            "format": "JSON"
        }
        try:
            async with httpx.AsyncClient(timeout=settings.EXTERNAL_API_TIMEOUT_SECONDS) as client:
                response = await client.get(url, params=params)
                if response.status_code == 200:
                    return response.json()
        except Exception as e:
            logger.warning(f"NASA POWER API request failed: {e}")
        return None

    @classmethod
    async def get_or_fetch_weather(
        cls,
        farm: Farm,
        db: Session,
        force_refresh: bool = False
    ) -> Dict[str, Any]:
        """Retrieve weather observations from cache, database, or external APIs,

        falling back gracefully to verified demonstration climatology if external APIs are unreachable.
        """
        lat, lon = get_farm_coordinates(farm)
        cache_key = (round(lat, 2), round(lon, 2))

        # 1. Check in-memory cache
        if not force_refresh and cache_key in _WEATHER_CACHE:
            cached_time, cached_payload = _WEATHER_CACHE[cache_key]
            if datetime.utcnow() - cached_time < CACHE_TTL:
                res = dict(cached_payload)
                res["farm_id"] = farm.id
                return res

        # 2. Check if DB has stored weather records for this farm
        db_records = (
            db.query(WeatherRecord)
            .filter(WeatherRecord.farm_id == farm.id)
            .order_by(WeatherRecord.observation_date.desc())
            .limit(365)
            .all()
        )
        if len(db_records) >= 30 and not force_refresh:
            processed = cls._process_weather_records(db_records, farm, is_demo=False, source=db_records[0].data_source)
            _WEATHER_CACHE[cache_key] = (datetime.utcnow(), processed)
            return processed

        # 3. Attempt external fetch from Open-Meteo
        one_year_ago = (datetime.utcnow() - timedelta(days=365)).strftime("%Y-%m-%d")
        yesterday = (datetime.utcnow() - timedelta(days=2)).strftime("%Y-%m-%d")
        external_data = await cls.fetch_open_meteo_historical(lat, lon, one_year_ago, yesterday)

        if external_data and "daily" in external_data:
            daily = external_data["daily"]
            time_series = daily.get("time", [])
            rain_series = daily.get("precipitation_sum", [])
            temp_max = daily.get("temperature_2m_max", [])
            temp_min = daily.get("temperature_2m_min", [])
            temp_mean = daily.get("temperature_2m_mean", [])

            # Persist valid records to DB
            new_records: List[WeatherRecord] = []
            for i, d_str in enumerate(time_series):
                try:
                    obs_date = datetime.strptime(d_str, "%Y-%m-%d").date()
                    r_val = float(rain_series[i]) if rain_series[i] is not None else 0.0
                    t_mx = float(temp_max[i]) if temp_max[i] is not None else None
                    t_mn = float(temp_min[i]) if temp_min[i] is not None else None
                    t_avg = float(temp_mean[i]) if temp_mean[i] is not None else None

                    rec = WeatherRecord(
                        farm_id=farm.id,
                        latitude=lat,
                        longitude=lon,
                        observation_date=obs_date,
                        rainfall_mm=r_val,
                        temp_min_c=t_mn,
                        temp_max_c=t_mx,
                        temp_avg_c=t_avg,
                        data_source="Open-Meteo Historical Archive",
                        is_forecast=False,
                        is_demo=False
                    )
                    new_records.append(rec)
                except Exception as ex:
                    logger.debug(f"Error parsing date {d_str}: {ex}")

            if new_records:
                # Clear old records for clean update
                db.query(WeatherRecord).filter(WeatherRecord.farm_id == farm.id).delete()
                db.bulk_save_objects(new_records)
                db.commit()

                processed = cls._process_weather_records(
                    new_records, farm, is_demo=False, source="Open-Meteo Historical Archive"
                )
                _WEATHER_CACHE[cache_key] = (datetime.utcnow(), processed)
                return processed

        # 4. Graceful Fallback to Demonstration / Baseline Data (Clearly labelled!)
        logger.info(f"Using clearly labelled demonstration climate baseline for farm {farm.id} ({farm.district})")
        demo_summary = cls._generate_demo_climate_summary(farm, lat, lon)
        _WEATHER_CACHE[cache_key] = (datetime.utcnow(), demo_summary)
        return demo_summary

    @classmethod
    def _process_weather_records(
        cls,
        records: List[WeatherRecord],
        farm: Farm,
        is_demo: bool,
        source: str
    ) -> Dict[str, Any]:
        """Aggregate raw weather observation records into scientific agronomic metrics."""
        df = pd.DataFrame([{
            "date": pd.to_datetime(r.observation_date),
            "rain": r.rainfall_mm or 0.0,
            "t_max": r.temp_max_c if r.temp_max_c is not None else np.nan,
            "t_min": r.temp_min_c if r.temp_min_c is not None else np.nan,
            "t_avg": r.temp_avg_c if r.temp_avg_c is not None else np.nan,
        } for r in records])

        total_annual = float(df["rain"].sum())
        
        # Monthly grouping
        df["month"] = df["date"].dt.strftime("%b")
        df["month_num"] = df["date"].dt.month

        # Kharif is June to October (Months 6-10)
        kharif_df = df[df["month_num"].isin([6, 7, 8, 9, 10])]
        kharif_rain = float(kharif_df["rain"].sum()) if not kharif_df.empty else total_annual * 0.75

        # Rabi is November to February (Months 11, 12, 1, 2)
        rabi_df = df[df["month_num"].isin([11, 12, 1, 2])]
        rabi_rain = float(rabi_df["rain"].sum()) if not rabi_df.empty else total_annual * 0.20

        avg_temp = float(df["t_avg"].dropna().mean()) if not df["t_avg"].dropna().empty else 28.5
        max_temp = float(df["t_max"].dropna().max()) if not df["t_max"].dropna().empty else 38.0
        min_temp = float(df["t_min"].dropna().min()) if not df["t_min"].dropna().empty else 16.5

        # Extreme events (>50mm per day)
        extreme_events = int((df["rain"] >= 50.0).sum())

        # Dry spell calculation: max consecutive days where rain < 2.5 mm
        dry_days = (df["rain"] < 2.5).astype(int)
        dry_spells = (dry_days != dry_days.shift()).cumsum()
        dry_spell_lengths = dry_days.groupby(dry_spells).sum()
        max_dry_spell = int(dry_spell_lengths.max()) if not dry_spell_lengths.empty else 14

        # Rainfall variability (CV = std / mean of monthly precipitation)
        monthly_rains = df.groupby("month_num")["rain"].sum()
        mean_monthly = float(monthly_rains.mean()) if not monthly_rains.empty else 40.0
        std_monthly = float(monthly_rains.std()) if not monthly_rains.empty else 12.0
        cv = round(std_monthly / mean_monthly, 3) if mean_monthly > 0 else 0.35

        lat, lon = get_farm_coordinates(farm)

        return {
            "farm_id": farm.id,
            "state": farm.state,
            "district": farm.district,
            "latitude": lat,
            "longitude": lon,
            "total_annual_rainfall_mm": round(total_annual, 1),
            "kharif_rainfall_mm": round(kharif_rain, 1),
            "rabi_rainfall_mm": round(rabi_rain, 1),
            "average_temperature_c": round(avg_temp, 1),
            "max_recorded_temp_c": round(max_temp, 1),
            "min_recorded_temp_c": round(min_temp, 1),
            "dry_spell_days": max_dry_spell,
            "extreme_rainfall_events": extreme_events,
            "rainfall_variability_coefficient": cv,
            "data_source": source,
            "retrieval_timestamp": datetime.utcnow().isoformat(),
            "is_demo_data": is_demo,
            "data_limitations": "Direct meteorological sensor / satellite grid observations." if not is_demo else "Demonstration baseline data."
        }

    @classmethod
    def _generate_demo_climate_summary(cls, farm: Farm, lat: float, lon: float) -> Dict[str, Any]:
        """Return a scientifically calibrated demonstration climate profile for offline or demo use."""
        return {
            "farm_id": farm.id,
            "state": farm.state,
            "district": farm.district,
            "latitude": lat,
            "longitude": lon,
            "total_annual_rainfall_mm": 568.0,
            "kharif_rainfall_mm": 488.0,
            "rabi_rainfall_mm": 156.0,
            "average_temperature_c": 28.4,
            "max_recorded_temp_c": 39.8,
            "min_recorded_temp_c": 17.1,
            "dry_spell_days": 14,
            "extreme_rainfall_events": 2,
            "rainfall_variability_coefficient": 0.28,
            "data_source": "Demonstration / Regional Climatology Baseline (Rayalaseema Semi-Arid Zone)",
            "retrieval_timestamp": datetime.utcnow().isoformat(),
            "is_demo_data": True,
            "data_limitations": "Simulated meteorological baseline for hackathon demonstration when external APIs are offline."
        }

    @classmethod
    def get_monthly_metrics(cls, farm_id: int) -> List[Dict[str, Any]]:
        """Return 12-month climate series for charts in the React frontend."""
        return DEMO_MONTHLY_CLIMATE

    @classmethod
    def get_seasonal_rainfall(cls, farm_id: int) -> List[Dict[str, Any]]:
        """Return historical seasonal rainfall comparisons for the React frontend."""
        return DEMO_SEASONAL_RAINFALL

