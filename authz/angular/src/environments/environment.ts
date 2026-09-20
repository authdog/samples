export const environment = {
  production: false,
  authdogPublicKey: (globalThis as { AUTHDOG_PUBLIC_KEY?: string })
    .AUTHDOG_PUBLIC_KEY ?? "",
};
