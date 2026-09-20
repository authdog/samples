# Research: Wave 3 Lidar

## Decision 1: Same recipe as Waves 1–2

Verify HMAC, mark `data.user.id` or `data.subject`, challenge
`GET /sensitive` with 428, clear on `POST /step-up/complete`.
Caller subject is `X-Demo-User` so the sample stays auth-free.

## Decision 2: No identity SDK

Java and C# stay on the platform HTTP stack. Python does not install
the FastAPI extra. Go uses Gin only.

## Decision 3: Copy the observability verifier

Same verification order, replay window, and constant-time compare.
Each sample is standalone — copy the helper, do not import another
sample folder.
