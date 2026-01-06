export const CONSTANTS = {
  factorBase: 0.55,
  kmIncluidos: 4,
  litrosPorKmExtra: 4.5,
} as const

export type TripInput = {
  m3: number
  kmViaje: number
  kmTraslado: number
  precioConIva: number
  iva: number
  porcentajeComision: number
  porcentajeChofer: number
  litrosPor100kmTraslado: number
}

export type TripCalculation = {
  kmExtra: number
  precioSinIva: number
  litrosBase: number
  litrosExtra: number
  litrosTraslado: number
  base: number
  extra: number
  traslado: number
  totalViaje: number
  comisionLucas: number
  pagoChofer: number
  netoViaje: number
}

export type HistoryEntry = {
  id: string
  timestamp: string
  m3: number
  kmViaje: number
  kmTraslado: number
  totalViaje: number
  netoViaje: number
  litrosExtra: number
  litrosTraslado: number
}

export type DayTotals = {
  brutoDia: number
  netoDia: number
  litrosComprometidos: number
  litrosDisponibles: number
  gasoilDisponibleValor: number
  netoPlus: number
  porcentajeGanancia: number
  porcentajeGananciaPlus: number
}

const clampNonNegative = (value: number) => (Number.isFinite(value) ? Math.max(0, value) : 0)

export const calcPrecioSinIva = (precioConIva: number, iva: number) => {
  const safePrecio = clampNonNegative(precioConIva)
  const safeIva = clampNonNegative(iva)
  const divisor = 1 + safeIva / 100
  if (divisor <= 0) return 0
  return safePrecio / divisor
}

export const calcTrip = (input: TripInput): TripCalculation => {
  const m3 = clampNonNegative(input.m3)
  const kmViaje = clampNonNegative(input.kmViaje)
  const kmTraslado = clampNonNegative(input.kmTraslado)
  const precioConIva = clampNonNegative(input.precioConIva)
  const porcentajeComision = clampNonNegative(input.porcentajeComision)
  const porcentajeChofer = clampNonNegative(input.porcentajeChofer)
  const litrosPor100kmTraslado = clampNonNegative(input.litrosPor100kmTraslado)

  const precioSinIva = calcPrecioSinIva(precioConIva, input.iva)

  const litrosBase = CONSTANTS.factorBase * m3
  const base = litrosBase * precioConIva

  const kmExtra = Math.max(0, kmViaje - CONSTANTS.kmIncluidos)
  const litrosExtra = kmExtra * CONSTANTS.litrosPorKmExtra
  const extra = litrosExtra * precioSinIva

  const litrosTraslado = (kmTraslado / 100) * litrosPor100kmTraslado
  const traslado = litrosTraslado * precioSinIva

  const totalViaje = base + extra + traslado
  const comisionLucas = totalViaje * (porcentajeComision / 100)
  const pagoChofer = totalViaje * (porcentajeChofer / 100)
  const netoViaje = totalViaje - comisionLucas - pagoChofer

  return {
    kmExtra,
    precioSinIva,
    litrosBase,
    litrosExtra,
    litrosTraslado,
    base,
    extra,
    traslado,
    totalViaje,
    comisionLucas,
    pagoChofer,
    netoViaje,
  }
}

export const createHistoryEntry = (
  input: TripInput,
  calc: TripCalculation,
  timestamp: string,
  id: string
): HistoryEntry => {
  const m3 = clampNonNegative(input.m3)
  const kmViaje = clampNonNegative(input.kmViaje)
  const kmTraslado = clampNonNegative(input.kmTraslado)

  return {
    id,
    timestamp,
    m3,
    kmViaje,
    kmTraslado,
    totalViaje: calc.totalViaje,
    netoViaje: calc.netoViaje,
    litrosExtra: calc.litrosExtra,
    litrosTraslado: calc.litrosTraslado,
  }
}

export const calcDayTotalsFromHistory = (
  history: HistoryEntry[],
  litrosRecibidos: number,
  precioConIva: number
): DayTotals => {
  const brutoDia = history.reduce((acc, entry) => acc + entry.totalViaje, 0)
  const netoDia = history.reduce((acc, entry) => acc + entry.netoViaje, 0)
  const litrosComprometidos = history.reduce(
    (acc, entry) => acc + entry.litrosExtra + entry.litrosTraslado,
    0
  )

  return buildDayTotals(
    brutoDia,
    netoDia,
    litrosComprometidos,
    litrosRecibidos,
    precioConIva
  )
}

export const calcDayTotalsFromMultiplier = (
  tripCalc: TripCalculation,
  viajesDia: number,
  litrosRecibidos: number,
  precioConIva: number
): DayTotals => {
  const safeViajes = clampNonNegative(viajesDia)
  const brutoDia = tripCalc.totalViaje * safeViajes
  const netoDia = tripCalc.netoViaje * safeViajes
  const litrosComprometidos = (tripCalc.litrosExtra + tripCalc.litrosTraslado) * safeViajes

  return buildDayTotals(
    brutoDia,
    netoDia,
    litrosComprometidos,
    litrosRecibidos,
    precioConIva
  )
}

const buildDayTotals = (
  brutoDia: number,
  netoDia: number,
  litrosComprometidos: number,
  litrosRecibidos: number,
  precioConIva: number
): DayTotals => {
  const safeRecibidos = clampNonNegative(litrosRecibidos)
  const safePrecio = clampNonNegative(precioConIva)
  const litrosDisponibles = safeRecibidos - litrosComprometidos
  const gasoilDisponibleValor = litrosDisponibles * safePrecio
  const netoPlus = netoDia + gasoilDisponibleValor
  const porcentajeGanancia = brutoDia > 0 ? netoDia / brutoDia : 0
  const porcentajeGananciaPlus = brutoDia > 0 ? netoPlus / brutoDia : 0

  return {
    brutoDia,
    netoDia,
    litrosComprometidos,
    litrosDisponibles,
    gasoilDisponibleValor,
    netoPlus,
    porcentajeGanancia,
    porcentajeGananciaPlus,
  }
}
