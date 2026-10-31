# GREENPULSE – Climate-Resilient Crop Planning Assistant

**Brand:** GREENPULSE  
**Tagline:** Growing Smarter with Climate Intelligence.  

GREENPULSE is a production-grade smart agricultural backend platform engineered for smallholder farmers, agronomists, and agricultural extension officers. It translates complex meteorological and soil datasets into actionable, transparent crop planning recommendations and climate hazard risk assessments.

---

## 1. Core Principles & Scientific Guarantees

1. **Yield Transparency:** Never guarantees crop yield; biological crop production is subject to dynamic micro-climates, unforeseen pest outbreaks, and extreme events.
2. **Measurement Integrity:** Never fabricates or hallucinates soil nutrient levels (pH, N, P, K). Distinguishes tested lab values from farmer-reported observations and regional baselines.
3. **Weight Normalization (Zero Bias):** When an agro-climatic factor is missing (e.g. untested soil or unmapped weather station), it is never silently assumed to be zero or ideally suitable. The engine normalizes the weights of available factors so scores remain calibrated between 0 and 100.
4. **Data Provenance:** Clearly distinguishes **actual data**, **estimated data**, and **demonstration baseline data**.
5. **Verified References:** Agronomic advisories and mitigation protocols are sourced directly from verified public research institutions (ICAR, CRIDA, NIASM, ANGRAU, IIMR).

---

## 2. Technology Stack

- **Language:** Python 3.11+ (Tested on Python 3.15)
- **Web Framework:** FastAPI (Asynchronous ASGI, high throughput)
- **Database & ORM:** PostgreSQL / SQLite fallback with SQLAlchemy 2.0 ORM
- **Database Migrations:** Alembic
- **Validation & Serialization:** Pydantic v2 & Pydantic-Settings
- **Security & Authentication:** JWT (PyJWT), password hashing via bcrypt
- **Scientific & Data Processing:** Pandas, NumPy
- **External API Client:** HTTPX (asynchronous client with connection timeouts)
- **Testing:** Pytest

---

## 3. Backend Architecture

```
backend/
├── alembic/                      # Database migration scripts
│   ├── env.py
│   ├── script.py.mako
│   └── versions/
│       └── 001_initial_schema.py
├── app/
│   ├── __init__.py
│   ├── main.py                   # FastAPI initialization, CORS, Lifespan & seed
│   ├── config.py                 # Application settings (Pydantic-Settings)
│   ├── database.py               # SQLAlchemy engine & session management
│   ├── models/                   # SQLAlchemy ORM database models
│   │   ├── __init__.py
│   │   ├── user.py               # User authentication & credentials
│   │   ├── farm.py               # Farm holdings, GPS, acreages, water sources
│   │   ├── soil.py               # Soil profiles & Soil Health Card tests
│   │   ├── weather.py            # Historical precipitation & temperature records
│   │   ├── crop.py               # Agronomic requirements & thresholds
│   │   ├── recommendation.py     # Stored recommendations & audit trails
│   │   └── guidance.py           # Verified package of practices & advisories
│   ├── schemas/                  # Pydantic request/response validation schemas
│   │   ├── __init__.py
│   │   ├── auth.py
│   │   ├── farm.py
│   │   ├── soil.py
│   │   ├── climate.py
│   │   ├── crop.py
│   │   ├── recommendation.py
│   │   ├── guidance.py
│   │   └── reports.py
│   ├── routers/                  # Modular REST API endpoints
│   │   ├── __init__.py
│   │   ├── auth.py               # Register, login, refresh, me
│   │   ├── farm.py               # Farm CRUD with user ownership checks
│   │   ├── soil.py               # Smart Soil Identification (Scenarios A, B, C)
│   │   ├── climate.py            # Weather & historical climate summaries
│   │   ├── crop.py               # Crop catalog & comparative analysis
│   │   ├── recommendation.py     # Rule-based suitability engine
│   │   ├── guidance.py           # ICAR/CRIDA package-of-practices
│   │   ├── reports.py            # Comprehensive planning report generation
│   │   └── water.py              # Water availability assessments
│   ├── services/                 # Business logic and external integrations
│   │   ├── __init__.py
│   │   ├── weather_service.py    # Open-Meteo & NASA POWER integration + caching
│   │   ├── soil_service.py       # Soil status determination & card ingestion
│   │   ├── water_service.py      # Water security & stress evaluations
│   │   ├── crop_recommendation_service.py
│   │   ├── climate_risk_service.py
│   │   ├── crop_comparison_service.py
│   │   ├── guidance_service.py
│   │   └── demo_data_service.py  # Demonstration baselines & crop seeds
│   ├── algorithms/               # Mathematical engines
│   │   ├── __init__.py
│   │   ├── suitability.py        # Factor scoring (rain, temp, soil, water, season)
│   │   ├── risk_assessment.py    # Drought, heat stress, excess rainfall risks
│   │   └── scoring.py            # Weight normalization & composite scoring
│   ├── utils/                    # Shared utilities
│   │   ├── __init__.py
│   │   ├── security.py           # JWT & bcrypt utilities
│   │   ├── validators.py         # Agronomic range validators (pH, GPS, land)
│   │   └── data_quality.py       # Completeness & confidence calculations
│   └── tests/                    # Pytest test suite
│       ├── __init__.py
│       ├── conftest.py
│       ├── test_auth.py
│       ├── test_farms.py
│       ├── test_soil.py
│       ├── test_weather.py
│       ├── test_recommendations.py
│       ├── test_risk_assessment.py
│       └── test_crops.py
├── alembic.ini                   # Alembic configuration
├── requirements.txt              # Production dependencies
├── .env.example                  # Environment configuration template
└── README.md                     # Documentation
```

---

## 4. Quick Start & Local Setup

### Step 1: Create Virtual Environment
```bash
cd backend
python -m venv venv

# Windows PowerShell:
.\venv\Scripts\Activate.ps1

# Linux / macOS:
source venv/bin/activate
```

### Step 2: Install Dependencies
```bash
pip install -r requirements.txt
```

### Step 3: Configure Environment Variables
Copy the `.env.example` file to `.env`:
```bash
cp .env.example .env
```
Default settings run out-of-the-box with SQLite (`greenpulse.db`). For production PostgreSQL, set:
```ini
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/greenpulse_db
```

### Step 4: Run Database Migrations
```bash
alembic upgrade head
```

### Step 5: Start the Backend Server
```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

The API will be live at:
- **API Base:** `http://localhost:8000`
- **Interactive Swagger UI:** `http://localhost:8000/docs`
- **ReDoc Documentation:** `http://localhost:8000/redoc`

---

## 5. Connecting with the React + Vite Frontend

In the `frontend` folder, configure `.env`:
```ini
VITE_API_BASE_URL=http://localhost:8000/api
```
The backend includes CORS middleware allowing requests from `http://localhost:5173` and `http://localhost:3000`.

---

## 6. Pre-seeded Demonstration Account

For instant hackathon demonstration, a verified demo profile is pre-seeded on startup:
- **Email:** `rameshwar.reddy@agrimail.in`
- **Password:** `Password123!`
- **Location:** Anantapur, Andhra Pradesh (Rayalaseema Semi-Arid Zone)
- **Soil:** Tested Red Sandy Loam (pH 6.8, N: 245, P: 16, K: 210 kg/ha)
- **Water Source:** Borewell with moderate yield (3-4 hrs daily)

---

## 7. API Reference Overview

### Authentication
- `POST /api/auth/register` - Create new user account and auto-instantiate farm.
- `POST /api/auth/login` - Authenticate credentials and receive JWT access/refresh tokens.
- `GET /api/auth/me` - Get authenticated profile details.
- `POST /api/auth/refresh` - Refresh expired access token.

### Farm Profile
- `POST /api/farms` - Register new farm holding.
- `GET /api/farms` - List user farms.
- `GET /api/farms/{farm_id}` - Retrieve farm details.
- `PUT /api/farms/{farm_id}` - Update land area, location, or irrigation.
- `DELETE /api/farms/{farm_id}` - Delete farm record.

### Smart Soil Identification
- `POST /api/soil/{farm_id}` - Scenario A/C: Save farmer-reported soil type.
- `GET /api/soil/{farm_id}` - Get soil profile.
- `PUT /api/soil/{farm_id}` - Update soil details.
- `POST /api/soil/{farm_id}/test-results` - Scenario B: Submit Soil Health Card test results.
- `GET /api/soil/{farm_id}/status` - Diagnostic soil verification status (`measured`, `farmer_reported`, `estimated`, `unknown`).

### Climate & Weather Intelligence
- `GET /api/climate/{farm_id}/summary` - Processed agro-climatic summary (precipitation, temperatures, variance, dry spells).
- `GET /api/climate/{farm_id}/historical` - 12-month historical rainfall and thermal time-series.
- `GET /api/climate/{farm_id}/seasonal` - Multi-year Kharif/Rabi rainfall comparison.
- `GET /api/climate/{farm_id}/risk` - Hazard assessments for drought, heat stress, and torrential rainfall.

### Water Security
- `GET /api/water/{farm_id}/assessment` - Irrigation capacity, potential water stress, and crop compatibility.

### Crop Recommendation Engine
- `POST /api/recommendations/generate` - Multi-factor rule-based suitability evaluation.
- `GET /api/recommendations/{farm_id}` - Latest recommendation for a farm.
- `GET /api/recommendations/details/{rec_id}` - Historical recommendation record.

### Crop Comparison
- `GET /api/crops` - Complete crop database.
- `GET /api/crops/{crop_id}` - Single crop details.
- `POST /api/crops/compare` - Compare 2 or 3 crops side-by-side with trade-off analysis.

### Agronomic Guidance
- `GET /api/guidance` - Verified ICAR/CRIDA guidelines.
- `GET /api/guidance/{crop_id}` - Crop-specific package of practices.
- `GET /api/guidance/seasonal` - Seasonal sowing windows and contingency advisories.

### Reports
- `GET /api/reports/{farm_id}` - Full crop planning report.
- `POST /api/reports/generate` - Compile custom report with comparisons.

---

## 8. Running Automated Tests

Run the full pytest suite:
```bash
pytest app/tests -v
```
All test suites validate:
- User authentication & duplicate email prevention
- Farm ownership & validation boundaries
- Scenarios A, B, and C soil identification
- External weather fallback & caching
- Weight normalization with missing factors
- Drought, heat, and excess rainfall risk calculations
- Multi-crop side-by-side comparative analysis

