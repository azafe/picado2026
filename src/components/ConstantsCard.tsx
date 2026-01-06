import { CONSTANTS } from '../helpers/calc'

export function ConstantsCard() {
  return (
    <section className="card">
      <header className="card__header">
        <h2>Constantes del sistema</h2>
        <p>Valores fijos usados en las formulas.</p>
      </header>

      <div className="constants">
        <div>
          <span>Factor base</span>
          <strong>{CONSTANTS.factorBase.toFixed(2)}</strong>
        </div>
        <div>
          <span>Kilometros incluidos</span>
          <strong>{CONSTANTS.kmIncluidos} km</strong>
        </div>
        <div>
          <span>Viaje maximo</span>
          <strong>{CONSTANTS.kmMaximo} km</strong>
        </div>
        <div>
          <span>Litros por km extra</span>
          <strong>{CONSTANTS.litrosPorKmExtra.toFixed(2)} L</strong>
        </div>
        <div>
          <span>IVA gasoil</span>
          <strong>{CONSTANTS.ivaGasoil}%</strong>
        </div>
        <div>
          <span>Comision Lucas</span>
          <strong>{CONSTANTS.comisionLucasPorcentaje}%</strong>
        </div>
        <div>
          <span>Porcentaje chofer</span>
          <strong>{CONSTANTS.porcentajeChofer}%</strong>
        </div>
      </div>
    </section>
  )
}
