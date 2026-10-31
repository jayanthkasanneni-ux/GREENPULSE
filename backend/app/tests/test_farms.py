def test_create_farm_success(client, test_user):
    payload = {
        "farm_name": "Kudair North Field",
        "state": "Andhra Pradesh",
        "district": "Anantapur",
        "village": "Kudair",
        "latitude": 14.68,
        "longitude": 77.60,
        "land_area": 5.2,
        "growing_season": "Kharif",
        "irrigation_availability": "borewell",
        "water_availability": "moderate"
    }
    resp = client.post("/api/farms", json=payload, headers=test_user["headers"])
    assert resp.status_code == 201
    data = resp.json()
    assert data["farm_name"] == "Kudair North Field"
    assert data["land_area"] == 5.2
    assert data["user_id"] == test_user["id"]
    assert "id" in data


def test_create_farm_invalid_land_area(client, test_user):
    payload = {
        "farm_name": "Zero Acre Field",
        "state": "Andhra Pradesh",
        "district": "Anantapur",
        "land_area": 0.0,
        "growing_season": "Kharif",
        "irrigation_availability": "rainfed",
        "water_availability": "scarce"
    }
    resp = client.post("/api/farms", json=payload, headers=test_user["headers"])
    assert resp.status_code == 422
    assert "greater than 0" in str(resp.json())


def test_create_farm_invalid_coordinates(client, test_user):
    payload = {
        "farm_name": "Bad GPS Plot",
        "state": "Andhra Pradesh",
        "district": "Anantapur",
        "latitude": 195.0,  # Invalid latitude
        "longitude": 77.0,
        "land_area": 3.0,
        "growing_season": "Kharif",
        "irrigation_availability": "rainfed",
        "water_availability": "scarce"
    }
    resp = client.post("/api/farms", json=payload, headers=test_user["headers"])
    assert resp.status_code == 422
    assert "Latitude" in str(resp.json()) or "latitude" in str(resp.json())


def test_get_user_farms(client, test_user):
    resp = client.get("/api/farms", headers=test_user["headers"])
    assert resp.status_code == 200
    farms = resp.json()
    assert isinstance(farms, list)
    assert len(farms) >= 1  # Includes auto-created farm from registration


def test_update_farm_success(client, test_user):
    # Get user farm
    farms_resp = client.get("/api/farms", headers=test_user["headers"])
    farm_id = farms_resp.json()[0]["id"]

    update_payload = {
        "farm_name": "Updated Holding Name",
        "land_area": 8.5,
        "water_availability": "abundant"
    }
    resp = client.put(f"/api/farms/{farm_id}", json=update_payload, headers=test_user["headers"])
    assert resp.status_code == 200
    data = resp.json()
    assert data["farm_name"] == "Updated Holding Name"
    assert data["land_area"] == 8.5
    assert data["water_availability"] == "abundant"


def test_unauthorized_farm_access(client, test_user, secondary_user):
    # test_user's farm
    farms_resp = client.get("/api/farms", headers=test_user["headers"])
    user_a_farm_id = farms_resp.json()[0]["id"]

    # secondary_user attempts to update user_a's farm
    resp = client.put(
        f"/api/farms/{user_a_farm_id}",
        json={"farm_name": "Hacked Farm"},
        headers=secondary_user["headers"]
    )
    assert resp.status_code == 403
    assert "permission" in resp.json()["detail"].lower()

    # secondary_user attempts to delete user_a's farm
    del_resp = client.delete(
        f"/api/farms/{user_a_farm_id}",
        headers=secondary_user["headers"]
    )
    assert del_resp.status_code == 403

