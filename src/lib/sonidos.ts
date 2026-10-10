export type Efecto =
  | "agua"
  | "impacto"
  | "hundido"
  | "sonar"
  | "sirena"
  | "fanfarria";

let ctx: AudioContext | null = null;
let silenciado = false;

export function establecerSilencio(valor: boolean) {
  silenciado = valor;
}

function contexto(): AudioContext | null {
  if (typeof window === "undefined") return null;
  ctx ??= new AudioContext();
  if (ctx.state === "suspended") void ctx.resume();
  return ctx;
}

// Llamar dentro de un toque del usuario: algunos navegadores (iPhone)
// solo dejan activar el audio en ese momento
export function prepararAudio() {
  try {
    contexto();
  } catch {
    // sin audio, el juego sigue
  }
}

function tono(
  frecuencia: number,
  inicio: number,
  duracion: number,
  tipo: OscillatorType = "sine",
  volumen = 0.15
) {
  if (!ctx) return;
  const t = ctx.currentTime + inicio;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = tipo;
  osc.frequency.setValueAtTime(frecuencia, t);
  gain.gain.setValueAtTime(volumen, t);
  gain.gain.exponentialRampToValueAtTime(0.001, t + duracion);

  osc.connect(gain).connect(ctx.destination);
  osc.start(t);
  osc.stop(t + duracion);
}

// Tono cuya frecuencia sube o baja (para la sirena)
function barrido(
  desde: number,
  hasta: number,
  inicio: number,
  duracion: number,
  tipo: OscillatorType,
  volumen: number
) {
  if (!ctx) return;
  const t = ctx.currentTime + inicio;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = tipo;
  osc.frequency.setValueAtTime(desde, t);
  osc.frequency.linearRampToValueAtTime(hasta, t + duracion);

  gain.gain.setValueAtTime(0.0001, t);
  gain.gain.linearRampToValueAtTime(volumen, t + 0.05);
  gain.gain.setValueAtTime(volumen, t + duracion - 0.05);
  gain.gain.linearRampToValueAtTime(0.0001, t + duracion);

  osc.connect(gain).connect(ctx.destination);
  osc.start(t);
  osc.stop(t + duracion);
}

export function reproducir(efecto: Efecto) {
  if (silenciado) return;
  try {
    if (!contexto()) return;

    switch (efecto) {
      case "agua":
        tono(300, 0, 0.18, "sine");
        tono(200, 0.08, 0.2, "sine");
        break;
      case "impacto":
        tono(150, 0, 0.25, "sawtooth", 0.2);
        tono(90, 0.05, 0.3, "square", 0.12);
        break;
      case "hundido":
        tono(160, 0, 0.2, "sawtooth", 0.2);
        tono(110, 0.15, 0.25, "sawtooth", 0.2);
        tono(70, 0.3, 0.5, "square", 0.15);
        break;
      case "sonar":
        // Ping con eco
        tono(1250, 0, 1.5, "sine", 0.18);
        tono(1250, 0.5, 1.2, "sine", 0.07);
        break;
      case "sirena":
        for (let i = 0; i < 3; i++) {
          barrido(480, 820, i * 1.2, 0.6, "sawtooth", 0.06);
          barrido(820, 480, i * 1.2 + 0.6, 0.6, "sawtooth", 0.06);
        }
        break;
      case "fanfarria":
        // Ta-ta-ta-taaa y acorde final
        tono(392, 0, 0.16, "sawtooth", 0.07);
        tono(392, 0.18, 0.16, "sawtooth", 0.07);
        tono(392, 0.36, 0.16, "sawtooth", 0.07);
        tono(523, 0.54, 0.4, "sawtooth", 0.08);
        [523, 659, 784, 1046].forEach((f) =>
          tono(f, 1.0, 1.4, "triangle", 0.09)
        );
        break;
    }
  } catch {
    // Si el navegador no soporta audio, el juego sigue sin sonido
  }
}