import type { TripInput } from '../helpers/calc'

type CalculatorFormProps = {
  form: TripInput & {
    viajesDia: number
    litrosGasoilRecibidosDia: number
  }
  onChange: (field: keyof CalculatorFormProps['form'], value: number) => void
  hasNegative: boolean
}

const clampInput = (value: string) => {
  if (value.trim() === '') return 0
  const parsed = Number.parseFloat(value)
  return Number.isNaN(parsed) ? 0 : parsed
}

export function CalculatorForm({ form, onChange, hasNegative }: CalculatorFormProps) {
  return (
    <section className="card">
      <header className="card__header">
        <h2>Datos del viaje</h2>
        <p>Calcula el total bruto, neto y el desglose por litros.</p>
      </header>

      {hasNegative ? (
        <div className="alert">No se permiten valores negativos. Ajusta los campos marcados.</div>
      ) : null}

      <div className="form-grid">
        <label className="field">
          <span>M3 transportados</span>
          <input
            type="number"
            min={0}
            step={0.1}
            value={form.m3}
            onChange={(event) => onChange('m3', clampInput(event.target.value))}
          />
        </label>

        <label className="field">
          <span>Kilometros del viaje</span>
          <input
            type="number"
            min={0}
            step={0.1}
            value={form.kmViaje}
            onChange={(event) => onChange('kmViaje', clampInput(event.target.value))}
          />
        </label>

        <label className="field">
          <span>Kilometros de traslado</span>
          <input
            type="number"
            min={0}
            step={0.1}
            value={form.kmTraslado}
            onChange={(event) => onChange('kmTraslado', clampInput(event.target.value))}
          />
          <small>Se valua sin IVA.</small>
        </label>

        <label className="field">
          <span>Litros por 100 km (traslado)</span>
          <input
            type="number"
            min={0}
            step={0.1}
            value={form.litrosPor100kmTraslado}
            onChange={(event) => onChange('litrosPor100kmTraslado', clampInput(event.target.value))}
          />
          <small>Valor operativo configurable.</small>
        </label>

        <label className="field">
          <span>Comision Lucas (%)</span>
          <input
            type="number"
            min={0}
            step={0.1}
            value={form.porcentajeComision}
            onChange={(event) => onChange('porcentajeComision', clampInput(event.target.value))}
          />
        </label>

        <label className="field">
          <span>Porcentaje chofer (%)</span>
          <input
            type="number"
            min={0}
            step={0.1}
            value={form.porcentajeChofer}
            onChange={(event) => onChange('porcentajeChofer', clampInput(event.target.value))}
          />
        </label>
      </div>

      <div className="card__divider" />

      <header className="card__header">
        <h2>Datos del dia (gasoil recibido)</h2>
        <p>Se usan para las metricas diarias y el balance de gasoil.</p>
      </header>

      <div className="form-grid">
        <label className="field">
          <span>Precio gasoil con IVA ($)</span>
          <input
            type="number"
            min={0}
            step={1}
            value={form.precioConIva}
            onChange={(event) => onChange('precioConIva', clampInput(event.target.value))}
          />
        </label>

        <label className="field">
          <span>IVA (%)</span>
          <input
            type="number"
            min={0}
            step={0.1}
            value={form.iva}
            onChange={(event) => onChange('iva', clampInput(event.target.value))}
          />
        </label>

        <label className="field">
          <span>Viajes del dia</span>
          <input
            type="number"
            min={0}
            step={1}
            value={form.viajesDia}
            onChange={(event) => onChange('viajesDia', clampInput(event.target.value))}
          />
          <small>Se usa si no hay historial cargado.</small>
        </label>

        <label className="field">
          <span>Litros recibidos en el dia</span>
          <input
            type="number"
            min={0}
            step={0.1}
            value={form.litrosGasoilRecibidosDia}
            onChange={(event) => onChange('litrosGasoilRecibidosDia', clampInput(event.target.value))}
          />
          <small>Para calcular gasoil disponible.</small>
        </label>
      </div>
    </section>
  )
}
