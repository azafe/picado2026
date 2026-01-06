import { CONSTANTS, type FuelCostCalculation, type TripCalculation } from '../helpers/calc'
import { formatCurrency, formatLiters, formatPercent } from '../helpers/format'

type ResultsPanelProps = {
  tripCalc: TripCalculation
  fuelCostCalc: FuelCostCalculation
  includeFuelCost: boolean
}

export function ResultsPanel({
  tripCalc,
  fuelCostCalc,
  includeFuelCost,
}: ResultsPanelProps) {
  const totalViaje = tripCalc.totalViaje
  const costoCombustible = includeFuelCost ? fuelCostCalc.costoCombustible : 0
  const beneficio = includeFuelCost ? fuelCostCalc.netoReal : tripCalc.netoViaje
  const porcentajeGasoil = totalViaje > 0 ? costoCombustible / totalViaje : 0
  const porcentajeBeneficio = totalViaje > 0 ? beneficio / totalViaje : 0

  return (
    <section className="card">
      <header className="card__header">
        <h2>Resultados</h2>
        <p>Resumen del viaje actual.</p>
      </header>

      <div className="result-grid">
        <article className="result-card">
          <h3>Total del viaje</h3>
          <p className="result-amount">{formatCurrency(totalViaje)}</p>
          <div className="result-meta">
            <span>
              Base: {formatLiters(tripCalc.litrosBase)} · {formatCurrency(tripCalc.base)}
            </span>
            <span>
              Extras: {formatLiters(tripCalc.litrosExtra)} · {formatCurrency(tripCalc.extra)}
            </span>
          </div>
        </article>

        <article className="result-card">
          <h3>Desglose por porcentajes</h3>
          <p className="result-amount">{formatCurrency(beneficio)}</p>
          <div className="result-meta">
            <span>
              {CONSTANTS.porcentajeChofer}% chofer: {formatCurrency(tripCalc.pagoChofer)}
            </span>
            <span>
              {CONSTANTS.comisionLucasPorcentaje}% Lucas: {formatCurrency(tripCalc.comisionLucas)}
            </span>
            <span>
              {formatPercent(porcentajeGasoil)} gasoil: {formatCurrency(costoCombustible)}
            </span>
            <span>
              {formatPercent(porcentajeBeneficio)} de beneficio: {formatCurrency(beneficio)}
            </span>
          </div>
        </article>

        {includeFuelCost ? (
          <article className="result-card">
            <h3>Margen real</h3>
            <p className="result-amount">{formatCurrency(fuelCostCalc.netoReal)}</p>
            <div className="result-meta">
              <span>
                Litros reconocidos (base+extra): {formatLiters(fuelCostCalc.litrosReconocidos)}
              </span>
              <span>
                Litros consumidos estimados: {formatLiters(fuelCostCalc.litrosConsumidos)}
              </span>
              <span>Costo de combustible: {formatCurrency(fuelCostCalc.costoCombustible)}</span>
              <span>Neto real: {formatCurrency(fuelCostCalc.netoReal)}</span>
              <span>% margen real: {formatPercent(fuelCostCalc.margenReal)}</span>
            </div>
          </article>
        ) : null}

      </div>
    </section>
  )
}
