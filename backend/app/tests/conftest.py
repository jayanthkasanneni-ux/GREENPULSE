import uuid
import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.main import app
from app.database import Base, get_db
from app.config import settings
from app.services.crop_recommendation_service import CropRecommendationService
from app.services.guidance_service import GuidanceService

# Use an isolated SQLite test database
TEST_DATABASE_URL = "sqlite:///./test_greenpulse.db"
test_engine = create_engine(TEST_DATABASE_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=test_engine)


def override_get_db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()


app.dependency_overrides[get_db] = override_get_db


@pytest.fixture(scope="session", autouse=True)
def setup_test_database():
    """Create all tables and seed reference data for the test session."""
    Base.metadata.drop_all(bind=test_engine)
    Base.metadata.create_all(bind=test_engine)

    db = TestingSessionLocal()
    CropRecommendationService.init_crop_database(db)
    GuidanceService.init_guidance_data(db)
    db.close()

    yield

    Base.metadata.drop_all(bind=test_engine)


@pytest.fixture
def client():
    """Return FastAPI TestClient."""
    with TestClient(app) as test_client:
        yield test_client


@pytest.fixture
def db_session():
    """Direct database session fixture for test assertions."""
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()


@pytest.fixture
def test_user(client):
    """Register and return a test user with valid auth headers."""
    email = f"test.farmer.{uuid.uuid4().hex[:8]}@example.com"
    password = "SecurePassword123!"
    resp = client.post("/api/auth/register", json={
        "full_name": "Test Farmer",
        "email": email,
        "password": password,
        "phone_number": "+91 99999 88888",
        "preferred_language": "English"
    })
    data = resp.json()
    token = data["access_token"]
    user_id = data["user"]["id"]
    headers = {"Authorization": f"Bearer {token}"}
    return {
        "id": user_id,
        "email": email,
        "password": password,
        "token": token,
        "headers": headers
    }


@pytest.fixture
def secondary_user(client):
    """Register a second user for unauthorized access testing."""
    email = f"other.farmer.{uuid.uuid4().hex[:8]}@example.com"
    resp = client.post("/api/auth/register", json={
        "full_name": "Other Farmer",
        "email": email,
        "password": "SecurePassword123!"
    })
    data = resp.json()
    return {
        "id": data["user"]["id"],
        "headers": {"Authorization": f"Bearer {data['access_token']}"}
    }

