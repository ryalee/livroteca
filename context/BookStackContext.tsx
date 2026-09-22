"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { GoogleBookItem } from "@/lib/googleBooks";

export type StackBook = GoogleBookItem & {
  addedAt: string;
  readStatus?: "reading" | "unread" | "read";
  source?: "owned" | "wishlist";
};

type BookStackContextType = {
  stack: StackBook[];
  addBookToStack: (book: GoogleBookItem) => void;
  removeBookFromStack: (bookId: string) => void;
  isBookInStack: (bookId: string) => boolean;
  toggleReadStatus: (bookId: string) => void;
};

const BookStackContext = createContext<BookStackContextType | undefined>(undefined);

export function BookStackProvider({ children }: { children: React.ReactNode }) {
  const [stack, setStack] = useState<StackBook[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Carrega do LocalStorage na inicialização
  useEffect(() => {
    const stored = localStorage.getItem("@livros:pilha");
    if (stored) {
      try {
        setStack(JSON.parse(stored));
      } catch (e) {
        console.error("Erro ao carregar pilha de livros:", e);
      }
    }
    setIsLoaded(true);
  }, []);

  // Salva no LocalStorage sempre que a pilha altera
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("@livros:pilha", JSON.stringify(stack));
    }
  }, [stack, isLoaded]);

  const addBookToStack = (book: GoogleBookItem) => {
    setStack((prev) => {
      if (prev.some((b) => b.id === book.id)) return prev; // Evita duplicados
      const newBook: StackBook = {
        ...book,
        addedAt: new Date().toISOString(),
        readStatus: "unread",
      };
      return [newBook, ...prev];
    });
  };

  const removeBookFromStack = (bookId: string) => {
    setStack((prev) => prev.filter((b) => b.id !== bookId));
  };

  const isBookInStack = (bookId: string) => {
    return stack.some((b) => b.id === bookId);
  };

  const toggleReadStatus = (bookId: string) => {
    setStack((prev) =>
      prev.map((b) => {
        if (b.id === bookId) {
          const nextStatus = b.readStatus === "read" ? "unread" : "read";
          return { ...b, readStatus: nextStatus };
        }
        return b;
      })
    );
  };

  return (
    <BookStackContext.Provider
      value={{
        stack,
        addBookToStack,
        removeBookFromStack,
        isBookInStack,
        toggleReadStatus,
      }}
    >
      {children}
    </BookStackContext.Provider>
  );
}

export function useBookStack() {
  const context = useContext(BookStackContext);
  if (!context) {
    throw new Error("useBookStack deve ser usado dentro de um BookStackProvider");
  }
  return context;
}