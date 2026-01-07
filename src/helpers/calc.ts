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

const BASE = {
  m3: 45,
  precioConIva: 1415,
} as const

const clampNonNegative = (value: number) => (Number.isFinite(value) ? Math.max(0, value) : 0)

const calcPrecioSinIva = (precioConIva: number, iva: number) => {
  const safePrecio = clampNonNegative(precioConIva)
  const safeIva = clampNonNegative(iva)
  const divisor = 1 + safeIva / 100
  if (divisor <= 0) return 0
  return safePrecio / divisor
}

const calcTripValues = (kmViaje: number) => {
  const m3 = BASE.m3
  const precioConIva = BASE.precioConIva
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

export const getLandingData = () => {
  const baseTrip = calcTripValues(3)
  const longTrip = calcTripValues(12)
  const viajesDia = 8
  const totalFacturado = baseTrip.base * viajesDia
  const choferDia = totalFacturado * (CONSTANTS.porcentajeChofer / 100)
  const gasoilDia = totalFacturado * (CONSTANTS.porcentajeGasoil / 100)
  const lucasDia = totalFacturado * (CONSTANTS.comisionLucasPorcentaje / 100)
  const netoDia = totalFacturado - choferDia - gasoilDia - lucasDia

  return {
    base: {
      m3: BASE.m3,
      precioConIva: BASE.precioConIva,
      litrosBase: baseTrip.litrosBase,
      base: baseTrip.base,
    },
    shortTrip: {
      title: 'Ejemplo 1 – Viaje de 3 km (hasta 4 km)',
      ...baseTrip,
    },
    longTrip: {
      title: 'Ejemplo 2 – Viaje de 12 km (más de 4 km)',
      ...longTrip,
    },
    dailyExample: {
      viajesDia,
      totalFacturado,
      choferDia,
      gasoilDia,
      lucasDia,
      netoDia,
    },
  }
}
