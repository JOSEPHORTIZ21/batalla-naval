import {
  TAMANO_TABLERO,
  type Barco,
  type Coordenada,
  type Dificultad,
  type Tablero,
} from "@/types/juego";

const DIRECCIONES = [
  [-1, 0],
  [1, 0],
  [0, -1],
  [0, 1],
];

function disponible(tablero: Tablero, f: number, c: number): boolean {
  const estado = tablero[f]?.[c];
  return estado === "agua" || estado === "barco";
}

function aleatorio<T>(lista: T[]): T {
  return lista[Math.floor(Math.random() * lista.length)];
}

function casillasLibres(tablero: Tablero): Coordenada[] {
  const libres: Coordenada[] = [];
  tablero.forEach((fila, i) =>
    fila.forEach((_, j) => {
      if (disponible(tablero, i, j)) libres.push({ fila: i, columna: j });
    })
  );
  return libres;
}

function estaHundido(barco: Barco, tablero: Tablero): boolean {
  return barco.celdas.every((c) => tablero[c.fila][c.columna] === "impacto");
}

// Impactos que pertenecen a barcos que todavía siguen a flote
function impactosActivos(tablero: Tablero, barcos: Barco[]): Coordenada[] {
  const activos: Coordenada[] = [];
  for (const barco of barcos) {
    const golpeadas = barco.celdas.filter(
      (c) => tablero[c.fila][c.columna] === "impacto"
    );
    if (golpeadas.length > 0 && golpeadas.length < barco.celdas.length) {
      activos.push(...golpeadas);
    }
  }
  return activos;
}

// FÁCIL: todo al azar
function disparoFacil(tablero: Tablero): Coordenada {
  return aleatorio(casillasLibres(tablero));
}

// NORMAL: rodea los impactos; sin pistas, al azar con patrón de ajedrez
function disparoNormal(tablero: Tablero, barcos: Barco[]): Coordenada {
  const activos = impactosActivos(tablero, barcos);
  const esActivo = (f: number, c: number) =>
    activos.some((a) => a.fila === f && a.columna === c);

  const candidatos = new Map<string, { coord: Coordenada; puntos: number }>();
  for (const h of activos) {
    for (const [df, dc] of DIRECCIONES) {
      const f = h.fila + df;
      const c = h.columna + dc;
      if (!disponible(tablero, f, c)) continue;

      const enLinea = esActivo(h.fila - df, h.columna - dc);
      const clave = `${f},${c}`;
      const previo = candidatos.get(clave)?.puntos ?? 0;
      candidatos.set(clave, {
        coord: { fila: f, columna: c },
        puntos: previo + (enLinea ? 2 : 1),
      });
    }
  }

  if (candidatos.size > 0) {
    const lista = [...candidatos.values()];
    const maximo = Math.max(...lista.map((x) => x.puntos));
    return aleatorio(lista.filter((x) => x.puntos === maximo)).coord;
  }

  const libres = casillasLibres(tablero);
  const ajedrez = libres.filter((c) => (c.fila + c.columna) % 2 === 0);
  return aleatorio(ajedrez.length > 0 ? ajedrez : libres);
}

// DIFÍCIL: cuenta de cuántas formas cabe cada barco restante en cada casilla
// y dispara a la más probable. Si hay impactos pendientes, solo cuenta las
// posiciones que pasan por ellos (y más si cubren varios).
function disparoDificil(tablero: Tablero, barcos: Barco[]): Coordenada {
  const N = TAMANO_TABLERO;
  const activos = impactosActivos(tablero, barcos);
  const claveActiva = new Set(activos.map((a) => `${a.fila},${a.columna}`));
  const restantes = barcos
    .filter((b) => !estaHundido(b, tablero))
    .map((b) => b.celdas.length);

  const conteo = tablero.map((fila) => fila.map(() => 0));

  for (const tamano of restantes) {
    for (const horizontal of [true, false]) {
      for (let f = 0; f < N; f++) {
        for (let c = 0; c < N; c++) {
          const celdas = Array.from({ length: tamano }, (_, i) => ({
            fila: horizontal ? f : f + i,
            columna: horizontal ? c + i : c,
          }));
          if (celdas.some((x) => x.fila >= N || x.columna >= N)) continue;

          let valido = true;
          let golpes = 0;
          for (const { fila, columna } of celdas) {
            const estado = tablero[fila][columna];
            if (estado === "fallo") {
              valido = false;
              break;
            }
            if (estado === "impacto") {
              // Un impacto de un barco ya hundido no puede formar parte de otro
              if (claveActiva.has(`${fila},${columna}`)) golpes++;
              else {
                valido = false;
                break;
              }
            }
          }
          if (!valido) continue;
          if (activos.length > 0 && golpes === 0) continue;

          const peso = golpes > 0 ? golpes * golpes : 1;
          for (const { fila, columna } of celdas) {
            if (tablero[fila][columna] !== "impacto") {
              conteo[fila][columna] += peso;
            }
          }
        }
      }
    }
  }

  let mejor = 0;
  let mejores: Coordenada[] = [];
  for (const { fila, columna } of casillasLibres(tablero)) {
    const valor = conteo[fila][columna];
    if (valor > mejor) {
      mejor = valor;
      mejores = [{ fila, columna }];
    } else if (valor === mejor && valor > 0) {
      mejores.push({ fila, columna });
    }
  }

  return mejor > 0 ? aleatorio(mejores) : disparoNormal(tablero, barcos);
}

export function elegirDisparoIA(
  tablero: Tablero,
  barcos: Barco[],
  dificultad: Dificultad = "normal"
): Coordenada {
  if (dificultad === "facil") return disparoFacil(tablero);
  if (dificultad === "dificil") return disparoDificil(tablero, barcos);
  return disparoNormal(tablero, barcos);
}