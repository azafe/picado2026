import './App.css'
import { ConstantsCard } from './components/ConstantsCard'
import { CONSTANTS, getExampleCalculations } from './helpers/calc'
import { formatCurrency, formatNumber } from './helpers/format'

function App() {
  const examples = getExampleCalculations()

  return (
    <div className="app">
      <header className="hero">
        <div className="hero__badge">Picado 2025/2026</div>
        <h1>Como se paga el viaje</h1>
        <p>
          Guia simple para entender el valor del viaje con dos ejemplos reales, sin calculos
          editables.
        </p>
      </header>

      <main className="layout">
        <div className="column">
          <section className="card">
            <header className="card__header">
              <h2>Regla del viaje</h2>
              <p>Resumen claro para entender el valor del viaje.</p>
            </header>
            <div className="rules">
              <p>
                <strong>Hasta 4 km:</strong> se paga solo la BASE (0,55 L por m3), valuada con
                gasoil CON IVA.
              </p>
              <p>
                <strong>Mas de 4 km (hasta 15):</strong> BASE (con IVA) + EXTRA por km excedente
                (4,5 L/km), valuado con gasoil SIN IVA.
              </p>
              <p>
                <strong>Traslados:</strong> los traslados entre campos no forman parte del valor
                del viaje. Se reconocen aparte unicamente cuando ocurre un traslado (acuerdo
                operativo).
              </p>
            </div>
          </section>

          <ConstantsCard />

          {examples.map((example) => (
            <section key={example.title} className="card example-card">
              <header className="card__header">
                <h2>{example.title}</h2>
                <p>Ejemplo real con datos fijos.</p>
              </header>

              <div className="example-grid">
                <article className="example-block">
                  <h3>Datos del ejemplo</h3>
                  <ul>
                    <li>m3 transportados: {example.m3}</li>
                    <li>km del viaje: {example.kmViaje}</li>
                    <li>gasoil con IVA: {formatCurrency(example.precioConIva)}</li>
                    <li>IVA: {CONSTANTS.ivaGasoil}%</li>
                    <li>chofer: {CONSTANTS.porcentajeChofer}%</li>
                    <li>Lucas: {CONSTANTS.comisionLucasPorcentaje}%</li>
                  </ul>
                </article>

                <article className="example-block">
                  <h3>Como se obtiene el total</h3>
                  <ul className="example-list">
                    <li>
                      Base (0–4 km, con IVA): {formatNumber(example.litrosBase)} L ×{' '}
                      {formatCurrency(example.precioConIva)}, total {formatCurrency(example.base)}.
                    </li>
                    {example.kmExtra === 0 ? (
                      <li>Extra por km excedente (sin IVA): 0 km, total $0,00.</li>
                    ) : (
                      <>
                        <li>Km excedente: {formatNumber(example.kmExtra)} km.</li>
                        <li>
                          Extra (sin IVA): {formatNumber(example.litrosExtra)} L ×{' '}
                          {formatCurrency(example.precioSinIva)}, total{' '}
                          {formatCurrency(example.extra)}.
                        </li>
                      </>
                    )}
                    <li>Total del viaje: {formatCurrency(example.totalViaje)}.</li>
                  </ul>
                </article>

                <article className="example-block example-block--result">
                  <h3>Liquidacion</h3>
                  <div className="result-row">
                    <span>Total del viaje (bruto)</span>
                    <strong>{formatCurrency(example.totalViaje)}</strong>
                  </div>
                  <div className="result-row">
                    <span>Chofer ({CONSTANTS.porcentajeChofer}%)</span>
                    <strong>{formatCurrency(example.pagoChofer)}</strong>
                  </div>
                  <div className="result-row">
                    <span>Lucas ({CONSTANTS.comisionLucasPorcentaje}%)</span>
                    <strong>{formatCurrency(example.comisionLucas)}</strong>
                  </div>
                  <div className="result-row result-row--neto">
                    <span>Neto Transporte Zafe</span>
                    <strong>{formatCurrency(example.netoViaje)}</strong>
                  </div>
                </article>
              </div>
            </section>
          ))}

          <section className="card notice">
            <h2>Aclaraciones</h2>
            <ul>
              <li>Valuacion: base con IVA, extras sin IVA.</li>
              <li>Traslados: se reconocen aparte con 32 L/100 km recorridos.</li>
              <li>Viajes maximos: 15 km.</li>
              <li>
                El costo real del gasoil consumido no esta incluido: se descuenta cuando se conozca
                el consumo efectivo.
              </li>
            </ul>
          </section>
        </div>
      </main>
    </div>
  )
}

export default App
