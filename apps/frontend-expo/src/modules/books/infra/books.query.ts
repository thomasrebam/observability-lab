import { useQuery } from "@tanstack/react-query";
import { fetchBooks } from "./books.connector";

export function useBooksQuery() {
  return useQuery({ queryKey: ["books"], queryFn: fetchBooks });
}
