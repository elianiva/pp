// @ts-check
import { defineConfig } from "astro/config";

import db from "@astrojs/db";

import tailwindcss from "@tailwindcss/vite";

import solidJs from "@astrojs/solid-js";

// https://astro.build/config
export default defineConfig({
  output: "server",
  integrations: [db(), solidJs()],

  vite: {
    plugins: [tailwindcss()],
  },
});
