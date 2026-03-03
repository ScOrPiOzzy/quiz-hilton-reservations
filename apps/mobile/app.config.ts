import { defineConfig } from "@solidjs/start/config";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  server: {
    port: 3002,
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
