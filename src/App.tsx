import './App.css'
import { CONSTANTS, getLandingData } from './helpers/calc'
import { formatCurrency, formatNumber } from './helpers/format'

function App() {
  const data = getLandingData()
  const precioConIvaTexto = formatNumber(data.base.precioConIva).replace(',00', '')

  return (
    <div className="app">
      <header className="hero">
        <div className="hero__badge">Picado 2025/2026</div>
        <h1>Cómo se pagan los viajes – Picado 2025/2026</h1>
        <p>Explicación simple y ejemplos reales para entender el valor de cada viaje.</p>
        <p className="hero__note">Explicación simple y definitiva – Picado 2025/2026</p>
      </header>

      <main className="stack">
        <section className="card card--simple">
          <header className="card__header">
            <h2>1️⃣ ¿Qué se paga siempre?</h2>
          </header>
          <ul className="bullet-list">
            <li>Cada viaje se paga, sin importar si es corto o largo.</li>
            <li>La base del viaje se paga siempre, aunque el campo esté muy cerca.</li>
            <li>No existen viajes sin base.</li>
          </ul>
        </section>

        <section className="card">
          <header className="card__header">
            <h2>2️⃣ ¿Cuál es la base del viaje?</h2>
          </header>
          <div className="base-grid">
            <div>
              <p>La base se calcula usando:</p>
              <ul className="bullet-list">
                <li>0,55 litros</li>
                <li>por cada metro cúbico (m³) de la batea</li>
                <li>valuados con el precio del gasoil CON IVA</li>
                <li>el precio lo fija la empresa según la zona</li>
              </ul>
              <p>👉 Ejemplo base (datos reales):</p>
              <ul className="bullet-list">
                <li>Batea: {data.base.m3} m³</li>
                <li>Precio gasoil con IVA: {formatCurrency(data.base.precioConIva)}</li>
              </ul>
              <p className="formula-line">
                ➡️ Valor base del viaje {formatNumber(CONSTANTS.factorBase)} × {data.base.m3} ×{' '}
                {precioConIvaTexto} = {formatCurrency(data.base.base)}
              </p>
            </div>
            <div className="value-highlight">
              <span>Valor base del viaje</span>
              <strong>{formatCurrency(data.base.base)}</strong>
            </div>
          </div>
        </section>

        <section className="card">
          <header className="card__header">
            <h2>3️⃣ ¿Qué pasa con los kilómetros?</h2>
          </header>
          <div className="subcards">
            <article className="subcard">
              <h3>🚜 Viajes de 0 a 4 km</h3>
              <ul className="bullet-list">
                <li>NO se suma nada extra.</li>
                <li>Se paga solo la base.</li>
                <li>El valor es {formatCurrency(data.base.base)} por viaje.</li>
              </ul>
            </article>
            <article className="subcard">
              <h3>🚜 Viajes de más de 4 km (hasta 15 km)</h3>
              <ul className="bullet-list">
                <li>Se paga la base (igual que siempre, con IVA).</li>
                <li>Más un extra por cada km que supere los 4 km.</li>
                <li>El extra se valúa con precio del gasoil SIN IVA.</li>
              </ul>
              <p className="example-note">Ejemplo: viaje de 12 km, km excedente: 8 km.</p>
            </article>
          </div>
          <div className="note-strong">
            Hasta 4 km no cambia nada. A partir del km 5, se suma un extra.
          </div>
        </section>

        <section className="card">
          <header className="card__header">
            <h2>4️⃣ ¿Cómo se reparte el dinero del viaje?</h2>
          </header>
          <p>Del total del viaje se descuentan:</p>
          <ul className="bullet-list">
            <li>{CONSTANTS.porcentajeChofer}% para el chofer</li>
            <li>{CONSTANTS.comisionLucasPorcentaje}% comisión de Lucas</li>
            <li>{CONSTANTS.porcentajeGasoil}% gasoil (consumo estimado)</li>
          </ul>
          <div className="summary-band">
            <div>
              <span>Costo total del viaje</span>
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
            <h2>5️⃣ Ejemplo real – Viaje corto (hasta 4 km)</h2>
          </header>
          <div className="example-grid">
            <article className="example-block">
              <h3>Datos del ejemplo</h3>
              <ul>
                <li>Batea: {data.shortTrip.m3} m³</li>
                <li>Kilómetros: {data.shortTrip.kmViaje} km</li>
                <li>Gasoil con IVA: {formatCurrency(data.shortTrip.precioConIva)}</li>
              </ul>
            </article>
            <article className="example-block">
              <h3>Cómo se cobra</h3>
              <ul className="example-list">
                <li>Se paga solo la base.</li>
                <li>No hay kilómetros extra.</li>
              </ul>
              <div className="result-row">
                <span>Valor del viaje</span>
                <strong>{formatCurrency(data.shortTrip.totalViaje)}</strong>
              </div>
            </article>
            <article className="example-block example-block--result">
              <h3>Liquidación (estilo recibo)</h3>
              <div className="result-row">
                <span>Total del viaje</span>
                <strong>{formatCurrency(data.shortTrip.totalViaje)}</strong>
              </div>
              <div className="result-row">
                <span>Chofer (15%)</span>
                <strong>{formatCurrency(data.shortTrip.pagoChofer)}</strong>
              </div>
              <div className="result-row">
                <span>Gasoil (11%)</span>
                <strong>{formatCurrency(data.shortTrip.pagoGasoil)}</strong>
              </div>
              <div className="result-row">
                <span>Lucas (4%)</span>
                <strong>{formatCurrency(data.shortTrip.comisionLucas)}</strong>
              </div>
              <div className="result-row result-row--neto">
                <span>Neto Transporte Zafe</span>
                <strong>{formatCurrency(data.shortTrip.netoViaje)}</strong>
              </div>
            </article>
          </div>

          <div className="daily-block">
            <h3>Si en el día se hacen {data.dailyExample.viajesDia} viajes</h3>
            <div className="result-row">
              <span>Total facturado</span>
              <strong>{formatCurrency(data.dailyExample.totalFacturado)}</strong>
            </div>
            <div className="result-row">
              <span>Chofer (15%)</span>
              <strong>{formatCurrency(data.dailyExample.choferDia)}</strong>
            </div>
            <div className="result-row">
              <span>Gasoil (11%)</span>
              <strong>{formatCurrency(data.dailyExample.gasoilDia)}</strong>
            </div>
            <div className="result-row">
              <span>Comisión Lucas (4%)</span>
              <strong>{formatCurrency(data.dailyExample.lucasDia)}</strong>
            </div>
            <div className="result-row result-row--neto">
              <span>Transporte Zafe se queda con</span>
              <strong>{formatCurrency(data.dailyExample.netoDia)}</strong>
            </div>
          </div>
        </section>

        <section className="card example-card">
          <header className="card__header">
            <h2>7️⃣ Ejemplo 2 – Viaje de 12 km (más de 4 km)</h2>
          </header>
          <div className="example-grid">
            <article className="example-block">
              <h3>Datos del ejemplo</h3>
              <ul>
                <li>Batea: {data.longTrip.m3} m³</li>
                <li>Kilómetros: {data.longTrip.kmViaje} km</li>
              </ul>
            </article>
            <article className="example-block">
              <h3>Cómo se cobra</h3>
              <ul className="example-list">
                <li>Se paga la base completa.</li>
                <li>Se suman {formatNumber(data.longTrip.kmExtra)} km extra.</li>
                <li>El extra se valúa sin IVA.</li>
              </ul>
            </article>
            <article className="example-block example-block--result">
              <h3>Liquidación</h3>
              <div className="result-row">
                <span>Base</span>
                <strong>{formatCurrency(data.longTrip.base)}</strong>
              </div>
              <div className="result-row">
                <span>Extra por km excedente</span>
                <strong>{formatCurrency(data.longTrip.extra)}</strong>
              </div>
              <div className="result-row">
                <span>Total del viaje</span>
                <strong>{formatCurrency(data.longTrip.totalViaje)}</strong>
              </div>
              <div className="result-row">
                <span>Chofer (15%)</span>
                <strong>{formatCurrency(data.longTrip.pagoChofer)}</strong>
              </div>
              <div className="result-row">
                <span>Gasoil (11%)</span>
                <strong>{formatCurrency(data.longTrip.pagoGasoil)}</strong>
              </div>
              <div className="result-row">
                <span>Lucas (4%)</span>
                <strong>{formatCurrency(data.longTrip.comisionLucas)}</strong>
              </div>
              <div className="result-row result-row--neto">
                <span>Neto Transporte Zafe</span>
                <strong>{formatCurrency(data.longTrip.netoViaje)}</strong>
              </div>
            </article>
          </div>
        </section>

        <section className="card card--notice">
          <header className="card__header">
            <h2>8️⃣ Aclaración importante sobre traslados 🚛</h2>
          </header>
          <ul className="bullet-list">
            <li>Los traslados entre campos o provincias NO son viajes.</li>
            <li>NO se mezclan con los viajes.</li>
            <li>NO afectan el valor del viaje.</li>
            <li>Se pagan aparte, solo cuando ocurren.</li>
            <li>El arreglo sigue vigente, pero no entra en esta cuenta.</li>
          </ul>
        </section>

        <section className="card card--simple">
          <header className="card__header">
            <h2>✅ Resumen en una frase (para cualquiera)</h2>
          </header>
          <p>
            Cada viaje tiene una base fija. Hasta 4 km no cambia nada. Si pasa los 4 km, se suma un
            extra. Del total se descuenta chofer, gasoil y comisión. El resto es ganancia.
          </p>
        </section>
      </main>
    </div>
  )
}

export default App
