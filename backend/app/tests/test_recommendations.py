def test_generate_recommendations_full_profile(client, test_user):
    farms_resp = client.get("/api/farms", headers=test_user["headers"])
    farm_id = farms_resp.json()[0]["id"]

    req_payload = {
        "farm_id": farm_id,
        "season": "Kharif (Monsoon)",
        "risk_tolerance": "balanced"
    }
    resp = client.post("/api/recommendations/generate", json=req_payload, headers=test_user["headers"])
    assert resp.status_code == 200
    data = resp.json()
    assert "recommended_crops" in data
    assert "data_quality" in data
    assert len(data["recommended_crops"]) >= 5

    # Check top crop properties
    top_crop = data["recommended_crops"][0]
    assert 0 <= top_crop["suitabilityScore"] <= 100
    assert top_crop["riskLevel"] in ["low", "moderate", "high"]
    assert "reasonsForRecommendation" in top_crop
    assert len(top_crop["climateRisks"]) > 0

    # Verify data completeness
    assert data["data_quality"]["completeness_percentage"] >= 70.0
    assert data["data_quality"]["confidence_classification"] in ["High", "Medium", "Low", "Provisional"]


def test_missing_factor_weight_normalization(client, test_user):
    """Critical GREENPULSE requirement:

    When soil information is missing, do not assume 0 or suitable.
    Normalize weights across available factors so sum(effective_weights) == 1.0.
    """
    # Create farm with completely unknown soil
    farm_resp = client.post("/api/farms", json={
        "farm_name": "Unknown Soil Landholding",
        "state": "Andhra Pradesh",
        "district": "Anantapur",
        "land_area": 6.0,
        "growing_season": "Kharif",
        "irrigation_availability": "rainfed",
        "water_availability": "scarce"
    }, headers=test_user["headers"])
    farm_id = farm_resp.json()["id"]

    # Explicitly clear any soil profile
    client.post(f"/api/soil/{farm_id}", json={
        "soil_knowledge_level": "unknown",
        "soil_type": None
    }, headers=test_user["headers"])

    # Generate recommendation
    resp = client.post("/api/recommendations/generate", json={
        "farm_id": farm_id,
        "season": "Kharif (Monsoon)"
    }, headers=test_user["headers"])
    assert resp.status_code == 200
    data = resp.json()

    dq = data["data_quality"]
    # Soil should be in missing factors
    assert "soil" in dq["missing_factors"]
    assert "soil" not in dq["evaluated_factors"]

    # Effective weights of evaluated factors must sum to 1.0 (approx due to float rounding)
    effective_weights = dq["effective_weights"]
    sum_weights = sum(effective_weights[f] for f in dq["evaluated_factors"])
    assert abs(sum_weights - 1.0) < 0.05

    # Scores must remain valid 0-100 scale without crashing or zeroing out
    for crop in data["recommended_crops"]:
        assert 10.0 <= crop["suitabilityScore"] <= 100.0


def test_get_cached_or_latest_recommendation(client, test_user):
    farms_resp = client.get("/api/farms", headers=test_user["headers"])
    farm_id = farms_resp.json()[0]["id"]

    # Fetch latest recommendation
    resp = client.get(f"/api/recommendations/{farm_id}", headers=test_user["headers"])
    assert resp.status_code == 200
    data = resp.json()
    assert data["farm_id"] == farm_id
    rec_id = data["id"]

    # Fetch details by ID
    det_resp = client.get(f"/api/recommendations/details/{rec_id}", headers=test_user["headers"])
    assert det_resp.status_code == 200
    assert det_resp.json()["id"] == rec_id

