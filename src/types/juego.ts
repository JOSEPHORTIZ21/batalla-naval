export type EstadoCelda = "agua" | "barco" | "impacto" | "fallo";

export type Tablero = EstadoCelda[][];

export const TAMANO_TABLERO = 10;

export function crearTableroVacio(): Tablero {
  return Array.from({ length: TAMANO_TABLERO }, () =>
    Array.from({ length: TAMANO_TABLERO }, () => "agua" as EstadoCelda)
  );
}
export interface TipoBarco {
  nombre: string;
  tamano: number;
}

export const FLOTA: TipoBarco[] = [
  { nombre: "Portaaviones", tamano: 5 },
  { nombre: "Acorazado", tamano: 4 },
  { nombre: "Crucero", tamano: 3 },
  { nombre: "Submarino", tamano: 3 },
  { nombre: "Destructor", tamano: 2 },
];
export interface Coordenada {
  fila: number;
  columna: number;
}

export interface Barco {
  nombre: string;
  celdas: Coordenada[];
}
export type Modo = "ia" | "local";

export type Dificultad = "facil" | "normal" | "dificil";

export const NOMBRE_DIFICULTAD: Record<Dificultad, string> = {
  facil: "Fácil",
  normal: "Normal",
  dificil: "Difícil",
};