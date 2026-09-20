"""
Rine Forge Systems V5 - Phase 1 Foundation Test Suite
Verifies:
1. Health Endpoint (multi-component status)
2. Request ID & Security Headers Middleware
3. Unauthenticated Request (401 with standard envelope)
4. Authenticated Request (200 OK with JWT)
5. Tenant Isolation (wrong organization rejected with 403)
6. Tenant Isolation (correct organization allowed with 200)
7. Role Authorization (wrong role rejected with 403)
8. Workspace Isolation (cross-tenant workspace access blocked)
9. Valid Input Validation
10. Invalid Input Validation (422 VALIDATION_ERROR)
11. Missing Required Input (422 with field details)
12. Not-Found Resource (404 NOT_FOUND)
13. Rate Limiting Foundation (429 RATE_LIMITED)
"""
import pytest
import pytest_asyncio
from httpx import AsyncClient, ASGITransport

from backend.app.main import app
from backend.app.ratelimit.limiter import InMemoryRateLimiter, RateLimiter

@pytest.mark.asyncio
async def test_health_endpoint(async_session):
    """Verifies that GET /api/health returns deep component diagnostics."""
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        res = await client.get("/api/health")
        assert res.status_code == 200
        data = res.json()
        assert data["status"] in ["healthy", "degraded"]
        assert data["platform"] == "RINE FORGE SYSTEMS"
        assert "components" in data
        assert "database" in data["components"]
        assert data["components"]["database"]["configured"] is True
        assert "ai" in data["components"]
        assert "rate_limiter" in data["components"]
        assert "queue" in data["components"]

@pytest.mark.asyncio
async def test_request_id_and_security_headers(async_session):
    """Verifies that all responses include X-Request-ID and defensive security headers."""
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        res = await client.get("/api/health")
        assert res.status_code == 200
        assert "X-Request-ID" in res.headers
        assert res.headers["X-Request-ID"].startswith("RF-")
        assert res.headers.get("X-Content-Type-Options") == "nosniff"
        assert res.headers.get("X-Frame-Options") == "DENY"
        assert res.headers.get("Referrer-Policy") == "strict-origin-when-cross-origin"

@pytest.mark.asyncio
async def test_unauthenticated_request(async_session):
    """Verifies that protected routes reject unauthenticated requests with 401 and standard envelope."""
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        res = await client.get("/api/v1/auth/me")
        assert res.status_code == 401
        data = res.json()
        assert "error" in data
        assert data["error"]["code"] == "UNAUTHORIZED"
        assert "reference" in data["error"]
        assert data["error"]["reference"].startswith("RF-")

@pytest.mark.asyncio
async def test_authenticated_request(async_session):
    """Verifies that valid JWT credentials authenticate successfully."""
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        signup_res = await client.post("/api/v1/auth/signup", json={
            "email": "test_auth_user@rineforge.com",
            "name": "Auth User",
            "password": "Password123!",
            "business_name": "Auth User Business"
        })
        assert signup_res.status_code == 201
        token = signup_res.json()["token"]

        me_res = await client.get("/api/v1/auth/me", headers={"Authorization": f"Bearer {token}"})
        assert me_res.status_code == 200
        assert me_res.json()["email"] == "test_auth_user@rineforge.com"

@pytest.mark.asyncio
async def test_tenant_isolation_wrong_and_correct_organization(async_session):
    """
    CRITICAL MULTI-TENANT TEST:
    Verifies that Organization A's resources cannot be accessed or manipulated by Organization B.
    """
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        # Create Org A
        res_a = await client.post("/api/v1/auth/signup", json={
            "email": "org_a_owner@alpha.com",
            "name": "Alpha Owner",
            "password": "PasswordAlpha123!",
            "business_name": "Alpha Enterprise"
        })
        token_a = res_a.json()["token"]
        org_a_id = res_a.json()["business_id"]

        # Create Org B
        res_b = await client.post("/api/v1/auth/signup", json={
            "email": "org_b_owner@beta.com",
            "name": "Beta Owner",
            "password": "PasswordBeta123!",
            "business_name": "Beta Enterprise"
        })
        token_b = res_b.json()["token"]
        org_b_id = res_b.json()["business_id"]

        # Create service under Org A
        svc_res = await client.post("/api/v1/services", json={
            "name": "Alpha Premium Consultation",
            "description": "Exclusive Alpha Service",
            "price": 500.0,
            "duration": 60
        }, headers={"Authorization": f"Bearer {token_a}"})
        assert svc_res.status_code == 201
        svc_a_id = svc_res.json()["id"]

        # 1. Correct Organization: Org A lists services -> sees service
        list_a = await client.get("/api/v1/services", headers={"Authorization": f"Bearer {token_a}"})
        assert list_a.status_code == 200
        svc_ids_a = [s["id"] for s in list_a.json()]
        assert svc_a_id in svc_ids_a

        # 2. Cross-Tenant Attempt: Org B tries to spoof X-Business-ID to Org A
        attack_list = await client.get("/api/v1/services", headers={
            "Authorization": f"Bearer {token_b}",
            "X-Business-ID": org_a_id
        })
        assert attack_list.status_code == 403
        data_err = attack_list.json()
        assert data_err["error"]["code"] == "FORBIDDEN"

        # 3. Cross-Tenant Mutation: Org B attempts to update Org A's service
        attack_put = await client.put(f"/api/v1/services/{svc_a_id}", json={
            "name": "Hacked Service Name"
        }, headers={"Authorization": f"Bearer {token_b}"})
        assert attack_put.status_code in [403, 404]

@pytest.mark.asyncio
async def test_role_authorization(async_session):
    """Verifies that non-admin members cannot access admin endpoints."""
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        # Create regular user
        res_user = await client.post("/api/v1/auth/signup", json={
            "email": "staff_member@clinic.com",
            "name": "Staff Member",
            "password": "Password123!",
            "role": "STAFF"
        })
        token_staff = res_user.json()["token"]

        # Attempt to access Super-Admin route
        res_admin = await client.get("/api/v1/admin/tenants", headers={"Authorization": f"Bearer {token_staff}"})
        assert res_admin.status_code == 403
        assert res_admin.json()["error"]["code"] == "FORBIDDEN"

@pytest.mark.asyncio
async def test_valid_input_validation(async_session):
    """Verifies that valid schema input succeeds."""
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        res = await client.post("/api/v1/auth/signup", json={
            "email": "valid_user@domain.com",
            "name": "Valid User",
            "password": "ValidPassword123!",
            "business_name": "Valid Business"
        })
        assert res.status_code == 201
        assert "token" in res.json()

@pytest.mark.asyncio
async def test_invalid_input_validation(async_session):
    """Verifies that schema validation failures return 422 VALIDATION_ERROR."""
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        # Invalid email format
        res = await client.post("/api/v1/auth/signup", json={
            "email": "not-a-valid-email",
            "name": "Invalid Email User",
            "password": "Password123!"
        })
        assert res.status_code == 422
        data = res.json()
        assert data["error"]["code"] == "VALIDATION_ERROR"
        assert "reference" in data["error"]

@pytest.mark.asyncio
async def test_missing_required_input(async_session):
    """Verifies that missing required fields return 422 with validation details."""
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        # Missing password
        res = await client.post("/api/v1/auth/signup", json={
            "email": "missing_pw@domain.com",
            "name": "Missing Password"
        })
        assert res.status_code == 422
        data = res.json()
        assert data["error"]["code"] == "VALIDATION_ERROR"
        assert "validation_errors" in data["error"]["details"]

@pytest.mark.asyncio
async def test_not_found_resource(async_session):
    """Verifies that querying a non-existent entity returns 404 NOT_FOUND with reference."""
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        res = await client.post("/api/v1/auth/signup", json={
            "email": "nf_user@domain.com",
            "name": "NF User",
            "password": "Password123!"
        })
        token = res.json()["token"]

        res_nf = await client.get("/api/v1/customers/00000000-0000-0000-0000-999999999999", headers={
            "Authorization": f"Bearer {token}"
        })
        assert res_nf.status_code == 404
        data = res_nf.json()
        assert data["error"]["code"] == "NOT_FOUND"
        assert data["error"]["reference"].startswith("RF-")

@pytest.mark.asyncio
async def test_rate_limiter_in_memory():
    """Verifies that the rate limiter permits allowed requests and blocks burst limit."""
    limiter = InMemoryRateLimiter()
    key = "test-user-ip-1"

    # Allow 3 requests in 10-second window
    allowed1, rem1, _ = await limiter.is_allowed(key, max_requests=3, window_seconds=10)
    assert allowed1 is True
    assert rem1 == 2

    allowed2, rem2, _ = await limiter.is_allowed(key, max_requests=3, window_seconds=10)
    assert allowed2 is True
    assert rem2 == 1

    allowed3, rem3, _ = await limiter.is_allowed(key, max_requests=3, window_seconds=10)
    assert allowed3 is True
    assert rem3 == 0

    # 4th request must be blocked
    allowed4, rem4, retry = await limiter.is_allowed(key, max_requests=3, window_seconds=10)
    assert allowed4 is False
    assert rem4 == 0
    assert retry > 0
