import type { Metadata } from "next";

import { Lora, Poppins } from "next/font/google";

import "./globals.css";

const lora = Lora({
  variable: "--font-lora",
  subsets: ["latin"],
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Livroteria | O livro certo para o seu momento",
  description: "Que tal ler algo que esteja alinhado com o seu humor de hoje? Iremos te recomendar livros que combinam com sua personalidade e respeite o seu momento :)",
};

export default function RootLayout({
  children,
}: LayoutProps<"/">) {
  return (
    <html
      lang="pt-BR"
      className={`${lora.variable} ${poppins.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {children}
      </body>
    </html>
  );
}