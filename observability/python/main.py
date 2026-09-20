import hashlib
import hmac
import json
import os
import time
from typing import Any
from urllib.error import HTTPError, URLError
from urllib.request import Request, urlopen

from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse

REPLAY_TOLERANCE_SECONDS = 300

api_token = os.environ.get("AUTHDOG_API_TOKEN")
webhook_secret = os.environ.get("AUTHDOG_WEBHOOK_SECRET")
tenant_id = os.environ.get("AUTHDOG_TENANT_ID")
environment_id = os.environ.get("AUTHDOG_ENVIRONMENT_ID")
if not api_token or not webhook_secret or not tenant_id or not environment_id:
    raise SystemExit(
        "Set AUTHDOG_API_TOKEN, AUTHDOG_WEBHOOK_SECRET, "
        "AUTHDOG_TENANT_ID, and AUTHDOG_ENVIRONMENT_ID"
    )

app = FastAPI()
seen_deliveries: set[str] = set()


def verify_signature(raw_body: bytes, header: str | None, secret: str) -> bool:
    if not header:
        return False
    parts: dict[str, str] = {}
    for kv in header.split(","):
        if "=" in kv:
            key, value = kv.strip().split("=", 1)
            parts[key] = value
    t = parts.get("t")
    v1 = parts.get("v1")
    if not t or not v1:
        return False
    try:
        timestamp = int(t)
    except ValueError:
        return False
    if abs(time.time() - timestamp) > REPLAY_TOLERANCE_SECONDS:
        return False
    expected = hmac.new(
        secret.encode("utf-8"),
        f"{t}.".encode("utf-8") + raw_body,
        hashlib.sha256,
    ).digest()
    try:
        received = bytes.fromhex(v1)
    except ValueError:
        return False
    if len(received) != len(expected):
        return False
    return hmac.compare_digest(expected, received)


def list_events() -> dict[str, Any]:
    url = (
        f"https://api.authdog.com/v1/tenants/{tenant_id}"
        f"/environments/{environment_id}/events?limit=20"
    )
    req = Request(url, headers={"Authorization": f"Bearer {api_token}"})
    try:
        with urlopen(req) as res:
            body = json.loads(res.read().decode("utf-8"))
    except HTTPError as exc:
        detail = exc.read().decode("utf-8", errors="replace")
        raise RuntimeError(f"Events API {exc.code}: {detail}") from exc
    except URLError as exc:
        raise RuntimeError(f"Events API: {exc.reason}") from exc
    events = body.get("data") or body.get("events") or []
    after = (body.get("list_metadata") or {}).get("after")
    return {"count": len(events), "after": after, "events": events}


@app.get("/")
async def index():
    return {
        "sample": "authdog observability on python",
        "endpoints": ["POST /webhooks/authdog", "GET /events"],
    }


@app.post("/webhooks/authdog")
async def webhook(request: Request):
    raw = await request.body()
    if not verify_signature(raw, request.headers.get("x-authdog-signature"), webhook_secret):
        return JSONResponse({"error": "Invalid signature"}, status_code=401)
    delivery_id = request.headers.get("x-authdog-delivery-id")
    if delivery_id:
        if delivery_id in seen_deliveries:
            return {"ok": True, "duplicate": True}
        seen_deliveries.add(delivery_id)
    event = json.loads(raw.decode("utf-8"))
    event_type = request.headers.get("x-authdog-event-type")
    print(f"[authdog] {event_type} ({delivery_id}): {event.get('id', '')}")
    return {"ok": True}


@app.get("/events")
async def events():
    try:
        return list_events()
    except RuntimeError as exc:
        return JSONResponse({"error": str(exc)}, status_code=502)
