def test_scenario_a_farmer_knows_soil_type(client, test_user):
    # Create a fresh farm holding with no previous measurements
    farm_resp = client.post("/api/farms", json={
        "farm_name": "Scenario A Holding",
        "state": "Andhra Pradesh",
        "district": "Anantapur",
        "land_area": 3.5,
        "growing_season": "Kharif",
        "irrigation_availability": "rainfed",
        "water_availability": "moderate"
    }, headers=test_user["headers"])
    farm_id = farm_resp.json()["id"]

    # Farmer reports Red soil
    payload = {
        "soil_knowledge_level": "know_type",
        "soil_type": "red",
        "soil_data_source": "Farmer Visual Observation"
    }
    resp = client.post(f"/api/soil/{farm_id}", json=payload, headers=test_user["headers"])
    assert resp.status_code == 201
    data = resp.json()
    assert data["soil_type"] == "red"
    assert data["verification_status"] == "farmer_reported"
    # Never generate fake pH or NPK!
    assert data["soil_ph"] is None


def test_scenario_b_soil_health_card_submission(client, test_user):
    farms_resp = client.get("/api/farms", headers=test_user["headers"])
    farm_id = farms_resp.json()[0]["id"]

    card_payload = {
        "soil_ph": 6.8,
        "nitrogen": 240.0,
        "phosphorus": 18.5,
        "potassium": 215.0,
        "organic_carbon": 0.48,
        "soil_type": "red",
        "lab_name": "District Soil Testing Laboratory, Anantapur",
        "soil_card_number": "SHC-AP-ATP-2026-9812",
        "source_of_information": "Soil Health Card Scheme"
    }
    resp = client.post(f"/api/soil/{farm_id}/test-results", json=card_payload, headers=test_user["headers"])
    assert resp.status_code == 200
    data = resp.json()
    assert data["verification_status"] == "measured"
    assert data["soil_ph"] == 6.8
    assert data["nitrogen"] == 240.0
    assert data["phosphorus"] == 18.5
    assert data["potassium"] == 215.0
    assert data["soil_card_number"] == "SHC-AP-ATP-2026-9812"


def test_scenario_c_unknown_soil_details(client, test_user):
    # Create farm with empty soil
    farm_resp = client.post("/api/farms", json={
        "farm_name": "Unexplored Field",
        "state": "Rajasthan",
        "district": "Jodhpur",
        "land_area": 4.0,
        "growing_season": "Kharif",
        "irrigation_availability": "rainfed",
        "water_availability": "scarce"
    }, headers=test_user["headers"])
    farm_id = farm_resp.json()["id"]

    # Soil status should be unknown
    status_resp = client.get(f"/api/soil/{farm_id}/status", headers=test_user["headers"])
    assert status_resp.status_code == 200
    status_data = status_resp.json()
    assert status_data["status"] == "unknown"
    assert "Soil Type" in status_data["missing_parameters"]
    assert "pH" in status_data["missing_parameters"]
    # Verify no fake values were populated
    assert status_data["soil_ph"] is None
    assert status_data["soil_type"] is None


def test_soil_ph_validation_limits(client, test_user):
    farms_resp = client.get("/api/farms", headers=test_user["headers"])
    farm_id = farms_resp.json()[0]["id"]

    # pH 1.5 is outside realistic agronomic range (3.0 - 11.0)
    resp = client.post(f"/api/soil/{farm_id}/test-results", json={
        "soil_ph": 1.5,
        "source_of_information": "Lab"
    }, headers=test_user["headers"])
    assert resp.status_code == 422
    assert "pH" in resp.json()["detail"] or "greater than or equal to 3" in str(resp.json())


def test_negative_npk_rejection(client, test_user):
    farms_resp = client.get("/api/farms", headers=test_user["headers"])
    farm_id = farms_resp.json()[0]["id"]

    resp = client.post(f"/api/soil/{farm_id}/test-results", json={
        "soil_ph": 7.0,
        "nitrogen": -50.0,
        "source_of_information": "Lab"
    }, headers=test_user["headers"])
    assert resp.status_code == 422

