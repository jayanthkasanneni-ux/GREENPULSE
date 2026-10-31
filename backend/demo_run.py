"""GREENPULSE Demonstration Runner.

Executes a complete end-to-end simulated workflow through the GREENPULSE backend API:
1. Authentication (Login with Demo Farmer Rameshwar Reddy)
2. Retrieve Farm Profile
3. Smart Soil Identification Status Check
4. Weather & Climate Intelligence Analysis
5. Water Availability Assessment
6. Rule-Based Crop Suitability Recommendation Generation (with Weight Normalization)
7. Multi-Crop Comparative Analysis
8. Verified Agronomic Guidance Citations
9. Comprehensive Planning Report Compilation
"""

import sys
import json
from fastapi.testclient import TestClient

from app.main import app

def run_demo():
    print("=" * 80)
    print("  GREENPULSE – Climate-Resilient Crop Planning Assistant")
    print("  Brand: GREENPULSE | Tagline: Growing Smarter with Climate Intelligence")
    print("=" * 80)

    client = TestClient(app)

    # 1. Health & Root Verification
    print("\n[1] Verifying System Status & Health...")
    root_resp = client.get("/")
    print(f"  Root Endpoint (200 OK): {root_resp.json()['brand']} - {root_resp.json()['tagline']}")
    health_resp = client.get("/api/health")
    print(f"  Health Check: {health_resp.json()['status']} | Engine: {health_resp.json()['engine']}")

    # 2. Authentication with Demo User
    print("\n[2] Authenticating Demo Farmer Account...")
    login_resp = client.post("/api/auth/login", json={
        "email": "rameshwar.reddy@agrimail.in",
        "password": "Password123!"
    })
    assert login_resp.status_code == 200, f"Login failed: {login_resp.text}"
    auth_data = login_resp.json()
    token = auth_data["access_token"]
    headers = {"Authorization": f"Bearer {token}"}
    user = auth_data["user"]
    print(f"  Authenticated User: {user['full_name']} ({user['email']})")
    print(f"  JWT Token Issued: {token[:25]}... (Expires in {auth_data['expires_in']}s)")

    # 3. Farm Profile Retrieval
    print("\n[3] Retrieving Farm Profile...")
    farm_resp = client.get("/api/farms/1", headers=headers)
    assert farm_resp.status_code == 200, f"Farm fetch failed: {farm_resp.text}"
    farm = farm_resp.json()
    print(f"  Farm ID: {farm['id']} | Holding: {farm['farm_name']}")
    print(f"  Location: {farm['village']}, {farm['district']}, {farm['state']} (GPS: {farm['latitude']}, {farm['longitude']})")
    print(f"  Land Area: {farm['land_area']} Acres | Season: {farm['growing_season']}")
    print(f"  Water Infrastructure: {farm['irrigation_availability']} ({farm['water_availability']})")

    # 4. Smart Soil Identification
    print("\n[4] Smart Soil Identification Diagnostic Status...")
    soil_resp = client.get(f"/api/soil/{farm['id']}/status", headers=headers)
    assert soil_resp.status_code == 200
    soil = soil_resp.json()
    print(f"  Verification Status: {soil['status'].upper()}")
    print(f"  Reported Texture: {soil['soil_type'].capitalize()} Soil")
    print(f"  Tested Parameters: {', '.join(soil['tested_parameters'])}")
    print(f"  Data Source: {soil['data_source']}")
    print(f"  Scientific Disclaimer: {soil['scientific_disclaimer']}")

    # 5. Climate Intelligence & Historical Weather
    print("\n[5] Retrieving Historical Climate & Weather Intelligence...")
    climate_resp = client.get(f"/api/climate/{farm['id']}/summary", headers=headers)
    assert climate_resp.status_code == 200
    clim = climate_resp.json()
    print(f"  Data Source: {clim['data_source']}")
    print(f"  Annual Rainfall: {clim['total_annual_rainfall_mm']} mm | Kharif Monsoon: {clim['kharif_rainfall_mm']} mm")
    print(f"  Average Temperature: {clim['average_temperature_c']}°C (Max: {clim['max_recorded_temp_c']}°C, Min: {clim['min_recorded_temp_c']}°C)")
    print(f"  Rainfall Variability (CV): {clim['rainfall_variability_coefficient']}")
    print(f"  Longest Recorded Dry Spell: {clim['dry_spell_days']} days | Heavy Rainfall Events: {clim['extreme_rainfall_events']}")

    # 6. Water Availability & Stress Assessment
    print("\n[6] Conducting Water Security Assessment...")
    water_resp = client.get(f"/api/water/{farm['id']}/assessment", headers=headers)
    assert water_resp.status_code == 200
    water = water_resp.json()
    print(f"  Water Availability Category: {water['water_availability_category']}")
    print(f"  Potential Moisture Stress: {water['potential_water_stress']}")
    print(f"  Crop Demand Compatibility: {water['crop_water_demand_compatibility']}")
    print(f"  Water-Efficient Alternatives: {', '.join(water['suitable_water_efficient_alternatives'])}")

    # 7. Rule-Based Crop Suitability Engine
    print("\n[7] Generating Multi-Factor Rule-Based Crop Recommendations...")
    rec_resp = client.post("/api/recommendations/generate", json={
        "farm_id": farm["id"],
        "season": "Kharif (Monsoon)",
        "risk_tolerance": "balanced"
    }, headers=headers)
    assert rec_resp.status_code == 200
    rec = rec_resp.json()
    dq = rec["data_quality"]
    print(f"  Data Completeness: {dq['completeness_percentage']}% | Confidence: {dq['confidence_classification']}")
    print(f"  Evaluated Factors: {', '.join(dq['evaluated_factors'])}")
    print(f"  Effective Normalized Weights: {json.dumps(dq['effective_weights'])}")
    print(f"\n  Top Ranked Crop Options:")
    for idx, c in enumerate(rec["recommended_crops"][:3], 1):
        print(f"    {idx}. {c['name']} (Score: {c['suitabilityScore']:.1f}/100 | Risk: {c['riskLevel'].upper()} | Water Demand: {c['waterDemand'].capitalize()})")
        print(f"       Estimated Yield Range: {c['estimatedYieldRange']}")
        print(f"       Primary Agronomic Justification: {c['reasonsForRecommendation'][0]}")

    # 8. Side-by-Side Crop Comparison
    print("\n[8] Comparing Top 3 Crops Side-by-Side...")
    comp_resp = client.post("/api/crops/compare", json={
        "crop_codes": ["crop-groundnut", "crop-millets", "crop-maize"],
        "farm_id": farm["id"]
    })
    assert comp_resp.status_code == 200
    comp = comp_resp.json()
    print(f"  Compared Crops: {', '.join(c['name'] for c in comp['compared_crops'])}")
    print(f"  Trade-Offs Analysis: {comp['trade_offs_summary']}")
    print(f"  Strategic Agronomic Guidance: {comp['strategic_recommendation']}")

    # 9. Verified Agronomic Guidance
    print("\n[9] Fetching ICAR / CRIDA Verified Agronomic Practices...")
    guide_resp = client.get("/api/guidance?category=Water Management")
    assert guide_resp.status_code == 200
    guides = guide_resp.json()
    top_guide = guides[0]
    print(f"  Guide Title: {top_guide['title']}")
    print(f"  Attribution: {top_guide['sourceAttribution']} ({top_guide['publishDate']})")
    print(f"  Key Recommendation: {top_guide['keyPractices'][0]}")

    # 10. Comprehensive Planning Report
    print("\n[10] Compiling Comprehensive Crop Planning Report...")
    rep_resp = client.get(f"/api/reports/{farm['id']}", headers=headers)
    assert rep_resp.status_code == 200
    report = rep_resp.json()
    print(f"  Report Reference: {report['report_id']} | Generated: {report['generated_at']}")
    print(f"  Audit Completeness: {report['data_quality_audit']['completeness_percentage']}%")
    print(f"  Top Crop Recommendation: {report['top_recommended_crops'][0]['name']}")
    print(f"  Legal Disclaimer: {report['legal_disclaimer']}")

    print("\n" + "=" * 80)
    print("  GREENPULSE DEMONSTRATION RUN COMPLETE – ALL 10 PHASES SUCCESSFUL!")
    print("=" * 80)

if __name__ == "__main__":
    run_demo()

