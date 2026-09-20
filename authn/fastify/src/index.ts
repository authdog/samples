import "dotenv/config";
import Fastify from "fastify";
import { authdogPlugin } from "@authdog/fastify";

const publicKey = process.env.PK_AUTHDOG;
if (!publicKey) {
  console.error("Set PK_AUTHDOG in .env to a pk_... public key.");
  process.exit(1);
}

const app = Fastify({ logger: true });
await app.register(authdogPlugin, { publicKey });

app.get("/", async () => ({
  sample: "authdog authn on fastify",
  hint: "GET /me with an authdog-session cookie or Authorization: Bearer <token>",
}));

app.get(
  "/me",
  { preHandler: app.authdog.requireAuth },
  async (req) => req.authdog!.user,
);

app.get("/logout", (req, reply) => app.authdog.logout(req, reply));

const port = Number(process.env.PORT ?? 3000);
await app.listen({ port, host: "0.0.0.0" });
