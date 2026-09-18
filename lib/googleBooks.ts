export type GoogleBookItem = {
  id: string;
  title: string;
  authors: string[];
  coverUrl: string;
  pageCount: number;
  isbn: string;
};

export async function searchBooks(query: string): Promise<GoogleBookItem[]> {
  if (!query.trim()) return [];

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_BOOKS_API_KEY;
  console.log("Minha API Key:", apiKey ? "Carregada com sucesso" : "UNDEFINED / NÃO ENCONTRADA");

  const keyParam = apiKey ? `&key=${apiKey}` : "";

  try {
    const res = await fetch(
      `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(
        query,
      )}&maxResults=5&langRestrict=pt${keyParam}`,
    );

    // Se bater no limite de cota
    if (res.status === 429) {
      console.warn("Limite de requisições excedido. Aguarde alguns instantes.");
      return [];
    }

    if (!res.ok) {
      throw new Error(`Erro na API: ${res.statusText}`);
    }

    const data = await res.json();
    if (!data.items) return [];

    return data.items.map((item: any) => {
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
      };
    });
  } catch (error) {
    console.error("Erro ao buscar livros no Google Books:", error);
    return [];
  }
}
