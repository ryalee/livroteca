"use client";

import { useState } from "react";
import Image from "next/image";
import { MoodSelector } from "@/components/MoodSeletor";
import RecommendationModal from "@/components/RecommendationModal";
import SlotMachineLoader from "@/components/SlotMachineLoader";
import { getRecommendedBooks } from "@/lib/recommendationEngine";
import { getProfile } from "@/lib/storage";
import { GoogleBookItem } from "@/lib/googleBooks";

interface HeroProps {
  userName?: string;
}

export default function Hero({ userName = "Leitor" }: HeroProps) {
  const [format, setFormat] = useState<"all" | "kindle">("all");
  const [selectedMoodId, setSelectedMoodId] = useState<string>("apaixonadin");
  
  const [recommendedBook, setRecommendedBook] = useState<GoogleBookItem | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const handleRecommend = async () => {
    const profile = getProfile();
    if (!profile) return;

    // 1. Ativa a roleta de carregamento
    setIsLoading(true);

    try {
      // Pequeno delay intencional (ex: 2.5 segundos) para a animação do cassino rodar na tela
      const [results] = await Promise.all([
        getRecommendedBooks({
          moodId: selectedMoodId,
          profile,
          format,
        }),
        new Promise((resolve) => setTimeout(resolve, 2500)),
      ]);

      if (results.length > 0) {
        setRecommendedBook(results[0]);
        setIsModalOpen(true);
      } else {
        alert("Nenhum livro encontrado com esses critérios no momento. Tente outro humor!");
      }
    } catch (err) {
      console.error("Erro na busca de recomendação:", err);
    } finally {
      // 2. Desativa a roleta
      setIsLoading(false);
    }
  };

  return (
    <section>
      <div>
        <h2 className="font-lora text-6xl">Olá, {userName}!</h2>
        <p className="font-lora text-xl">Como está se sentindo hoje?</p>
      </div>

      <div className="mt-10">
        <MoodSelector onSelectMood={(moodId) => setSelectedMoodId(moodId)} />

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
              <Image src="/images/hero/open-book.png" alt="livro" width={24} height={24} />
              Todos
            </button>

            <button
              onClick={() => setFormat("kindle")}
              className={`flex items-center gap-2 rounded-full border-2 px-6 py-2 justify-center cursor-pointer duration-300 font-semibold ${
                format === "kindle"
                  ? "bg-lightColor text-darkColor border-lightColor shadow-[0_0_12px_rgba(255,255,255,0.2)]"
                  : "border-cream/40 hover:bg-lightColor/20"
              }`}
            >
              <Image src="/images/hero/kindle.png" alt="kindle" width={24} height={24} />
              Apenas Kindle
            </button>
          </div>
        </div>

        <div className="flex flex-col items-center mt-8 gap-10 mx-auto">
          <div className="flex gap-10 justify-center flex-wrap">
            
            <div className="flex flex-col items-center max-w-80">
              <button
                onClick={handleRecommend}
                disabled={isLoading}
                className="flex w-full items-center gap-2 justify-center border-2 border-greenColor bg-greenColor text-white shadow-[0px_0px_15px_rgba(87,194,81,0.6)] px-6 py-3 rounded-full font-bold duration-300 cursor-pointer hover:scale-105 disabled:opacity-50"
              >
                <Image src="/images/hero/dice.png" alt="dado" width={32} height={32} />
                Buscar próxima história
              </button>
              <p className="text-xs mt-3 text-center opacity-75">
                Recomendação baseada na sua personalidade e no seu humor.
              </p>
            </div>

            <div className="flex flex-col items-center max-w-80">
              <button
                className="flex w-full items-center gap-2 justify-center border-2 border-cream/40 hover:border-greenColor/60 px-6 py-3 rounded-full font-bold duration-300 cursor-pointer"
              >
                <Image src="/images/hero/books.png" alt="livros" width={32} height={32} />
                Buscar da minha estante
              </button>
              <p className="text-xs mt-3 text-center opacity-75">
                Sorteio entre os livros cadastrados na sua pilha.
              </p>
            </div>

          </div>
        </div>
      </div>

      {/* Modal Roleta de Carregamento */}
      <SlotMachineLoader isOpen={isLoading} />

      {/* Modal do Resultado */}
      <RecommendationModal
        book={recommendedBook}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onReshuffle={handleRecommend}
      />
    </section>
  );
}