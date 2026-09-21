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

  // Pesquisamos bem próximo das primeiras páginas (índice 0 a 5) para manter o apelo comercial
  const safeStartIndex = Math.floor(Math.random() * 5);

  try {
    const res = await fetch(
      `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(
        query,
      )}&startIndex=${safeStartIndex}&maxResults=${maxResults}&printType=books&orderBy=relevance&langRestrict=pt&country=BR${keyParam}`,
    );

    if (res.status === 429) {
      console.warn("Limite de requisições excedido. Aguarde alguns instantes.");
      return [];
    }

    if (!res.ok) {
      throw new Error(`Erro na API: ${res.statusText}`);
    }

    const data = await res.json();
    if (!data.items) return [];

    return data.items
      .filter((item: any) => {
        const info = item.volumeInfo;

        // 1. Precisa ter capa e sinopse razoável
        const hasCover = Boolean(
          info.imageLinks?.thumbnail || info.imageLinks?.smallThumbnail,
        );
        const hasDescription = info.description && info.description.length > 50;

        // 2. Filtro de Ano: Ignorar livros muito antigos (ex: anteriores a 1995/2000)
        const publishedYear = info.publishedDate
          ? parseInt(info.publishedDate.substring(0, 4))
          : 0;
        const isRecent = publishedYear >= 1995;

        // 3. Filtro Anti-Academico / Anti-Underground: Evitar termos de teses/manuais
        const titleLower = (info.title || "").toLowerCase();
        const isAcademic =
          titleLower.includes("revista") ||
          titleLower.includes("anais") ||
          titleLower.includes("congresso") ||
          titleLower.includes("relatório") ||
          titleLower.includes("manual de");

        return hasCover && hasDescription && isRecent && !isAcademic;
      })
      .map((item: any) => {
        const info = item.volumeInfo;
        let cover =
          info.imageLinks?.thumbnail || info.imageLinks?.smallThumbnail || "";
        cover = cover.replace("http://", "https://");

        const isbnObj = info.industryIdentifiers?.find(
          (id: any) => id.type === "ISBN_10" || id.type === "ISBN_13",
        );

        return {
          id: item.id,
          title: info.title || "Título desconhecido",
          authors: info.authors || ["Autor desconhecido"],
          coverUrl: cover,
          pageCount: info.pageCount || 0,
          isbn: isbnObj ? isbnObj.identifier : "",
          description: info.description || "",
          averageRating: info.averageRating || null,
          ratingsCount: info.ratingsCount || 0,
          publishedDate: info.publishedDate || "",
        };
      });
  } catch (error) {
    console.error("Erro ao buscar livros no Google Books:", error);
    return [];
  }
}
