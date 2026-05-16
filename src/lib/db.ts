import { drizzle } from "drizzle-orm/d1";
import { Paste } from "./schema";
import { eq } from "drizzle-orm";
import { env } from "cloudflare:workers";

export function getDb() {
  return drizzle(env.DB, { schema: { Paste } });
}

export { Paste, eq };
