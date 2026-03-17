import type { APIRoute } from 'astro';
import { db, Paste, eq } from 'astro:db';

export const GET: APIRoute = async ({ params }) => {
  try {
    const { id } = params;

    if (!id) {
      return new Response(JSON.stringify({ error: 'ID is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const result = await db.select().from(Paste).where(eq(Paste.id, id));

    if (result.length === 0) {
      return new Response(JSON.stringify({ error: 'Paste not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const paste = result[0];

    return new Response(JSON.stringify(paste), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Failed to fetch paste:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch paste' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
