"use client";

import { useEffect, type ReactNode } from "react";
import { reproducir, type Efecto } from "@/lib/sonidos";

export type VarianteEscena = "choque" | "victoria" | "derrota";

type Tipo = "portaaviones" | "destructor" | "submarino";

// Silueta de perfil; usa el color del texto (currentColor)
function Silueta({ tipo }: { tipo: Tipo }) {
  return (
    <svg
      viewBox="0 0 120 40"
      fill="currentColor"
      className="h-auto w-full"
      aria-hidden
    >
      {tipo === "submarino" && (
        <>
          <path d="M4 28c0-7 7-10 16-10h80c10 0 16 4 16 10s-6 10-16 10H20C11 38 4 35 4 28Z" />
          <path d="M48 18V8h14v10Z" />
          <path d="M58 8V3h6" fill="none" stroke="currentColor" strokeWidth="2" />
        </>
      )}
      {tipo === "portaaviones" && (
        <>
          <path d="M2 24h116l-10 12H14Z" />
          <rect x="6" y="20" width="108" height="4" />
          <path d="M84 20V10h10v10Z" />
          <path d="M89 10V3" stroke="currentColor" strokeWidth="2" />
        </>
      )}
      {tipo === "destructor" && (
        <>
          <path d="M2 22h110l-12 14H14Z" />
          <path d="M36 22v-8h26v8Z" />
          <path d="M46 14V8h10v6Z" />
          <path d="M51 8V1" stroke="currentColor" strokeWidth="2" />
          <rect x="80" y="17" width="16" height="5" />
          <rect x="14" y="18" width="12" height="4" />
        </>
      )}
    </svg>
  );
}

const NAVES: { tipo: Tipo; ancho: string; sangria: number }[] = [
  { tipo: "portaaviones", ancho: "w-28 sm:w-52", sangria: 0 },
  { tipo: "destructor", ancho: "w-20 sm:w-40", sangria: 16 },
  { tipo: "submarino", ancho: "w-24 sm:w-44", sangria: 4 },
];

interface FlotaProps {
  lado: "izq" | "der";
  color: string;
  animacion: string;
  retraso: number;
}

function Flota({ lado, color, animacion, retraso }: FlotaProps) {
  return (
    <div
      className={`flex flex-col gap-3 sm:gap-5 ${color} ${
        lado === "izq" ? "items-start" : "items-end"
      }`}
      style={{ filter: "drop-shadow(0 0 6px currentColor)" }}
    >
      {NAVES.map((nave, i) => (
        <div
          key={nave.tipo}
          className={`${nave.ancho} ${animacion}`}
          style={{
            animationDelay: `${retraso + i * 0.15}s`,
            ...(lado === "izq"
              ? { marginLeft: nave.sangria }
              : { marginRight: nave.sangria }),
          }}
        >
          <div className="animate-flotar" style={{ animationDelay: `${i * 0.4}s` }}>
            {/* La flota derecha se refleja para mirar a la izquierda */}
            <div className={lado === "der" ? "-scale-x-100" : ""}>
              <Silueta tipo={nave.tipo} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

interface EscenaFlotasProps {
  variante: VarianteEscena;
  etiqueta: string;
  titulo: string;
  subtitulo?: string;
  icono?: ReactNode;
  onSaltar?: () => void;
}

export default function EscenaFlotas({
  variante,
  etiqueta,
  titulo,
  subtitulo,
  icono,
  onSaltar,
}: EscenaFlotasProps) {
      // Sonidos de la escena, sincronizados con la animación
  useEffect(() => {
    const ids: ReturnType<typeof setTimeout>[] = [];
    const sonar = (ms: number, efecto: Efecto) =>
      ids.push(setTimeout(() => reproducir(efecto), ms));

    if (variante === "choque") {
      sonar(0, "sonar");
      sonar(1100, "impacto");
    } else if (variante === "victoria") {
      sonar(0, "sonar");
      sonar(800, "fanfarria");
    } else {
      sonar(0, "sirena");
      sonar(800, "hundido");
    }

    return () => ids.forEach(clearTimeout);
  }, [variante]);
  // Izquierda = tu flota (o la ganadora). Derecha = la rival.
  const izquierda =
    variante === "derrota"
      ? { animacion: "animate-hundir", retraso: 0.7 }
      : { animacion: "animate-entra-izq", retraso: 0.1 };
  const derecha =
    variante === "victoria"
      ? { animacion: "animate-hundir", retraso: 0.7 }
      : { animacion: "animate-entra-der", retraso: 0.1 };

  const colorDerecha = variante === "choque" ? "text-laton" : "text-alerta";
  const colorOnda = variante === "derrota" ? "border-alerta" : "border-sonar";
  const colorDestello = variante === "derrota" ? "bg-alerta" : "bg-sonar";
  const retrasoImpacto = variante === "choque" ? 1.1 : 0.8;

  return (
    <div
      role="dialog"
      aria-label={titulo}
      onClick={onSaltar}
      className={`escena animate-fundido fondo-mar fixed inset-0 z-50 flex flex-col items-center justify-center gap-8 overflow-hidden px-4 ${
        onSaltar ? "cursor-pointer" : ""
      }`}
    >
      <div className="franja absolute inset-x-0 top-0" aria-hidden />
      <div className="franja absolute inset-x-0 bottom-0" aria-hidden />

      {/* Destello de impacto */}
      <div
        className={`animate-destello pointer-events-none absolute inset-0 ${colorDestello}`}
        style={{ animationDelay: `${retrasoImpacto}s` }}
        aria-hidden
      />

      {/* Las dos flotas frente a frente */}
      <div className="relative flex w-full max-w-3xl items-center justify-between">
        <Flota
          lado="izq"
          color="text-sonar"
          animacion={izquierda.animacion}
          retraso={izquierda.retraso}
        />

        <div
          className="pointer-events-none absolute inset-0 flex items-center justify-center"
          aria-hidden
        >
          {[0, 0.25].map((extra) => (
            <span
              key={extra}
              className={`animate-onda-lenta absolute size-32 rounded-full border-2 sm:size-48 ${colorOnda}`}
              style={{ animationDelay: `${retrasoImpacto + extra}s` }}
            />
          ))}
        </div>

        <Flota
          lado="der"
          color={colorDerecha}
          animacion={derecha.animacion}
          retraso={derecha.retraso}
        />
      </div>

      {/* Texto */}
      <div className="flex flex-col items-center gap-2 text-center">
        {icono && (
          <div
            className="animate-texto text-laton"
            style={{ animationDelay: `${retrasoImpacto}s` }}
          >
            {icono}
          </div>
        )}
        <p
          className="animate-texto font-display text-xs tracking-[0.4em] text-laton"
          style={{ animationDelay: `${retrasoImpacto}s` }}
        >
          {etiqueta}
        </p>
        <h2
          className="animate-texto font-estencil text-4xl tracking-wide sm:text-6xl"
          style={{ animationDelay: `${retrasoImpacto + 0.1}s` }}
        >
          {titulo}
        </h2>
        {subtitulo && (
          <p
            className="animate-texto max-w-xs text-slate-300"
            style={{ animationDelay: `${retrasoImpacto + 0.2}s` }}
          >
            {subtitulo}
          </p>
        )}
        {onSaltar && (
          <p
            className="animate-texto mt-2 text-xs text-slate-500"
            style={{ animationDelay: "1.8s" }}
          >
            Toca para continuar
          </p>
        )}
      </div>
    </div>
  );
}