import { defineConfig } from "drizzle-kit";

export default defineConfig({
  out: "./drizzle",
  schema: "./src/lib/schema.ts",
  dialect: "sqlite",
  driver: "d1-http",
  dbCredentials: {
    accountId: process.env.CLOUDFLARE_ACCOUNT_ID!,
    databaseId: "54f42ea9-6918-43c8-a57a-67ded59cea9e",
    token: process.env.CLOUDFLARE_D1_TOKEN!,
  },
});
