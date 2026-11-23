import { Book, booksSchema } from "@/modules/books/domain/books";
import { httpClient } from "@/shared/httpClient";

export async function fetchBooks(): Promise<Book[]> {
  const response = await httpClient.get("/api/books");
  const books = booksSchema.parse(response.data);
  return books;
}
