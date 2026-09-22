"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getProfile } from "@/lib/storage";
import Hero from "@/components/Hero";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  const router = useRouter();
  const [userName, setUserName] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const profile = getProfile();

    // se não respondeu o onboarding, redireciona
    if (!profile || !profile.isOnboarded) {
      router.push("/onboarding");
      return;
    }

    setUserName(profile.name);
    setIsLoading(false);
  }, [router]);

  if (isLoading) {
    return null;
  }

  return (
    <>
      <header className="py-5 px-12 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Image
            src="/images/header/logo.png"
            alt="Logo"
            width={80}
            height={80}
          />

          <div className="font-lora flex flex-col">
            <h1 className="text-4xl">Livroteria</h1>
            <p className="">O livro certo para o seu momento</p>
          </div>
        </div>

        <nav className="flex gap-4">
          <Link
            href="/pilha-de-livros"
            className="relative group flex flex-col items-center hover:scale-110 duration-300"
          >
            <Image
              src="/images/header/bookshelf.png"
              alt="Pilha de Livros"
              width={50}
              height={50}
            />

            <span className="absolute -bottom-8 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-gray-900 text-white text-xs py-1 px-2.5 rounded-md whitespace-nowrap pointer-events-none shadow-md z-10">
              Sua Pilha de Livros
            </span>
          </Link>

          <Link
            href="/personalidade"
            className="relative group flex flex-col items-center hover:scale-110 duration-300"
          >
            <Image
              src="/images/header/perfil.png"
              alt="Perfil"
              width={50}
              height={50}
            />

            <span className="absolute -bottom-8 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-gray-900 text-white text-xs py-1 px-2.5 rounded-md whitespace-nowrap pointer-events-none shadow-md z-10">
              Sua Personalidade
            </span>
          </Link>
        </nav>
      </header>

      <main className="mt-12">
        <Hero userName={userName} />
      </main>
    </>
  );
}
