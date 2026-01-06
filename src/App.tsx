import { useEffect, useMemo, useState } from 'react'
import './App.css'
import { CalculatorForm } from './components/CalculatorForm'
import { ConstantsCard } from './components/ConstantsCard'
import { DayHistory } from './components/DayHistory'
import { ResultsPanel } from './components/ResultsPanel'
import {
  calcFuelCost,
  calcDayTotalsFromHistory,
  calcDayTotalsFromMultiplier,
  calcTrip,
  createHistoryEntry,
  CONSTANTS,
  type FuelCostMode,
  type HistoryEntry,
  type TripInput,
} from './helpers/calc'

const STORAGE_KEY = 'picado2026_history'

const defaultForm: TripInput & {
  viajesDia: number
  litrosGasoilRecibidosDia: number
  incluirCostoCombustible: boolean
  modoConsumo: FuelCostMode
  consumoPorcentaje: number
  litrosConsumidosViaje: number
} = {
  m3: 45,
  kmViaje: 4,
  precioConIva: 1415,
  iva: 21,
  porcentajeComision: 4,
  porcentajeChofer: 0,
  viajesDia: 1,
  litrosGasoilRecibidosDia: 0,
  incluirCostoCombustible: false,
  modoConsumo: 'porcentaje',
  consumoPorcentaje: 0,
  litrosConsumidosViaje: 0,
}

const readHistory = (): HistoryEntry[] => {
  if (typeof window === 'undefined') return []
  const raw = window.localStorage.getItem(STORAGE_KEY)
  if (!raw) return []
  try {
    const parsed = JSON.parse(raw) as HistoryEntry[]
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

const createId = () => {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID()
  }
  return `trip-${Date.now()}-${Math.round(Math.random() * 1000)}`
}

function App() {
  const [form, setForm] = useState(defaultForm)
  const [history, setHistory] = useState<HistoryEntry[]>(readHistory)
  const [kmViajeClamped, setKmViajeClamped] = useState(false)

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(history))
  }, [history])

  const tripCalc = useMemo(
    () =>
      calcTrip({
        m3: form.m3,
        kmViaje: form.kmViaje,
        precioConIva: form.precioConIva,
        iva: form.iva,
        porcentajeComision: form.porcentajeComision,
        porcentajeChofer: form.porcentajeChofer,
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

  const usingHistory = history.length > 0
  const dayTotals = useMemo(
    () =>
      usingHistory
        ? calcDayTotalsFromHistory(history, form.litrosGasoilRecibidosDia, form.precioConIva)
        : calcDayTotalsFromMultiplier(
            tripCalc,
            form.viajesDia,
            form.litrosGasoilRecibidosDia,
            form.precioConIva
          ),
    [history, form.litrosGasoilRecibidosDia, form.precioConIva, form.viajesDia, tripCalc, usingHistory]
  )

  const hasNegative = [
    form.m3,
    form.kmViaje,
    form.precioConIva,
    form.iva,
    form.porcentajeComision,
    form.porcentajeChofer,
    form.viajesDia,
    form.litrosGasoilRecibidosDia,
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

  const handleSaveTrip = () => {
    const entry = createHistoryEntry(
      {
        m3: form.m3,
        kmViaje: form.kmViaje,
        precioConIva: form.precioConIva,
        iva: form.iva,
        porcentajeComision: form.porcentajeComision,
        porcentajeChofer: form.porcentajeChofer,
      },
      tripCalc,
      new Date().toLocaleString('es-AR'),
      createId()
    )
    setHistory((prev) => [entry, ...prev])
  }

  const handleClearHistory = () => {
    setHistory([])
  }

  const handleExample = (kmViaje: number) => {
    setKmViajeClamped(false)
    setForm((prev) => ({
      ...prev,
      m3: 45,
      kmViaje,
      precioConIva: 1415,
      iva: 21,
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
              <h2>Como se calcula el viaje</h2>
              <p>Reglas claras para entender el valor del viaje.</p>
            </header>
            <div className="rules">
              <div>
                <strong>Si el viaje es de 0 a 4 km:</strong> se paga solo la BASE, valuada con
                gasoil CON IVA.
                <pre className="formula">{`BASE: litros_base = 0.55 * m3
$base = litros_base * precio_gasoil_con_iva`}</pre>
              </div>
              <div>
                <strong>Si el viaje supera 4 km (hasta 15):</strong> se paga BASE (con IVA) + EXTRA
                por km excedente, valuado con gasoil SIN IVA.
                <pre className="formula">{`EXTRA: km_extra = max(0, km_viaje - 4)
litros_extra = km_extra * 4.5
precio_sin_iva = precio_con_iva / (1 + iva/100)
$extra = litros_extra * precio_sin_iva`}</pre>
              </div>
              <div>
                <strong>TOTAL VIAJE:</strong>
                <pre className="formula">{`total_viaje = $base + $extra`}</pre>
              </div>
            </div>
          </section>

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
              <p>En 3 km: extra = 0.</p>
              <p>En 12 km: extra por 8 km.</p>
            </div>
          </section>
          <CalculatorForm
            form={form}
            onChange={handleChange}
            hasNegative={hasNegative}
            kmViajeClamped={kmViajeClamped}
          />
          <ConstantsCard />
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
            dayTotals={dayTotals}
            usingHistory={usingHistory}
            viajesDia={form.viajesDia}
          />
          <DayHistory
            history={history}
            onSaveTrip={handleSaveTrip}
            onClear={handleClearHistory}
            dayTotals={dayTotals}
            viajesDia={form.viajesDia}
            litrosRecibidos={form.litrosGasoilRecibidosDia}
          />
        </div>
      </main>
    </div>
  )
}

export default App
