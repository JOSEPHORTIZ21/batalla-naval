import Celda, { type Previa } from "./Celda";
import type { Coordenada, Tablero as TableroTipo } from "@/types/juego";

interface TableroProps {
  tablero: TableroTipo;
  ocultarBarcos?: boolean;
  onDisparo?: (fila: number, columna: number) => void;
  // Solo al colocar la flota
  previa?: { celdas: Coordenada[]; valida: boolean } | null;
  onHover?: (fila: number, columna: number) => void;
  onSalir?: () => void;
}

const LETRAS = "ABCDEFGHIJ".split("");

const COLUMNAS =
  "grid grid-cols-[1.1rem_repeat(10,minmax(0,1fr))] gap-[2px] sm:grid-cols-[1.5rem_repeat(10,minmax(0,1fr))]";

const ROTULO = "font-display text-[10px] font-semibold text-laton/90 sm:text-xs";

export default function Tablero({
  tablero,
  ocultarBarcos,
  onDisparo,
  previa,
  onHover,
  onSalir,
}: TableroProps) {
  const marcas = new Map<string, Previa>();
  previa?.celdas.forEach((c) =>
    marcas.set(`${c.fila},${c.columna}`, previa.valida ? "ok" : "mal")
  );

  return (
    <div
      onPointerLeave={(e) => {
        if (e.pointerType === "mouse") onSalir?.();
      }}
      className="marco-tactico w-full rounded-2xl border border-sonar/25 bg-mar-900/70 p-2 shadow-[0_0_30px_-8px] shadow-sonar/40 backdrop-blur sm:p-3"
    >
      <div className="flex flex-col gap-[2px]">
        {/* Encabezado: esquina vacía + números 1 a 10 */}
        <div className={COLUMNAS}>
          <div />
          {tablero[0].map((_, columna) => (
            <div key={columna} className={`text-center ${ROTULO}`}>
              {columna + 1}
            </div>
          ))}
        </div>

        {/* Cada fila: letra + 10 celdas */}
        {tablero.map((fila, i) => (
          <div key={i} className={COLUMNAS}>
            <div className={`flex items-center justify-center ${ROTULO}`}>
              {LETRAS[i]}
            </div>
            {fila.map((estado, j) => (
              <Celda
                key={j}
                estado={estado}
                ocultarBarco={ocultarBarcos}
                previa={marcas.get(`${i},${j}`)}
                siempreActiva={Boolean(onHover)}
                onClick={onDisparo ? () => onDisparo(i, j) : undefined}
                onEntrarRaton={onHover ? () => onHover(i, j) : undefined}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}