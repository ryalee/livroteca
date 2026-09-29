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

  useEffect(() => {
    if (!isOpen) return;

    let isMounted = true;
    setIsLoadingCovers(true);

    async function fetchLibraryCovers() {
      try {
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

  const displayCovers = [...covers, ...covers, ...covers];
  // Cada card tem 144px de altura + 16px de gap = 160px
  const itemStep = 160;

  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex flex-col items-center justify-center p-4">
      <div className="bg-[#1a120c] p-8 rounded-3xl border border-amber-900/40 shadow-[0_0_50px_rgba(0,0,0,0.8)] flex flex-col items-center text-center max-w-sm w-full relative">
        
        {/* Cabeçalho */}
        <div className="flex items-center gap-2 mb-6">
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
          <span className="text-xs uppercase tracking-widest text-amber-300/90 font-semibold">
            Vasculhando a biblioteca...
          </span>
        </div>

        {/* Moldura da Slot Machine */}
        <div className="relative w-48 h-72 bg-black/70 rounded-2xl border-2 border-amber-500/40 overflow-hidden shadow-[0_0_35px_rgba(217,119,6,0.2)]">
          
          {/* Sombras interna superior e inferior (Suaviza a entrada e saída dos livros) */}
          <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-black via-black/80 to-transparent z-20 pointer-events-none" />
          <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black via-black/80 to-transparent z-20 pointer-events-none" />

          {/* Mira / Linha de seleção central estilo Roleta */}
          <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-40 bg-amber-500/10 z-10 border-y-2 border-amber-400/50 pointer-events-none shadow-[0_0_15px_rgba(245,158,11,0.15)] flex justify-between items-center px-1">
            <div className="w-1 h-5 rounded-full bg-amber-400 shadow-[0_0_8px_#f59e0b]" />
            <div className="w-1 h-5 rounded-full bg-amber-400 shadow-[0_0_8px_#f59e0b]" />
          </div>

          {/* Estado Carregando */}
          {isLoadingCovers || covers.length === 0 ? (
            <div className="w-full h-full flex flex-col items-center justify-center text-amber-200/60 text-xs animate-pulse p-4">
              Acessando estantes...
            </div>
          ) : (
            /* Trilha dos Livros Rolando */
            <motion.div
              className="flex flex-col items-center gap-4 py-4"
              animate={{
                y: [0, -(covers.length * itemStep)],
              }}
              transition={{
                repeat: Infinity,
                duration: Math.max(covers.length * 0.3, 3),
                ease: "linear",
              }}
            >
              {displayCovers.map((coverUrl, index) => (
                <div
                  key={index}
                  className="w-28 h-36 relative bg-neutral-900 rounded-lg overflow-hidden border border-amber-200/20 shrink-0 shadow-lg"
                >
                  <Image
                    src={coverUrl}
                    alt="Capa de livro"
                    fill
                    unoptimized
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