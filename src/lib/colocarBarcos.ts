import {
  FLOTA,
  TAMANO_TABLERO,
  crearTableroVacio,
  type Barco,
  type Tablero,
  type TipoBarco,
} from "@/types/juego";

export interface FlotaColocada {
  tablero: Tablero;
  barcos: Barco[];
}

export function flotaVacia(): FlotaColocada {
  return { tablero: crearTableroVacio(), barcos: [] };
}

function cabeBarco(
  tablero: Tablero,
  fila: number,
  columna: number,
  tamano: number,
  horizontal: boolean
): boolean {
  for (let i = 0; i < tamano; i++) {
    const f = horizontal ? fila : fila + i;
    const c = horizontal ? columna + i : columna;

    if (f >= TAMANO_TABLERO || c >= TAMANO_TABLERO) return false;
    if (tablero[f][c] !== "agua") return false;
  }
  return true;
}

// Coloca UN barco. Devuelve la flota nueva, o null si no cabe.
export function colocarUno(
  flota: FlotaColocada,
  { nombre, tamano }: TipoBarco,
  fila: number,
  columna: number,
  horizontal: boolean
): FlotaColocada | null {
  if (!cabeBarco(flota.tablero, fila, columna, tamano, horizontal)) return null;

  const tablero = flota.tablero.map((f) => [...f]);
  const celdas = [];
  for (let i = 0; i < tamano; i++) {
    const f = horizontal ? fila : fila + i;
    const c = horizontal ? columna + i : columna;
    tablero[f][c] = "barco";
    celdas.push({ fila: f, columna: c });
  }
  return { tablero, barcos: [...flota.barcos, { nombre, celdas }] };
}

// Quita el último barco colocado (para "Deshacer")
export function quitarUltimo(flota: FlotaColocada): FlotaColocada {
  const ultimo = flota.barcos[flota.barcos.length - 1];
  if (!ultimo) return flota;

  const tablero = flota.tablero.map((f) => [...f]);
  for (const c of ultimo.celdas) tablero[c.fila][c.columna] = "agua";
  return { tablero, barcos: flota.barcos.slice(0, -1) };
}

export function colocarBarcosAleatorios(): FlotaColocada {
  let flota = flotaVacia();

  for (const barco of FLOTA) {
    let nueva: FlotaColocada | null = null;
    while (!nueva) {
      nueva = colocarUno(
        flota,
        barco,
        Math.floor(Math.random() * TAMANO_TABLERO),
        Math.floor(Math.random() * TAMANO_TABLERO),
        Math.random() < 0.5
      );
    }
    flota = nueva;
  }

  return flota;
}