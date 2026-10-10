import { Check, Smartphone } from "lucide-react";
import { clasesBoton } from "@/lib/estilos";

interface RelevoProps {
  nombre: string;
  accion: "colocar" | "jugar";
  onContinuar: () => void;
}

export default function Relevo({ nombre, accion, onContinuar }: RelevoProps) {
  return (
    <main className="animate-aparecer flex min-h-dvh flex-col items-center justify-center gap-6 p-6 text-center">
      <div className="relative size-28" aria-hidden>
        <div className="absolute inset-0 rounded-full border border-laton/50 bg-mar-950/60" />
        <div className="absolute inset-[22%] rounded-full border border-laton/30" />
        <div className="barrido absolute inset-0 rounded-full opacity-70" />
        <span className="absolute inset-0 flex items-center justify-center text-laton">
          <Smartphone className="size-9" />
        </span>
      </div>

      <div>
        <p className="font-display text-xs tracking-[0.35em] text-laton">
          CAMBIO DE TURNO
        </p>
        <h1 className="mt-2 font-display text-3xl font-bold sm:text-4xl">
          Pasa el dispositivo a <span className="text-laton">{nombre}</span>
        </h1>
      </div>

      <p className="max-w-xs text-slate-300">
        {accion === "colocar"
          ? "Es hora de colocar tu flota. Que nadie más mire la pantalla."
          : "Es tu turno de disparar."}
      </p>

      <button onClick={onContinuar} className={clasesBoton("laton", true)}>
        <Check className="size-5" aria-hidden /> Estoy listo
      </button>
    </main>
  );
}