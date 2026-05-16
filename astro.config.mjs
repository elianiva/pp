// @ts-check
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import solidJs from "@astrojs/solid-js";
import cloudflare from "@astrojs/cloudflare";
import { fileURLToPath } from "node:url";

// https://astro.build/config
export default defineConfig({
  site: "https://pp.elianiva.my.id",
  output: "server",
  integrations: [solidJs()],

  vite: {
    plugins: [tailwindcss()],
    resolve: {
      alias: {
        "node-fetch": fileURLToPath(new URL("./src/fetch-shim.mjs", import.meta.url)),
        "cross-fetch": fileURLToPath(new URL("./src/fetch-shim.mjs", import.meta.url)),
      },
    },
    ssr: {
      noExternal: ["drizzle-orm"],
    },
  },

  adapter: cloudflare(),
});
