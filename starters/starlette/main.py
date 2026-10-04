import os

from authdog.starlette import Authdog
from starlette.applications import Starlette
from starlette.responses import JSONResponse
from starlette.routing import Route

public_key = os.environ.get("PK_AUTHDOG")
if not public_key:
    raise SystemExit("Set PK_AUTHDOG to your environment public key (pk_...)")

authdog = Authdog(public_key=public_key)


async def index(request):
    return JSONResponse(
        {
            "sample": "Intake service",
            "hint": "GET /me with an authdog-session cookie or Authorization: Bearer <token>",
        }
    )


async def me(request):
    user = await authdog.require_auth(request)
    return JSONResponse(user)


app = Starlette(
    routes=[
        Route("/", index),
        Route("/me", me),
    ],
    middleware=[authdog.middleware],
)
