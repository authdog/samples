import "dotenv/config";
import express, { type RequestHandler } from "express";
import { createAuthdog } from "@authdog/express";

const publicKey = process.env.PK_AUTHDOG;
if (!publicKey) {
  throw new Error("Set PK_AUTHDOG to your environment public key (pk_...)");
}

const app = express();
const authdog = createAuthdog({ publicKey });
const { identityHost, environmentId } = authdog.getPublicKeyPayload();
const signinUri = `${identityHost}/signin/${environmentId}`;

const REQUIRED_PERMISSION = "invoices:read";

type AuthdogUserClaims = {
  permissions?: string[];
  roles?: string[];
};

const requirePermission = (...required: string[]): RequestHandler => {
  return (req, res, next) => {
    const user = req.authdog?.user as AuthdogUserClaims | null;
    const permissions = Array.isArray(user?.permissions)
      ? user.permissions
      : [];
    const missing = required.filter((p) => !permissions.includes(p));
    if (missing.length > 0) {
      res.status(403).json({ error: "Forbidden", missing });
      return;
    }
    next();
  };
};

app.use(authdog.attachSession());

app.get("/", (_req, res) => {
  res.type("html").send(`<!doctype html>
<html lang="en">
  <body style="font-family:system-ui,sans-serif;margin:2rem auto;max-width:40rem;line-height:1.5">
    <h1>authdog authorization (Express)</h1>
    <p>This starter proves a server-side allow/deny decision. Identity comes first; permission comes second.</p>
    <p><code>GET /invoices</code> is 401 without a session, 403 without
      <code>${REQUIRED_PERMISSION}</code>, and 200 with it.</p>
    <p>
      <a href="${signinUri}">Sign in with the hosted Account portal</a>
      · <a href="/invoices">GET /invoices</a>
      · <a href="/logout">Sign out</a>
    </p>
  </body>
</html>`);
});

app.get("/me", authdog.requireAuth, (req, res) => {
  res.json(req.authdog!.user);
});

app.get(
  "/invoices",
  authdog.requireAuth,
  requirePermission(REQUIRED_PERMISSION),
  (_req, res) => {
    res.json({
      invoices: [
        { id: "inv_001", amount: 1200, status: "paid" },
        { id: "inv_002", amount: 340, status: "open" },
      ],
    });
  },
);

app.get("/logout", authdog.logout);

const port = Number(process.env.PORT) || 3000;
app.listen(port, () => {
  console.log(`authz/express listening on http://localhost:${port}`);
});
