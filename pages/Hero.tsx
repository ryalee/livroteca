import { MoodSelector } from "@/components/MoodSeletor";
import Image from "next/image";
import React from "react";

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

  return (
    <section>
      <div>
        <h2 className="font-lora text-6xl">{greeting}, Ryan!</h2>
        <p className="font-lora text-xl">Como está se sentindo hoje?</p>
      </div>

      <div className="mt-10">
        <MoodSelector/>

        <div className="">
          <p>Formato</p>

          <div className="flex gap-5">
            <button className="flex items-center gap-2">
              <Image
                src="/images/hero/open-book.png"
                alt="livro aberto"
                width={30}
                height={30}
              />
              todos
            </button>

            <button className="flex items-center gap-2">
              <Image
                src="/images/hero/kindle.png"
                alt="kindle"
                width={30}
                height={30}
              />
              Apenas Kindle
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
