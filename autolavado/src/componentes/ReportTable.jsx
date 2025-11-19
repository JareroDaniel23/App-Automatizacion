/* Todo Migrarlo a una libreria de tablas como react-table */
import './styles/ReportTable.css'
export default function ReportTable({ data, eliminarVehiculo }) {
  if (!data) return null;

  {
    /* TODO: Separar dependencias  (crear un archivo que sea utils o tableFunctions) */
  }
  {
    /* TODO: Crear una funcion reutilizable para no repetir el reduce  */
    
  }

  const totalAgua = data.reduce((sum, d) => sum + Number(d.agua || 0), 0);
  const totalDesinfectante = data.reduce(
    (sum, d) => sum + Number(d.desinfectante || 0),
    0
  );
  const totalDesengrasante = data.reduce(
    (sum, d) => sum + Number(d.desengrasante || 0),
    0
  );
  const totalBlanqueador = data.reduce(
    (sum, d) => sum + Number(d.blanqueador || 0),
    0
  );

  {/* TODO: Tiende a fallar por que que pasaria si d.tipo no es valor valido? */}
  const conteoTipos = {};
  data.forEach((d) => {
    const tipo = d.tipo || "Sin tipo";
    conteoTipos[tipo] = (conteoTipos[tipo] || 0) + 1;
  });

  return (
    <div className="Report-Container">
      <h2>Reporte de Vehículos</h2>
      <div className="Table-Wrapper">
      <table className="Report-Table">
        <thead>
          <tr>
            <th>Fecha</th>
            <th>Tipo de Vehículo</th>
            <th>Agua (L)</th>
            <th>Desinfectante (mL)</th>
            <th>Desengrasante (mL)</th>
            <th>Blanqueador (mL)</th>
            <th>Total Vehículos por Tipo</th>
            <th>Eliminar</th>
          </tr>
        </thead>
        <tbody>
          {data.map((d, i) => (
            <tr key={i}>
              <td>{d.fecha || ''}</td>
              <td>{d.tipo || ''}</td>
              <td>{Number(d.agua || 0).toFixed(2)}</td>
              <td>{Math.round(Number(d.desinfectante || 0) * 1000)}</td>
              <td>{Math.round(Number(d.desengrasante || 0) * 1000)}</td>
              <td>{Math.round(Number(d.blanqueador || 0) * 1000)}</td>
              <td>{conteoTipos[d.tipo] || 0}</td>
              <td>
                <button onClick={() => eliminarVehiculo(i)} className='Delete-Button'>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan="2">
              <b>Totales Gastados</b>
            </td>
            <td>{totalAgua.toFixed(2)}</td>
            {/* TODO: Crear un formateador */}
            <td>{Math.round(totalDesinfectante * 1000)}</td>
            <td>{Math.round(totalDesengrasante * 1000)}</td>
            <td>{Math.round(totalBlanqueador * 1000)}</td>
            <td>-</td>
            <td>-</td>
          </tr>
        </tfoot>
      </table>
      </div>
    </div>
  );
}
