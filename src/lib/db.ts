import { createClient } from "@libsql/client/web";
import { drizzle } from "drizzle-orm/libsql";
import { Paste } from "./schema";
import { eq } from "drizzle-orm";
import { ASTRO_DB_REMOTE_URL, ASTRO_DB_APP_TOKEN } from "astro:env/server";

// Create a function to get the DB client with the correct env vars
export function getDb() {
  if (!ASTRO_DB_REMOTE_URL || !ASTRO_DB_APP_TOKEN) {
    throw new Error("Missing database credentials");
  }

  const client = createClient({
    url: ASTRO_DB_REMOTE_URL,
    authToken: ASTRO_DB_APP_TOKEN,
  });

  return drizzle(client, {
    schema: { Paste },
  });
}

// Export the table and helpers for convenience
export { Paste, eq };
