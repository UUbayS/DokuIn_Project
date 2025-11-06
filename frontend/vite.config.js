import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],

  server: {
    proxy: {
      // String '/api' akan diganti dengan target
      "/api": {
        target: "http://localhost:5000", // URL backend Anda
        changeOrigin: true,
        secure: false, // Jika backend Anda http, bukan https
      },
    },
  },
});
