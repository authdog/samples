import "dotenv/config";
import express from "express";
import { createAuthdog } from "@authdog/express";

const publicKey = process.env.PK_AUTHDOG;
if (!publicKey) {
  throw new Error("Set PK_AUTHDOG to your environment public key (pk_...)");
}

const app = express();
const authdog = createAuthdog({ publicKey });
const { identityHost, environmentId } = authdog.getPublicKeyPayload();
const signinUri = `${identityHost}/signin/${environmentId}`;

app.use(authdog.attachSession());

app.get("/", (_req, res) => {
  res.type("html").send(`<!doctype html>
<html lang="en">
  <body style="font-family:system-ui,sans-serif;margin:2rem auto;max-width:40rem;line-height:1.5">
    <h1>authdog authentication (Express)</h1>
    <p>This starter proves identity only. A signed-in session is not a permission grant.</p>
    <p><code>attachSession</code> is informational. <code>GET /me</code> is the identity gate.</p>
    <p>
      <a href="${signinUri}">Sign in with the hosted Account portal</a>
      · <a href="/me">GET /me</a>
      · <a href="/logout">Sign out</a>
    </p>
    <p>Without a session, <code>/me</code> returns 401. After hosted sign-in, send
      <code>authdog-session</code> or <code>Authorization: Bearer</code>.</p>
  </body>
</html>`);
});

app.get("/session", (req, res) => {
  res.json({
    note: "Informational only. requireAuth on GET /me is the identity gate.",
    isAuthenticated: req.authdog?.isAuthenticated ?? false,
    user: req.authdog?.user ?? null,
  });
});

app.get("/me", authdog.requireAuth, (req, res) => {
  res.json(req.authdog!.user);
});

app.get("/logout", authdog.logout);

const port = Number(process.env.PORT) || 3000;
app.listen(port, () => {
  console.log(`authn/express listening on http://localhost:${port}`);
});
