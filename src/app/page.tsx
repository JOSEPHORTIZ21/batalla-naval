import MenuModos from "@/components/MenuModos";

export default function Inicio() {
  return (
    <main className="relative flex min-h-dvh flex-col items-center justify-center gap-8 overflow-hidden px-5 py-12 text-center">
      <div className="franja absolute inset-x-0 top-0" aria-hidden />
      <div className="franja absolute inset-x-0 bottom-0" aria-hidden />

      {/* Radar decorativo */}
      <div className="relative size-44 sm:size-56" aria-hidden>
        <div className="absolute inset-0 rounded-full border border-sonar/40 bg-mar-950/60" />
        <div className="absolute inset-[18%] rounded-full border border-sonar/30" />
        <div className="absolute inset-[36%] rounded-full border border-sonar/25" />
        <div className="absolute top-0 left-1/2 h-full w-px bg-sonar/20" />
        <div className="absolute top-1/2 left-0 h-px w-full bg-sonar/20" />
        <div className="barrido absolute inset-0 rounded-full" />
        <span className="animate-pulso absolute top-[28%] left-[62%] size-2 rounded-full bg-sonar shadow-[0_0_8px_2px] shadow-sonar" />
        <span className="animate-pulso absolute top-[66%] left-[30%] size-2 rounded-full bg-alerta shadow-[0_0_8px_2px] shadow-alerta" />
      </div>

      <div>
        <p className="font-display text-xs tracking-[0.4em] text-laton sm:text-sm">
          COMANDO NAVAL · SECTOR 07
        </p>
        <h1 className="mt-2 font-estencil text-5xl tracking-wide sm:text-7xl">
          Batalla <span className="text-sonar">Naval</span>
        </h1>
        <p className="mx-auto mt-4 max-w-sm text-slate-300">
          Hunde la flota enemiga antes de que hundan la tuya.
        </p>
      </div>

      <MenuModos />
    </main>
  );
}