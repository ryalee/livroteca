"use client";

import Image from "next/image";
import React from "react";
import { StackBook } from "@/context/BookStackContext";

type PilhaProps = {
  books?: StackBook[];
  onRemove?: (id: string) => void;
  activeTab?: "all" | "owned" | "wishlist";
};

export default function Pilha({
  books = [],
  onRemove,
  activeTab = "all",
}: PilhaProps) {
  // Estado Vazio com mensagens dinâmicas
  if (books.length === 0) {
    let emptyTitle = "Parece que a pilha de livros tá vazia.";
    let emptySubtitle = "Adicione alguns para poder sortear sua próxima leitura.";

    if (activeTab === "owned") {
      emptyTitle = "Nenhum livro cadastrado na sua estante ou Kindle.";
      emptySubtitle = "Clique em 'Cadastrar Novo Livro' para colocar os que você tem em casa!";
    } else if (activeTab === "wishlist") {
      emptyTitle = "Nenhum livro salvo das recomendações ainda.";
      emptySubtitle = "Use o sorteador na Home para descobrir histórias e salvá-las aqui!";
    }

    return (
      <section className="flex justify-center items-center min-h-87.5">
        <div className="flex flex-col items-center justify-center text-center max-w-md p-6">
          <Image
            src="/images/pilha/empty.png"
            alt="pilha vazia"
            width={120}
            height={120}
            className="opacity-80"
          />

          <p className="text-lg opacity-85 mt-4 font-semibold">{emptyTitle}</p>

          <p className="text-sm opacity-60 mt-1">{emptySubtitle}</p>
        </div>
      </section>
    );
  }

  // Grid de Cards dos Livros
  return (
    <section className="py-2">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {books.map((book) => {
          const isOwned = book.source === "owned";

          return (
            <div
              key={book.id}
              className="group relative bg-[#1a120c] border border-amber-900/30 rounded-2xl p-4 flex flex-col justify-between hover:border-amber-500/50 transition-all duration-300 shadow-xl hover:-translate-y-1"
            >
              {/* Badge de Origem */}
              <div className="absolute top-2 right-2 z-10">
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-md backdrop-blur-md shadow-md border ${
                    isOwned
                      ? "bg-amber-950/80 border-amber-500/40 text-amber-200"
                      : "bg-emerald-950/80 border-emerald-500/40 text-emerald-200"
                  }`}
                >
                  {isOwned ? "Estante/Kindle" : "Recomendado"}
                </span>
              </div>

              {/* Capa do Livro */}
              <div className="relative w-full h-52 bg-stone-900 rounded-xl overflow-hidden mb-3 border border-white/5">
                {book.coverUrl ? (
                  <Image
                    src={book.coverUrl}
                    alt={book.title}
                    fill
                    unoptimized
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-xs opacity-50 text-center p-2">
                    Sem capa disponível
                  </div>
                )}
              </div>

              {/* Detalhes */}
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-sm text-amber-50 line-clamp-2 leading-snug">
                    {book.title}
                  </h3>
                  <p className="text-xs text-amber-100/60 line-clamp-1 mt-1">
                    {book.authors?.join(", ")}
                  </p>
                </div>

                {/* Botão Remover */}
                {onRemove && (
                  <button
                    onClick={() => onRemove(book.id)}
                    className="mt-4 w-full py-1.5 rounded-lg bg-red-950/30 hover:bg-red-900/50 border border-red-500/20 text-red-300 text-xs font-medium transition-colors cursor-pointer"
                  >
                    Remover
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}