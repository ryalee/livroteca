import Hero from "@/sections/Hero";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <header className="py-5 px-6 flex items-center justify-between">
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
            className="hover:scale-110 duration-300"
          >
            <Image
              src="/images/header/bookshelf.png"
              alt="Pilha de Livros"
              width={50}
              height={50}
            />
          </Link>

          <Link 
            href=""
            className="hover:scale-110 duration-300"
          >
            <Image
              src="/images/header/profile.png"
              alt="Perfil"
              width={50}
              height={50}
            />
          </Link>
        </nav>
      </header>

      <main className="mt-12">
        <Hero/>
      </main>
    </>
  );
}
