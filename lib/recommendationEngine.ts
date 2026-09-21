import { GoogleBookItem, searchBooks } from "./googleBooks";
import { UserProfile } from "./storage";

const MOOD_QUERY_MAP: Record<string, string[]> = {
  apaixonadin: [
    "bestseller romance",
    "romance pop",
    "colleen hoover",
    "ali hazelwood",
    "comédia romântica sucesso",
    "comédia romântica",
  ],
  "cansado-da-realidade": [
    "fantasia bestseller",
    "ficção científica sucesso",
    "livros pop fantasia",
    "sarah j maas",
    "fantasia épica moderna",
  ],
  muahahaha: [
    "thriller bestseller",
    "suspense psicologico sucesso",
    "fiona barton",
    "thriller policial pop",
  ],
  introspectivo: [
    "romance contemporâneo premiado",
    "literatura contemporânea sucesso",
    "matt haig",
    "ficção moderna",
  ],
  "cerebro-frito": [
    "quadrinhos sucesso",
    "graphic novel bestseller",
    "leitura leve pop",
  ],
  melancolico: [
    "drama contemporâneo bestseller",
    "romance emocionante sucesso",
  ],
};

interface SearchOptions {
  moodId: string;
  profile: UserProfile;
  format?: "all" | "kindle";
}

export async function getRecommendedBooks({
  moodId,
  profile,
}: SearchOptions): Promise<GoogleBookItem[]> {
  const terms = MOOD_QUERY_MAP[moodId] || ["fiction"];

  // pega um termo de humor da lista
  const randomMoodTerm = terms[Math.floor(Math.random() * terms.length)];

  // sorteia um genero dos favoritos do usuário (se tiver)
  const userGenre =
    profile.favoriteGenres.length > 0
      ? profile.favoriteGenres[
          Math.floor(Math.random() * profile.favoriteGenres.length)
        ]
      : "";

  // monta uma query dinamica (ex: "enemies to lovers subject:Fantasy")
  const searchQuery = userGenre
    ? `${randomMoodTerm} subject:"${userGenre}"`
    : randomMoodTerm;

  // busca livros com busca paginada e ordenação aleatória
  const rawBooks = await searchBooks(searchQuery, 20);

  // filtra elementos a evitar salvos no onboarding
  const filteredBooks = rawBooks.filter((book) => {
    const textToAnalyze =
      `${book.title} ${book.description || ""}`.toLowerCase();

    return !profile.avoidTropes.some((trope) =>
      textToAnalyze.includes(trope.toLowerCase()),
    );
  });

  // embaralha os resultados filtrados
  return filteredBooks.sort(() => 0.5 - Math.random());
}
