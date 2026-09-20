import type { ReactNode } from "react";

export const metadata = {
  title: "authdog lidar — Next.js",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body
        style={{
          fontFamily: "system-ui, sans-serif",
          margin: "2rem auto",
          maxWidth: "40rem",
          lineHeight: 1.5,
        }}
      >
        {children}
      </body>
    </html>
  );
}
