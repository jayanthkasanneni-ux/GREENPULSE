from app.algorithms.risk_assessment import (
    assess_drought_risk,
    assess_heat_stress_risk,
    assess_excess_rainfall_risk,
)


def test_drought_risk_calculation():
    # Low drought risk: low sensitivity + irrigation
    low_risk = assess_drought_risk(
        crop_drought_sensitivity="low",
        rainfall_deficit_pct=10.0,
        dry_spell_days=7,
        water_availability="abundant",
        irrigation_type="drip",
        has_weather_data=True
    )
    assert low_risk.risk_level in ["Low", "Moderate"]
    assert low_risk.score < 50.0
    assert len(low_risk.factors) > 0
    assert len(low_risk.supporting_observations) > 0

    # High drought risk: high sensitivity + rainfed + prolonged dry spell
    high_risk = assess_drought_risk(
        crop_drought_sensitivity="high",
        rainfall_deficit_pct=60.0,
        dry_spell_days=25,
        water_availability="rainfed_only",
        irrigation_type="rainfed",
        has_weather_data=True
    )
    assert high_risk.risk_level == "High"
    assert high_risk.score >= 65.0


def test_heat_stress_risk_calculation():
    # Ambient max temp 32C with crop ceiling 35C -> Low heat stress
    low_heat = assess_heat_stress_risk(
        crop_heat_sensitivity="moderate",
        max_recorded_temp_c=32.0,
        crop_temp_max_c=35.0,
        has_weather_data=True
    )
    assert low_heat.risk_level == "Low"

    # Ambient max temp 41C with crop ceiling 34C -> High heat stress
    high_heat = assess_heat_stress_risk(
        crop_heat_sensitivity="high",
        max_recorded_temp_c=41.0,
        crop_temp_max_c=34.0,
        has_weather_data=True
    )
    assert high_heat.risk_level == "High"
    assert "41.0°C" in high_heat.supporting_observations[0]


def test_excess_rainfall_risk_calculation():
    # Rice in clay soil with 2 extreme events
    excess_res = assess_excess_rainfall_risk(
        crop_excess_sensitivity="low",
        soil_type="clay",
        extreme_rainfall_events=1,
        seasonal_rainfall_mm=600.0,
        crop_rainfall_max_mm=1200.0,
        has_weather_data=True
    )
    assert excess_res.risk_level in ["Low", "Moderate"]

    # Groundnut in clay soil with 6 torrential rainfall events
    gn_excess = assess_excess_rainfall_risk(
        crop_excess_sensitivity="high",
        soil_type="clay",
        extreme_rainfall_events=6,
        seasonal_rainfall_mm=850.0,
        crop_rainfall_max_mm=650.0,
        has_weather_data=True
    )
    assert gn_excess.risk_level == "High"


def test_missing_weather_returns_unknown_risk():
    """Verify that absent weather data does not invent arbitrary random numbers."""
    drought = assess_drought_risk(
        crop_drought_sensitivity="high",
        rainfall_deficit_pct=0.0,
        dry_spell_days=0,
        water_availability="moderate",
        irrigation_type="borewell",
        has_weather_data=False
    )
    assert drought.risk_level == "Unknown"
    assert "Missing" in drought.factors[0]

    heat = assess_heat_stress_risk(
        crop_heat_sensitivity="high",
        max_recorded_temp_c=0.0,
        crop_temp_max_c=35.0,
        has_weather_data=False
    )
    assert heat.risk_level == "Unknown"


def test_farm_climate_risk_endpoint(client, test_user):
    farms_resp = client.get("/api/farms", headers=test_user["headers"])
    farm_id = farms_resp.json()[0]["id"]

    resp = client.get(f"/api/climate/{farm_id}/risk", headers=test_user["headers"])
    assert resp.status_code == 200
    data = resp.json()
    assert "drought_risk" in data
    assert "heat_stress_risk" in data
    assert "excess_rainfall_risk" in data
    assert "composite_climate_risk" in data
    assert "disclaimer" in data

