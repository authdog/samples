import "dotenv/config";
import Fastify from "fastify";
import { authdogPlugin } from "@authdog/fastify";
import type { FastifyRequest, FastifyReply } from "fastify";

const publicKey = process.env.PK_AUTHDOG;
if (!publicKey) {
  console.error("Set PK_AUTHDOG in .env to a pk_... public key.");
  process.exit(1);
}

const REQUIRED_PERMISSION = "invoices:read";

type AuthdogUserClaims = {
  permissions?: string[];
  roles?: string[];
};

// Fail-closed: a missing claim is a deny. Runs after requireAuth.
function requirePermission(...required: string[]) {
  return async (req: FastifyRequest, reply: FastifyReply) => {
    const user = req.authdog?.user as AuthdogUserClaims | null;
    const permissions = Array.isArray(user?.permissions) ? user.permissions : [];
    const missing = required.filter((p) => !permissions.includes(p));
    if (missing.length > 0) {
      return reply.status(403).send({ error: "Forbidden", missing });
    }
  };
}

const app = Fastify({ logger: true });
await app.register(authdogPlugin, { publicKey });

app.get("/", async () => ({
  sample: "authdog authz on fastify",
  hint: "GET /invoices with an authdog-session cookie or Authorization: Bearer <token>",
}));

app.get("/me", { preHandler: app.authdog.requireAuth }, async (req) =>
  req.authdog!.user,
);

app.get(
  "/invoices",
  { preHandler: [app.authdog.requireAuth, requirePermission(REQUIRED_PERMISSION)] },
  async () => ({
    invoices: [
      { id: "inv_001", amount: 1200, status: "paid" },
      { id: "inv_002", amount: 340, status: "open" },
    ],
  }),
);

app.get("/logout", (req, reply) => app.authdog.logout(req, reply));

const port = Number(process.env.PORT ?? 3000);
await app.listen({ port, host: "0.0.0.0" });
