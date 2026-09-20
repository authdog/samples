import os

from fastapi import Depends, FastAPI, Request
from authdog.fastapi import Authdog

public_key = os.environ.get("PK_AUTHDOG")
if not public_key:
    raise SystemExit("Set PK_AUTHDOG to your environment public key (pk_...)")

authdog = Authdog(public_key=public_key)
app = FastAPI()


@app.get("/")
async def index(ctx=Depends(authdog.session)):
    return {
        "sample": "authdog authn on python",
        "authenticated": ctx.is_authenticated,
        "hint": "GET /me with an authdog-session cookie or Authorization: Bearer <token>",
    }


@app.get("/me")
async def me(user=Depends(authdog.require_auth)):
    return user


@app.get("/logout")
async def logout(request: Request):
    return authdog.logout(request)
