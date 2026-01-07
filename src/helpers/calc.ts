export const CONSTANTS = {
  factorBase: 0.55,
  kmIncluidos: 4,
  litrosPorKmExtra: 4.5,
  kmMaximo: 15,
  ivaGasoil: 21,
  porcentajeChofer: 15,
  porcentajeGasoil: 11,
  comisionLucasPorcentaje: 4,
} as const

export type ExampleCalculation = {
  title: string
  m3: number
  kmViaje: number
  precioConIva: number
  litrosBase: number
  base: number
  kmExtra: number
  litrosExtra: number
  precioSinIva: number
  extra: number
  totalViaje: number
  pagoChofer: number
  pagoGasoil: number
  comisionLucas: number
  netoViaje: number
}

const clampNonNegative = (value: number) => (Number.isFinite(value) ? Math.max(0, value) : 0)

const calcPrecioSinIva = (precioConIva: number, iva: number) => {
  const safePrecio = clampNonNegative(precioConIva)
  const safeIva = clampNonNegative(iva)
  const divisor = 1 + safeIva / 100
  if (divisor <= 0) return 0
  return safePrecio / divisor
}

const calcExample = (kmViaje: number) => {
  const m3 = 45
  const precioConIva = 1415
  const safeKm = clampNonNegative(kmViaje)

  const litrosBase = CONSTANTS.factorBase * m3
  const base = litrosBase * precioConIva

  const kmExtra = Math.max(0, safeKm - CONSTANTS.kmIncluidos)
  const litrosExtra = kmExtra * CONSTANTS.litrosPorKmExtra
  const precioSinIva = calcPrecioSinIva(precioConIva, CONSTANTS.ivaGasoil)
  const extra = litrosExtra * precioSinIva

  const totalViaje = base + extra
  const pagoChofer = totalViaje * (CONSTANTS.porcentajeChofer / 100)
  const pagoGasoil = totalViaje * (CONSTANTS.porcentajeGasoil / 100)
  const comisionLucas = totalViaje * (CONSTANTS.comisionLucasPorcentaje / 100)
  const netoViaje = totalViaje - pagoChofer - pagoGasoil - comisionLucas

  return {
    m3,
    kmViaje: safeKm,
    precioConIva,
    litrosBase,
    base,
    kmExtra,
    litrosExtra,
    precioSinIva,
    extra,
    totalViaje,
    pagoChofer,
    pagoGasoil,
    comisionLucas,
    netoViaje,
  }
}

export const getExampleCalculations = (): ExampleCalculation[] => [
  {
    title: 'Ejemplo 1 – Viaje de 3 km (hasta 4 km)',
    ...calcExample(3),
  },
  {
    title: 'Ejemplo 2 – Viaje de 12 km (más de 4 km)',
    ...calcExample(12),
  },
]
