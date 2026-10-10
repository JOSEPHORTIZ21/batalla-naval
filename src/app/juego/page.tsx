import Partida from "@/components/Partida";
import type { Dificultad, Modo } from "@/types/juego";

export default async function Juego({
  searchParams,
}: {
  searchParams: Promise<{ modo?: string; dificultad?: string }>;
}) {
  const { modo, dificultad } = await searchParams;

  const modoJuego: Modo = modo === "local" ? "local" : "ia";
  const nivel: Dificultad =
    dificultad === "facil" || dificultad === "dificil" ? dificultad : "normal";

  // key obliga a reiniciar todo si cambia el modo o la dificultad
  return (
    <Partida key={`${modoJuego}-${nivel}`} modo={modoJuego} dificultad={nivel} />
  );
}