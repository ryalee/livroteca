"use client";

import Image from "next/image";
import { useState } from "react";
import { moods, Mood } from "@/data/moods";

export function MoodSelector() {
  const [selectedMood, setSelectedMood] = useState<string>("apaixonadin");

  return (
    <div className="flex flex-wrap items-center justify-center gap-8 p-4">
      {moods.map((mood) => {
        const isSelected = selectedMood === mood.id;

        return (
          <button
            key={mood.id}
            onClick={() => setSelectedMood(mood.id)}
            className="group relative flex flex-col items-center justify-center transition-transform hover:scale-105 focus:outline-none cursor-pointer"
          >
            {/* texto curvo em svg */}
            <div className="pointer-events-none absolute -top-4 z-10 h-30 w-30">
              <svg
                viewBox="0 0 100 100"
                className="h-full w-full overflow-visible"
              >
                <path
                  id={`curve-${mood.id}`}
                  d="M 10,50 A 40,40 0 0,1 90,50" // arco do topo do círculo
                  fill="transparent"
                />
                <text
                  className={`font-medium text-lightColor text-[11px] tracking-wide transition-colors ${
                    isSelected
                      ? "font-bold fill-[#E3E7AF]"
                      : "opacity-60 group-hover:opacity-100 fill-[#E3E7AF]"
                  }`}
                >
                  <textPath
                    href={`#curve-${mood.id}`}
                    startOffset="50%"
                    textAnchor="middle"
                  >
                    {mood.name}
                  </textPath>
                </text>
              </svg>
            </div>

            {/* circulo */}
            <div
              className={`relative flex h-20 w-20 items-center justify-center rounded-full border-2 transition-all duration-300 ${
                isSelected
                  ? "border-[#2E5A36] bg-[#1E3A23] shadow-[0_0_15px_rgba(46,90,54,0.6)]"
                  : "border-cream/30 bg-[#1A1813] hover:border-cream/60"
              }`}
            >
              <Image
                src={mood.icon}
                alt={mood.name}
                width={48}
                height={48}
                className="object-contain"
              />
            </div>
          </button>
        );
      })}
    </div>
  );
}
