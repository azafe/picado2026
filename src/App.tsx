import { useEffect, useMemo, useState } from 'react'
import './App.css'
import { CalculatorForm } from './components/CalculatorForm'
import { ConstantsCard } from './components/ConstantsCard'
import { DayHistory } from './components/DayHistory'
import { ResultsPanel } from './components/ResultsPanel'
import {
  calcDayTotalsFromHistory,
  calcDayTotalsFromMultiplier,
  calcTrip,
  createHistoryEntry,
  type HistoryEntry,
  type TripInput,
} from './helpers/calc'

const STORAGE_KEY = 'picado2026_history'

const defaultForm: TripInput & {
  viajesDia: number
  litrosGasoilRecibidosDia: number
} = {
  m3: 45,
  kmViaje: 4,
  kmTraslado: 0,
  precioConIva: 1415,
  iva: 21,
  porcentajeComision: 4,
  porcentajeChofer: 0,
  litrosPor100kmTraslado: 32,
  viajesDia: 1,
  litrosGasoilRecibidosDia: 0,
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

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(history))
  }, [history])

  const tripCalc = useMemo(
    () =>
      calcTrip({
        m3: form.m3,
        kmViaje: form.kmViaje,
        kmTraslado: form.kmTraslado,
        precioConIva: form.precioConIva,
        iva: form.iva,
        porcentajeComision: form.porcentajeComision,
        porcentajeChofer: form.porcentajeChofer,
        litrosPor100kmTraslado: form.litrosPor100kmTraslado,
      }),
    [form]
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

  const hasNegative = Object.values(form).some((value) => value < 0)

  const handleChange = (field: keyof typeof form, value: number) => {
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
        kmTraslado: form.kmTraslado,
        precioConIva: form.precioConIva,
        iva: form.iva,
        porcentajeComision: form.porcentajeComision,
        porcentajeChofer: form.porcentajeChofer,
        litrosPor100kmTraslado: form.litrosPor100kmTraslado,
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

  return (
    <div className="app">
      <header className="hero">
        <div className="hero__badge">Picado 2025/2026</div>
        <h1>Transporte Zafe - Calculadora de Viajes</h1>
        <p>
          Calculadora rapida para estimar valores brutos, netos y el balance diario de gasoil con
          valuacion mixta.
        </p>
      </header>

      <main className="layout">
        <div className="column">
          <CalculatorForm form={form} onChange={handleChange} hasNegative={hasNegative} />
          <ConstantsCard />
          <section className="card notice">
            <h2>Aclaraciones</h2>
            <ul>
              <li>Traslado 32 L/100 km: acuerdo operativo (no figura en el documento contractual).</li>
              <li>Valuacion: base con IVA, extras y traslados sin IVA.</li>
            </ul>
          </section>
        </div>

        <div className="column">
          <ResultsPanel
            tripCalc={tripCalc}
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
