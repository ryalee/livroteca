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

// 1. BUSCA PARA O RECOMENDADOR / SLOT MACHINE
export async function searchBooks(
  query: string,
  maxResults: number = 20,
): Promise<GoogleBookItem[]> {
  if (!query.trim()) return [];

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_BOOKS_API_KEY;
  const keyParam = apiKey ? `&key=${apiKey}` : "";

  try {
    const res = await fetch(
      `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(
        query.trim(),
      )}&startIndex=0&maxResults=${maxResults}&printType=books&orderBy=relevance&langRestrict=pt&country=BR${keyParam}`,
    );

    if (res.status === 429) {
      console.warn("Limite de requisições excedido no Google Books.");
      return [];
    }

    if (!res.ok) {
      throw new Error(`Erro na API: ${res.statusText}`);
    }

    const data = await res.json();
    if (!data.items || data.items.length === 0) return [];

    // Filtro Ideal (Qualidade Alta)
    const idealResults = data.items
      .filter((item: any) => {
        const info = item.volumeInfo;
        const hasCover = Boolean(
          info.imageLinks?.thumbnail || info.imageLinks?.smallThumbnail,
        );
        const hasDescription = info.description && info.description.length > 20;

        const titleLower = (info.title || "").toLowerCase();
        const isAcademic =
          titleLower.includes("revista") ||
          titleLower.includes("anais") ||
          titleLower.includes("congresso") ||
          titleLower.includes("relatório") ||
          titleLower.includes("manual de");

        return hasCover && hasDescription && !isAcademic;
      })
      .map(mapGoogleBookItem);

    // Se o filtro ideal encontrou livros, retorna eles
    if (idealResults.length > 0) {
      return idealResults;
    }

    // FALLBACK: Se o filtro de sinopse/ano barrou tudo, retorna apenas exigindo Capa e Título
    return data.items
      .filter((item: any) => {
        const info = item.volumeInfo;
        const hasTitle = Boolean(info.title);
        const hasCover = Boolean(
          info.imageLinks?.thumbnail || info.imageLinks?.smallThumbnail,
        );
        return hasTitle && hasCover;
      })
      .map(mapGoogleBookItem);
  } catch (error) {
    console.error("Erro ao buscar livros no Google Books:", error);
    return [];
  }
}

// 2. BUSCA DIRETA PARA A PILHA DE LIVROS (Exata por título/autor digitado pelo usuário)
export async function searchBooksExact(
  query: string,
  maxResults: number = 12,
): Promise<GoogleBookItem[]> {
  if (!query.trim()) return [];

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_BOOKS_API_KEY;
  const keyParam = apiKey ? `&key=${apiKey}` : "";

  try {
    // Tenta primeiro forçar busca pelo título com intitle:
    const formattedQuery = `intitle:${query.trim()}`;
    let res = await fetch(
      `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(
        formattedQuery,
      )}&startIndex=0&maxResults=${maxResults}&printType=books&langRestrict=pt&country=BR${keyParam}`,
    );

    let data = await res.json();
    let items = data.items;

    // Se o intitle: não retornar nada, faz a busca genérica por texto livre
    if (!items || items.length === 0) {
      res = await fetch(
        `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(
          query,
        )}&startIndex=0&maxResults=${maxResults}&printType=books&langRestrict=pt&country=BR${keyParam}`,
      );
      data = await res.json();
      items = data.items || [];
    }

    if (!items) return [];

    return items
      .filter((item: any) => item.volumeInfo?.title)
      .map(mapGoogleBookItem);
  } catch (error) {
    console.error("Erro ao realizar busca exata de livros:", error);
    return [];
  }
}

export function getHighResCoverUrl(url?: string): string {
  if (!url) return "";

  return (
    url
      // Força o protocolo HTTPS
      .replace(/^http:/, "https:")
      // Aumenta o parâmetro de zoom de 1/2 para 0 (tamanho original)
      .replace(/zoom=\d/, "zoom=0")
      // Remove bordas e efeitos de dobra de página de baixa qualidade
      .replace("&edge=curl", "")
  );
}

// Função utilitária de conversão do payload da API
function mapGoogleBookItem(item: any): GoogleBookItem {
  const info = item.volumeInfo || {};
  
  const rawCover = info.imageLinks?.thumbnail || info.imageLinks?.smallThumbnail || "";

  const isbnObj = info.industryIdentifiers?.find(
    (id: any) => id.type === "ISBN_10" || id.type === "ISBN_13",
  );

  return {
    id: item.id,
    title: info.title || "Título desconhecido",
    authors: info.authors || ["Autor desconhecido"],
    coverUrl: getHighResCoverUrl(rawCover), // função para puxar em alta resolução
    pageCount: info.pageCount || 0,
    isbn: isbnObj ? isbnObj.identifier : "",
    description: info.description || "Sem descrição disponível.",
    averageRating: info.averageRating || null,
    ratingsCount: info.ratingsCount || 0,
    publishedDate: info.publishedDate || "",
  };
}