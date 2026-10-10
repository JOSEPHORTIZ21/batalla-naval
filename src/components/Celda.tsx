import type { EstadoCelda } from "@/types/juego";

export type Previa = "ok" | "mal";

interface CeldaProps {
  estado: EstadoCelda;
  ocultarBarco?: boolean;
  previa?: Previa;
  siempreActiva?: boolean;
  onClick?: () => void;
  onEntrarRaton?: () => void;
}

const base =
  "relative flex aspect-square min-w-0 touch-manipulation items-center justify-center rounded-[3px] border leading-none transition duration-150";

const estilos: Record<EstadoCelda, string> = {
  agua: "border-sonar/15 bg-mar-800/80",
  barco:
    "border-slate-200/40 bg-gradient-to-br from-slate-300 to-slate-500 shadow-inner",
  impacto: "border-alerta/60 bg-alerta/20",
  fallo: "border-sonar/10 bg-mar-900",
};

const previas: Record<Previa, string> = {
  ok: "border-sonar bg-sonar/40 shadow-[0_0_10px_1px] shadow-sonar/60",
  mal: "border-alerta bg-alerta/40 shadow-[0_0_10px_1px] shadow-alerta/50",
};

const etiquetas: Record<EstadoCelda, string> = {
  agua: "Casilla sin disparar",
  barco: "Barco",
  impacto: "Impacto",
  fallo: "Agua",
};

export default function Celda({
  estado,
  ocultarBarco,
  previa,
  siempreActiva,
  onClick,
  onEntrarRaton,
}: CeldaProps) {
  // En el tablero enemigo, un barco sin tocar se ve como agua
  const visible: EstadoCelda =
    estado === "barco" && ocultarBarco ? "agua" : estado;
  const activa = Boolean(onClick) && (siempreActiva || visible === "agua");

  return (
    <button
      type="button"
      aria-disabled={!activa}
      tabIndex={activa ? 0 : -1}
      onClick={activa ? onClick : undefined}
      // Solo el ratón; en pantallas táctiles la previa se fija con el primer toque
      onPointerEnter={(e) => {
        if (e.pointerType === "mouse") onEntrarRaton?.();
      }}
      aria-label={etiquetas[visible]}
      className={`${base} ${previa ? previas[previa] : estilos[visible]} ${
        activa ? "cursor-crosshair" : ""
      } ${
        activa && !previa
          ? "hover:border-sonar hover:bg-sonar/25 active:scale-90"
          : ""
      }`}
    >
      {visible === "impacto" && (
        <span className="animate-golpe size-[55%] rounded-full bg-alerta shadow-[0_0_10px_2px] shadow-alerta/70" />
      )}
      {visible === "fallo" && (
        <>
          <span className="animate-golpe size-[26%] rounded-full bg-sonar/60" />
          <span className="animate-onda absolute inset-0 m-auto size-[70%] rounded-full border border-sonar/70" />
        </>
      )}
    </button>
  );
}