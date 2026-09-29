"use client";

import { useState } from "react";
import Image from "next/image";
import { MoodSelector } from "@/components/MoodSeletor";
import RecommendationModal from "@/components/RecommendationModal";
import SlotMachineLoader from "@/components/SlotMachineLoader";
import { getRecommendedBooks } from "@/lib/recommendationEngine";
import { getProfile } from "@/lib/storage";
import { GoogleBookItem } from "@/lib/googleBooks";
import { useBookStack } from "@/context/BookStackContext";

interface HeroProps {
  userName?: string;
}

export default function Hero({ userName = "Leitor" }: HeroProps) {
  const [format, setFormat] = useState<"all" | "kindle">("all");
  const [selectedMoodId, setSelectedMoodId] = useState<string>("apaixonadin");

  const [recommendedBook, setRecommendedBook] = useState<GoogleBookItem | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  // Acessa a pilha apenas para o botão específico da estante
  const { stack } = useBookStack();

  // 1. Recomendação Pura (Baseada exclusivamente em Humor + Personalidade via API)
  // 1. Recomendação Pura (Totalmente blindada contra erros)
  const handleRecommend = async () => {
    const profile = getProfile() || {
      favoriteGenres: ["Ficção"],
      readingPace: "medium",
    };

    setIsLoading(true);

    try {
      // Dispara a busca limpa diretamente para a API
      const results = await getRecommendedBooks({
        moodId: selectedMoodId,
        profile,
        format,
      });

      // Aguarda um pequeno delay apenas para dar o efeito visual da roleta
      await new Promise((resolve) => setTimeout(resolve, 1500));

      if (results && results.length > 0) {
        const randomIndex = Math.floor(Math.random() * results.length);
        setRecommendedBook(results[randomIndex]);
        setIsModalOpen(true);
      } else {
        alert(
          "A API do Google Books não encontrou resultados para esta combinação. Tenta outro humor!",
        );
      }
    } catch (err) {
      console.error("Erro crítico na busca:", err);
      alert(
        "Erro ao comunicar com a API do Google Books. Verifica a tua chave de API ou se atingiste o limite de requisições.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  // 2. Recomendação exclusiva da Pilha/Estante do Usuário
  const handleRecommendFromStack = async () => {
    if (stack.length === 0) {
      alert(
        "Sua pilha de livros está vazia! Adicione alguns livros na sua pilha primeiro.",
      );
      return;
    }

    setIsLoading(true);

    await new Promise((resolve) => setTimeout(resolve, 2000));

    const randomIndex = Math.floor(Math.random() * stack.length);
    const chosenBook = stack[randomIndex];

    setRecommendedBook(chosenBook);
    setIsLoading(false);
    setIsModalOpen(true);
  };

  return (
    <section>
      <div className="flex flex-col gap-2">
        <h2 className="font-lora text-6xl">Olá, {userName}!</h2>
        <p className="font-lora text-xl">Como está se sentindo hoje?</p>
      </div>

      <div className="mt-10">
        <MoodSelector onSelectMood={(moodId) => setSelectedMoodId(moodId)} />

        <div className="flex flex-col items-center mt-8 gap-10 mx-auto">
          <div className="flex gap-10 justify-center flex-wrap">
            {/* Botão 1: Buscar Nova História (Estritamente Humor + Personalidade) */}
            <div className="flex flex-col items-center max-w-80">
              <button
                onClick={handleRecommend}
                disabled={isLoading}
                className="flex w-full items-center gap-2 justify-center border-2 border-greenColor bg-greenColor text-white shadow-[0px_0px_15px_rgba(87,194,81,0.6)] px-6 py-3 rounded-full font-bold duration-300 cursor-pointer hover:scale-105 disabled:opacity-50 text-sm"
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
                Recomendação baseada na sua personalidade e no seu humor.
              </p>
            </div>

            <div className="flex flex-col items-center max-w-80">
              <button
                onClick={handleRecommendFromStack}
                disabled={isLoading}
                className="flex w-full items-center gap-2 justify-center border-2 border-cream/40 hover:border-greenColor/60 px-6 py-3 rounded-full font-bold duration-300 cursor-pointer disabled:opacity-50 text-sm"
              >
                <Image
                  src="/images/hero/books.png"
                  alt="livros"
                  width={32}
                  height={32}
                />
                Buscar da minha estante ({stack.length})
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
      />
    </section>
  );
}
