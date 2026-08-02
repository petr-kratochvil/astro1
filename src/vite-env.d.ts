/// <reference types="vite/client" />

interface ViteTypeOptions {
  // Disables the fallback `[key: string]: any` on ImportMetaEnv so that
  // only the keys declared below are valid — typos become type errors.
  strictImportMetaEnv: unknown;
}

interface ImportMetaEnv {
  readonly VITE_EPHEMERIDES_API_BASE: string;
}
