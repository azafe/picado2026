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
                  <h3>Datos</h3>
                  <ul>
                    <li>m3: {example.m3}</li>
                    <li>km: {example.kmViaje}</li>
                    <li>gasoil con IVA: {formatCurrency(example.precioConIva)}</li>
                  </ul>
                </article>

                <article className="example-block">
                  <h3>Calculo</h3>
                  <ul>
                    <li>
                      litros_base = {CONSTANTS.factorBase} * {example.m3} ={' '}
                      {formatNumber(example.litrosBase)}
                    </li>
                    <li>
                      $base = {formatNumber(example.litrosBase)} *{' '}
                      {formatCurrency(example.precioConIva)} = {formatCurrency(example.base)}
                    </li>
                    <li>
                      km_extra ={' '}
                      {example.kmExtra > 0
                        ? `${example.kmViaje} - ${CONSTANTS.kmIncluidos} = ${formatNumber(
                            example.kmExtra
                          )}`
                        : '0'}
                    </li>
                    <li>
                      litros_extra ={' '}
                      {example.kmExtra > 0
                        ? `${formatNumber(example.kmExtra)} * ${
                            CONSTANTS.litrosPorKmExtra
                          } = ${formatNumber(example.litrosExtra)}`
                        : '0'}
                    </li>
                    <li>
                      precio_sin_iva = {formatCurrency(example.precioSinIva)}
                    </li>
                    <li>$extra = {formatCurrency(example.extra)}</li>
                  </ul>
                </article>

                <article className="example-block example-block--result">
                  <h3>Resultado final</h3>
                  <div className="result-big">
                    <span>Total del viaje (bruto)</span>
                    <strong>{formatCurrency(example.totalViaje)}</strong>
                  </div>
                  <div className="result-split">
                    <span>{CONSTANTS.porcentajeChofer}% Chofer</span>
                    <strong>{formatCurrency(example.pagoChofer)}</strong>
                  </div>
                  <div className="result-split">
                    <span>{CONSTANTS.comisionLucasPorcentaje}% Lucas</span>
                    <strong>{formatCurrency(example.comisionLucas)}</strong>
                  </div>
                  <div className="result-neto">
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
            </ul>
          </section>
        </div>
      </main>
    </div>
  )
}

export default App
