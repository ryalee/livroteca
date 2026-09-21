"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { saveProfile } from "@/lib/storage";

const GENRES = [
  "Romance", "Fantasia", "Ficção Científica", 
  "Thriller/Suspense", "Terror", "Drama", 
  "Filosofia", "Poesia", "Graphic Novels"
];

const TROPES_TO_AVOID = [
  "Dark Romance", "Final Triste", "Triângulo Amoroso", 
  "Conteúdo +18", "Luto/Perda", "Gatilhos Pesados"
];

const PACES = [
  { id: "slow", title: "Tranquilo", desc: "1 livro por mês" },
  { id: "medium", title: "Constante", desc: "2 a 3 livros por mês" },
  { id: "fast", title: "Devorador", desc: "4+ livros por mês" },
] as const;

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [favoriteGenres, setFavoriteGenres] = useState<string[]>([]);
  const [readingPace, setReadingPace] = useState<"slow" | "medium" | "fast">("medium");
  const [avoidTropes, setAvoidTropes] = useState<string[]>([]);

  const toggleArrayItem = (item: string, list: string[], setList: (val: string[]) => void) => {
    setList(list.includes(item) ? list.filter((i) => i !== item) : [...list, item]);
  };

  const handleComplete = () => {
    saveProfile({
      name: name.trim() || "Leitor",
      favoriteGenres,
      readingPace,
      avoidTropes,
    });
    router.push("/personalidade");
  };

  return (
    <main className="min-h-screen bg-background text-white flex flex-col items-center justify-center p-6">
      <div className="max-w-md w-full bg-foreground p-8 rounded-2xl border border-cream/20 shadow-2xl">
        
        {/* Barra de Progresso (4 Passos) */}
        <div className="flex gap-2 mb-8">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className={`h-1.5 flex-1 rounded-full transition-colors ${
                step >= i ? "bg-greenColor" : "bg-cream/20"
              }`}
            />
          ))}
        </div>

        {/* Passo 1: Nome */}
        {step === 1 && (
          <div className="space-y-6">
            <h2 className="font-lora text-3xl font-bold">Como podemos te chamar?</h2>
            <p className="text-sm opacity-80">Isso deixará as recomendações com o seu toque pessoal.</p>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Digite seu nome ou apelido..."
              className="w-full bg-black/30 border border-cream/30 rounded-xl px-4 py-3 text-white outline-none focus:border-greenColor"
            />
            <button
              onClick={() => name.trim() && setStep(2)}
              disabled={!name.trim()}
              className="w-full bg-greenColor hover:bg-greenColor/90 disabled:opacity-50 text-white font-bold py-3 rounded-xl transition"
            >
              Continuar
            </button>
          </div>
        )}

        {/* Passo 2: Gêneros Favoritos */}
        {step === 2 && (
          <div className="space-y-6">
            <h2 className="font-lora text-2xl font-bold">Quais gêneros você mais gosta?</h2>
            <p className="text-sm opacity-80">Selecione pelo menos 1 opção.</p>
            <div className="flex flex-wrap gap-2">
              {GENRES.map((genre) => {
                const selected = favoriteGenres.includes(genre);
                return (
                  <button
                    key={genre}
                    type="button"
                    onClick={() => toggleArrayItem(genre, favoriteGenres, setFavoriteGenres)}
                    className={`px-4 py-2 rounded-full text-xs font-semibold border transition ${
                      selected
                        ? "bg-greenColor border-greenColor text-white"
                        : "border-cream/30 hover:border-cream/60"
                    }`}
                  >
                    {genre}
                  </button>
                );
              })}
            </div>
            <button
              onClick={() => setStep(3)}
              disabled={favoriteGenres.length === 0}
              className="w-full bg-greenColor hover:bg-greenColor/90 disabled:opacity-50 text-white font-bold py-3 rounded-xl transition"
            >
              Próximo
            </button>
          </div>
        )}

        {/* Passo 3: Ritmo de Leitura (NOVO) */}
        {step === 3 && (
          <div className="space-y-6">
            <h2 className="font-lora text-2xl font-bold">Qual é o seu ritmo de leitura?</h2>
            <p className="text-sm opacity-80">Qual velocidade descreve melhor o seu hábito atual?</p>
            
            <div className="space-y-3">
              {PACES.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setReadingPace(item.id)}
                  className={`w-full p-4 rounded-xl border text-left flex justify-between items-center transition ${
                    readingPace === item.id
                      ? "bg-greenColor/20 border-greenColor text-white"
                      : "border-cream/30 hover:border-cream/60 bg-black/20"
                  }`}
                >
                  <div>
                    <p className="font-semibold text-sm">{item.title}</p>
                    <p className="text-xs opacity-70">{item.desc}</p>
                  </div>
                  {readingPace === item.id && <span className="text-greenColor">✓</span>}
                </button>
              ))}
            </div>

            <button
              onClick={() => setStep(4)}
              className="w-full bg-greenColor hover:bg-greenColor/90 text-white font-bold py-3 rounded-xl transition"
            >
              Próximo
            </button>
          </div>
        )}

        {/* Passo 4: Limites & Filtros */}
        {step === 4 && (
          <div className="space-y-6">
            <h2 className="font-lora text-2xl font-bold">Tem algo que você prefere evitar?</h2>
            <p className="text-sm opacity-80">Filtraremos livros com esses elementos.</p>
            <div className="flex flex-wrap gap-2">
              {TROPES_TO_AVOID.map((trope) => {
                const selected = avoidTropes.includes(trope);
                return (
                  <button
                    key={trope}
                    type="button"
                    onClick={() => toggleArrayItem(trope, avoidTropes, setAvoidTropes)}
                    className={`px-4 py-2 rounded-full text-xs font-semibold border transition ${
                      selected
                        ? "bg-red-900/60 border-red-500 text-white"
                        : "border-cream/30 hover:border-cream/60"
                    }`}
                  >
                    {trope}
                  </button>
                );
              })}
            </div>
            <button
              onClick={handleComplete}
              className="w-full bg-greenColor hover:bg-greenColor/90 text-white font-bold py-3 rounded-xl transition"
            >
              Finalizar e Ver Perfil
            </button>
          </div>
        )}
      </div>
    </main>
  );
}