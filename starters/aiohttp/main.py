import os

from aiohttp import web
from authdog.aiohttp import Authdog

public_key = os.environ.get("PK_AUTHDOG")
if not public_key:
    raise SystemExit("Set PK_AUTHDOG to your environment public key (pk_...)")

authdog = Authdog(public_key=public_key)


async def index(request):
    return web.json_response(
        {
            "sample": "Event ingest",
            "hint": "GET /me with an authdog-session cookie or Authorization: Bearer <token>",
        }
    )


@authdog.require_auth
async def me(request):
    ctx = await authdog.session(request)
    return web.json_response(ctx.user)


app = web.Application(middlewares=[authdog.middleware])
app.router.add_get("/", index)
app.router.add_get("/me", me)


if __name__ == "__main__":
    web.run_app(app, port=int(os.environ.get("PORT", "3000")))
