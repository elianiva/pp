import type { APIRoute } from "astro";
import { db, Paste } from "astro:db";
import { generateId } from "../../lib/nanoid";

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    const { content, language } = await request.json();

    if (!content || typeof content !== "string") {
      return new Response(JSON.stringify({ error: "Content is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Check size limit (1MB)
    const sizeInBytes = new TextEncoder().encode(content).length;
    if (sizeInBytes > 1024 * 1024) {
      return new Response(JSON.stringify({ error: "Content exceeds 1MB limit" }), {
        status: 413,
        headers: { "Content-Type": "application/json" },
      });
    }

    const id = generateId();
    const createdAt = Date.now();

    await db.insert(Paste).values({
      id,
      content,
      language: language || "plaintext",
      createdAt,
    });

    return new Response(JSON.stringify({ id }), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Failed to create paste:", error);
    return new Response(JSON.stringify({ error: "Failed to create paste" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
