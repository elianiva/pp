import { defineDb, defineTable, column } from "astro:db";

const Paste = defineTable({
  columns: {
    id: column.text({ primaryKey: true }),
    content: column.text(),
    language: column.text(),
    createdAt: column.number(),
  },
});

// https://astro.build/db/config
export default defineDb({
  tables: { Paste },
});
