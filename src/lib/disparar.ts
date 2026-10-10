import type { Barco, Tablero } from "@/types/juego";

export interface ResultadoDisparo {
  tablero: Tablero;
  valido: boolean;
  acierto: boolean;
}

export function disparar(
  tablero: Tablero,
  fila: number,
  columna: number
): ResultadoDisparo {
  const estado = tablero[fila][columna];

  // Ya se disparó aquí antes
  if (estado === "impacto" || estado === "fallo") {
    return { tablero, valido: false, acierto: false };
  }

  const copia = tablero.map((f) => [...f]);
  const acierto = estado === "barco";
  copia[fila][columna] = acierto ? "impacto" : "fallo";

  return { tablero: copia, valido: true, acierto };
}

export function todosHundidos(tablero: Tablero): boolean {
  return !tablero.some((fila) => fila.includes("barco"));
}
// Devuelve el barco si el disparo en (fila, columna) lo acaba de hundir
export function barcoHundido(
  tablero: Tablero,
  barcos: Barco[],
  fila: number,
  columna: number
): Barco | null {
  const barco = barcos.find((b) =>
    b.celdas.some((c) => c.fila === fila && c.columna === columna)
  );
  if (!barco) return null;

  const hundido = barco.celdas.every(
    (c) => tablero[c.fila][c.columna] === "impacto"
  );
  return hundido ? barco : null;
}