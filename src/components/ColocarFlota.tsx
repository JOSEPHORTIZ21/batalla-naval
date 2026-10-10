"use client";

import { useState } from "react";
import {
  Anchor,
  Check,
  Dices,
  MoveHorizontal,
  MoveVertical,
  Play,
  RotateCw,
  Undo2,
} from "lucide-react";
import Banner from "@/components/Banner";
import Tablero from "@/components/Tablero";
import {
  colocarBarcosAleatorios,
  colocarUno,
  flotaVacia,
  quitarUltimo,
  type FlotaColocada,
} from "@/lib/colocarBarcos";
import { clasesBoton } from "@/lib/estilos";
import { FLOTA, TAMANO_TABLERO, type Coordenada } from "@/types/juego";

interface ColocarFlotaProps {
  nombre: string;
  onEmpezar: (flota: FlotaColocada) => void;
}

export default function ColocarFlota({ nombre, onEmpezar }: ColocarFlotaProps) {
  const [flota, setFlota] = useState<FlotaColocada>(flotaVacia);
  const [horizontal, setHorizontal] = useState(true);
  // Casilla donde empezaría el barco (la previa)
  const [previa, setPrevia] = useState<Coordenada | null>(null);

  const colocados = flota.barcos.length;
  const completo = colocados === FLOTA.length;
  const siguiente = FLOTA[colocados];

  // Casillas que ocuparía el barco (solo las que están dentro del tablero)
  const celdasPrevia: Coordenada[] =
    previa && !completo
      ? Array.from({ length: siguiente.tamano }, (_, i) => ({
          fila: horizontal ? previa.fila : previa.fila + i,
          columna: horizontal ? previa.columna + i : previa.columna,
        })).filter(
          (c) => c.fila < TAMANO_TABLERO && c.columna < TAMANO_TABLERO
        )
      : [];

  const previaValida = Boolean(
    previa &&
      !completo &&
      colocarUno(flota, siguiente, previa.fila, previa.columna, horizontal)
  );

  function colocar() {
    if (!previa || completo) return;
    const nueva = colocarUno(
      flota,
      siguiente,
      previa.fila,
      previa.columna,
      horizontal
    );
    if (!nueva) return;
    setFlota(nueva);
    setPrevia(null);
  }

  // Primer toque: muestra la previa. Mismo toque otra vez: coloca el barco.
  // Con ratón, pasar el cursor ya fija la previa, así que un clic coloca.
  function tocar(fila: number, columna: number) {
    if (completo) return;
    const mismaCasilla = previa?.fila === fila && previa?.columna === columna;
    if (mismaCasilla) colocar();
    else setPrevia({ fila, columna });
  }

  const ayuda = completo
    ? null
    : !previa
    ? "Toca una casilla para ver dónde caería el barco"
    : previaValida
    ? "Toca la misma casilla otra vez o pulsa Colocar"
    : "No cabe ahí. Rota el barco o elige otra casilla";

  return (
    <main className="flex min-h-dvh flex-col items-center gap-3 px-3 pt-[max(0.75rem,env(safe-area-inset-top))] pb-[max(1rem,env(safe-area-inset-bottom))]">
      <header className="text-center">
        <p className="font-display text-xs tracking-[0.35em] text-laton">
          PREPARACIÓN
        </p>
        <h1 className="font-display text-xl font-bold sm:text-3xl">
          {nombre}: coloca tu flota
        </h1>
      </header>

      {/* Progreso de la flota */}
      <ul className="flex w-full max-w-md flex-wrap justify-center gap-1.5">
        {FLOTA.map((b, i) => {
          const hecho = i < colocados;
          const actual = i === colocados;
          return (
            <li
              key={b.nombre}
              className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 font-display text-[11px] font-semibold ${
                hecho
                  ? "border-sonar/40 bg-sonar/10 text-sonar"
                  : actual
                  ? "animate-pulso border-laton bg-laton/10 text-laton"
                  : "border-white/10 text-slate-500"
              }`}
            >
              {hecho ? <Check className="size-3" aria-hidden /> : b.tamano}
              {b.nombre}
            </li>
          );
        })}
      </ul>

      <Banner tono={completo ? "exito" : "sonar"}>
        {completo ? (
          "¡Flota lista! Pulsa Empezar"
        ) : (
          <span className="inline-flex items-center justify-center gap-2">
            {siguiente.nombre} · {siguiente.tamano} casillas ·
            {horizontal ? (
              <>
                horizontal <MoveHorizontal className="size-4" aria-hidden />
              </>
            ) : (
              <>
                vertical <MoveVertical className="size-4" aria-hidden />
              </>
            )}
          </span>
        )}
      </Banner>

      <p
        className={`min-h-8 max-w-xs text-center text-xs ${
          previa && !previaValida ? "text-alerta" : "text-laton"
        }`}
      >
        {ayuda}
      </p>

      <section className="animate-aparecer flex w-[min(100%,28rem,calc(100dvh-23rem))] flex-col items-center">
        <Tablero
          tablero={flota.tablero}
          onDisparo={tocar}
          previa={
            celdasPrevia.length
              ? { celdas: celdasPrevia, valida: previaValida }
              : null
          }
          onHover={(fila, columna) => setPrevia({ fila, columna })}
          onSalir={() => setPrevia(null)}
        />
      </section>

      <div className="mt-auto flex flex-wrap items-center justify-center gap-2 pt-2">
        <button
          className={clasesBoton("suave")}
          onClick={() => setHorizontal((h) => !h)}
          disabled={completo}
        >
          <RotateCw className="size-4" aria-hidden /> Rotar
        </button>
        <button
          className={clasesBoton("suave")}
          onClick={() => {
            setFlota(quitarUltimo(flota));
            setPrevia(null);
          }}
          disabled={colocados === 0}
        >
          <Undo2 className="size-4" aria-hidden /> Deshacer
        </button>
        <button
          className={clasesBoton("suave")}
          onClick={() => {
            setFlota(colocarBarcosAleatorios());
            setPrevia(null);
          }}
        >
          <Dices className="size-4" aria-hidden /> Aleatorio
        </button>

        {completo ? (
          <button
            className={clasesBoton("sonar")}
            onClick={() => onEmpezar(flota)}
          >
            <Play className="size-4" aria-hidden /> ¡Empezar!
          </button>
        ) : (
          <button
            className={clasesBoton("laton")}
            onClick={colocar}
            disabled={!previaValida}
          >
            <Anchor className="size-4" aria-hidden /> Colocar
          </button>
        )}
      </div>
    </main>
  );
}