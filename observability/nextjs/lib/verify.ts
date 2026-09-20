import { createHmac, timingSafeEqual } from "node:crypto";

const REPLAY_TOLERANCE_SECONDS = 300;

/**
 * Verify an Authdog webhook signature.
 *
 * Header: `X-Authdog-Signature: t=<unix>, v1=<hex hmac>`
 * `v1` is HMAC-SHA256 over the exact bytes of `t + "." + rawBody`.
 *
 * Verification order (do not reorder):
 * 1. raw body (caller passes it, before JSON parsing)
 * 2. parse t/v1
 * 3. reject stale timestamps
 * 4. compute HMAC
 * 5. constant-time compare
 */
export function verifyAuthdogSignature(
  rawBody: string,
  signatureHeader: string | null,
  secret: string,
): boolean {
  if (!signatureHeader) return false;

  const parts = Object.fromEntries(
    signatureHeader
      .split(",")
      .map((kv) => kv.trim().split("=", 2) as [string, string]),
  );
  const t = parts.t;
  const v1 = parts.v1;
  if (!t || !v1) return false;

  const timestamp = Number(t);
  if (!Number.isFinite(timestamp)) return false;
  const age = Math.abs(Date.now() / 1000 - timestamp);
  if (age > REPLAY_TOLERANCE_SECONDS) return false;

  const expected = createHmac("sha256", secret)
    .update(`${t}.${rawBody}`)
    .digest();

  let received: Buffer;
  try {
    received = Buffer.from(v1, "hex");
  } catch {
    return false;
  }
  if (received.length !== expected.length) return false;
  return timingSafeEqual(received, expected);
}
