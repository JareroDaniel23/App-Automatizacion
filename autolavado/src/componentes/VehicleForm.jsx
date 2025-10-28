import { useState } from "react";
import TipoVehiculo, { Consumo_litros_Agua_Por_Minuto } from "./data/Consumos";
import './styles/VehicleStyle.css';

export default function VehicleForm({ onSelect }) {
  const [tipo, setTipo] = useState("");
  const [minutos, setMinutos] = useState("");
  const [fecha, setFecha] = useState(""); // Fecha del lavado

  const handleSubmit = (e) => {
    e.preventDefault();
    const tipoDatos = TipoVehiculo.find((v) => v.tipo === tipo);
    if (!tipoDatos || !minutos || !fecha) return; // validar todos

    const agua = minutos * Consumo_litros_Agua_Por_Minuto;

    const desinfectante = tipoDatos.desinfectante
      ? Number(tipoDatos.desinfectante.replace(" mL", "")) / 1000
      : 0;

    const desengrasante = tipoDatos.desengrasante
      ? Number(tipoDatos.desengrasante.replace(" mL", "")) / 1000
      : 0;

    const blanqueador = tipoDatos.blanqueador
      ? Number(tipoDatos.blanqueador.replace(" mL", "")) / 1000
      : 0;

    onSelect({
      tipo,
      minutos,
      agua,
      desinfectante,
      desengrasante,
      blanqueador,
      fecha, // Guardamos la fecha
    });

    // Limpiar formulario
    setTipo("");
    setMinutos("");
    setFecha("");
  };

  return (
    <form onSubmit={handleSubmit} className="Form_Vehicle">
      <label className="Type-Vehicle">Tipo de Vehículo:</label>
      <select value={tipo} onChange={(e) => setTipo(e.target.value)} className="input_select" >
        <option value="" className="option_select">Selecciona</option>
        {TipoVehiculo.map((v) => (
          <option key={v.tipo} value={v.tipo}>
            {v.tipo}
          </option>
        ))}
      </select>

      <label className="Minutes">Minutos de lavado:</label>
      <input
      className="input_date"
        type="number"
        value={minutos}
        onChange={(e) => setMinutos(e.target.value)}
      />

      <label className="Day_of_wash">Fecha de lavado:</label>
      <input className="input_date"
        type="date"
        value={fecha}
        onChange={(e) => setFecha(e.target.value)}
      />

      <button type="submit" className="Add_Vehicle">Agregar Vehículo</button>
    </form>
  );
}
