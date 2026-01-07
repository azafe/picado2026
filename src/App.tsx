import './App.css'
import { CONSTANTS, getExampleCalculations } from './helpers/calc'
import { formatCurrency, formatNumber } from './helpers/format'

function App() {
  const examples = getExampleCalculations()
  const exampleShort = examples[0]
  const exampleLong = examples[1]

  return (
    <div className="app">
      <header className="hero">
        <div className="hero__badge">Picado 2025/2026</div>
        <h1>Cómo se pagan los viajes – Picado 2025/2026</h1>
        <p>Explicación simple y ejemplos reales para entender el valor de cada viaje.</p>
      </header>

      <main className="stack">
        <section className="card card--simple">
          <header className="card__header">
            <h2>¿Qué se paga siempre?</h2>
          </header>
          <ul className="bullet-list">
            <li>Cada viaje se paga siempre.</li>
            <li>Aunque el campo esté cerca, la base del viaje se cobra igual.</li>
            <li>No existen viajes sin base.</li>
          </ul>
        </section>

        <section className="card">
          <header className="card__header">
            <h2>La base del viaje</h2>
          </header>
          <div className="base-grid">
            <div>
              <p>La base del viaje se calcula usando:</p>
              <ul className="bullet-list">
                <li>0,55 litros</li>
                <li>por cada metro cúbico (m³) de la batea</li>
                <li>valuados con el precio del gasoil CON IVA</li>
              </ul>
              <p>El precio del gasoil lo fija la empresa según la zona de trabajo.</p>
              <p>
                Ejemplo real: batea de {exampleShort.m3} m³ y gasoil con IVA de{' '}
                {formatCurrency(exampleShort.precioConIva)}.
              </p>
            </div>
            <div className="value-highlight">
              <span>Valor base del viaje</span>
              <strong>{formatCurrency(exampleShort.base)}</strong>
            </div>
          </div>
        </section>

        <section className="card">
          <header className="card__header">
            <h2>Los kilómetros</h2>
          </header>
          <div className="subcards">
            <article className="subcard">
              <h3>Viajes de 0 a 4 km</h3>
              <ul className="bullet-list">
                <li>No se suma nada extra.</li>
                <li>Se paga solo la base.</li>
                <li>El valor del viaje es siempre el mismo.</li>
              </ul>
            </article>
            <article className="subcard">
              <h3>Viajes de más de 4 km (hasta 15 km)</h3>
              <ul className="bullet-list">
                <li>Se paga la base (igual que siempre).</li>
                <li>Se suma un extra por cada km que supere los 4 km.</li>
                <li>El extra se valúa con gasoil SIN IVA.</li>
              </ul>
            </article>
          </div>
          <div className="note-strong">
            Hasta 4 km no cambia nada. A partir del km 5, se suma un extra.
          </div>
        </section>

        <section className="card">
          <header className="card__header">
            <h2>Cómo se reparte el dinero del viaje</h2>
          </header>
          <p>Del valor total del viaje se descuentan:</p>
          <ul className="bullet-list">
            <li>{CONSTANTS.porcentajeChofer}% para el chofer</li>
            <li>{CONSTANTS.porcentajeGasoil}% para gasoil</li>
            <li>{CONSTANTS.comisionLucasPorcentaje}% comisión de Lucas</li>
          </ul>
          <div className="summary-band">
            <div>
              <span>Costo total</span>
              <strong>30%</strong>
            </div>
            <div>
              <span>Margen Transporte Zafe</span>
              <strong>70%</strong>
            </div>
          </div>
        </section>

        <section className="card example-card">
          <header className="card__header">
            <h2>{exampleShort.title}</h2>
          </header>
          <div className="example-grid">
            <article className="example-block">
              <h3>Datos del ejemplo</h3>
              <ul>
                <li>Batea: {exampleShort.m3} m³</li>
                <li>Kilómetros: {exampleShort.kmViaje} km</li>
                <li>Gasoil con IVA: {formatCurrency(exampleShort.precioConIva)}</li>
              </ul>
            </article>
            <article className="example-block">
              <h3>Cómo se obtiene el total</h3>
              <ul className="example-list">
                <li>
                  Base (0–4 km, con IVA): {formatNumber(exampleShort.litrosBase)} L ×{' '}
                  {formatCurrency(exampleShort.precioConIva)}, total{' '}
                  {formatCurrency(exampleShort.base)}.
                </li>
                <li>Extra por km excedente (sin IVA): 0 km, total $0,00.</li>
                <li>Total del viaje: {formatCurrency(exampleShort.totalViaje)}.</li>
              </ul>
            </article>
            <article className="example-block example-block--result">
              <h3>Liquidación</h3>
              <div className="result-row">
                <span>Total del viaje</span>
                <strong>{formatCurrency(exampleShort.totalViaje)}</strong>
              </div>
              <div className="result-row">
                <span>Chofer (15%)</span>
                <strong>{formatCurrency(exampleShort.pagoChofer)}</strong>
              </div>
              <div className="result-row">
                <span>Gasoil (11%)</span>
                <strong>{formatCurrency(exampleShort.pagoGasoil)}</strong>
              </div>
              <div className="result-row">
                <span>Lucas (4%)</span>
                <strong>{formatCurrency(exampleShort.comisionLucas)}</strong>
              </div>
              <div className="result-row result-row--neto">
                <span>Neto Transporte Zafe</span>
                <strong>{formatCurrency(exampleShort.netoViaje)}</strong>
              </div>
            </article>
          </div>
        </section>

        <section className="card example-card">
          <header className="card__header">
            <h2>{exampleLong.title}</h2>
          </header>
          <div className="example-grid">
            <article className="example-block">
              <h3>Datos del ejemplo</h3>
              <ul>
                <li>Batea: {exampleLong.m3} m³</li>
                <li>Kilómetros: {exampleLong.kmViaje} km</li>
                <li>Gasoil con IVA: {formatCurrency(exampleLong.precioConIva)}</li>
              </ul>
            </article>
            <article className="example-block">
              <h3>Cómo se obtiene el total</h3>
              <ul className="example-list">
                <li>
                  Base (0–4 km, con IVA): {formatNumber(exampleLong.litrosBase)} L ×{' '}
                  {formatCurrency(exampleLong.precioConIva)}, total{' '}
                  {formatCurrency(exampleLong.base)}.
                </li>
                <li>Km excedente: {formatNumber(exampleLong.kmExtra)} km.</li>
                <li>
                  Extra (sin IVA): {formatNumber(exampleLong.litrosExtra)} L ×{' '}
                  {formatCurrency(exampleLong.precioSinIva)}, total{' '}
                  {formatCurrency(exampleLong.extra)}.
                </li>
                <li>Total del viaje: {formatCurrency(exampleLong.totalViaje)}.</li>
              </ul>
            </article>
            <article className="example-block example-block--result">
              <h3>Liquidación</h3>
              <div className="result-row">
                <span>Base</span>
                <strong>{formatCurrency(exampleLong.base)}</strong>
              </div>
              <div className="result-row">
                <span>Extra por km excedente</span>
                <strong>{formatCurrency(exampleLong.extra)}</strong>
              </div>
              <div className="result-row">
                <span>Total del viaje</span>
                <strong>{formatCurrency(exampleLong.totalViaje)}</strong>
              </div>
              <div className="result-row">
                <span>Chofer (15%)</span>
                <strong>{formatCurrency(exampleLong.pagoChofer)}</strong>
              </div>
              <div className="result-row">
                <span>Gasoil (11%)</span>
                <strong>{formatCurrency(exampleLong.pagoGasoil)}</strong>
              </div>
              <div className="result-row">
                <span>Lucas (4%)</span>
                <strong>{formatCurrency(exampleLong.comisionLucas)}</strong>
              </div>
              <div className="result-row result-row--neto">
                <span>Neto Transporte Zafe</span>
                <strong>{formatCurrency(exampleLong.netoViaje)}</strong>
              </div>
            </article>
          </div>
        </section>

        <section className="card card--notice">
          <header className="card__header">
            <h2>Aclaración sobre traslados</h2>
          </header>
          <ul className="bullet-list">
            <li>Los traslados entre campos o provincias NO son viajes.</li>
            <li>No forman parte del valor del viaje.</li>
            <li>No se mezclan con los viajes.</li>
            <li>Se reconocen y pagan aparte únicamente cuando ocurre un traslado.</li>
            <li>Este arreglo sigue vigente, pero no entra en el cálculo del viaje.</li>
          </ul>
        </section>
      </main>
    </div>
  )
}

export default App
