"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { searchBooks, GoogleBookItem } from "@/lib/googleBooks";
import { moods } from "@/data/moods"; // Importe o seu array oficial de humores

type AddBookModalProps = {
  onClose: () => void;
  onBookAdded?: () => void;
};

export default function AddBookModal({
  onClose,
  onBookAdded,
}: AddBookModalProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<GoogleBookItem[]>([]);
  const [selectedBook, setSelectedBook] = useState<GoogleBookItem | null>(null);
  const [selectedMoodId, setSelectedMoodId] = useState<string>("apaixonadin");

  // Handles the search on Google Books API
  const handleSearch = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!searchTerm.trim()) return;

      setIsSearching(true);
      setSelectedBook(null);

      const results = await searchBooks(searchTerm);
      setSearchResults(results);
      setIsSearching(false);
    },
    [searchTerm],
  );

  // Saves the selected book with its mood tag to localStorage
  const handleSaveToBookshelf = () => {
    if (!selectedBook) return;

    const newBook = {
      ...selectedBook,
      moodId: selectedMoodId,
      addedAt: new Date().toISOString(),
    };

    // Lê os livros que já existem salvos
    const existing = JSON.parse(
      localStorage.getItem("@livroteca:bookshelf") || "[]",
    );

    // Evita duplicados pelo ID do livro
    const updated = [
      newBook,
      ...existing.filter((b: any) => b.id !== selectedBook.id),
    ];

    localStorage.setItem("@livroteca:bookshelf", JSON.stringify(updated));

    if (onBookAdded) onBookAdded();
    onClose();
  };
  
  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="bg-foreground p-6 md:p-8 rounded-2xl max-w-lg w-full shadow-2xl relative border border-cream/20 max-h-[90vh] overflow-y-auto"
          initial={{ opacity: 0, scale: 0.95, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 30 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={onClose}
            className="absolute top-3 right-4 text-gray-400 hover:text-white text-3xl"
            aria-label="Fechar modal"
          >
            &times;
          </button>

          <div className="mb-6 text-center">
            <h2 className="text-2xl font-bold font-lora mb-1">
              Adicionar à Minha Estante
            </h2>
            <p className="text-xs opacity-80">
              Busque o livro que você já possui em casa para usar no modo
              sorteio!
            </p>
          </div>

          <form onSubmit={handleSearch} className="flex gap-2 mb-6">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Digite o título ou autor do livro..."
              required
              className="flex-1 bg-black/30 border border-cream/30 text-white rounded-xl px-4 py-2 text-sm outline-none focus:border-greenColor transition"
            />
            <button
              type="submit"
              disabled={isSearching}
              className="bg-greenColor hover:bg-greenColor/90 text-white font-bold text-sm px-5 py-2 rounded-xl transition disabled:opacity-50"
            >
              {isSearching ? "Buscando..." : "Buscar"}
            </button>
          </form>

          {!selectedBook && searchResults.length > 0 && (
            <div className="space-y-3 max-h-60 overflow-y-auto pr-1 mb-6">
              <p className="text-xs font-semibold uppercase opacity-70">
                Selecione o livro correto:
              </p>
              {searchResults.map((book) => (
                <div
                  key={book.id}
                  onClick={() => setSelectedBook(book)}
                  className="flex items-center gap-3 p-2 bg-black/20 hover:bg-black/40 rounded-xl cursor-pointer transition border border-transparent hover:border-cream/30"
                >
                  <div className="relative w-10 h-14 bg-gray-800 rounded shrink-0 overflow-hidden">
                    {book.coverUrl ? (
                      <Image
                        src={book.coverUrl}
                        alt={book.title}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[10px] text-center p-1">
                        Sem Capa
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate">
                      {book.title}
                    </p>
                    <p className="text-xs opacity-70 truncate">
                      {book.authors.join(", ")}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* config do livro selecionado */}
          {selectedBook && (
            <div className="bg-black/30 p-4 rounded-xl mb-6 border border-greenColor/40">
              <div className="flex gap-4 items-center mb-4">
                <div className="relative w-14 h-20 bg-gray-800 rounded overflow-hidden shrink-0">
                  {selectedBook.coverUrl && (
                    <Image
                      src={selectedBook.coverUrl}
                      alt={selectedBook.title}
                      fill
                      className="object-cover"
                    />
                  )}
                </div>
                <div>
                  <h4 className="font-bold text-sm line-clamp-2">
                    {selectedBook.title}
                  </h4>
                  <p className="text-xs opacity-70">
                    {selectedBook.authors.join(", ")}
                  </p>
                  <button
                    onClick={() => setSelectedBook(null)}
                    className="text-xs text-greenColor underline mt-2"
                  >
                    Trocar livro
                  </button>
                </div>
              </div>

              {/* seletor do humor/vibe pro livro */}
              <div>
                <label className="block text-xs font-semibold mb-2 opacity-90">
                  Qual a vibe desse livro para quando for sortear?
                </label>
                <select
                  value={selectedMoodId}
                  onChange={(e) => setSelectedMoodId(e.target.value)}
                  className="w-full bg-black/50 border border-cream/30 text-white text-sm rounded-lg p-2.5 outline-none focus:border-greenColor"
                >
                  {moods.map((m) => (
                    <option
                      key={m.id}
                      value={m.id}
                      className="bg-foreground text-white"
                    >
                      {m.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {selectedBook && (
            <button
              onClick={handleSaveToBookshelf}
              className="w-full bg-greenColor hover:bg-greenColor/90 text-white font-bold py-3 rounded-xl transition shadow-[0_0_15px_rgba(87,194,81,0.4)]"
            >
              Salvar na Minha Estante
            </button>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
