type Variante = "sonar" | "laton" | "suave" | "fantasma";

const base =
  "inline-flex items-center justify-center gap-2 rounded-xl font-display font-semibold tracking-wide transition active:scale-95 disabled:pointer-events-none disabled:opacity-40";

const variantes: Record<Variante, string> = {
  sonar:
    "bg-sonar text-mar-950 shadow-[0_0_20px_-4px] shadow-sonar/70 hover:brightness-110",
  laton:
    "bg-laton text-mar-950 shadow-[0_0_20px_-4px] shadow-laton/60 hover:brightness-110",
  suave:
    "border border-sonar/30 bg-mar-800/80 text-slate-100 hover:bg-mar-700",
  fantasma: "text-sonar/80 hover:text-sonar",
};

export function clasesBoton(variante: Variante = "suave", grande = false) {
  return `${base} ${variantes[variante]} ${
    grande ? "px-8 py-4 text-lg" : "px-4 py-2.5 text-sm"
  }`;
}