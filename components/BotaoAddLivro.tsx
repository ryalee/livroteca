"use client";

import { useState, ReactNode } from "react";
import dynamic from "next/dynamic";

interface BotaoModalProps {
  label: string;
  icon?: ReactNode; 
  className?: string;
  onClick?: () => void;
}

const AddBookModal = dynamic(() => import("./AddLivro"), {
  ssr: false,
});

export default function BotaoAddLivro({ label, icon, className, onClick }: BotaoModalProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleClick = () => {
    setIsOpen(true);
    if (onClick) onClick(); // executa algum evento extra caso o elemento pai envie
  };

  return (
    <>
      <button
        onClick={handleClick}
        className={`flex items-center gap-2 text-xl cursor-pointer duration-300 px-4 py-2 rounded-full hover:shadow-[0px_0px_1px_1px_rgba(227,231,175,1)] ${className}`}
      >
        {icon}
        {label}
      </button>

      {isOpen && <AddBookModal onClose={() => setIsOpen(false)} />}
    </>
  );
}