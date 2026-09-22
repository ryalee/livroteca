"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

type MoodsHelpModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

// Mapeamento dos humores e suas explicações
const MOOD_EXPLANATIONS = [
  {
    id: "apaixonado",
    title: "Apaixonado",
    icon: "/images/hero/love.png",
    description: "Romances aquecedores de coração, comédias românticas, 'enemies to lovers' e histórias para suspirar.",
  },
  {
    id: "cansado-da-realidade",
    title: "Cansado da Realidade",
    icon: "/images/hero/sword.png",
    description: "Fantasias épicas, ficção científica e universos paralelos para se desligar totalmente do mundo real.",
  },
  {
    id: "daquele-jeito",
    title: "Daquele Jeito",
    icon: "/images/hero/pimenta.png",
    description: "Romances sensuais e provocantes, com muita química, tensão, romance 'hot' e histórias apimentadas.",
  },
  {
    id: "muahahaha",
    title: "Muahahaha",
    icon: "/images/hero/murder.png",
    description: "Thrillers psicológicos, mistérios policiais instigantes, plot twists de explodir a cabeça e suspense.",
  },
  {
    id: "introspectivo",
    title: "Introspectivo",
    icon: "/images/hero/zen.png",
    description: "Ficção contemporânea profunda, clássicos, ensaios e histórias para refletir sobre a vida e as emoções.",
  },
  {
    id: "cerebro-frito",
    title: "Cérebro Frito",
    icon: "/images/hero/avestruz.png",
    description: "Leituras curtas, quadrinhos, mangás, contos ou livros leves sem enredo denso para dias de cansaço mental.",
  },
  {
    id: "melancolico",
    title: "Melancólico",
    icon: "/images/hero/sad.png",
    description: "Dramas familiares, histórias emocionantes de 'superação e choro' que abraçam a sua tristeza em dias chuvosos.",
  },
];

export default function MoodsHelpModal({ isOpen, onClose }: MoodsHelpModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="bg-[#1a120c] border border-amber-900/40 rounded-2xl p-6 shadow-2xl max-w-lg w-full relative max-h-[85vh] flex flex-col"
            initial={{ scale: 0.95, opacity: 0, y: 15 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 15 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Cabeçalho */}
            <div className="flex justify-between items-center pb-4 border-b border-amber-900/30">
              <h3 className="font-lora text-xl  text-amber-50 flex items-center gap-2">
                O que cada humor significa?
              </h3>
              <button
                onClick={onClose}
                className="text-amber-100/60 hover:text-amber-50 text-xl font-bold transition-colors w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/5"
              >
                ✕
              </button>
            </div>

            {/* Lista de Humores */}
            <div className="overflow-y-auto my-4 space-y-3 pr-2 scrollbar-thin scrollbar-thumb-amber-900/40">
              {MOOD_EXPLANATIONS.map((mood) => (
                <div
                  key={mood.id}
                  className="p-3.5 rounded-xl bg-black/30 border border-amber-100/5 hover:border-amber-500/20 transition-all flex gap-3.5 items-center"
                >
                  <span className="text-2xl shrink-0 p-2 rounded-full border">
                  <Image
                    src={mood.icon}
                    alt={mood.title}
                    width={40}
                    height={40}
                  />
                    
                  </span>
                  <div>
                    <h4 className="font-bold text-amber-200 text-sm">{mood.title}</h4>
                    <p className="text-xs text-amber-100/70 mt-0.5 leading-relaxed">
                      {mood.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Rodapé */}
            <button
              onClick={onClose}
              className="w-full py-2.5 mt-2 rounded-full bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-200 text-xs font-semibold transition-all text-center"
            >
              Entendi, vamos escolher!
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}