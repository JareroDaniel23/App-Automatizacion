
export default function SummaryPanel({ datos }) {
  if (!datos) return null;

  return (
    <div className="Consumos_estimados">
      <h2 className="Consumos_texto">Consumo Estimado</h2>
      <p>Tipo de vehículo: {datos.tipo || ""}</p>
      <p>Minutos de lavado: {datos.minutos || 0}</p>
      <p>Consumo de Agua: {Number(datos.agua || 0).toFixed(2)} L</p>
      <p>Desinfectante: {Math.round(Number(datos.desinfectante || 0) * 1000)} mL</p>
      <p>Desengrasante: {Math.round(Number(datos.desengrasante || 0) * 1000)} mL</p>
      <p>Blanqueador: {Math.round(Number(datos.blanqueador || 0) * 1000)} mL</p>
    </div>
  );
}
