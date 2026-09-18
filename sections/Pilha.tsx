import Image from "next/image";
import React from "react";

export default function Pilha() {
  return (
    <section className="flex justify-center h-100">
      <div className="flex flex-col items-center justify-center text-center">
        <Image
          src="/images/pilha/empty.png"
          alt="pilha vazia"
          width={120}
          height={120}
        />

        <p className="text-lg opacity-65">
          Parece que a pilha de livros tá vazia.
        </p>

        <p className="text-sm opacity-65">
          adicione alguns para poder sortear sua próxima leitura
        </p>
      </div>
    </section>
  );
}
