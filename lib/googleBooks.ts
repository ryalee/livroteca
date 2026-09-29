export type GoogleBookItem = {
  id: string;
  title: string;
  authors: string[];
  coverUrl: string;
  pageCount: number;
  isbn: string;
  description: string;
  averageRating: number | null;
  ratingsCount: number;
  publishedDate?: string;
};

export async function searchBooks(
  query: string,
  maxResults: number = 20,
): Promise<GoogleBookItem[]> {
  if (!query.trim()) return [];

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_BOOKS_API_KEY;
  const keyParam = apiKey ? `&key=${apiKey}` : "";

  try {
    // Adicionamos &langRestrict=pt para obrigar a API a retornar apenas livros em português
    const res = await fetch(
      `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(
        query.trim(),
      )}&startIndex=0&maxResults=${maxResults}&printType=books&orderBy=relevance&langRestrict=pt&country=BR${keyParam}`,
    );

    if (!res.ok) {
      throw new Error(`Erro na API: ${res.status} - ${res.statusText}`);
    }

    const data = await res.json();

    if (!data.items || data.items.length === 0) {
      return [];
    }

    return data.items.map(mapGoogleBookItem);
  } catch (error) {
    console.error("Erro crítico na requisição da API:", error);
    throw error;
  }
}

export function getHighResCoverUrl(url?: string): string {
  if (!url) return "";

  return url
    .replace(/^http:/, "https:")
    .replace(/zoom=\d/, "zoom=0")
    .replace("&edge=curl", "");
}

// Função utilitária de conversão do payload da API
function mapGoogleBookItem(item: any): GoogleBookItem {
  const info = item.volumeInfo || {};

  const rawCover =
    info.imageLinks?.thumbnail || info.imageLinks?.smallThumbnail || "";

  const isbnObj = info.industryIdentifiers?.find(
    (id: any) => id.type === "ISBN_10" || id.type === "ISBN_13",
  );

  return {
    id: item.id || Math.random().toString(),
    title: info.title || "Título desconhecido",
    authors: info.authors || ["Autor desconhecido"],
    coverUrl: getHighResCoverUrl(rawCover),
    pageCount: info.pageCount || 150,
    isbn: isbnObj ? isbnObj.identifier : "",
    description: info.description || "Sem descrição disponível para esta obra.",
    averageRating: info.averageRating || null,
    ratingsCount: info.ratingsCount || 0,
    publishedDate: info.publishedDate || "",
  };
}
