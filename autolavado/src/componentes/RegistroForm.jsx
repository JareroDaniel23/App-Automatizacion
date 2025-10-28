import React, { useState } from "react";
import './styles/RecordForm.css'

export default function RegistroForm({ agregarInventario, inventario }) {
  const [desinfectante, setDesinfectante] = useState("");
  const [desengrasante, setDesengrasante] = useState("");
  const [blanqueador, setBlanqueador] = useState("");

  const agregar = () => {
    const nuevo = {
      desinfectante: Number(desinfectante) || 0,
      desengrasante: Number(desengrasante) || 0,
      blanqueador: Number(blanqueador) || 0,
    };

    agregarInventario(nuevo);

    // Limpiar campos
    setDesinfectante("");
    setDesengrasante("");
    setBlanqueador("")
  };

  return (
    <div>
      <div className="Title_inventary">
      <h3 className="Title_inventary-h1">Inventario Actual</h3>
      </div>

      <div className="Product_inventary">
        <h2>Producto en (L)</h2>
      </div>
      <div className="card">
        <div className="table_inventary desinfectante">
           <div className="Title_products">Desinfectante</div>
           <div className="Product-L">{inventario.desinfectante?.toFixed(1) ?? 0}</div>

          <div className="Title_products">Desengrasante</div>
          <div className="Product-L">{inventario.desengrasante?.toFixed(1) ?? 0}</div>

          <div className="Title_products">Blanqueador</div>
          <div className="Product-L">{inventario.blanqueador?.toFixed(1) ?? 0}</div>
        </div>
      </div>

    <div className="Header_2">
      <h2 className="Header_2-title">Agregar Nuevos Líquidos al Inventario</h2>
      </div>
            <div className="Table_1">
        <input 
        className="input_table"
          type="number"
          placeholder="Desinfectante (L)"
          value={desinfectante}
          onChange={(e) => setDesinfectante(e.target.value)}
        />
        <input
          type="number"
          className="input_table"
          placeholder="Desengrasante (L)"
          value={desengrasante}
          onChange={(e) => setDesengrasante(e.target.value)}
        />
        <input
          type="number"
          className="input_table"
          placeholder="Blanqueador (L)"
          value={blanqueador}
          onChange={(e) => setBlanqueador(e.target.value)}
        />
        
<button type="button" onClick={agregar} className="Add_button_table">
  Agregar
</button>
      </div>
    </div>
  );
}
