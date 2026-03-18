import type { APIRoute } from "astro";
import { eq } from "drizzle-orm";
import { getDb, Paste } from "../../lib/db";

export const prerender = false;

export const GET: APIRoute = async ({ params }) => {
  try {
    const { id } = params;

    if (!id) {
      return new Response("ID is required", { status: 400 });
    }

    const db = getDb();
    const result = await db.select().from(Paste).where(eq(Paste.id, id));

    if (result.length === 0) {
      return new Response("Paste not found", { status: 404 });
    }

    const paste = result[0];

    return new Response(paste.content, {
      status: 200,
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (error) {
    console.error("Failed to fetch raw paste:", error);
    return new Response("Failed to fetch paste", { status: 500 });
  }
};
