export const CONSTANTS = {
  factorBase: 0.55,
  kmIncluidos: 4,
  kmMax: 15,
  litrosPorKmExtra: 4.5,
} as const

export type TripInput = {
  m3: number
  kmViaje: number
  precioConIva: number
  iva: number
  porcentajeComision: number
  porcentajeChofer: number
}

export type TripCalculation = {
  kmExtra: number
  precioSinIva: number
  litrosBase: number
  litrosExtra: number
  litrosReconocidos: number
  base: number
  extra: number
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
  totalViaje: number
  netoViaje: number
  litrosExtra: number
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

export type FuelCostMode = 'porcentaje' | 'litros'

export type FuelCostInput = {
  modo: FuelCostMode
  consumoPorcentaje: number
  litrosConsumidosViaje: number
  precioConIva: number
}

export type FuelCostCalculation = {
  litrosReconocidos: number
  litrosConsumidos: number
  costoCombustible: number
  netoReal: number
  margenReal: number
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
  const kmViajeRaw = clampNonNegative(input.kmViaje)
  const kmViaje = Math.min(kmViajeRaw, CONSTANTS.kmMax)
  const precioConIva = clampNonNegative(input.precioConIva)
  const porcentajeComision = clampNonNegative(input.porcentajeComision)
  const porcentajeChofer = clampNonNegative(input.porcentajeChofer)

  const precioSinIva = calcPrecioSinIva(precioConIva, input.iva)

  const litrosBase = CONSTANTS.factorBase * m3
  const base = litrosBase * precioConIva

  const kmExtra = Math.max(0, kmViaje - CONSTANTS.kmIncluidos)
  const litrosExtra = kmExtra * CONSTANTS.litrosPorKmExtra
  const extra = litrosExtra * precioSinIva
  const litrosReconocidos = litrosBase + litrosExtra

  const totalViaje = base + extra
  const comisionLucas = totalViaje * (porcentajeComision / 100)
  const pagoChofer = totalViaje * (porcentajeChofer / 100)
  const netoViaje = totalViaje - comisionLucas - pagoChofer

  return {
    kmExtra,
    precioSinIva,
    litrosBase,
    litrosExtra,
    litrosReconocidos,
    base,
    extra,
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
  const kmViaje = Math.min(clampNonNegative(input.kmViaje), CONSTANTS.kmMax)

  return {
    id,
    timestamp,
    m3,
    kmViaje,
    totalViaje: calc.totalViaje,
    netoViaje: calc.netoViaje,
    litrosExtra: calc.litrosExtra,
  }
}

export const calcDayTotalsFromHistory = (
  history: HistoryEntry[],
  litrosRecibidos: number,
  precioConIva: number
): DayTotals => {
  const brutoDia = history.reduce((acc, entry) => acc + entry.totalViaje, 0)
  const netoDia = history.reduce((acc, entry) => acc + entry.netoViaje, 0)
  const litrosComprometidos = history.reduce((acc, entry) => acc + entry.litrosExtra, 0)

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
  const litrosComprometidos = tripCalc.litrosExtra * safeViajes

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

export const calcFuelCost = (
  tripCalc: TripCalculation,
  input: FuelCostInput
): FuelCostCalculation => {
  const litrosReconocidos = tripCalc.litrosReconocidos
  const consumoPorcentaje = clampNonNegative(input.consumoPorcentaje)
  const litrosConsumidosViaje = clampNonNegative(input.litrosConsumidosViaje)
  const precioConIva = clampNonNegative(input.precioConIva)

  const litrosConsumidos =
    input.modo === 'porcentaje'
      ? litrosReconocidos * (consumoPorcentaje / 100)
      : litrosConsumidosViaje
  const costoCombustible = litrosConsumidos * precioConIva
  const netoReal = tripCalc.netoViaje - costoCombustible
  const margenReal = tripCalc.totalViaje > 0 ? netoReal / tripCalc.totalViaje : 0

  return {
    litrosReconocidos,
    litrosConsumidos,
    costoCombustible,
    netoReal,
    margenReal,
  }
}
