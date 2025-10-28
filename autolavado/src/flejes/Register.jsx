import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './stylesRegister.css'; // <-- CSS puro
import * as XLSX from 'xlsx';


export default function Register() {
  const [registros, setRegistros] = useState([]);
  const [chofer, setChofer] = useState('');
  const [fecha, setFecha] = useState('');
  const [tipoCarro, setTipoCarro] = useState('');
  const [quienLoLavo, setQuienLoLavo] = useState('');
  const [placasTracto, setPlacasTracto] = useState('');
  const [flejeInicial, setFlejeInicial] = useState('');
  const [flejeFinal, setFlejeFinal] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const registrosGuardados = localStorage.getItem('registrosDeFlejes');
    if (registrosGuardados) setRegistros(JSON.parse(registrosGuardados));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');

    const flejeInicialNum = parseInt(flejeInicial);
    const flejeFinalNum = parseInt(flejeFinal);

    if (flejeFinalNum < flejeInicialNum) {
      setErrorMsg('El "Fleje Final" debe ser mayor o igual al "Fleje Inicial".');
      return;
    }

    if (isNaN(flejeInicialNum) || isNaN(flejeFinalNum)) {
      setErrorMsg('Los valores de los flejes deben ser números.');
      return;
    }

    const totalUsados = (flejeFinalNum - flejeInicialNum) + 1;

    const nuevoRegistro = {
      chofer,
      fecha,
      tipoCarro,
      quienLoLavo,
      placasTracto,
      flejeInicial: flejeInicialNum,
      flejeFinal: flejeFinalNum,
      totalUsados
    };

    const nuevosRegistros = [...registros, nuevoRegistro];
    setRegistros(nuevosRegistros);
    localStorage.setItem('registrosDeFlejes', JSON.stringify(nuevosRegistros));

    setChofer('');
    setFecha('');
    setTipoCarro('');
    setQuienLoLavo('');
    setPlacasTracto('');
    setFlejeInicial('');
    setFlejeFinal('');
  };

  const handleExport = () => {
  if (registros.length === 0) {
    setErrorMsg('No hay registros para exportar.');
    return;
  }


  const wsData = registros.map((r, i) => ({
    '#': i + 1,
    'Chofer': r.chofer,
    'Fecha': r.fecha,
    'Tipo de Carro': r.tipoCarro,
    'Lavado Por': r.quienLoLavo,
    'Placas': r.placasTracto,
    'Fleje Inicial': r.flejeInicial,
    'Fleje Final': r.flejeFinal,
    'Total Usados': r.totalUsados
  }));

  const worksheet = XLSX.utils.json_to_sheet(wsData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'MonitoreoFlejes');

  XLSX.writeFile(workbook, 'monitoreo_flejes.xlsx');
};
const handleEliminar = (index) => {
  const nuevosRegistros = registros.filter((_, i) => i !== index);
  setRegistros(nuevosRegistros);
  localStorage.setItem('registrosDeFlejes', JSON.stringify(nuevosRegistros));
};

const limpiarTablaRegistros = () => {
  if (window.confirm('¿Deseas eliminar todos los registros de flejes?')) {
    setRegistros([]); // Vacía la tabla
    localStorage.removeItem('registrosDeFlejes'); // Opcional: también limpiar localStorage
  }
};

  return (
    <div className="register-container">
      <Link to="/">
        <button className="register-btn register-back">Volver al Dashboard</button>
      </Link>

      <div className="register-box">
        <h1 className="register-title">Registro de Monitoreo de Flejes</h1>

        <form onSubmit={handleSubmit} className="register-form">
          <div className="form-grid-3">
            <input type="text" placeholder="Nombre del Chofer" value={chofer} onChange={e => setChofer(e.target.value)} className="register-input" required />
            <input type="date" value={fecha} onChange={e => setFecha(e.target.value)} className="register-input" required />
            <input type="text" placeholder="Tipo de Carro" value={tipoCarro} onChange={e => setTipoCarro(e.target.value)} className="register-input" required />
          </div>

          <div className="form-grid-2">
            <input type="text" placeholder="¿Quién lo Lavó?" value={quienLoLavo} onChange={e => setQuienLoLavo(e.target.value)} className="register-input" required />
            <input type="text" placeholder="Placas del Tracto" value={placasTracto} onChange={e => setPlacasTracto(e.target.value)} className="register-input" required />
          </div>

          <div className="form-grid-2">
            <input type="number" placeholder="Fleje Inicial" value={flejeInicial} onChange={e => setFlejeInicial(e.target.value)} className="register-input" required />
            <input type="number" placeholder="Fleje Final" value={flejeFinal} onChange={e => setFlejeFinal(e.target.value)} className="register-input" required />
          </div>

          {errorMsg && <div className="register-error">{errorMsg}</div>}

          <button type="submit" className="register-btn">Agregar Registro</button>
        </form>

        {registros.length > 0 && (
          <table className="register-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Chofer</th>
                <th>Fecha</th>
                <th>Carro</th>
                <th>Lavado Por</th>
                <th>Placas</th>
                <th>Fleje Inicial</th>
                <th>Fleje Final</th>
                <th>Total Usados</th>
                        <th>Eliminar</th>
              </tr>
            </thead>
            <tbody>
              {registros.map((r, i) => (
                <tr key={i}>
                  <td>{i + 1}</td>
                  <td>{r.chofer}</td>
                  <td>{r.fecha}</td>
                  <td>{r.tipoCarro}</td>
                  <td>{r.quienLoLavo}</td>
                  <td>{r.placasTracto}</td>
                  <td>{r.flejeInicial}</td>
                  <td>{r.flejeFinal}</td>
                  <td>{r.totalUsados}</td>
                    <td>
            <button 
              onClick={() => handleEliminar(i)} 
            >
              Eliminar
            </button>
          </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        <button onClick={handleExport} className="register-btn" style={{backgroundColor:'#16a34a', marginTop:'1rem'}}>Exportar</button>
      
      <button 
  onClick={limpiarTablaRegistros} 
  className="register-btn" 
  style={{backgroundColor:'#dc2626', marginTop:'1rem'}}
>
  Eliminar Todos los Registros
</button>
      
      </div>
    </div>
  );
}
