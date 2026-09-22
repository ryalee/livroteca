import { searchBooks, GoogleBookItem } from "./googleBooks";

// Mapeamento simplificado de humores para termos abrangentes de busca
const MOOD_KEYWORDS: Record<string, string[]> = {
  apaixonadin: ["romance", "amor", "paixão", "relacionamento"],
  reflexivo: ["filosofia", "desenvolvimento pessoal", "psicologia", "ensaios"],
  misterioso: ["suspense", "thriller", "mistério", "investigação"],
  aventura: ["fantasia", "aventura", "ficção científica", "epopeia"],
  leve: ["humor", "comédia", "crônicas", "fábula"],
  sombrio: ["terror", "gótico", "horror", "dark fantasy"],
};

export async function getRecommendedBooks({
  moodId,
  profile,
  format,
}: {
  moodId: string;
  profile?: any;
  format?: string;
}): Promise<GoogleBookItem[]> {
  // 1. Extrai o gênero preferido (se houver) e palavras-chave do humor
  const favoriteGenre = profile?.favoriteGenres?.[0] || "";
  const moodKeywords = MOOD_KEYWORDS[moodId] || ["ficção"];
  const randomMoodKeyword =
    moodKeywords[Math.floor(Math.random() * moodKeywords.length)];

  // Tentativa 1: Busca combinando Gênero + Palavra-chave do Humor
  if (favoriteGenre) {
    const query = `${favoriteGenre} ${randomMoodKeyword}`;
    const results = await searchBooks(query);
    if (results.length > 0) return results;
  }

  // Tentativa 2 (Fallback 1): Busca apenas pela Palavra-chave do Humor
  const moodResults = await searchBooks(randomMoodKeyword);
  if (moodResults.length > 0) return moodResults;

  // Tentativa 3 (Fallback 2): Busca apenas pelo Gênero Favorito
  if (favoriteGenre) {
    const genreResults = await searchBooks(favoriteGenre);
    if (genreResults.length > 0) return genreResults;
  }

  // Tentativa 4 (Fallback Final Garantido): Busca um termo amplo aleatório
  const fallbackTerms = [
    "romance",
    "ficção",
    "suspense",
    "fantasia",
    "história",
  ];
  const randomTerm =
    fallbackTerms[Math.floor(Math.random() * fallbackTerms.length)];
  return await searchBooks(randomTerm);
}
