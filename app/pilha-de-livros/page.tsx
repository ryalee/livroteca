import BotaoAddLivro from "@/components/BotaoAddLivro";
import SearchInput from "@/components/SearchInput";
import Pilha from "@/sections/Pilha";
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
          <BotaoAddLivro
            icon={
              <Image
                src="/images/pilha/new-book.png"
                alt="novo livro"
                width={40}
                height={40}
              />
            }
            label="Cadastrar Novo Livro"
          />
          <button className="flex items-center gap-2 text-xl cursor-pointer duration-300 px-4 py-2 rounded-full hover:shadow-[0px_0px_1px_1px_rgba(227,231,175,1)]"></button>

          <SearchInput />
        </div>

        <div className="w-full mx-auto h-px bg-lightColor my-8 opacity-65 rounded-full" />

        <div>
          <Pilha />
        </div>
      </main>
    </section>
  );
}
