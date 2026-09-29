"use client";

import BotaoAddLivro from "@/components/BotaoAddLivro";
import SearchInput from "@/components/SearchInput";
import Pilha from "@/components/Pilha";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { useBookStack } from "@/context/BookStackContext";

export default function Page() {
  const { stack, removeBookFromStack } = useBookStack();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"all" | "owned" | "wishlist">(
    "all",
  );

  // 1. Filtra por busca de texto (Título/Autor)
  const searchFilteredBooks = stack.filter((book) => {
    const query = searchQuery.toLowerCase();
    const titleMatch = book.title?.toLowerCase().includes(query);
    const authorMatch = book.authors?.some((author) =>
      author.toLowerCase().includes(query),
    );
    return titleMatch || authorMatch;
  });

  // 2. Filtra pela Aba Selecionada
  const finalBooks = searchFilteredBooks.filter((book) => {
    if (activeTab === "owned") return book.source === "owned";
    if (activeTab === "wishlist") return book.source === "wishlist";
    return true; // "all"
  });

  // Contadores para os crachás/badges das abas
  const ownedCount = stack.filter((b) => b.source === "owned").length;
  const wishlistCount = stack.filter((b) => b.source === "wishlist").length;

  return (
    <section className="min-h-screen pb-12">
      {/* Header */}
      <header className="py-5 px-6 flex items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-2 text-lg hover:text-white transition-colors duration-300 opacity-80 hover:opacity-100"
        >
          <Image
            src="/images/pilha/back.png"
            alt="voltar"
            width={28}
            height={28}
          />
          Página anterior
        </Link>

        <h1 className="flex items-center gap-3 text-3xl font-lora font-bold">
          Minha Pilha de Livros
          <Image
            src="/images/header/bookshelf.png"
            alt="pilha de livros"
            width={45}
            height={45}
          />
        </h1>
      </header>

      <main className="mt-8 px-6 max-w-7xl mx-auto">
        {/* Barra superior de ações */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <BotaoAddLivro
            icon={
              <Image
                src="/images/pilha/new-book.png"
                alt="novo livro"
                width={36}
                height={36}
              />
            }
            label="Cadastrar Novo Livro"
          />

          <SearchInput
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Divisor */}
        <div className="w-full h-px bg-lightColor/20 my-6 rounded-full" />

        {/* Abas de Navegação / Filtro de Origem */}
        <div className="flex items-center gap-3 mb-8 overflow-x-auto pb-2">
          <button
            onClick={() => setActiveTab("all")}
            className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 cursor-pointer flex items-center gap-2 ${
              activeTab === "all"
                ? "bg-lightColor text-slate-950 shadow-md shadow-amber-500/20"
                : "bg-stone-900/60 border border-stone-800 text-stone-300 hover:bg-stone-800"
            }`}
          >
            <Image
              src="/images/header/bookshelf.png"
              alt="salvos"
              width={30}
              height={30}
            />
            Todos os Livros
            <span className="bg-stone-950/30 px-2 py-0.5 rounded-full text-xs">
              {stack.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("owned")}
            className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 cursor-pointer flex items-center gap-2 ${
              activeTab === "owned"
                ? "bg-lightColor text-slate-950 shadow-md shadow-amber-500/20"
                : "bg-stone-900/60 border border-stone-800 text-stone-300 hover:bg-stone-800"
            }`}
          >
            <Image
              src="/images/pilha/bookcase.png"
              alt="salvos"
              width={30}
              height={30}
            />
            Minha Estante Pessoal
            <span className="bg-stone-950/30 px-2 py-0.5 rounded-full text-xs">
              {ownedCount}
            </span>
          </button>
            
          <button
            onClick={() => setActiveTab("wishlist")}
            className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 cursor-pointer flex items-center gap-2 ${
              activeTab === "wishlist"
                ? "bg-lightColor text-slate-950 shadow-md shadow-amber-500/20"
                : "bg-stone-900/60 border border-stone-800 text-stone-300 hover:bg-stone-800"
            }`}
          >
            <Image
              src="/images/pilha/bookmark.png"
              alt="salvos"
              width={30}
              height={30}
            />
            Salvos da Recomendação
            <span className="bg-stone-950/30 px-2 py-0.5 rounded-full text-xs">
              {wishlistCount}
            </span>
          </button>
        </div>

        {/* Exibição da Pilha */}
        <Pilha
          books={finalBooks}
          onRemove={removeBookFromStack}
          activeTab={activeTab}
        />
      </main>
    </section>
  );
}
