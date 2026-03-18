// @ts-check
import { defineConfig, envField } from "astro/config";
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
      noExternal: ["drizzle-orm", "@libsql/client"],
    },
  },

  adapter: cloudflare(),
  env: {
    schema: {
      ASTRO_DB_REMOTE_URL: envField.string({
        context: "server",
        access: "secret",
        optional: false,
      }),
      ASTRO_DB_APP_TOKEN: envField.string({
        context: "server",
        access: "secret",
        optional: false,
      }),
    },
  },
});
