import type { Barco, Tablero } from "@/types/juego";

interface ContadorBarcosProps {
  barcos: Barco[];
  tablero: Tablero;
  mostrarImpactos?: boolean;
}

export default function ContadorBarcos({
  barcos,
  tablero,
  mostrarImpactos,
}: ContadorBarcosProps) {
  const estados = barcos.map((barco) => ({
    barco,
    hundido: barco.celdas.every(
      (c) => tablero[c.fila][c.columna] === "impacto"
    ),
  }));
  const vivos = estados.filter((e) => !e.hundido).length;

  return (
    <div className="flex w-full flex-col items-center gap-1.5">
      <p className="font-display text-xs tracking-wider text-laton">
        BARCOS A FLOTE · {vivos}/{barcos.length}
      </p>
      <ul className="flex flex-wrap justify-center gap-x-4 gap-y-1.5">
        {estados.map(({ barco, hundido }) => (
          <li
            key={barco.nombre}
            title={barco.nombre}
            className={`flex gap-0.5 ${hundido ? "opacity-60" : ""}`}
          >
            {barco.celdas.map((c, i) => {
              const golpeada =
                hundido ||
                (mostrarImpactos && tablero[c.fila][c.columna] === "impacto");
              return (
                <span
                  key={i}
                  className={`h-2 w-2.5 rounded-[2px] sm:h-2.5 sm:w-3 ${
                    golpeada
                      ? "bg-alerta shadow-[0_0_6px] shadow-alerta/70"
                      : "bg-slate-300/80"
                  }`}
                />
              );
            })}
          </li>
        ))}
      </ul>
    </div>
  );
}