import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  // The 3D route is lazy-loaded; pre-bundle its deps so the dev server doesn't
  // discover them late and serve a stale "outdated optimize dep" 504.
  optimizeDeps: {
    include: ["three", "@react-three/fiber"],
  },
  server: {
    port: 5173,
    proxy: {
      "/api": "http://127.0.0.1:8000",
    },
  },
});
