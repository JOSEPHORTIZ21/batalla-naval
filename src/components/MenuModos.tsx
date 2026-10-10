"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Bot,
  ChevronRight,
  Flame,
  Shield,
  Swords,
  Target,
  Users,
  type LucideIcon,
} from "lucide-react";
import EscenaFlotas from "@/components/EscenaFlotas";
import { prepararAudio } from "@/lib/sonidos";
import {
  NOMBRE_DIFICULTAD,
  type Dificultad,
  type Modo,
} from "@/types/juego";

const DURACION_TRANSICION = 2600; // ms antes de entrar a la partida

const NIVELES: { id: Dificultad; icono: LucideIcon; detalle: string }[] = [
  { id: "facil", icono: Shield, detalle: "Dispara al azar" },
  { id: "normal", icono: Target, detalle: "Persigue tus barcos" },
  { id: "dificil", icono: Flame, detalle: "Calcula probabilidades" },
];

const tarjeta =
  "group flex w-full items-center gap-4 rounded-2xl border bg-mar-900/80 p-4 text-left backdrop-blur transition active:scale-[0.98]";

interface Eleccion {
  modo: Modo;
  dificultad: Dificultad;
}

export default function MenuModos() {
  const router = useRouter();
  const [elegido, setElegido] = useState<Eleccion | null>(null);
  const [abierto, setAbierto] = useState(false);
  const temporizador = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined
  );

  useEffect(() => () => clearTimeout(temporizador.current), []);

  function elegir(modo: Modo, dificultad: Dificultad = "normal") {
    if (elegido) return; // evita dobles toques
    prepararAudio(); // el toque actual permite activar el sonido

    const destino =
      modo === "ia"
        ? `/juego?modo=ia&dificultad=${dificultad}`
        : "/juego?modo=local";

    setElegido({ modo, dificultad });
    router.prefetch(destino);
    temporizador.current = setTimeout(
      () => router.push(destino),
      DURACION_TRANSICION
    );
  }

  return (
    <>
      <div className="flex w-full max-w-sm flex-col gap-3">
        {/* Robot: al tocar se despliega la dificultad */}
        <div>
          <button
            onClick={() => setAbierto((a) => !a)}
            aria-expanded={abierto}
            className={`${tarjeta} border-sonar/30 hover:border-sonar/70 hover:bg-mar-800/80`}
          >
            <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-sonar/15 text-sonar">
              <Bot className="size-6" aria-hidden />
            </span>
            <span className="flex-1">
              <span className="block font-display text-lg font-semibold text-sonar">
                Contra el robot
              </span>
              <span className="block text-sm text-slate-400">
                Un jugador contra la IA
              </span>
            </span>
            <ChevronRight
              className={`size-5 text-sonar/60 transition ${
                abierto ? "rotate-90" : "group-hover:translate-x-1"
              }`}
              aria-hidden
            />
          </button>

          {abierto && (
            <div className="animate-aparecer mt-2">
              <p className="mb-2 font-display text-xs tracking-[0.3em] text-laton">
                ELIGE LA DIFICULTAD
              </p>
              <div className="grid grid-cols-3 gap-2">
                {NIVELES.map(({ id, icono: Icono, detalle }) => (
                  <button
                    key={id}
                    onClick={() => elegir("ia", id)}
                    className="flex flex-col items-center gap-1 rounded-xl border border-sonar/30 bg-mar-900/80 px-2 py-3 text-center backdrop-blur transition hover:border-sonar hover:bg-mar-800 active:scale-95"
                  >
                    <Icono className="size-5 text-sonar" aria-hidden />
                    <span className="font-display text-sm font-semibold text-sonar">
                      {NOMBRE_DIFICULTAD[id]}
                    </span>
                    <span className="text-[10px] leading-tight text-slate-400">
                      {detalle}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <button
          onClick={() => elegir("local")}
          className={`${tarjeta} border-laton/30 hover:border-laton/70 hover:bg-mar-800/80`}
        >
          <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-laton/15 text-laton">
            <Users className="size-6" aria-hidden />
          </span>
          <span className="flex-1">
            <span className="block font-display text-lg font-semibold text-laton">
              Dos jugadores
            </span>
            <span className="block text-sm text-slate-400">
              Pasándose el mismo dispositivo
            </span>
          </span>
          <ChevronRight
            className="size-5 text-laton/60 transition group-hover:translate-x-1"
            aria-hidden
          />
        </button>
      </div>

      {elegido && (
        <EscenaFlotas
          variante="choque"
          etiqueta="PREPARANDO LA BATALLA"
          titulo={elegido.modo === "ia" ? "CONTRA EL ROBOT" : "DOS JUGADORES"}
          subtitulo={
            elegido.modo === "ia"
              ? `Dificultad ${NOMBRE_DIFICULTAD[elegido.dificultad]}`
              : undefined
          }
          icono={<Swords className="size-8" aria-hidden />}
        />
      )}
    </>
  );
}