"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { House, RefreshCw, Skull, Trophy } from "lucide-react";
import EscenaFlotas from "@/components/EscenaFlotas";
import { clasesBoton } from "@/lib/estilos";

interface PantallaFinalProps {
  resultado: "victoria" | "derrota";
  titulo: string;
  detalle: string;
  disparos: number;
  precision: number;
  onReiniciar: () => void;
}

type Fase = "espera" | "escena" | "tarjeta";

export default function PantallaFinal({
  resultado,
  titulo,
  detalle,
  disparos,
  precision,
  onReiniciar,
}: PantallaFinalProps) {
  const [fase, setFase] = useState<Fase>("espera");

  useEffect(() => {
    if (fase === "tarjeta") return;
    const id = setTimeout(
      () => setFase(fase === "espera" ? "escena" : "tarjeta"),
      fase === "espera" ? 900 : 3800
    );
    return () => clearTimeout(id);
  }, [fase]);

  const victoria = resultado === "victoria";
  const Icono = victoria ? Trophy : Skull;

  // Deja ver el último disparo antes de cubrir la pantalla
  if (fase === "espera") return null;

  if (fase === "escena") {
    return (
      <EscenaFlotas
        variante={resultado}
        etiqueta={victoria ? "MISIÓN CUMPLIDA" : "FLOTA PERDIDA"}
        titulo={titulo}
        subtitulo={detalle}
        icono={<Icono className="size-9" aria-hidden />}
        onSaltar={() => setFase("tarjeta")}
      />
    );
  }

  return (
    <div className="animate-fundido fixed inset-0 z-40 flex items-center justify-center bg-mar-950/85 p-4 backdrop-blur-sm">
      <div className="w-full max-w-sm overflow-hidden rounded-2xl border border-sonar/30 bg-mar-900 text-center shadow-[0_0_60px_-10px] shadow-sonar/50">
        <div className="franja" aria-hidden />
        <div className="p-6">
          <span
            className={`mx-auto flex size-16 items-center justify-center rounded-full border ${
              victoria
                ? "border-laton/50 bg-laton/10 text-laton"
                : "border-alerta/50 bg-alerta/10 text-alerta"
            }`}
          >
            <Icono className="size-8" aria-hidden />
          </span>
          <h2 className="mt-3 font-estencil text-3xl tracking-wide">{titulo}</h2>
          <p className="mt-1 text-slate-300">{detalle}</p>

          <div className="mt-5 grid grid-cols-2 gap-3">
            <div className="rounded-xl border border-white/10 bg-mar-800/60 py-3">
              <p className="font-display text-2xl font-bold text-sonar">
                {disparos}
              </p>
              <p className="text-xs text-slate-400">Disparos</p>
            </div>
            <div className="rounded-xl border border-white/10 bg-mar-800/60 py-3">
              <p className="font-display text-2xl font-bold text-laton">
                {precision}%
              </p>
              <p className="text-xs text-slate-400">Precisión</p>
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-2">
            <button onClick={onReiniciar} className={clasesBoton("sonar", true)}>
              <RefreshCw className="size-5" aria-hidden /> Jugar otra vez
            </button>
            <Link href="/" className={clasesBoton("fantasma")}>
              <House className="size-4" aria-hidden /> Ir al inicio
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}