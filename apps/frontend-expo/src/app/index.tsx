import { BooksScreenContent } from "@/modules/books/view/BooksScreenContent";
import { Stack } from "expo-router";

export default function BooksScreen() {
  return (
    <>
      <Stack.Screen options={{ title: "Books" }} />
      <BooksScreenContent />
    </>
  );
}
