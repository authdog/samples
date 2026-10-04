import React, { useEffect } from "react";
import { initAuthdog } from "@authdog/gatsby/client";

function AuthdogBootstrap({ children }) {
  useEffect(() => {
    initAuthdog();
  }, []);
  return children;
}

export const wrapRootElement = ({ element }) => {
  return <AuthdogBootstrap>{element}</AuthdogBootstrap>;
};
