from typing import List, Dict, Any

# Initial verified crop database entries with accurate agronomic thresholds
SEED_CROPS: List[Dict[str, Any]] = [
    {
        "crop_code": "crop-groundnut",
        "name": "Groundnut (Peanut)",
        "botanical_name": "Arachis hypogaea",
        "local_name": "Verusenaga / Moongphali",
        "category": "Oilseed",
        "image": "/src/assets/images/crop_groundnut_legumes_1793426700241.jpg",
        "suitable_soil_types": ["red", "loamy", "sandy"],
        "preferred_ph_min": 6.0,
        "preferred_ph_max": 7.5,
        "rainfall_min_mm": 450.0,
        "rainfall_max_mm": 650.0,
        "temp_min_c": 22.0,
        "temp_max_c": 32.0,
        "water_demand": "low",
        "growing_duration_days": "105 - 115 days",
        "growing_duration_min_days": 105,
        "growing_duration_max_days": 115,
        "drought_sensitivity": "low",
        "heat_sensitivity": "low",
        "excess_rainfall_sensitivity": "moderate",
        "recommended_growing_seasons": ["Kharif", "Rabi"],
        "soil_compatibility_text": "Excellent in well-drained Red Sandy Loam (pH 6.2 - 7.2)",
        "estimated_yield_range": "14 - 18 Quintals / Acre",
        "reasons_default": [
            "High tolerance to intermittent mid-season dry spells in red soils.",
            "Pegging and pod development match projected August-September rainfall.",
            "Fixes atmospheric nitrogen, lowering synthetic urea input requirements.",
            "Active regional procurement center within 18 km with guaranteed MSP."
        ],
        "climate_risks": [
            {
                "category": "Drought",
                "severity": "low",
                "explanation": "Deep taproot system recovers quickly from 10-14 day dry spells during vegetative growth.",
                "mitigation": "Apply anti-transpirant kaolin spray (5%) if dry spell exceeds 12 consecutive days."
            },
            {
                "category": "Heat Stress",
                "severity": "low",
                "explanation": "Flower pollen viability stays intact up to 34°C, well within regional historical norms.",
                "mitigation": "Maintain micro-sprinkler misting if midday peak touches 36°C."
            },
            {
                "category": "Excess Rainfall",
                "severity": "moderate",
                "explanation": "Waterlogging during late maturity can cause pod rotting and premature germination.",
                "mitigation": "Ensure broad-bed furrow (BBF) planting to evacuate torrential rain surges."
            }
        ],
        "agronomic_advisory": {
            "recommendedWindow": "June 25 – July 15 (Post-monsoon onset)",
            "seedRate": "40 - 45 kg kernels / acre (Treated with Trichoderma viride)",
            "criticalWaterStages": ["Flowering (25-30 DAS)", "Peg penetration (40-45 DAS)", "Pod formation (60-70 DAS)"],
            "fertilizerRecommendation": "10 kg N : 20 kg P₂O₅ : 20 kg K₂O per acre with Gypsum 200 kg at flowering.",
            "climateContingency": "If monsoon delayed past July 20, shift to short-duration variety Dharani (95 days)."
        },
        "economics": {
            "estimatedCostPerAcre": 18500,
            "expectedRevenuePerAcre": 48000,
            "minimumSupportPriceAvailable": True
        },
        "is_verified": True,
        "is_demo": False,
        "source_reference": "ICAR - Directorate of Groundnut Research (DGR) Package of Practices"
    },
    {
        "crop_code": "crop-millets",
        "name": "Pearl Millet (Bajra)",
        "botanical_name": "Pennisetum glaucum",
        "local_name": "Sajjalu / Bajra",
        "category": "Millet",
        "image": "/src/assets/images/crop_millets_sorghum_1793426699961.jpg",
        "suitable_soil_types": ["sandy", "red", "loamy", "other"],
        "preferred_ph_min": 6.5,
        "preferred_ph_max": 8.5,
        "rainfall_min_mm": 350.0,
        "rainfall_max_mm": 500.0,
        "temp_min_c": 25.0,
        "temp_max_c": 38.0,
        "water_demand": "low",
        "growing_duration_days": "80 - 88 days",
        "growing_duration_min_days": 80,
        "growing_duration_max_days": 88,
        "drought_sensitivity": "low",
        "heat_sensitivity": "low",
        "excess_rainfall_sensitivity": "moderate",
        "recommended_growing_seasons": ["Kharif", "Zaid"],
        "soil_compatibility_text": "Thrives in marginal Red Loam and Shallow Gravelly soils",
        "estimated_yield_range": "12 - 16 Quintals / Acre",
        "reasons_default": [
            "Superior C4 photosynthetic efficiency under high daytime solar radiation.",
            "Lowest consumptive water footprint of all regional grain staples.",
            "Extremely resilient to thermal spikes exceeding 37°C during grain filling.",
            "High fodder biomass output provides insurance for livestock feed."
        ],
        "climate_risks": [
            {
                "category": "Drought",
                "severity": "low",
                "explanation": "Can extract moisture from deep soil layers; enters dormancy under stress without wilting.",
                "mitigation": "Seed hardening with 2% potassium chloride prior to sowing."
            },
            {
                "category": "Excess Rainfall",
                "severity": "moderate",
                "explanation": "Unseasonal rain during anthesis/flowering washes pollen and promotes Ergot fungal disease.",
                "mitigation": "Select downy mildew and ergot-tolerant hybrid HHB-67 Improved."
            },
            {
                "category": "Pest Outbreak",
                "severity": "low",
                "explanation": "Natural silica content in stalks confers pest resistance against stem borers.",
                "mitigation": "Pheromone traps for shoot fly surveillance at 14 days after emergence."
            }
        ],
        "agronomic_advisory": {
            "recommendedWindow": "July 05 – July 25",
            "seedRate": "1.8 - 2.2 kg / acre (Line sowing at 45cm x 15cm)",
            "criticalWaterStages": ["Tillering (20-25 DAS)", "Panicle emergence (45 DAS)"],
            "fertilizerRecommendation": "25 kg N : 15 kg P₂O₅ : 10 kg K₂O per acre in two splits.",
            "climateContingency": "Ideal catch crop if initial pulses experience early moisture failure."
        },
        "economics": {
            "estimatedCostPerAcre": 9200,
            "expectedRevenuePerAcre": 28500,
            "minimumSupportPriceAvailable": True
        },
        "is_verified": True,
        "is_demo": False,
        "source_reference": "ICAR - Indian Institute of Millets Research (IIMR) Technical Bulletin"
    },
    {
        "crop_code": "crop-maize",
        "name": "Maize (Hybrid Corn)",
        "botanical_name": "Zea mays",
        "local_name": "Mokka Jonnalu / Makka",
        "category": "Cereal",
        "image": "/src/assets/images/crop_maize_corn_1793426699966.jpg",
        "suitable_soil_types": ["loamy", "red", "black"],
        "preferred_ph_min": 6.0,
        "preferred_ph_max": 7.5,
        "rainfall_min_mm": 550.0,
        "rainfall_max_mm": 750.0,
        "temp_min_c": 20.0,
        "temp_max_c": 30.0,
        "water_demand": "moderate",
        "growing_duration_days": "100 - 110 days",
        "growing_duration_min_days": 100,
        "growing_duration_max_days": 110,
        "drought_sensitivity": "moderate",
        "heat_sensitivity": "moderate",
        "excess_rainfall_sensitivity": "high",
        "recommended_growing_seasons": ["Kharif", "Rabi"],
        "soil_compatibility_text": "Good in fertile Red Loam with pH 6.0 - 7.5; requires good aeration",
        "estimated_yield_range": "24 - 32 Quintals / Acre",
        "reasons_default": [
            "High revenue potential under regulated supplemental borewell irrigation.",
            "Strong commercial demand from animal feed mills and starch processing units.",
            "Uniform maturity allows mechanized cob picking and reduced harvest labor."
        ],
        "climate_risks": [
            {
                "category": "Heat Stress",
                "severity": "moderate",
                "explanation": "Temperatures >35°C during tasseling and silking cause silk desiccation and poor kernel set.",
                "mitigation": "Ensure protective evening irrigation during 50-60 DAS tasseling stage."
            },
            {
                "category": "Drought",
                "severity": "moderate",
                "explanation": "High leaf surface area creates significant evapotranspiration demand; moisture stress drops yield ~30%.",
                "mitigation": "Adopt furrow diking and retain in-situ crop residue mulch."
            },
            {
                "category": "Pest Outbreak",
                "severity": "high",
                "explanation": "Fall Armyworm (Spodoptera frugiperda) proliferates during humid dry-spell alternations.",
                "mitigation": "Release Trichogramma egg parasitoids + Neem oil (1500 ppm) early at whorl stage."
            }
        ],
        "agronomic_advisory": {
            "recommendedWindow": "June 20 – July 10",
            "seedRate": "7.5 - 8 kg / acre (Single seed per hill at 60cm x 20cm)",
            "criticalWaterStages": ["Tasseling (45-50 DAS)", "Silking (55-60 DAS)", "Grain filling (70-80 DAS)"],
            "fertilizerRecommendation": "50 kg N : 25 kg P₂O₅ : 20 kg K₂O per acre with Zinc Sulphate 10 kg.",
            "climateContingency": "If borewell yield drops below 2 GPM in August, skip alternate furrow irrigations."
        },
        "economics": {
            "estimatedCostPerAcre": 22000,
            "expectedRevenuePerAcre": 54000,
            "minimumSupportPriceAvailable": True
        },
        "is_verified": True,
        "is_demo": False,
        "source_reference": "ICAR - Indian Institute of Maize Research (IIMR) Agronomic Guide"
    },
    {
        "crop_code": "crop-pulses",
        "name": "Pigeon Pea (Red Gram / Toor)",
        "botanical_name": "Cajanus cajan",
        "local_name": "Kandulu / Arhar",
        "category": "Legume/Pulse",
        "image": "/src/assets/images/crop_groundnut_legumes_1793426700241.jpg",
        "suitable_soil_types": ["red", "black", "loamy"],
        "preferred_ph_min": 6.5,
        "preferred_ph_max": 7.8,
        "rainfall_min_mm": 500.0,
        "rainfall_max_mm": 700.0,
        "temp_min_c": 24.0,
        "temp_max_c": 34.0,
        "water_demand": "low",
        "growing_duration_days": "150 - 165 days",
        "growing_duration_min_days": 150,
        "growing_duration_max_days": 165,
        "drought_sensitivity": "low",
        "heat_sensitivity": "low",
        "excess_rainfall_sensitivity": "low",
        "recommended_growing_seasons": ["Kharif"],
        "soil_compatibility_text": "Well-suited to deep Red & Medium Black soils with deep root space",
        "estimated_yield_range": "6 - 9 Quintals / Acre",
        "reasons_default": [
            "Deep penetrating taproot (>1.5 meters) taps deep subsoil residual moisture.",
            "Excellent intercropping candidate (7:1 ratio with Groundnut or Millets).",
            "High market price stability with strong consumer domestic demand.",
            "Sheds massive organic leaf litter, enriching topsoil humus."
        ],
        "climate_risks": [
            {
                "category": "Drought",
                "severity": "low",
                "explanation": "Very high drought avoidance capability through osmotic adjustment in stem tissues.",
                "mitigation": "Single protective irrigation at pod development stage guarantees full seed weight."
            },
            {
                "category": "Pest Outbreak",
                "severity": "moderate",
                "explanation": "Pod borer (Helicoverpa armigera) pressure peaks under overcast cloudy weather in November.",
                "mitigation": "Install 5 bird perches/acre and spray NPV (Nuclear Polyhedrosis Virus) @ 250 LE/acre."
            },
            {
                "category": "Excess Rainfall",
                "severity": "low",
                "explanation": "Moderate tolerance; surface ridges prevent root rot stagnation.",
                "mitigation": "Inter-row cultivation to maintain ridge height before late-season rains."
            }
        ],
        "agronomic_advisory": {
            "recommendedWindow": "June 15 – July 10",
            "seedRate": "4 - 5 kg / acre as sole crop (90cm x 30cm spacing)",
            "criticalWaterStages": ["Branching (30 DAS)", "Flower initiation (75 DAS)", "Pod development (110 DAS)"],
            "fertilizerRecommendation": "10 kg N : 20 kg P₂O₅ : 10 kg K₂O per acre with Rhizobium bio-fertilizer.",
            "climateContingency": "If vegetative growth is excessive due to early rains, pinch terminal shoots at 60 DAS."
        },
        "economics": {
            "estimatedCostPerAcre": 13500,
            "expectedRevenuePerAcre": 46000,
            "minimumSupportPriceAvailable": True
        },
        "is_verified": True,
        "is_demo": False,
        "source_reference": "ICAR - Indian Institute of Pulses Research (IIPR) Field Guidelines"
    },
    {
        "crop_code": "crop-rice",
        "name": "Direct Seeded Rice (AEROBIC / DSR)",
        "botanical_name": "Oryza sativa",
        "local_name": "Vari (Direct Seeded)",
        "category": "Cereal",
        "image": "/src/assets/images/crop_rice_paddy_1793426700005.jpg",
        "suitable_soil_types": ["clay", "loamy"],
        "preferred_ph_min": 5.5,
        "preferred_ph_max": 7.0,
        "rainfall_min_mm": 900.0,
        "rainfall_max_mm": 1200.0,
        "temp_min_c": 22.0,
        "temp_max_c": 33.0,
        "water_demand": "high",
        "growing_duration_days": "120 - 130 days",
        "growing_duration_min_days": 120,
        "growing_duration_max_days": 130,
        "drought_sensitivity": "high",
        "heat_sensitivity": "moderate",
        "excess_rainfall_sensitivity": "low",
        "recommended_growing_seasons": ["Kharif", "Rabi"],
        "soil_compatibility_text": "Prefers Heavy Clay or Silty Loam; poor water retention in sandy red soils",
        "estimated_yield_range": "18 - 24 Quintals / Acre",
        "reasons_default": [
            "Direct seeding avoids transplanting labor and saves ~30% water over flooded paddy.",
            "Shorter field residency by 10-14 days compared to puddled seedlings."
        ],
        "climate_risks": [
            {
                "category": "Drought",
                "severity": "high",
                "explanation": "Lack of standing water allows weed suppression breakdown; drought during panicle initiation triggers high spikelet sterility (>50%).",
                "mitigation": "Requires continuous dedicated borewell availability; avoid without micro-irrigation backup."
            },
            {
                "category": "Soil Mismatch",
                "severity": "high",
                "explanation": "In light red sandy soil, deep percolation losses are catastrophic (up to 65% water loss).",
                "mitigation": "Do not attempt in coarse soils with high hydraulic conductivity."
            },
            {
                "category": "Heat Stress",
                "severity": "moderate",
                "explanation": "Anthesis temperatures >35°C prevent anther dehiscence.",
                "mitigation": "Advance sowing date to avoid peak September heatwaves."
            }
        ],
        "agronomic_advisory": {
            "recommendedWindow": "June 10 – June 30",
            "seedRate": "12 - 15 kg / acre with seed drill",
            "criticalWaterStages": ["Active tillering (25-35 DAS)", "Panicle initiation (50-65 DAS)", "Flowering (85 DAS)"],
            "fertilizerRecommendation": "40 kg N : 20 kg P₂O₅ : 20 kg K₂O with Iron Chelate (Fe-EDTA) against chlorosis.",
            "climateContingency": "If water storage drops below 40% by July 31, convert standing field to pulses."
        },
        "economics": {
            "estimatedCostPerAcre": 26000,
            "expectedRevenuePerAcre": 48000,
            "minimumSupportPriceAvailable": True
        },
        "is_verified": True,
        "is_demo": False,
        "source_reference": "ICAR - National Rice Research Institute (NRRI) Direct Seeding Protocols"
    },
    {
        "crop_code": "crop-cotton",
        "name": "Desi / Medium Staple Cotton",
        "botanical_name": "Gossypium hirsutum",
        "local_name": "Patti / Kapas",
        "category": "Fiber",
        "image": "/src/assets/images/crop_maize_corn_1793426699966.jpg",
        "suitable_soil_types": ["black", "loamy", "red"],
        "preferred_ph_min": 6.5,
        "preferred_ph_max": 8.0,
        "rainfall_min_mm": 600.0,
        "rainfall_max_mm": 850.0,
        "temp_min_c": 21.0,
        "temp_max_c": 35.0,
        "water_demand": "moderate",
        "growing_duration_days": "150 - 170 days",
        "growing_duration_min_days": 150,
        "growing_duration_max_days": 170,
        "drought_sensitivity": "moderate",
        "heat_sensitivity": "low",
        "excess_rainfall_sensitivity": "high",
        "recommended_growing_seasons": ["Kharif"],
        "soil_compatibility_text": "Moderate in deep red loams; optimal in medium-deep black cotton soils",
        "estimated_yield_range": "8 - 12 Quintals / Acre",
        "reasons_default": [
            "Commercial cash crop with high liquidity and active daily market yards.",
            "Deep root system can explore subsoil nutrients below 80 cm depth."
        ],
        "climate_risks": [
            {
                "category": "Excess Rainfall",
                "severity": "high",
                "explanation": "Late October cyclone squalls cause severe square dropping, open boll soaking, and fiber yellowing.",
                "mitigation": "Pick early flushes promptly; spray planofix (NAA) @ 4.5ml/15L to arrest square drop."
            },
            {
                "category": "Pest Outbreak",
                "severity": "high",
                "explanation": "Prolonged dry spells encourage sucking pests (Whitefly, Thrips, Aphids) followed by Pink Bollworm.",
                "mitigation": "Plant 2 border rows of Pigeon Pea and castor as trap crops; use yellow sticky traps."
            },
            {
                "category": "Drought",
                "severity": "moderate",
                "explanation": "Vegetative growth halts during peak drought; leaves turn brittle.",
                "mitigation": "Supplemental drip fertigation with 1% 19:19:19 water-soluble grade."
            }
        ],
        "agronomic_advisory": {
            "recommendedWindow": "June 20 – July 15",
            "seedRate": "1.5 - 2.0 kg / acre (90cm x 60cm spacing)",
            "criticalWaterStages": ["Square formation (45 DAS)", "Flowering (70 DAS)", "Boll filling (100 DAS)"],
            "fertilizerRecommendation": "35 kg N : 18 kg P₂O₅ : 18 kg K₂O per acre with Magnesium Sulphate.",
            "climateContingency": "If late rains fail entirely, defoliate early to ripen lower bolls."
        },
        "economics": {
            "estimatedCostPerAcre": 24500,
            "expectedRevenuePerAcre": 58000,
            "minimumSupportPriceAvailable": True
        },
        "is_verified": True,
        "is_demo": False,
        "source_reference": "ICAR - Central Institute for Cotton Research (CICR) Advisory Bulletin"
    }
]

# Verified Agronomic Guidance Database
SEED_GUIDES: List[Dict[str, Any]] = [
    {
        "guide_code": "guide-1",
        "title": "Climate-Adaptive Sowing Windows for Semi-Arid Tropics",
        "category": "Planting Windows",
        "applicable_crops": ["Groundnut", "Pearl Millet", "Pigeon Pea"],
        "applicable_region": "Rayalaseema / Deccan Plateau / Semi-Arid Tropics",
        "summary": "Adjusting sowing dates based on cumulative soil moisture rather than fixed calendar dates prevents early seedling mortality.",
        "key_practices": [
            "Wait for minimum 50-60 mm cumulative rainfall before initiating dryland sowing.",
            "Perform seed priming with 1% potassium nitrate (KNO₃) for 6 hours to accelerate emergence.",
            "Adopt ridge and furrow sowing at 45 cm distance across the slope to arrest runoff velocity."
        ],
        "source_organisation": "ICAR - Central Research Institute for Dryland Agriculture (CRIDA), Hyderabad",
        "reference_title": "Contingency Crop Planning for Delayed Monsoon in Dryland Areas",
        "source_url": "http://www.crida.in/cp-2023/AndhraPradesh/Anantapur.pdf",
        "publication_date": "Updated Kharif 2026",
        "is_verified": True
    },
    {
        "guide_code": "guide-2",
        "title": "Micro-Irrigation Scheduling Under Declining Borewell Yield",
        "category": "Water Management",
        "applicable_crops": ["Maize", "Groundnut", "Cotton"],
        "applicable_region": "Hard Rock Aquifers / Peninsular India",
        "summary": "Targeted deficit irrigation (TDI) reduces total seasonal water consumption by 28% while safeguarding 90% of maximum harvest yield.",
        "key_practices": [
            "Concentrate supplemental irrigation strictly on phenological critical stages (flowering & pod set).",
            "Operate drip lines in late afternoon or night to eliminate midday evaporative losses.",
            "Install inline pulse emitters with pressure compensating valves across undulating slopes."
        ],
        "source_organisation": "National Institute of Abiotic Stress Management (NIASM), Baramati",
        "reference_title": "Deficit Irrigation Protocols in Groundwater-Stressed Ecologies",
        "source_url": "https://niasm.icar.gov.in/publications/technical-bulletins",
        "publication_date": "Updated Kharif 2026",
        "is_verified": True
    },
    {
        "guide_code": "guide-3",
        "title": "Building Soil Organic Carbon (SOC) in Degraded Red Loams",
        "category": "Soil Improvement",
        "applicable_crops": ["All Crops", "Millets", "Pulses"],
        "applicable_region": "Alfisol / Red Soil Agro-Climatic Zones",
        "summary": "Every 0.1% increase in topsoil organic carbon improves soil water retention capacity by approximately 18,000 liters per acre.",
        "key_practices": [
            "Incorporate green manure crop (Sunn hemp / Crotalaria juncea) at 45 days before primary crop planting.",
            "Apply farmyard manure (FYM) enriched with Trichoderma at 4 tons/acre.",
            "Retain 30% crop stubble on field surface rather than open-field burning."
        ],
        "source_organisation": "Acharya N.G. Ranga Agricultural University (ANGRAU), Guntur",
        "reference_title": "Soil Health Management Guidelines for Alfisols",
        "source_url": "https://angrau.ac.in/extension/package-of-practices",
        "publication_date": "Updated Kharif 2026",
        "is_verified": True
    },
    {
        "guide_code": "guide-4",
        "title": "Heat Stress Abatement During Pollination in Maize & Millets",
        "category": "Heat Mitigation",
        "applicable_crops": ["Maize", "Pearl Millet"],
        "applicable_region": "Semi-Arid and Arid Zones",
        "summary": "Thermal spikes above 36°C during 10:00 AM - 2:00 PM degrade pollen tube elongation, resulting in chaffy or half-filled cobs.",
        "key_practices": [
            "Maintain surface soil dampness to bring down micro-canopy ambient temperature by 2.2°C.",
            "Foliar spray of 1% Ascorbic acid or Salicylic acid (100 ppm) 48 hours prior to anticipated heat spell.",
            "Intercrop with tall companion barriers (such as Sorghum on windward boundaries) to block hot desiccating winds."
        ],
        "source_organisation": "Indian Institute of Millets Research (IIMR), Hyderabad",
        "reference_title": "Abiotic Stress Alleviation in Millets and Cereals",
        "source_url": "https://millets.res.in/publications",
        "publication_date": "Updated Kharif 2026",
        "is_verified": True
    }
]

# Baseline monthly climate series (Rayalaseema / Anantapur agro-climatic region)
DEMO_MONTHLY_CLIMATE = [
    {"month": "Jan", "rainfallCurrentMm": 2.0, "rainfallHistoricalNormalMm": 3.0, "tempMaxC": 30.2, "tempMinC": 17.1, "tempHistoricalMaxC": 29.8, "drySpellDays": 28},
    {"month": "Feb", "rainfallCurrentMm": 4.0, "rainfallHistoricalNormalMm": 5.0, "tempMaxC": 33.5, "tempMinC": 19.4, "tempHistoricalMaxC": 32.8, "drySpellDays": 26},
    {"month": "Mar", "rainfallCurrentMm": 12.0, "rainfallHistoricalNormalMm": 9.0, "tempMaxC": 37.1, "tempMinC": 22.8, "tempHistoricalMaxC": 36.4, "drySpellDays": 25},
    {"month": "Apr", "rainfallCurrentMm": 18.0, "rainfallHistoricalNormalMm": 21.0, "tempMaxC": 39.8, "tempMinC": 25.5, "tempHistoricalMaxC": 38.9, "drySpellDays": 22},
    {"month": "May", "rainfallCurrentMm": 42.0, "rainfallHistoricalNormalMm": 48.0, "tempMaxC": 39.2, "tempMinC": 26.2, "tempHistoricalMaxC": 38.5, "drySpellDays": 18},
    {"month": "Jun", "rainfallCurrentMm": 58.0, "rainfallHistoricalNormalMm": 64.0, "tempMaxC": 34.6, "tempMinC": 24.5, "tempHistoricalMaxC": 34.0, "drySpellDays": 14},
    {"month": "Jul", "rainfallCurrentMm": 82.0, "rainfallHistoricalNormalMm": 94.0, "tempMaxC": 32.4, "tempMinC": 23.8, "tempHistoricalMaxC": 32.1, "drySpellDays": 11},
    {"month": "Aug", "rainfallCurrentMm": 96.0, "rainfallHistoricalNormalMm": 108.0, "tempMaxC": 31.8, "tempMinC": 23.4, "tempHistoricalMaxC": 31.5, "drySpellDays": 10},
    {"month": "Sep", "rainfallCurrentMm": 142.0, "rainfallHistoricalNormalMm": 135.0, "tempMaxC": 31.5, "tempMinC": 23.0, "tempHistoricalMaxC": 31.2, "drySpellDays": 8},
    {"month": "Oct", "rainfallCurrentMm": 110.0, "rainfallHistoricalNormalMm": 118.0, "tempMaxC": 31.2, "tempMinC": 22.1, "tempHistoricalMaxC": 31.0, "drySpellDays": 12},
    {"month": "Nov", "rainfallCurrentMm": 38.0, "rainfallHistoricalNormalMm": 46.0, "tempMaxC": 29.8, "tempMinC": 19.5, "tempHistoricalMaxC": 29.5, "drySpellDays": 21},
    {"month": "Dec", "rainfallCurrentMm": 8.0, "rainfallHistoricalNormalMm": 12.0, "tempMaxC": 29.1, "tempMinC": 17.4, "tempHistoricalMaxC": 28.9, "drySpellDays": 27}
]

DEMO_SEASONAL_RAINFALL = [
    {"year": "2022", "kharifMm": 420.0, "rabiMm": 165.0, "normalMm": 540.0},
    {"year": "2023", "kharifMm": 360.0, "rabiMm": 92.0, "normalMm": 540.0},
    {"year": "2024", "kharifMm": 510.0, "rabiMm": 180.0, "normalMm": 540.0},
    {"year": "2025", "kharifMm": 445.0, "rabiMm": 134.0, "normalMm": 540.0},
    {"year": "2026 (Est.)", "kharifMm": 488.0, "rabiMm": 156.0, "normalMm": 540.0}
]

