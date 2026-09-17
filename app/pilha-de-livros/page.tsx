import SearchInput from "@/components/SearchInput";
import Image from "next/image";
import Link from "next/link";
import React from "react";

export default function page() {
  return (
    <section>
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
          Minha Pilha de Livros
          <Image
            src="/images/header/bookshelf.png"
            alt="pilha de livros"
            width={50}
            height={50}
          />
        </h1>
      </header>

      <main className="mt-10">
        <div className="flex items-center justify-between">
          <button 
            className="flex items-center gap-2 text-xl cursor-pointer duration-300 hover:bg-lightColor hover:text-darkColor px-4 py-2 rounded-full hover:shadow-[0px_1px_8px_-1px_rgba(255,255,255,1)]"
          > 
            <Image
              src="/images/pilha/new-book.png"
              alt="novo livro"
              width={40}
              height={40}
            />
            Cadastrar Novo Livro
          </button>

          <SearchInput/>
        </div>
      </main>
    </section>
  );
}
