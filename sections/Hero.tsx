"use client";

import { MoodSelector } from "@/components/MoodSeletor";
import Image from "next/image";
import React, { useState } from "react";

function getGreeting() {
  const hour = new Date().getHours();

  if (hour >= 5 && hour < 12) {
    return "Bom dia";
  }
  if (hour >= 12 && hour < 18) {
    return "Boa tarde";
  }

  return "Boa noite";
}

export default function Hero() {
  const greeting = getGreeting();

  const [format, setFormat] = useState<"all" | "kindle">("all");
  const [searchMode, setSearchMode] = useState<"general" | "bookshelf">(
    "general",
  );

  return (
    <section>
      <div>
        <h2 className="font-lora text-6xl">{greeting}, Ryan!</h2>
        <p className="font-lora text-xl">Como está se sentindo hoje?</p>
      </div>

      <div className="mt-10">
        <MoodSelector />

        <div className="flex flex-col items-center mt-6">
          <p className="text-sm opacity-80">Formato</p>

          <div className="flex gap-6 mt-2">
            <button
              onClick={() => setFormat("all")}
              className={`flex items-center gap-2 rounded-full border-2 px-6 py-2 justify-center cursor-pointer duration-300 font-semibold ${
                format === "all"
                  ? "bg-lightColor text-darkColor border-lightColor shadow-[0_0_12px_rgba(255,255,255,0.2)]"
                  : "border-cream/40 hover:bg-lightColor/20"
              }`}
            >
              <Image
                src="/images/hero/open-book.png"
                alt="livro aberto"
                width={24}
                height={24}
              />
              todos
            </button>

            <button
              onClick={() => setFormat("kindle")}
              className={`flex items-center gap-2 rounded-full border-2 px-6 py-2 justify-center cursor-pointer duration-300 font-semibold ${
                format === "kindle"
                  ? "bg-lightColor text-darkColor border-lightColor shadow-[0_0_12px_rgba(255,255,255,0.2)]"
                  : "border-cream/40 hover:bg-lightColor/20"
              }`}
            >
              <Image
                src="/images/hero/kindle.png"
                alt="kindle"
                width={24}
                height={24}
              />
              Apenas Kindle
            </button>
          </div>
        </div>

        <div className="flex flex-col items-center mt-10 gap-10 mx-auto">
          <div className="flex gap-10 justify-center">
            <div className="flex flex-col items-center max-w-80">
              <button
                onClick={() => setSearchMode("general")}
                className={`flex w-full items-center gap-2 justify-center border-2 px-6 py-3 rounded-full font-bold duration-300 cursor-pointer ${
                  searchMode === "general"
                    ? "bg-greenColor border-greenColor text-white shadow-[0px_0px_15px_rgba(87,194,81,0.6)] scale-105"
                    : "border-cream/40 hover:border-greenColor/60"
                }`}
              >
                <Image
                  src="/images/hero/dice.png"
                  alt="dado"
                  width={32}
                  height={32}
                />
                Buscar próxima história
              </button>

              <p className="text-xs mt-3 text-center opacity-75">
                Recomendação aleatória baseada na sua personalidade e no seu
                humor de hoje
              </p>
            </div>

            <div className="flex flex-col items-center max-w-80">
              <button
                onClick={() => setSearchMode("bookshelf")}
                className={`flex w-full items-center gap-2 justify-center border-2 px-6 py-3 rounded-full font-bold duration-300 cursor-pointer ${
                  searchMode === "bookshelf"
                    ? "bg-greenColor border-greenColor text-white shadow-[0px_0px_15px_rgba(87,194,81,0.6)] scale-105"
                    : "border-cream/40 hover:border-greenColor/60"
                }`}
              >
                <Image
                  src="/images/hero/books.png"
                  alt="livros"
                  width={32}
                  height={32}
                />
                Buscar da minha estante
              </button>

              <div className="flex flex-col items-center text-center opacity-75">
                <p className="text-xs mt-3">
                  "Sorteio" entre os livros que você já tem.
                </p>
                <p className="text-xs mt-1 flex items-center gap-1">
                  Veja seus livros em <Image src="/images/header/bookshelf.png" alt="pilha de livros" width={30} height={30} />
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
