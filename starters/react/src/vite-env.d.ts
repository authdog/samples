/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_AUTHDOG_IDENTITY_HOST: string;
  readonly VITE_AUTHDOG_ENVIRONMENT_ID: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
