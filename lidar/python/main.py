import hashlib
import hmac
import json
import os
import time
from typing import Any

from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse

REPLAY_TOLERANCE_SECONDS = 300

webhook_secret = os.environ.get("AUTHDOG_WEBHOOK_SECRET")
if not webhook_secret:
    raise SystemExit("Set AUTHDOG_WEBHOOK_SECRET")

app = FastAPI()
seen_deliveries: set[str] = set()
marked_subjects: set[str] = set()


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


def event_subject(event: dict[str, Any]) -> str | None:
    data = event.get("data")
    if not isinstance(data, dict):
        return None
    user = data.get("user")
    if isinstance(user, dict) and isinstance(user.get("id"), str):
        return user["id"]
    subject = data.get("subject")
    return subject if isinstance(subject, str) else None


@app.get("/")
async def index():
    return {
        "sample": "authdog lidar on python",
        "endpoints": [
            "POST /webhooks/authdog",
            "GET /sensitive (X-Demo-User)",
            "POST /step-up/complete (X-Demo-User)",
        ],
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
    subject = event_subject(event)
    if subject:
        marked_subjects.add(subject)
        print(f"[authdog] {request.headers.get('x-authdog-event-type')}: marked {subject} for step-up")
    return {"ok": True}


@app.get("/sensitive")
async def sensitive(request: Request):
    subject = request.headers.get("x-demo-user")
    if not subject:
        return JSONResponse({"error": "Unauthenticated"}, status_code=401)
    if subject in marked_subjects:
        return JSONResponse(
            {
                "error": "Step-up required",
                "challenge": "/step-up/complete",
                "reason": "A security-relevant event was recorded for this subject.",
            },
            status_code=428,
        )
    return {"secret": "the sensitive resource"}


@app.post("/step-up/complete")
async def complete(request: Request):
    subject = request.headers.get("x-demo-user")
    if not subject:
        return JSONResponse({"error": "Unauthenticated"}, status_code=401)
    marked_subjects.discard(subject)
    return {"ok": True}
