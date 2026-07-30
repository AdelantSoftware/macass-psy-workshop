/* refactored: tokens */
export interface Step {
  id: number;
  title: string;
  word: string;
  location: string;
  description: string;
  interaction: string;
  image: string;
  color: string;
}

export const STEPS: Step[] = [
  {
    id: 1,
    title: "La Ruota delle Emozioni",
    word: "ASCOLTA",
    location: "Libreria 100 Pagine",
    description:
      "Una grande ruota delle emozioni che gira. Trova l'emozione giusta e scopri la parola nascosta.",
    interaction: "Gira la ruota per rivelare l'emozione",
    image: "/images/tappa1-wheel.jpg",
    color: "var(--color-accent-clay)",
  },
  {
    id: 2,
    title: "L'Agenda Piena",
    word: "ACCETTA",
    location: "Casa MAC",
    description:
      "Un'agenda troppo piena di impegni. Liberala dagli impegni inutili e scopri la parola.",
    interaction: "Libera l'agenda dagli impegni",
    image: "/images/tappa2-planner.jpg",
    color: "var(--color-accent-ochre)",
  },
  {
    id: 3,
    title: "L'Abbraccio",
    word: "RESPIRA",
    location: "San Giovanni",
    description:
      "Un peluche che chiede un abbraccio. Stringilo forte e scopri la parola.",
    interaction: "Abbraccia il peluche",
    image: "/images/tappa3-hug.jpg",
    color: "var(--color-accent-sand)",
  },
  {
    id: 4,
    title: "Il Memory",
    word: "SEI",
    location: "Sala Teatro",
    description:
      "Un piccolo gioco di memory. Trova tutti i coppie e scopri la parola.",
    interaction: "Completa il memory",
    image: "/images/tappa4-memory.jpg",
    color: "var(--color-accent-sage)",
  },
  {
    id: 5,
    title: "Le Navi nel Porto",
    word: "GIÀ",
    location: "Mostra",
    description:
      "Due navi che si incontrano in un porto. Falle incontrare e scopri la parola.",
    interaction: "Incontra le navi nel porto",
    image: "/images/tappa5-ships.jpg",
    color: "var(--color-accent-lavender)",
  },
  {
    id: 6,
    title: "La Bilancia",
    word: "ABBASTANZA",
    location: "MACASS",
    description:
      "Una bilancia: a sinistra i giudizi, a destra le qualità. Elimina tutti i giudizi e scopri la parola.",
    interaction: "Elimina i giudizi dalla bilancia",
    image: "/images/tappa6-scale.jpg",
    color: "var(--color-accent-amber)",
  },
];

export const FULL_PHRASE = STEPS.map((s) => s.word).join(" ");