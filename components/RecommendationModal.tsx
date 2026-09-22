"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { GoogleBookItem } from "@/lib/googleBooks";
import { useState } from "react";
import { useBookStack } from "@/context/BookStackContext";

type RecommendationModalProps = {
  book:
    | (GoogleBookItem & {
        description?: string;
        averageRating?: number;
        ratingsCount?: number;
      })
    | null;
  isOpen: boolean;
  readingPace?: "slow" | "medium" | "fast";
  selectedMoodLabel?: string;
  onClose: () => void;
  onMarkAsRead?: (book: GoogleBookItem, isRead: boolean) => void;
};

export default function RecommendationModal({
  book,
  isOpen,
  readingPace = "medium",
  selectedMoodLabel = "seu momento",
  onClose,
  onMarkAsRead,
}: RecommendationModalProps) {
  const { addBookToStack, isBookInStack } = useBookStack();

  const inStack = book ? isBookInStack(book.id) : false;

  // injeta a flag source: "wishlist" ao adicionar na pilha
  const handleAddToStack = () => {
    if (!book) return;
    addBookToStack({
      ...book,
      source: "wishlist",
    });
  };

  const calculateReadingHours = (pages: number) => {
    if (!pages) return null;
    const multiplier =
      readingPace === "fast" ? 40 : readingPace === "slow" ? 20 : 30;
    const hours = Math.round(pages / multiplier);
    return hours < 1 ? "menos de 1h" : `~${hours}h`;
  };

  if (!isOpen || !book) return null;

  const readingTime = calculateReadingHours(book.pageCount);
  const amazonUrl = `https://www.amazon.com.br/s?k=${encodeURIComponent(
    book.title + " " + (book.authors[0] || ""),
  )}`;
  const skoobUrl = `https://www.skoob.com.br/livro/lista/busca:${encodeURIComponent(
    book.title,
  )}`;
  const skeeloUrl = `https://skeelo.com/busca?q=${encodeURIComponent(
    book.title,
  )}`;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="relative max-w-4xl w-full flex flex-col md:flex-row gap-6 items-center md:items-start"
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Card Principal */}
          <div className="flex-1 bg-[#1a120c] border border-[#3a2e22] rounded-2xl p-6 shadow-2xl flex flex-col justify-between">
            <div className="flex flex-col sm:flex-row gap-6">
              {/* Capa */}
              <div className="relative w-36 h-52 shrink-0 bg-neutral-800 rounded-xl overflow-hidden shadow-lg border border-cream/10 mx-auto sm:mx-0">
                {book.coverUrl ? (
                  <Image
                    src={book.coverUrl}
                    alt={book.title}
                    fill
                    unoptimized
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-xs opacity-60 p-2 text-center">
                    Capa indisponível
                  </div>
                )}
              </div>

              {/* Informações Principais */}
              <div className="flex-1 space-y-2">
                <h3 className="font-lora text-2xl font-bold text-amber-50">
                  {book.title}{" "}
                  <span className="font-normal opacity-80 text-lg">
                    • {book.authors.join(", ")}
                  </span>
                </h3>

                {/* Avaliações */}
                <div className="flex items-center gap-2 text-amber-400 text-sm">
                  {book.averageRating ? (
                    <>
                      <span>
                        {"★".repeat(Math.round(book.averageRating))}
                        {"☆".repeat(5 - Math.round(book.averageRating))}
                      </span>
                      <span className="text-xs text-amber-100/70">
                        {book.averageRating.toFixed(1)} (
                        {book.ratingsCount > 0
                          ? `${book.ratingsCount} avaliações`
                          : "Popular no Skoob"}
                        )
                      </span>
                    </>
                  ) : (
                    <span className="text-xs text-amber-100/70 italic">
                      ✨ Recomendação alta de leitores
                    </span>
                  )}
                </div>

                {/* Métricas */}
                <p className="text-xs text-amber-100/60 font-medium">
                  {book.pageCount
                    ? `${book.pageCount} páginas`
                    : "Páginas não informadas"}
                  {readingTime && ` • ${readingTime} de leitura`}
                </p>

                {/* Sinopse Curta */}
                <p className="text-xs text-amber-100/80 leading-relaxed line-clamp-4 pt-2">
                  {book.description ||
                    "Sem sinopse disponível para este livro no momento."}
                </p>
              </div>
            </div>
          </div>

          {/* Painel Lateral de Ações e Links */}
          <div className="w-full md:w-80 flex flex-col gap-4 self-center">
            {/* Botão Adicionar à Pilha */}
            <button
              onClick={handleAddToStack}
              disabled={inStack}
              className={`w-full py-3 px-4 rounded-full font-bold text-sm transition-all duration-300 border flex items-center justify-center gap-2 cursor-pointer ${
                inStack
                  ? "bg-emerald-950/40 border-emerald-500/60 text-emerald-200 cursor-not-allowed shadow-[0_0_15px_rgba(16,185,129,0.2)]"
                  : "bg-black/30 hover:bg-black/50 border-amber-200/40 hover:border-amber-200 text-amber-100"
              }`}
            >
              <Image
                src="/images/pilha/bookmark.png"
                alt="Adicionar à pilha"
                width={20}
                height={20}
                className="object-contain"
              />
              <span>
                {inStack
                  ? "na sua pilha de leitura"
                  : "adicionar à minha pilha"}
              </span>
            </button>

            {/* Botão Amazon */}
            <a
              href={amazonUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 px-4 rounded-full bg-lightColor hover:bg-lightColor/90 text-black font-bold text-center text-sm shadow-md transition flex items-center justify-center gap-2"
            >
              <Image
                src="/images/result/amazon-logo.png"
                alt="Ver na Amazon"
                width={40}
                height={40}
              />
            </a>

            {/* Links Auxiliares */}
            <div className="flex gap-2">
              <a
                href={skoobUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-2 px-3 rounded-lg border border-sky-500/40 hover:border-sky-400 bg-sky-950/30 text-[10px] text-sky-200 font-medium flex items-center justify-center gap-1.5 transition text-center"
              >
                <Image
                  src="/images/result/skoob.png"
                  alt="Avaliações no Skoob"
                  width={24}
                  height={24}
                />
                Ver avaliações no Skoob
              </a>

              <a
                href={skeeloUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-2 px-3 rounded-lg border border-emerald-500/40 hover:border-emerald-400 bg-emerald-950/30 text-[10px] text-emerald-200 font-medium flex items-center justify-center gap-1.5 transition text-center"
              >
                <Image
                  src="/images/result/skeelo.png"
                  alt="Ver no Skeelo"
                  width={24}
                  height={24}
                />
                Ver no Skeelo
              </a>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
