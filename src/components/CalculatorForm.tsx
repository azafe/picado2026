import type { FuelCostMode, TripInput } from '../helpers/calc'

type CalculatorFormProps = {
  form: TripInput & {
    viajesDia: number
    litrosGasoilRecibidosDia: number
    incluirCostoCombustible: boolean
    modoConsumo: FuelCostMode
    consumoPorcentaje: number
    litrosConsumidosViaje: number
  }
  onChange: (
    field: keyof CalculatorFormProps['form'],
    value: number | boolean | FuelCostMode
  ) => void
  hasNegative: boolean
  kmViajeClamped: boolean
}

const clampInput = (value: string) => {
  if (value.trim() === '') return 0
  const parsed = Number.parseFloat(value)
  return Number.isNaN(parsed) ? 0 : parsed
}

export function CalculatorForm({
  form,
  onChange,
  hasNegative,
  kmViajeClamped,
}: CalculatorFormProps) {
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
          <span>m3 transportados por capacidad de batea (m3)</span>
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
            max={15}
            step={0.1}
            value={form.kmViaje}
            onChange={(event) => onChange('kmViaje', clampInput(event.target.value))}
          />
          {kmViajeClamped ? <small className="warning">Se aplico el limite de 15 km.</small> : null}
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

      <div className="card__divider" />

      <header className="card__header">
        <h2>Costo de combustible (para margen real)</h2>
        <p>Opcional: suma el costo de combustible para estimar el margen real.</p>
      </header>

      <label className="toggle">
        <input
          type="checkbox"
          checked={form.incluirCostoCombustible}
          onChange={(event) => onChange('incluirCostoCombustible', event.target.checked)}
        />
        Incluir costo de combustible en el margen
      </label>

      {form.incluirCostoCombustible ? (
        <div className="form-grid">
          <label className="field">
            <span>Modo de consumo</span>
            <select
              value={form.modoConsumo}
              onChange={(event) => onChange('modoConsumo', event.target.value as FuelCostMode)}
            >
              <option value="porcentaje">% sobre litros reconocidos</option>
              <option value="litros">Litros consumidos por viaje</option>
            </select>
          </label>

          {form.modoConsumo === 'porcentaje' ? (
            <label className="field">
              <span>Consumo (%)</span>
              <input
                type="number"
                min={0}
                step={0.1}
                value={form.consumoPorcentaje}
                onChange={(event) => onChange('consumoPorcentaje', clampInput(event.target.value))}
              />
            </label>
          ) : (
            <label className="field">
              <span>Litros consumidos por viaje</span>
              <input
                type="number"
                min={0}
                step={0.1}
                value={form.litrosConsumidosViaje}
                onChange={(event) =>
                  onChange('litrosConsumidosViaje', clampInput(event.target.value))
                }
              />
            </label>
          )}
        </div>
      ) : null}
    </section>
  )
}
