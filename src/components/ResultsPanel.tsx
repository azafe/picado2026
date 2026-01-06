import type { FuelCostCalculation, TripCalculation } from '../helpers/calc'
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
  return (
    <section className="card">
      <header className="card__header">
        <h2>Resultados</h2>
        <p>Resumen del viaje actual.</p>
      </header>

      <div className="result-grid">
        <article className="result-card">
          <h3>Viaje (bruto)</h3>
          <p className="result-amount">{formatCurrency(tripCalc.totalViaje)}</p>
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
          <h3>Viaje (neto)</h3>
          <p className="result-amount">{formatCurrency(tripCalc.netoViaje)}</p>
          <div className="result-meta">
            <span>Comision Lucas: {formatCurrency(tripCalc.comisionLucas)}</span>
            <span>Pago chofer: {formatCurrency(tripCalc.pagoChofer)}</span>
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
