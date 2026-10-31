def test_user_registration_success(client):
    response = client.post("/api/auth/register", json={
        "full_name": "Suresh Patel",
        "email": "suresh.patel@agrimail.in",
        "password": "FarmPassword2026!",
        "phone_number": "+91 94231 11223",
        "preferred_language": "Telugu"
    })
    assert response.status_code == 201
    data = response.json()
    assert "access_token" in data
    assert "refresh_token" in data
    assert data["user"]["email"] == "suresh.patel@agrimail.in"
    assert data["user"]["full_name"] == "Suresh Patel"


def test_duplicate_email_prevention(client):
    payload = {
        "full_name": "Duplicate User",
        "email": "duplicate@agrimail.in",
        "password": "Password123!"
    }
    resp1 = client.post("/api/auth/register", json=payload)
    assert resp1.status_code == 201

    resp2 = client.post("/api/auth/register", json=payload)
    assert resp2.status_code == 400
    assert "already exists" in resp2.json()["detail"]


def test_user_login_success(client):
    # Register user
    client.post("/api/auth/register", json={
        "full_name": "Login Farmer",
        "email": "login.farmer@agrimail.in",
        "password": "CorrectPassword123"
    })

    # Successful login
    login_resp = client.post("/api/auth/login", json={
        "email": "login.farmer@agrimail.in",
        "password": "CorrectPassword123"
    })
    assert login_resp.status_code == 200
    data = login_resp.json()
    assert "access_token" in data
    assert data["user"]["email"] == "login.farmer@agrimail.in"


def test_user_login_invalid_password(client):
    login_resp = client.post("/api/auth/login", json={
        "email": "login.farmer@agrimail.in",
        "password": "WrongPassword!"
    })
    assert login_resp.status_code == 401
    assert "Incorrect email or password" in login_resp.json()["detail"]


def test_get_current_user_profile(client, test_user):
    resp = client.get("/api/auth/me", headers=test_user["headers"])
    assert resp.status_code == 200
    data = resp.json()
    assert data["id"] == test_user["id"]
    assert data["email"] == test_user["email"]


def test_get_current_user_unauthorized(client):
    resp = client.get("/api/auth/me")
    assert resp.status_code == 401


def test_refresh_token(client):
    reg = client.post("/api/auth/register", json={
        "full_name": "Token Refresher",
        "email": "refresh.user@agrimail.in",
        "password": "Password123!"
    })
    refresh_tok = reg.json()["refresh_token"]

    resp = client.post("/api/auth/refresh", json={"refresh_token": refresh_tok})
    assert resp.status_code == 200
    data = resp.json()
    assert "access_token" in data
    assert "refresh_token" in data

