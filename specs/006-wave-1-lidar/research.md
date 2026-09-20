# Research: Wave 1 Lidar

## Decision 1: No Signals API — react to the event stream

Lidar monitors run inside Authdog and surface Signals in the console.
There is no public Signals endpoint. The documented app-side pattern
(impossible-travel recipe) is to pair a monitor with a step-up or
challenge in the app. These samples implement that: react to verified
security events with a challenge.

## Decision 2: Challenge, not block

The recipe is explicit: "Pair with step-up or a challenge step ...
rather than blocking outright; a real user on a VPN can look like
impossible travel." The sensitive route returns HTTP 428 (Precondition
Required) with a challenge payload, not 403.

## Decision 3: Step-up flow

1. Webhook receiver verifies the signature (same rules as
   observability) and, on a security event, extracts the subject
   (`data.user.id` or `data.subject`) and marks it.
2. `GET /sensitive` checks the caller's subject (from a header in this
   sample) against the mark store. Marked → 428 challenge. Unmarked →
   resource.
3. `POST /step-up/complete` clears the mark after the app's challenge
   (the sample stubs the challenge; the README says to wire a real
   one).

## Decision 4: Reuse the observability verifier

The HMAC verification module is copied from the observability samples
unchanged. Same verification order, same constant-time compare.

## Decision 5: Subject from a header in the sample

To keep the sample auth-free, the caller's subject is read from
`X-Demo-User`. The README states a real app derives the subject from
the authenticated session instead.
