import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3600,
  },
  build: {
    // Keep the Dockerfile's `COPY build/ .` working unchanged.
    outDir: "build",
  },
});
