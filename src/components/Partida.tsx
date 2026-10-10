"use client";

import Link from "next/link";
import {
  Anchor,
  ArrowRight,
  Bomb,
  Crosshair,
  Droplets,
  Flame,
  House,
  RefreshCw,
  ShieldCheck,
  Target,
  Trophy,
  Volume2,
  VolumeX,
  type LucideIcon,
} from "lucide-react";
import Banner, { type Tono } from "@/components/Banner";
import ColocarFlota from "@/components/ColocarFlota";
import ContadorBarcos from "@/components/ContadorBarcos";
import PantallaFinal from "@/components/PantallaFinal";
import Relevo from "@/components/Relevo";
import Tablero from "@/components/Tablero";
import { useJuego, type TipoMensaje } from "@/hooks/useJuego";
import { clasesBoton } from "@/lib/estilos";
import {
  NOMBRE_DIFICULTAD,
  type Dificultad,
  type Modo,
} from "@/types/juego";

const ICONOS_MENSAJE: Record<TipoMensaje, LucideIcon> = {
  turno: Crosshair,
  apuntando: Target,
  impacto: Flame,
  agua: Droplets,
  hundido: Bomb,
};

interface PartidaProps {
  modo: Modo;
  dificultad: Dificultad;
}

export default function Partida({ modo, dificultad }: PartidaProps) {
  const {
    jugadores,
    fase,
    actual,
    rival,
    vista,
    mensaje,
    ganador,
    stats,
    silencio,
    puedeDisparar,
    accionRelevo,
    confirmarFlota,
    continuarRelevo,
    disparoJugador,
    terminarTurno,
    reiniciar,
    alternarSonido,
  } = useJuego(modo, dificultad);

  if (!jugadores) {
    return (
      <main className="flex min-h-dvh items-center justify-center font-display tracking-widest text-sonar">
        <span className="animate-pulso">PREPARANDO LA FLOTA...</span>
      </main>
    );
  }

  if (fase === "colocando") {
    return (
      <ColocarFlota
        key={actual}
        nombre={jugadores[actual].nombre}
        onEmpezar={confirmarFlota}
      />
    );
  }

  if (fase === "relevo") {
    return (
      <Relevo
        nombre={jugadores[actual].nombre}
        accion={accionRelevo}
        onContinuar={continuarRelevo}
      />
    );
  }

  const verRival = vista === "rival";
  const terminado = ganador !== null;

  // El rival (para disparar) o tu propia flota (cuando dispara el robot)
  const mostrado = verRival ? jugadores[rival] : jugadores[0];

  const textoBanner = terminado
    ? `¡Gana ${jugadores[ganador].nombre}!`
    : modo === "local"
    ? `Turno de ${jugadores[actual].nombre} · ${mensaje.texto}`
    : mensaje.texto;

  const IconoBanner = terminado ? Trophy : ICONOS_MENSAJE[mensaje.tipo];

  const tono: Tono = terminado
    ? "exito"
    : !verRival
    ? "alerta"
    : modo === "local" && actual === 1
    ? "laton"
    : "sonar";

  const titulo = verRival
    ? modo === "ia"
      ? "Flota enemiga"
      : `Flota de ${mostrado.nombre}`
    : "Tu flota";
  const IconoTitulo = verRival ? Crosshair : ShieldCheck;

  // Datos para la pantalla final
  const victoriaHumana = modo === "ia" && ganador === 0;
  const resultado = modo === "ia" && ganador === 1 ? "derrota" : "victoria";
  const tituloFinal =
    modo === "ia"
      ? victoriaHumana
        ? "¡VICTORIA!"
        : "DERROTA"
      : terminado
      ? `¡GANA ${jugadores[ganador].nombre.toUpperCase()}!`
      : "";
  const detalleFinal =
    modo === "ia"
      ? victoriaHumana
        ? "Hundiste toda la flota enemiga"
        : "Tu flota fue hundida"
      : terminado
      ? `${jugadores[ganador].nombre} hundió toda la flota rival`
      : "";
  const est = modo === "ia" ? stats[0] : stats[ganador ?? 0];
  const precision = est.total ? Math.round((est.aciertos / est.total) * 100) : 0;

  return (
    <main className="flex min-h-dvh flex-col items-center gap-3 px-3 pt-[max(0.75rem,env(safe-area-inset-top))] pb-[max(1rem,env(safe-area-inset-bottom))]">
      <header className="text-center">
        <p className="font-display text-[10px] tracking-[0.35em] text-laton">
          {modo === "ia"
            ? `CONTRA EL ROBOT · ${NOMBRE_DIFICULTAD[dificultad].toUpperCase()}`
            : "DOS JUGADORES"}
        </p>
        <h1 className="flex items-center justify-center gap-2 font-estencil text-xl tracking-wide sm:text-3xl">
          <Anchor className="size-5 text-sonar sm:size-7" aria-hidden />
          Batalla <span className="text-sonar">Naval</span>
        </h1>
      </header>

      <Banner
        tono={tono}
        icono={<IconoBanner className="size-5 shrink-0" aria-hidden />}
      >
        {textoBanner}
      </Banner>

      <section
        key={`${vista}-${actual}`}
        className="animate-aparecer flex w-[min(100%,28rem,calc(100dvh-19rem))] flex-col items-center gap-2"
      >
        <h2 className="flex items-center gap-2 font-display text-sm font-semibold tracking-wide text-slate-200 sm:text-base">
          <IconoTitulo className="size-4 text-sonar" aria-hidden />
          {titulo}
        </h2>

        <ContadorBarcos
          barcos={mostrado.flota.barcos}
          tablero={mostrado.flota.tablero}
          mostrarImpactos={!verRival}
        />

        <Tablero
          tablero={mostrado.flota.tablero}
          ocultarBarcos={verRival}
          onDisparo={verRival && puedeDisparar ? disparoJugador : undefined}
        />
      </section>

      {/* Solo en modo local: pasar el turno tras ver el resultado */}
      {modo === "local" && fase === "resultado" && !terminado && (
        <button onClick={terminarTurno} className={clasesBoton("laton", true)}>
          Terminar turno <ArrowRight className="size-5" aria-hidden />
        </button>
      )}

      <div className="mt-auto flex items-center gap-2 pt-2">
        <button
          onClick={alternarSonido}
          aria-label={silencio ? "Activar sonido" : "Silenciar"}
          className={clasesBoton("suave")}
        >
          {silencio ? (
            <VolumeX className="size-4" aria-hidden />
          ) : (
            <Volume2 className="size-4" aria-hidden />
          )}
        </button>
        <button onClick={reiniciar} className={clasesBoton("suave")}>
          <RefreshCw className="size-4" aria-hidden /> Reiniciar
        </button>
        <Link href="/" className={clasesBoton("fantasma")}>
          <House className="size-4" aria-hidden /> Inicio
        </Link>
      </div>

      {terminado && (
        <PantallaFinal
          resultado={resultado}
          titulo={tituloFinal}
          detalle={detalleFinal}
          disparos={est.total}
          precision={precision}
          onReiniciar={reiniciar}
        />
      )}
    </main>
  );
}