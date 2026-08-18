export interface FireClass {
  id: "A" | "B" | "C" | "D" | "K";
  title: string;
  description: string;
}

export const fireClasses: FireClass[] = [
  {
    id: "A",
    title: "Clase A",
    description:
      "Materiales sólidos combustibles: madera, papel, telas, cauchos y diversos plásticos.",
  },
  {
    id: "B",
    title: "Clase B",
    description:
      "Líquidos y gases inflamables: combustibles, aceites, grasas, ceras, solventes y pinturas.",
  },
  {
    id: "C",
    title: "Clase C",
    description: "Equipos energizados eléctricamente.",
  },
  {
    id: "D",
    title: "Clase D",
    description: "Metales y determinados no metales combustibles.",
  },
  {
    id: "K",
    title: "Clase K",
    description: "Grasas y aceites de cocina.",
  },
];
