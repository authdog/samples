import { createAuthdog } from "@authdog/gatsby/server";

const publicKey = process.env.PK_AUTHDOG;
if (!publicKey) {
  throw new Error("Set PK_AUTHDOG to your environment public key (pk_...)");
}

const authdog = createAuthdog({ publicKey });

export default authdog.requireAuth(async (req, res) => {
  res.status(200).json({ user: req.authdog?.user ?? null });
});
