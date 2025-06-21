
import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    host: "0.0.0.0",
    port: 5173,
    proxy: {
      "/api": {
        target: "http://davidovito.duckdns.org:8080",
        // target: "https://quiet-nails-wink.loca.lt",
        //target: "http://backend:8000",
        changeOrigin: true,
        secure: false,
      },
    }
  },
});
