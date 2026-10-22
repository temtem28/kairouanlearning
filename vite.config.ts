import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

export default defineConfig(() => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  optimizeDeps: {
    include: ["jspdf", "canvg", "html2canvas"],
  },
  build: {
    rollupOptions: {
      // Treat core-js as external so canvg's polyfill imports don't break the ESM build.
      // Modern browsers don't need these polyfills anyway.
      external: (id: string) =>
        id.startsWith("core-js/") || id.includes("?commonjs-external"),
      onwarn(warning, warn) {
        if (warning.code === "UNRESOLVED_IMPORT") return;
        warn(warning);
      },
    },
  },
}));
