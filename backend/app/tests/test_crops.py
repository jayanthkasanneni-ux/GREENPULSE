def test_get_all_crops(client):
    resp = client.get("/api/crops")
    assert resp.status_code == 200
    crops = resp.json()
    assert len(crops) >= 5
    crop_codes = [c["id"] for c in crops]
    assert "crop-groundnut" in crop_codes
    assert "crop-millets" in crop_codes
    assert "crop-maize" in crop_codes


def test_get_crop_details(client):
    resp = client.get("/api/crops/crop-groundnut")
    assert resp.status_code == 200
    crop = resp.json()
    assert crop["name"] == "Groundnut (Peanut)"
    assert "Arachis hypogaea" in crop["botanicalName"]
    assert "agronomicAdvisory" in crop
    assert crop["isVerified"] is True


def test_get_nonexistent_crop_returns_404(client):
    resp = client.get("/api/crops/non-existent-crop-xyz")
    assert resp.status_code == 404


def test_crop_comparison_two_crops(client):
    payload = {
        "crop_codes": ["crop-groundnut", "crop-millets"]
    }
    resp = client.post("/api/crops/compare", json=payload)
    assert resp.status_code == 200
    data = resp.json()
    assert len(data["compared_crops"]) == 2
    assert len(data["comparative_factors"]) >= 4
    assert "trade_offs_summary" in data
    assert "strategic_recommendation" in data


def test_crop_comparison_three_crops_with_farm_context(client, test_user):
    farms_resp = client.get("/api/farms", headers=test_user["headers"])
    farm_id = farms_resp.json()[0]["id"]

    payload = {
        "crop_codes": ["crop-groundnut", "crop-millets", "crop-maize"],
        "farm_id": farm_id
    }
    resp = client.post("/api/crops/compare", json=payload)
    assert resp.status_code == 200
    data = resp.json()
    assert len(data["compared_crops"]) == 3
    assert data["data_completeness_percent"] >= 80.0


def test_crop_comparison_validation_fails_with_one_crop(client):
    payload = {
        "crop_codes": ["crop-groundnut"]
    }
    resp = client.post("/api/crops/compare", json=payload)
    assert resp.status_code == 422  # Pydantic min_length=2


def test_water_assessment_endpoint(client, test_user):
    farms_resp = client.get("/api/farms", headers=test_user["headers"])
    farm_id = farms_resp.json()[0]["id"]

    resp = client.get(f"/api/water/{farm_id}/assessment", headers=test_user["headers"])
    assert resp.status_code == 200
    data = resp.json()
    assert "water_availability_category" in data
    assert "potential_water_stress" in data
    assert "suitable_water_efficient_alternatives" in data
    assert "scientific_disclaimer" in data


def test_guidance_endpoints(client):
    # All guidance
    resp = client.get("/api/guidance")
    assert resp.status_code == 200
    guides = resp.json()
    assert len(guides) >= 3
    assert "sourceAttribution" in guides[0]

    # Filter by category
    cat_resp = client.get("/api/guidance?category=Water Management")
    assert cat_resp.status_code == 200
    assert len(cat_resp.json()) >= 1

    # Filter by crop
    crop_resp = client.get("/api/guidance/Groundnut")
    assert crop_resp.status_code == 200


def test_planning_report_generation(client, test_user):
    farms_resp = client.get("/api/farms", headers=test_user["headers"])
    farm_id = farms_resp.json()[0]["id"]

    resp = client.get(f"/api/reports/{farm_id}", headers=test_user["headers"])
    assert resp.status_code == 200
    report = resp.json()
    assert "report_id" in report
    assert "farm_profile" in report
    assert "climate_summary" in report
    assert "soil_status" in report
    assert "water_assessment" in report
    assert "top_recommended_crops" in report
    assert "legal_disclaimer" in report

