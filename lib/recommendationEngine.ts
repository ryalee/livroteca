import { searchBooks, GoogleBookItem } from "./googleBooks";

// Termos ultra-focados em bestsellers, sucessos de livraria e autores populares no Brasil
const MOOD_SEARCH_TERMS: Record<string, string[]> = {
  apaixonado: [
    "ali hazelwood romance",
    "romance adolescente", 
    "comédia romântica best seller", 
    "livro de romance moderno sucesso"
  ],
  "cansado-da-realidade": [
    "Brandon Sanderson fantasia", 
    "Harry Potter fantasia", 
    "ficção científica best seller moderno"
  ],
  "daquele-jeito": [
    "romance erótico best seller", 
    "Colleen Hoover romance hot", 
    "livro new adult sucesso"
  ],
  muahahaha: [
    "Stephen King suspense", 
    "thriller psicológico best seller", 
    "Agatha Christie mistério"
  ],
  introspectivo: [
    "Itamar Vieira Junior torto arado", 
    "ficção contemporânea premiada", 
    "livro reflexivo sucesso"
  ],
  "cerebro-frito": [
    "crônicas Luis Fernando Verissimo", 
    "livro de contos moderno", 
    "humor best seller"
  ],
  melancólico: [
    "Jojo Moyes drama", 
    "livro emocionante best seller", 
    "drama contemporâneo sucesso"
  ],
};

export async function getRecommendedBooks({
  moodId,
  profile,
}: {
  moodId: string;
  profile?: any;
}): Promise<GoogleBookItem[]> {
  const normalizedMood = moodId.toLowerCase();
  const terms = MOOD_SEARCH_TERMS[normalizedMood] || ["bestseller ficção"];
  const selectedTerm = terms[Math.floor(Math.random() * terms.length)];

  // Executa a busca com foco em obras de grande apelo comercial
  const results = await searchBooks(selectedTerm);
  return results;
}