import type { DayTotals, HistoryEntry } from '../helpers/calc'
import { formatCurrency, formatLiters, formatNumber } from '../helpers/format'

type DayHistoryProps = {
  history: HistoryEntry[]
  onSaveTrip: () => void
  onClear: () => void
  dayTotals: DayTotals
  viajesDia: number
  litrosRecibidos: number
}

export function DayHistory({
  history,
  onSaveTrip,
  onClear,
  dayTotals,
  viajesDia,
  litrosRecibidos,
}: DayHistoryProps) {
  return (
    <section className="card">
      <header className="card__header card__header--inline">
        <div>
          <h2>Historial del dia</h2>
          <p>Guarda cada viaje para tener sumatorias exactas.</p>
        </div>
        <div className="button-row">
          <button type="button" className="button" onClick={onSaveTrip}>
            Guardar viaje
          </button>
          <button type="button" className="button button--ghost" onClick={onClear}>
            Limpiar dia
          </button>
        </div>
      </header>

      {history.length === 0 ? (
        <div className="empty">
          <p>No hay viajes guardados todavia.</p>
          <span>Se usa el multiplicador de {viajesDia} viaje(s) para el dia.</span>
        </div>
      ) : (
        <div className="history">
          {history.map((entry) => (
            <article key={entry.id} className="history-item">
              <div>
                <strong>{entry.timestamp}</strong>
                <span>
                  {formatNumber(entry.m3)} m3 · {formatNumber(entry.kmViaje)} km
                </span>
              </div>
              <div>
                <span>Bruto: {formatCurrency(entry.totalViaje)}</span>
                <span>Neto: {formatCurrency(entry.netoViaje)}</span>
              </div>
              <div>
                <span>Extras: {formatLiters(entry.litrosExtra)}</span>
              </div>
            </article>
          ))}
        </div>
      )}

      <div className="card__divider" />

      <div className="summary-grid">
        <article>
          <h3>Sumatorias del dia</h3>
          <p className="result-amount">{formatCurrency(dayTotals.brutoDia)}</p>
          <span>Neto: {formatCurrency(dayTotals.netoDia)}</span>
        </article>
        <article>
          <h3>Balance de gasoil</h3>
          <span>Recibidos: {formatLiters(litrosRecibidos)}</span>
          <span>Comprometidos: {formatLiters(dayTotals.litrosComprometidos)}</span>
          <span>Disponibles: {formatLiters(dayTotals.litrosDisponibles)}</span>
          <span>Valor disponible: {formatCurrency(dayTotals.gasoilDisponibleValor)}</span>
        </article>
      </div>

      <p className="note">
        El balance de gasoil considera extras valorizados sin IVA.
      </p>
    </section>
  )
}
