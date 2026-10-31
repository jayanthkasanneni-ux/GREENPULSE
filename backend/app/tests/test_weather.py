from app.services.weather_service import WeatherService, DISTRICT_COORDINATES


def test_get_climate_summary(client, test_user):
    farms_resp = client.get("/api/farms", headers=test_user["headers"])
    farm_id = farms_resp.json()[0]["id"]

    resp = client.get(f"/api/climate/{farm_id}/summary", headers=test_user["headers"])
    assert resp.status_code == 200
    data = resp.json()
    assert "total_annual_rainfall_mm" in data
    assert "kharif_rainfall_mm" in data
    assert "dry_spell_days" in data
    assert "extreme_rainfall_events" in data
    assert "data_source" in data
    assert "is_demo_data" in data
    assert data["farm_id"] == farm_id


def test_get_historical_monthly_series(client, test_user):
    farms_resp = client.get("/api/farms", headers=test_user["headers"])
    farm_id = farms_resp.json()[0]["id"]

    resp = client.get(f"/api/climate/{farm_id}/historical", headers=test_user["headers"])
    assert resp.status_code == 200
    series = resp.json()
    assert len(series) == 12  # Jan through Dec
    assert series[0]["month"] == "Jan"
    assert "rainfallCurrentMm" in series[0]
    assert "tempMaxC" in series[0]


def test_get_seasonal_rainfall(client, test_user):
    farms_resp = client.get("/api/farms", headers=test_user["headers"])
    farm_id = farms_resp.json()[0]["id"]

    resp = client.get(f"/api/climate/{farm_id}/seasonal", headers=test_user["headers"])
    assert resp.status_code == 200
    seasonal = resp.json()
    assert len(seasonal) >= 4
    assert "kharifMm" in seasonal[0]
    assert "rabiMm" in seasonal[0]


def test_district_centroid_fallback(client, test_user):
    # Create farm with no GPS coordinates
    farm_resp = client.post("/api/farms", json={
        "farm_name": "No GPS Farm",
        "state": "Maharashtra",
        "district": "Nashik",
        "land_area": 3.0,
        "growing_season": "Kharif",
        "irrigation_availability": "borewell",
        "water_availability": "moderate"
    }, headers=test_user["headers"])
    farm_id = farm_resp.json()["id"]

    summary_resp = client.get(f"/api/climate/{farm_id}/summary", headers=test_user["headers"])
    assert summary_resp.status_code == 200
    data = summary_resp.json()
    # Should resolve Nashik coordinates from DISTRICT_COORDINATES
    assert abs(data["latitude"] - DISTRICT_COORDINATES["nashik"][0]) < 0.1
    assert abs(data["longitude"] - DISTRICT_COORDINATES["nashik"][1]) < 0.1

