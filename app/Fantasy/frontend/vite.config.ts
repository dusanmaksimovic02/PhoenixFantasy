import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import mkcert from "vite-plugin-mkcert";

export default defineConfig({
  plugins: [tailwindcss(), react(), mkcert()],
  server: {
    https: {},
    port: 5174,
    strictPort: true,
    proxy: {
      "/images": {
        target: "https://localhost:7034/",
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
