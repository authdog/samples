# Follow-ups after Wave 3 authentication

Do these in order. One Spec Kit feature per row
(`/speckit-specify` → plan → tasks → implement). Do not start a
later row until the previous feature is Present or Deferred.

- [x] **011** Wave 3 authorization — `authz/go`, `authz/java`, `authz/csharp`, `authz/python`. Go/Python: `GET /invoices` after the identity gate, `invoices:read`, 401 / 403 / 200. Java/C#: token CLI like `authz/node`. Fail-closed. Keep source-only labels.
- [x] **012** Wave 3 observability — signed webhook (`X-Authdog-Signature`) + Events API pull. Go/Python in-app. Java/C#: standalone HTTP receiver (no invented SDK helper). Secrets stay server-only.
- [x] **013** Wave 3 lidar — same receiver rules; mark subject on a verified security event; `GET /sensitive` → 428 challenge, not a block. No Signals API.
- [x] **014** Wave 4 authentication — `expo`, `ios-swift`, `android-kotlin`, `flutter-dart`. Identity only. Native stacks use the REST / redirect bridge until an official SDK ships. No `authz/<stack>`.
- [ ] **015** Wave 4 observability — companion receiver or pair with `observability/express`. No webhook secrets or API tokens on device.
- [ ] **016** Wave 4 lidar — companion / paired-server step-up. Console Signals stay console-only.
- [ ] **017** Wave 5 authentication — `gatsby`, `redwood`, `react`, `rust`. `react` is UI-only. `rust` is source-only until a crate is published.
- [ ] **018** Wave 5 remaining concepts — `authz` only where the stack can enforce on the server (`gatsby`, `redwood`, `rust`). Skip `authz/react`. Then observability, then lidar.

Also, when a registry package actually publishes:

- [ ] Replace Java / C# / Python source pins with the real Maven, NuGet, or PyPI install and drop the source-only banners.

Start with **015**. MCP and agentic identity still need their own Spec Kit feature before any top-level folder.
