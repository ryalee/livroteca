export type Mood = {
  id: string;
  name: string;
  icon: string;
  apiQuery: string;
  tags: string[];
  description: string;
};

export const moods: Mood[] = [
  {
    id: "apaixonadin",
    name: "Apaixonadin",
    icon: "/images/hero/love.png",
    apiQuery: "subject:romance",
    tags: ["romance", "romance-leve", "comedia-romantica", "cozy-romance"],
    description:
      "Para quem busca uma leitura leve, fofa e com final feliz garantido.",
  },
  {
    id: "cansado-da-realidade",
    name: "Cansado da Realidade",
    icon: "/images/hero/sword.png",
    apiQuery: "subject:fantasy",
    tags: ["fantasia", "epic-fantasy", "sci-fi", "universos-paralelos"],
    description:
      "Para se desligar do mundo real e se perder em universos e magias incríveis.",
  },
  {
    id: "daquele-jeitao",
    name: "Daquele Jeitão",
    icon: "/images/hero/pimenta.png",
    apiQuery: "subject:erotic-romance",
    tags: ["romance-hot", "hot", "enemies-to-lovers", "dark-romance"],
    description:
      "Historias com química intensa, tensão nas alturas e leitura +18.",
  },
  {
    id: "melancolico",
    name: "Melancólico",
    icon: "/images/hero/sad.png",
    apiQuery: "subject:drama",
    tags: ["drama", "sentimental", "superacao", "ficcao-literaria"],
    description:
      "Para alimentar as emoções profundas com histórias tocantes e marcantes.",
  },
  {
    id: "introspectivo",
    name: "Introspectivo",
    icon: "/images/hero/zen.png",
    apiQuery: "subject:philosophy",
    tags: ["filosofia", "poesia", "ensaios", "reflexao"],
    description:
      "Para desacelerar a mente, refletir sobre a vida e mergulhar em poesias.",
  },
  {
    id: "cerebro-frito",
    name: "Cérebro Frito",
    icon: "/images/hero/avestruz.png",
    apiQuery: "subject:graphic-novels",
    tags: [
      "cozy-fantasy",
      "cozy-mystery",
      "contos",
      "graphic-novel",
      "ressaca-literaria",
    ],
    description:
      "Leituras curativas, curtas e confortáveis para vencer qualquer ressaca literária.",
  },
  {
    id: "querendo-treta",
    name: "Querendo Treta",
    icon: "/images/hero/furioso.png",
    apiQuery: "subject:action",
    tags: ["acao", "aventura", "pacing-rapido", "distopia"],
    description:
      "Narrativas ágeis e sem enrolação para prender sua atenção do início ao fim.",
  },
  {
    id: "muahahaha",
    name: "Muahahaha",
    icon: "/images/hero/murder.png",
    apiQuery: "subject:horror",
    tags: ["terror", "suspense", "thriller", "dark-academia"],
    description:
      "Para quem quer sentir aquele arrepio na espinha e um clima sombrio.",
  },
];
