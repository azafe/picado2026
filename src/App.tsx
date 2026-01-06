import { useMemo, useState } from 'react'
import './App.css'
import { CalculatorForm } from './components/CalculatorForm'
import { ConstantsCard } from './components/ConstantsCard'
import { ResultsPanel } from './components/ResultsPanel'
import {
  calcFuelCost,
  calcTrip,
  CONSTANTS,
  type FuelCostMode,
  type TripInput,
} from './helpers/calc'
import { formatLiters, formatNumber } from './helpers/format'

const defaultForm: TripInput & {
  incluirCostoCombustible: boolean
  modoConsumo: FuelCostMode
  consumoPorcentaje: number
  litrosConsumidosViaje: number
} = {
  m3: 45,
  kmViaje: 4,
  precioConIva: 1415,
  incluirCostoCombustible: false,
  modoConsumo: 'porcentaje',
  consumoPorcentaje: 0,
  litrosConsumidosViaje: 0,
}

function App() {
  const [form, setForm] = useState(defaultForm)
  const [kmViajeClamped, setKmViajeClamped] = useState(false)

  const tripCalc = useMemo(
    () =>
      calcTrip({
        m3: form.m3,
        kmViaje: form.kmViaje,
        precioConIva: form.precioConIva,
      }),
    [form]
  )

  const fuelCostCalc = useMemo(
    () =>
      calcFuelCost(tripCalc, {
        modo: form.modoConsumo,
        consumoPorcentaje: form.consumoPorcentaje,
        litrosConsumidosViaje: form.litrosConsumidosViaje,
        precioConIva: form.precioConIva,
      }),
    [
      form.consumoPorcentaje,
      form.litrosConsumidosViaje,
      form.modoConsumo,
      form.precioConIva,
      tripCalc,
    ]
  )

  const hasNegative = [
    form.m3,
    form.kmViaje,
    form.precioConIva,
    form.consumoPorcentaje,
    form.litrosConsumidosViaje,
  ].some((value) => value < 0)

  const handleChange = (
    field: keyof typeof form,
    value: number | boolean | FuelCostMode
  ) => {
    if (field === 'kmViaje' && typeof value === 'number') {
      const clamped = Math.min(CONSTANTS.kmMax, Math.max(0, value))
      setKmViajeClamped(value > CONSTANTS.kmMax)
      setForm((prev) => ({
        ...prev,
        [field]: clamped,
      }))
      return
    }

    if (typeof value === 'number') {
      setForm((prev) => ({
        ...prev,
        [field]: Math.max(0, value),
      }))
      return
    }

    setForm((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleExample = (kmViaje: number) => {
    setKmViajeClamped(false)
    setForm((prev) => ({
      ...prev,
      m3: 45,
      kmViaje,
      precioConIva: 1415,
    }))
  }

  return (
    <div className="app">
      <header className="hero">
        <div className="hero__badge">Picado 2025/2026</div>
        <h1>Calculadora de viajes</h1>
        <p>
          Calculadora rapida para estimar valores brutos, netos y el balance diario de gasoil con
          valuacion mixta.
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
                <strong>Hasta 4 km:</strong> se paga solo la BASE, calculada como 0,55 litros por
                m3, valuada con gasoil CON IVA.
              </p>
              <p>
                <strong>Mas de 4 km:</strong> se paga la BASE (con IVA) mas un EXTRA de 4,5 litros
                por cada km excedente, valuado con gasoil SIN IVA.
              </p>
            </div>
          </section>

          <ConstantsCard />

          <section className="card">
            <header className="card__header">
              <h2>Ejemplos rapidos</h2>
              <p>Dos escenarios listos para cargar en el formulario.</p>
            </header>
            <div className="button-row">
              <button type="button" className="button" onClick={() => handleExample(3)}>
                Ejemplo 3 km
              </button>
              <button type="button" className="button button--ghost" onClick={() => handleExample(12)}>
                Ejemplo 12 km
              </button>
            </div>
            <div className="example-results">
              {tripCalc.kmExtra === 0 ? (
                <p>En este caso no hay km extra.</p>
              ) : (
                <p>
                  En este caso hay {formatNumber(tripCalc.kmExtra)} km extra que generan{' '}
                  {formatLiters(tripCalc.litrosExtra)} adicionales.
                </p>
              )}
            </div>
          </section>
          <CalculatorForm
            form={form}
            onChange={handleChange}
            hasNegative={hasNegative}
            kmViajeClamped={kmViajeClamped}
          />
          <section className="card">
            <header className="card__header">
              <h2>Aclaracion sobre traslados</h2>
              <p>
                Los traslados entre campos/provincias NO forman parte del valor del viaje. Se
                reconocen/pagan aparte unicamente cuando ocurre un traslado (acuerdo operativo).
              </p>
            </header>
          </section>
          <section className="card notice">
            <h2>Aclaraciones</h2>
            <ul>
              <li>Valuacion: base con IVA, extras sin IVA.</li>
            </ul>
          </section>
        </div>

        <div className="column">
          <ResultsPanel
            tripCalc={tripCalc}
            fuelCostCalc={fuelCostCalc}
            includeFuelCost={form.incluirCostoCombustible}
          />
        </div>
      </main>
    </div>
  )
}

export default App
