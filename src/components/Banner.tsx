import type { ReactNode } from "react";

export type Tono = "sonar" | "laton" | "alerta" | "exito";

const tonos: Record<Tono, string> = {
  sonar: "border-sonar/40 bg-sonar/10 text-sonar",
  laton: "border-laton/50 bg-laton/10 text-laton",
  alerta: "border-alerta/50 bg-alerta/10 text-alerta",
  exito: "border-emerald-400/50 bg-emerald-400/15 text-emerald-300",
};

export default function Banner({
  tono,
  icono,
  children,
}: {
  tono: Tono;
  icono?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div
      role="status"
      className={`flex w-full max-w-md items-center justify-center gap-2 rounded-xl border px-4 py-2 text-center font-display text-sm font-semibold tracking-wide transition-colors sm:text-base ${tonos[tono]}`}
    >
      {icono}
      <span>{children}</span>
    </div>
  );
}