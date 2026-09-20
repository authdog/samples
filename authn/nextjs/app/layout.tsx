import type { ReactNode } from "react";
import { AuthdogProvider } from "@authdog/nextjs-app/client";
import "./styles.css";

export const metadata = {
  title: "authdog authn — Next.js",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AuthdogProvider>{children}</AuthdogProvider>
      </body>
    </html>
  );
}
