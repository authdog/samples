import os

from authdog.flask import Authdog
from flask import Flask, jsonify

public_key = os.environ.get("PK_AUTHDOG")
if not public_key:
    raise SystemExit("Set PK_AUTHDOG to your environment public key (pk_...)")

authdog = Authdog(public_key=public_key)
app = Flask(__name__)


@app.get("/")
def index():
    return jsonify(
        {
            "sample": "Status board",
            "hint": "GET /me with an authdog-session cookie or Authorization: Bearer <token>",
        }
    )


@app.get("/me")
@authdog.require_auth
def me():
    return jsonify(authdog.session().user)
