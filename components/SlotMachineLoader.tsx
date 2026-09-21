"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { searchBooks, GoogleBookItem } from "@/lib/googleBooks";

type SlotMachineLoaderProps = {
  isOpen: boolean;
};

export default function SlotMachineLoader({ isOpen }: SlotMachineLoaderProps) {
  const [covers, setCovers] = useState<string[]>([]);
  const [isLoadingCovers, setIsLoadingCovers] = useState<boolean>(true);

  // Busca capas de livros reais na API sempre que o modal abre
  useEffect(() => {
    if (!isOpen) return;

    let isMounted = true;
    setIsLoadingCovers(true);

    async function fetchLibraryCovers() {
      try {
        // Busca uma amostra diversa de livros para popular o carrossel
        const randomQueries = [
          "bestsellers",
          "ficcao",
          "literatura",
          "romance",
          "classicos",
        ];
        const randomQuery =
          randomQueries[Math.floor(Math.random() * randomQueries.length)];

        const books: GoogleBookItem[] = await searchBooks(randomQuery, 15);

        // Filtra apenas livros que possuem capas válidas
        const validCovers = books
          .map((b) => b.coverUrl)
          .filter((url): url is string => Boolean(url));

        if (isMounted && validCovers.length > 0) {
          setCovers(validCovers);
        }
      } catch (err) {
        console.error("Erro ao carregar capas para o loader:", err);
      } finally {
        if (isMounted) setIsLoadingCovers(false);
      }
    }

    fetchLibraryCovers();

    return () => {
      isMounted = false;
    };
  }, [isOpen]);

  if (!isOpen) return null;

  // Duplicamos as capas para criar a ilusão de rolagem infinita contínua
  const displayCovers = [...covers, ...covers, ...covers];

  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex flex-col items-center justify-center p-4">
      <div className="bg-[#1a120c] p-8 rounded-2xl border border-amber-900/40 shadow-2xl flex flex-col items-center text-center max-w-sm w-full">
        <span className="text-xs uppercase tracking-widest text-amber-400 font-bold mb-4 animate-pulse flex items-center gap-2">
          <span>🎰</span> Vasculhando a biblioteca...
        </span>

        {/* Caixilho do Cassino / Roleta */}
        <div className="relative w-44 h-64 bg-black/60 rounded-xl border-2 border-amber-500/50 overflow-hidden shadow-[0_0_30px_rgba(217,119,6,0.25)]">
          {/* Sombras interna superior/inferior para efeito 3D/profundidade */}
          <div className="absolute inset-x-0 top-0 h-10 bg-linear-to-b from-black to-transparent z-20 pointer-events-none" />
          <div className="absolute inset-x-0 bottom-0 h-10 bg-linear-to-t from-black to-transparent z-20 pointer-events-none" />

          {/* Mira / Linha de seleção central */}
          <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-36 bg-amber-500/10 z-10 border-y border-amber-500/40 pointer-events-none" />

          {/* Estado de carregamento rápido até buscar as capas */}
          {isLoadingCovers || covers.length === 0 ? (
            <div className="w-full h-full flex flex-col items-center justify-center text-amber-200/60 text-xs animate-pulse p-4">
              Acessando estantes...
            </div>
          ) : (
            /* Rolagem das Capas */
            <motion.div
              className="flex flex-col items-center gap-4 py-4"
              animate={{
                y: [0, -(covers.length * 150)],
              }}
              transition={{
                repeat: Infinity,
                duration: Math.max(covers.length * 0.25, 2),
                ease: "linear",
              }}
            >
              {displayCovers.map((coverUrl, index) => (
                <div
                  key={index}
                  className="w-28 h-40 relative bg-neutral-900 rounded-lg overflow-hidden border border-amber-100/10 shrink-0 shadow-md"
                >
                  <Image
                    src={coverUrl}
                    alt="Capa de livro da biblioteca"
                    fill
                    className="object-cover"
                    sizes="112px"
                  />
                </div>
              ))}
            </motion.div>
          )}
        </div>

        <p className="text-xs text-amber-100/70 mt-6 font-lora italic">
          Analisando títulos, autores e seu humor atual...
        </p>
      </div>
    </div>
  );
}
