import { useState, useEffect } from 'react';
import RegistroForm from './componentes/RegistroForm';
import VehicleForm from './componentes/VehicleForm';
import ReportTable from './componentes/ReportTable';
import Register from './flejes/Register';
import * as XLSX from 'xlsx';
import './componentes/styles/stylesApp.css';
import { Routes, Route, Link } from 'react-router-dom';

function App() {
  const [inventario, setInventario] = useState(() => {
    const saved = localStorage.getItem('inventario');
    return saved
      ? JSON.parse(saved)
      : { desinfectante: 0, desengrasante: 0, blanqueador: 0 };
  });

  const [vehiculos, setVehiculos] = useState(() => {
    const saved = localStorage.getItem('vehiculos');
    return saved ? JSON.parse(saved) : [];
  });

  const [setDatosVehiculo] = useState(null);
  const [fechaSemana, setFechaSemana] = useState('');

  useEffect(() => {
    localStorage.setItem('vehiculos', JSON.stringify(vehiculos));
  }, [vehiculos]);
  useEffect(() => {
    localStorage.setItem('inventario', JSON.stringify(inventario));
  }, [inventario]);

  // ---- Inventario ----
  const agregarInventario = (nuevo) => {
    setInventario({
      desinfectante: inventario.desinfectante + (nuevo.desinfectante || 0),
      desengrasante: inventario.desengrasante + (nuevo.desengrasante || 0),
      blanqueador: inventario.blanqueador + (nuevo.blanqueador || 0),
    });
  };

  const limpiarInventario = () => {
    if (window.confirm('¿Deseas limpiar todo el inventario?')) {
      setInventario({ desinfectante: 0, desengrasante: 0, blanqueador: 0 });
      localStorage.removeItem('inventario');
    }
  };

  // ---- Vehículos ----
  const agregarVehiculo = (vehiculo) => {
    setInventario({
      desinfectante: inventario.desinfectante - (vehiculo.desinfectante || 0),
      desengrasante: inventario.desengrasante - (vehiculo.desengrasante || 0),
      blanqueador: inventario.blanqueador - (vehiculo.blanqueador || 0),
    });
    setVehiculos([...vehiculos, vehiculo]);
    setDatosVehiculo(vehiculo);
  };

  const eliminarVehiculo = (index) => {
    const v = vehiculos[index];
    setInventario({
      desinfectante: inventario.desinfectante + (v.desinfectante || 0),
      desengrasante: inventario.desengrasante + (v.desengrasante || 0),
      blanqueador: inventario.blanqueador + (v.blanqueador || 0),
    });
    setVehiculos(vehiculos.filter((_, i) => i !== index));
  };

  // ---- Exportar Excel ----
  const exportarExcel = () => {
    let inicio, fin;
    if (fechaSemana) {
      inicio = new Date(`${fechaSemana}T00:00:00`);
    } else {
      const hoy = new Date();
      const day = (hoy.getDay() + 6) % 7;
      inicio = new Date(hoy);
      inicio.setDate(hoy.getDate() - day);
      inicio.setHours(0, 0, 0, 0);
    }
    fin = new Date(inicio);
    fin.setDate(inicio.getDate() + 6);
    fin.setHours(23, 59, 59, 999);

    const parseFecha = (yyyy_mm_dd) => new Date(`${yyyy_mm_dd}T00:00:00`);
    const semana = vehiculos.filter(
      (v) =>
        v.fecha && parseFecha(v.fecha) >= inicio && parseFecha(v.fecha) <= fin
    );

    const data = semana.map((v, idx) => ({
      '#': idx + 1,
      Fecha: v.fecha,
      Tipo: v.tipo,
      'Agua (L)': Number(v.agua || 0),
      'Desinfectante (L)': Number(v.desinfectante || 0),
      'Desengrasante (L)': Number(v.desengrasante || 0),
      'Blanqueador (L)': Number(v.blanqueador || 0),
    }));

  const totales = {
    agua: 0,
    desinfectante: 0,
    desengrasante: 0,
    blanqueador: 0
  };

  if (semana) {
    for (const v of semana) {
      totales.agua += Number(v.agua || 0);
      totales.desinfectante += Number(v.desinfectante || 0);
      totales.desengrasante += Number(v.desengrasante || 0);
      totales.blanqueador += Number(v.blanqueador || 0);
    }
  }

  data.push({
    '#': '',
    Fecha: '',
    Tipo: 'TOTAL SEMANA',
    'Agua (L)': totales.agua,
    'Desinfectante (L)': totales.desinfectante,
    'Desengrasante (L)': totales.desengrasante,
    'Blanqueador (L)': totales.blanqueador,
  });

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Semana');

    const yyyy_mm_dd = (d) => d.toISOString().slice(0, 10);
    XLSX.writeFile(
      wb,
      `Reporte_Semanal_${yyyy_mm_dd(inicio)}_a_${yyyy_mm_dd(fin)}.xlsx`
    );
  };

  const limpiarTablaVehiculos = () => {
    if (window.confirm('¿Deseas eliminar todos los registros de vehículos?')) {
      setVehiculos([]); // Limpia los vehículos
      setDatosVehiculo(null); // Limpia los detalles del vehículo seleccionado
    }
  };

  // --- DASHBOARD COMPONENTE ---
  const Dashboard = () => (
    <section>
      <header className="Header_Cont">
        <h1 className="Header">Autolavado San Diego</h1>

        {/* BOTÓN RESPONSIVE PARA IR A REGISTER */}
        <Link to="/register">
          <button className="app-btn-primary">Ir a Registro de Flejes</button>
        </Link>
      </header>

      <div className="Body_Page">
        <RegistroForm
          inventario={inventario}
          agregarInventario={agregarInventario}
        />
        <button onClick={limpiarInventario} className="Button_clear">
          Eliminar Inventario
        </button>

        <VehicleForm onSelect={agregarVehiculo} />
        <ReportTable
          data={vehiculos}
          inventario={inventario}
          eliminarVehiculo={eliminarVehiculo}
        />
        <button onClick={limpiarTablaVehiculos} className="Button_clear">
          Eliminar Tabla de Vehículos
        </button>

        <div>
          <label>Selecciona inicio de semana: </label>
          <input
            type="date"
            value={fechaSemana || ''}
            className="input_date"
            onChange={(e) => setFechaSemana(e.target.value)}
          />
        </div>

        <button onClick={exportarExcel} className="Export_Btn">
          Exportar Excel Semanal
        </button>
      </div>
    </section>
  );

  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/register" element={<Register />} />
    </Routes>
  );
}

export default App;
