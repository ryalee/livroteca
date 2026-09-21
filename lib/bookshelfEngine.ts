import { createClient } from "./supabase";
import { UserProfile } from "./storage";

export type BookshelfItem = {
  id: string;
  user_id: string;
  google_book_id: string;
  title: string;
  authors: string[];
  cover_url: string;
  isbn?: string;
  format: "physical" | "kindle" | "both";
  mood_id: string;
};

interface ShelfSearchOptions {
  moodId: string;
  formatFilter: "all" | "kindle";
  profile: UserProfile;
}

export async function pickFromBookshelf({
  moodId,
  formatFilter,
  profile,
}: ShelfSearchOptions): Promise<BookshelfItem | null> {
  const supabase = createClient();

  // busca os livros do usuario
  let query = supabase.from("bookshelf").select("*");

  // filtra por humor se especificado
  if (moodId) {
    query = query.eq("mood_id", moodId);
  }

  // filtra por formato se ativado o botão "Apenas Kindle"
  if (formatFilter === "kindle") {
    query = query.in("format", ["kindle", "both"]);
  }

  const { data: books, error } = await query;

  if (error || !books || books.length === 0) {
    return null;
  }

  // filtra livros que possam conter gatilhos/a evitar
  const validBooks = books.filter((book) => {
    const textToCheck = `${book.title}`.toLowerCase();
    return !profile.avoidTropes.some((trope) =>
      textToCheck.includes(trope.toLowerCase())
    );
  });

  if (validBooks.length === 0) return null;

  // sorteia um livro aleatório da lista filtrada
  const randomIndex = Math.floor(Math.random() * validBooks.length);
  return validBooks[randomIndex];
}