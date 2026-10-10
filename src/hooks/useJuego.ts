"use client";

import { useEffect, useState } from "react";
import {
  colocarBarcosAleatorios,
  flotaVacia,
  type FlotaColocada,
} from "@/lib/colocarBarcos";
import { barcoHundido, disparar, todosHundidos } from "@/lib/disparar";
import { elegirDisparoIA } from "@/lib/ia";
import { establecerSilencio, reproducir } from "@/lib/sonidos";
import { vibrar } from "@/lib/vibrar";
import { FLOTA, type Dificultad, type Modo } from "@/types/juego";

interface Jugador {
  nombre: string;
  flota: FlotaColocada;
}

type Jugadores = [Jugador, Jugador];
type Indice = 0 | 1;

type Fase =
  | "colocando"
  | "relevo"
  | "turno"
  | "resultado"
  | "iaApunta"
  | "resultadoIA";

export type Vista = "rival" | "propio";

export type TipoMensaje =
  | "turno"
  | "apuntando"
  | "impacto"
  | "agua"
  | "hundido";

export interface Mensaje {
  tipo: TipoMensaje;
  texto: string;
}

const MENSAJE_TURNO: Mensaje = {
  tipo: "turno",
  texto: "Toca una casilla para disparar",
};

const STATS_INICIALES = [
  { total: 0, aciertos: 0 },
  { total: 0, aciertos: 0 },
];

function crearJugadores(modo: Modo): Jugadores {
  if (modo === "ia") {
    return [
      { nombre: "Tú", flota: flotaVacia() },
      { nombre: "Robot", flota: colocarBarcosAleatorios() },
    ];
  }
  return [
    { nombre: "Jugador 1", flota: flotaVacia() },
    { nombre: "Jugador 2", flota: flotaVacia() },
  ];
}

// Una flota cuenta como hundida solo si ya fue colocada
function estaHundida(j: Jugador): boolean {
  return (
    j.flota.barcos.length === FLOTA.length && todosHundidos(j.flota.tablero)
  );
}

export function useJuego(modo: Modo, dificultad: Dificultad = "normal") {
  const [jugadores, setJugadores] = useState<Jugadores | null>(null);
  const [fase, setFase] = useState<Fase>("colocando");
  const [actual, setActual] = useState<Indice>(0);
  const [mensaje, setMensaje] = useState<Mensaje>(MENSAJE_TURNO);
  const [stats, setStats] = useState(STATS_INICIALES);
  const [silencio, setSilencio] = useState(false);

  useEffect(() => {
    setJugadores(crearJugadores(modo));
  }, [modo]);

  // Cada partida empieza con el sonido activado
  useEffect(() => {
    establecerSilencio(false);
  }, []);

  const rival = (1 - actual) as Indice;

  const ganador: Indice | null = jugadores
    ? estaHundida(jugadores[1])
      ? 0
      : estaHundida(jugadores[0])
      ? 1
      : null
    : null;

  const vista: Vista =
    fase === "iaApunta" || fase === "resultadoIA" ? "propio" : "rival";

  const puedeDisparar = fase === "turno" && ganador === null;

  const accionRelevo: "colocar" | "jugar" =
    jugadores && jugadores[actual].flota.barcos.length === 0
      ? "colocar"
      : "jugar";

  // ── Modo robot: tras tu disparo, cambia a tu tablero ──
  useEffect(() => {
    if (modo !== "ia" || fase !== "resultado" || ganador !== null) return;
    const id = setTimeout(() => {
      setActual(1);
      setFase("iaApunta");
      setMensaje({ tipo: "apuntando", texto: "El robot está apuntando..." });
    }, 1100);
    return () => clearTimeout(id);
  }, [modo, fase, ganador]);

  // ── Modo robot: el robot dispara ──
  useEffect(() => {
    if (fase !== "iaApunta" || !jugadores) return;
    const id = setTimeout(() => {
      const humano = jugadores[0].flota;
      const { fila, columna } = elegirDisparoIA(
        humano.tablero,
        humano.barcos,
        dificultad
      );
      const r = disparar(humano.tablero, fila, columna);
      const hundido = r.acierto
        ? barcoHundido(r.tablero, humano.barcos, fila, columna)
        : null;

      setJugadores([
        { ...jugadores[0], flota: { ...humano, tablero: r.tablero } },
        jugadores[1],
      ]);
      setStats((s) =>
        s.map((x, i) =>
          i === 1
            ? { total: x.total + 1, aciertos: x.aciertos + (r.acierto ? 1 : 0) }
            : x
        )
      );
      setMensaje(
        hundido
          ? { tipo: "hundido", texto: `El robot hundió tu ${hundido.nombre}` }
          : r.acierto
          ? { tipo: "impacto", texto: "El robot te dio en un barco" }
          : { tipo: "agua", texto: "El robot falló" }
      );

      reproducir(hundido ? "hundido" : r.acierto ? "impacto" : "agua");
      if (r.acierto) vibrar(hundido ? [150, 60, 250] : 200);

      setFase("resultadoIA");
    }, 1200);
    return () => clearTimeout(id);
  }, [fase, jugadores, dificultad]);

  // ── Modo robot: vuelve tu turno ──
  useEffect(() => {
    if (fase !== "resultadoIA" || ganador !== null) return;
    const id = setTimeout(() => {
      setActual(0);
      setFase("turno");
      setMensaje(MENSAJE_TURNO);
    }, 1600);
    return () => clearTimeout(id);
  }, [fase, ganador]);

  // ── Acciones ──

  function confirmarFlota(flota: FlotaColocada) {
    if (!jugadores) return;
    const nuevos: Jugadores = [...jugadores];
    nuevos[actual] = { ...nuevos[actual], flota };
    setJugadores(nuevos);
    setMensaje(MENSAJE_TURNO);

    if (modo === "ia") {
      setFase("turno");
      return;
    }

    setActual(actual === 0 ? 1 : 0);
    setFase("relevo");
  }

  function continuarRelevo() {
    setFase(accionRelevo === "colocar" ? "colocando" : "turno");
  }

  function disparoJugador(fila: number, columna: number) {
    if (!jugadores || !puedeDisparar) return;

    const objetivo = jugadores[rival].flota;
    const r = disparar(objetivo.tablero, fila, columna);
    if (!r.valido) return;

    const hundido = r.acierto
      ? barcoHundido(r.tablero, objetivo.barcos, fila, columna)
      : null;

    const nuevos: Jugadores = [...jugadores];
    nuevos[rival] = {
      ...nuevos[rival],
      flota: { ...objetivo, tablero: r.tablero },
    };
    setJugadores(nuevos);

    setStats((s) =>
      s.map((x, i) =>
        i === actual
          ? { total: x.total + 1, aciertos: x.aciertos + (r.acierto ? 1 : 0) }
          : x
      )
    );
    setMensaje(
      hundido
        ? { tipo: "hundido", texto: `¡Hundiste el ${hundido.nombre}!` }
        : r.acierto
        ? { tipo: "impacto", texto: "¡Impacto!" }
        : { tipo: "agua", texto: "Agua..." }
    );

    reproducir(hundido ? "hundido" : r.acierto ? "impacto" : "agua");
    if (r.acierto) vibrar(hundido ? [100, 50, 200] : 80);

    setFase("resultado");
  }

  function terminarTurno() {
    setActual(rival);
    setFase("relevo");
  }

  function reiniciar() {
    setJugadores(crearJugadores(modo));
    setActual(0);
    setFase("colocando");
    setMensaje(MENSAJE_TURNO);
    setStats(STATS_INICIALES);
  }

  function alternarSonido() {
    const nuevo = !silencio;
    setSilencio(nuevo);
    establecerSilencio(nuevo);
  }

  return {
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
  };
}