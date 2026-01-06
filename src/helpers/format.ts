const currencyFormatter = new Intl.NumberFormat('es-AR', {
  style: 'currency',
  currency: 'ARS',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

const numberFormatter = new Intl.NumberFormat('es-AR', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

export const formatCurrency = (value: number) => currencyFormatter.format(value)

export const formatLiters = (value: number) => `${numberFormatter.format(value)} L`

export const formatNumber = (value: number) => numberFormatter.format(value)

export const formatPercent = (value: number) => `${numberFormatter.format(value * 100)}%`
