import { z } from "zod";

const bookSchema = z.object({
  id: z.number(),
  title: z.string(),
  author: z.string(),
  year: z.number(),
});

export const booksSchema = z.array(bookSchema);

export type Book = z.infer<typeof bookSchema>;
