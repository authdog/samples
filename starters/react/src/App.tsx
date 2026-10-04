import { Navbar } from "@authdog/react-elements";

const identityHost = import.meta.env.VITE_AUTHDOG_IDENTITY_HOST;
const environmentId = import.meta.env.VITE_AUTHDOG_ENVIRONMENT_ID;

export function App() {
  if (!identityHost || !environmentId) {
    return (
      <main style={{ fontFamily: "system-ui, sans-serif", margin: "2rem" }}>
        <h1>Customer navbar</h1>
        <p>
          Set <code>VITE_AUTHDOG_IDENTITY_HOST</code> and{" "}
          <code>VITE_AUTHDOG_ENVIRONMENT_ID</code> in <code>.env</code>.
        </p>
      </main>
    );
  }

  return (
    <>
      <Navbar
        logoText="Customer navbar"
        items={[{ title: "Home", href: "/" }]}
        user={undefined}
        isLoading={false}
        identityHost={identityHost}
        environmentId={environmentId}
        onNavItemClick={(href) => {
          window.location.href = href;
        }}
        onLogout={() => undefined}
      />
      <main style={{ fontFamily: "system-ui, sans-serif", margin: "2rem" }}>
        <h1>Customer navbar</h1>
        <p>
          React elements open hosted sign-in. They do not store a session or
          protect a server route. Authentication is not authorization.
        </p>
      </main>
    </>
  );
}
