import os
from typing import Any

from fastapi import Depends, FastAPI, HTTPException, Request, status
from authdog.fastapi import Authdog

REQUIRED_PERMISSION = "invoices:read"

public_key = os.environ.get("PK_AUTHDOG")
if not public_key:
    raise SystemExit("Set PK_AUTHDOG to your environment public key (pk_...)")

authdog = Authdog(public_key=public_key)
app = FastAPI()


def permissions_of(user: Any) -> list[str]:
    if not isinstance(user, dict):
        return []
    raw = user.get("permissions")
    if not isinstance(raw, list):
        return []
    return [item for item in raw if isinstance(item, str)]


def require_permission(required: str):
    async def dependency(user: Any = Depends(authdog.require_auth)) -> Any:
        if required not in permissions_of(user):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail={"error": "Forbidden", "missing": [required]},
            )
        return user

    return dependency


@app.get("/")
async def index():
    return {
        "sample": "authdog authz on python",
        "hint": "GET /invoices with an authdog-session cookie or Authorization: Bearer <token>",
    }


@app.get("/invoices")
async def invoices(_user: Any = Depends(require_permission(REQUIRED_PERMISSION))):
    return {
        "invoices": [
            {"id": "inv_001", "amount": 1200, "status": "paid"},
            {"id": "inv_002", "amount": 340, "status": "open"},
        ]
    }


@app.get("/logout")
async def logout(request: Request):
    return authdog.logout(request)
