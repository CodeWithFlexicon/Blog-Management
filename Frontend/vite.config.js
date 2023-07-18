import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./setupTests.js",
  },
  server: {
    port: 5173,
    proxy: {
      "/blog": {
        target: "http://localhost:4004",
        changeOrigin: true,
      },
    },
  },
});
