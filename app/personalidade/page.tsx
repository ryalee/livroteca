"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getProfile, UserProfile } from "@/lib/storage";
import Image from "next/image";
import Link from "next/link";

export default function ProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    const data = getProfile();
    if (!data || !data.isOnboarded) {
      router.push("/onboarding");
      return;
    }
    setProfile(data);
  }, [router]);

  if (!profile) return null;

  // Tradução do ritmo de leitura para exibição
  const paceLabels = {
    slow: "Tranquilo (1 livro/mês)",
    medium: "Constante (2-3 livros/mês)",
    fast: "Devorador (4+ livros/mês)",
  };

  return (
    <div className="min-h-screen ">
      <header className="py-5 px-6 flex items-center justify-between">
        <Link
          href="/"
          className="flex items-center text-lg hover:text-white duration-300"
        >
          <Image
            src="/images/pilha/back.png"
            alt="voltar"
            width={32}
            height={32}
          />
          Página anterior
        </Link>

        <h1 className="flex items-center gap-2 text-3xl font-lora">
          Sua Personalidade Literária
          <Image
            src="/images/header/perfil.png"
            alt="pilha de livros"
            width={50}
            height={50}
          />
        </h1>
      </header>

      {/* Hero do Perfil */}
      <div className="pb-12 px-6 w-4xl mx-auto mt-4 p-8 rounded-2xl bg-foreground border border-cream/20 flex flex-col md:flex-row items-center gap-6 shadow-xl">
        <div className="relative w-24 h-24 rounded-full flex items-center justify-center overflow-hidden border-2 border-greenColor">
          <Image
            src="/images/profile/profile-pic.png"
            alt="Avatar"
            width={70}
            height={70}
            className="object-cover"
          />
        </div>
        <div className="text-center md:text-left space-y-1">
          <div className="flex gap-1">
            <h2 className="font-lora text-3xl font-bold">{profile.name}</h2>
            <Image
              src="/images/profile/edit-pencil.png"
              alt="editar nome"
              width={16}
              height={16}
              className="self-start"
            />
          </div>

          <p className="text-sm opacity-70">
            Ritmo de Leitura:{" "}
            <span className="text-lightColor">
              {paceLabels[profile.readingPace] || "Não especificado"}
            </span>
          </p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row mt-8 justify-center gap-3 mx-auto">
        {/* generos favoritos */}
        <div className="p-6 rounded-2xl max-w-110 border border-cream/15 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Image
                src="/images/profile/story-book.png"
                alt="gêneros favoritos"
                width={40}
                height={40}
              />
              <h3 className="font-lora text-xl font-semibold">
                Gêneros Favoritos
              </h3>
            </div>
            <p className="text-xs opacity-70 mb-4">
              Usados para priorizar sorteios de livros que você provavelmente
              vai amar.
            </p>

            <div className="flex flex-wrap gap-2">
              {profile.favoriteGenres.length > 0 ? (
                profile.favoriteGenres.map((genre) => (
                  <span
                    key={genre}
                    className="px-3 py-1.5 rounded-full text-xs font-medium bg-greenColor/20 border border-greenColor/50 text-white"
                  >
                    {genre}
                  </span>
                ))
              ) : (
                <p className="text-xs italic opacity-50">
                  Nenhum gênero selecionado.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Card: Tropos & Tropas a Evitar */}
        <div className="p-6 rounded-2xl max-w-110 border border-cream/15 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Image
                src="/images/profile/block.png"
                alt="evitar"
                width={40}
                height={40}
              />

              <h3 className="font-lora text-xl font-semibold">
                Elementos a Evitar
              </h3>
            </div>
            <p className="text-xs opacity-70 mb-4">
              Gatilhos e dinâmicas que o sistema vai tentar ignorar nas
              sugestões.
            </p>

            <div className="flex flex-wrap gap-2">
              {profile.avoidTropes.length > 0 ? (
                profile.avoidTropes.map((trope) => (
                  <span
                    key={trope}
                    className="px-3 py-1.5 rounded-full text-xs font-medium bg-red-500/20 border border-red-500/40 text-red-200"
                  >
                    {trope}
                  </span>
                ))
              ) : (
                <p className="text-xs italic opacity-50">
                  Nenhum filtro de exceção configurado.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Ação para Refazer o Questionário */}
      <div className="mt-8 text-center">
        <button
          onClick={() => router.push("/onboarding")}
          className="px-6 py-2.5 rounded-full border border-cream/30 hover:border-greenColor text-xs opacity-80 hover:opacity-100 transition duration-300"
        >
          Refazer Questionário de Personalidade
        </button>
      </div>
    </div>
  );
}
