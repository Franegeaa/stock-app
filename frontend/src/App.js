import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function StockApp() {
  const [producto, setProducto] = useState('');
  const [tipo, setTipo] = useState('Ingreso');
  const [cantidad, setCantidad] = useState('');
  const [usuario, setUsuario] = useState('');
  const [comentario, setComentario] = useState('');
  const [historial, setHistorial] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:3001/api/stock')
      .then(res => setHistorial(res.data))
      .catch(err => console.error(err));
  }, []);

  const guardar = () => {
    if (!producto || !cantidad || !usuario) return;

    axios.post('http://localhost:3001/api/stock', {
      producto,
      tipo,
      cantidad: parseInt(cantidad),
      usuario,
      comentario
    }).then(() => {
      setProducto('');
      setCantidad('');
      setUsuario('');
      setComentario('');
      return axios.get('http://localhost:3001/api/stock');
    }).then(res => setHistorial(res.data));
  };

  return (
    <div className="container my-4">
      <h2 className="mb-4">Gestión de Stock</h2>
      <div className="row g-2 align-items-end mb-4">
        <div className="col-md">
          <label className="form-label">Producto</label>
          <input type="text" className="form-control" value={producto} onChange={e => setProducto(e.target.value)} />
        </div>
        <div className="col-md">
          <label className="form-label">Tipo</label>
          <select className="form-select" value={tipo} onChange={e => setTipo(e.target.value)}>
            <option>Ingreso</option>
            <option>Egreso</option>
          </select>
        </div>
        <div className="col-md">
          <label className="form-label">Cantidad</label>
          <input type="number" className="form-control" value={cantidad} onChange={e => setCantidad(e.target.value)} />
        </div>
        <div className="col-md">
          <label className="form-label">Tu nombre</label>
          <input type="text" className="form-control" value={usuario} onChange={e => setUsuario(e.target.value)} />
        </div>
        <div className="col-md">
          <label className="form-label">Comentario</label>
          <input type="text" className="form-control" value={comentario} onChange={e => setComentario(e.target.value)} />
        </div>
        <div className="col-auto">
          <button className="btn btn-primary" onClick={guardar}>Guardar</button>
        </div>
      </div>

      <h4 className="mt-4">Historial</h4>
      <ul className="list-group">
        {historial.map((item, i) => (
          <li key={i} className="list-group-item">
            <strong>[{item.fecha.slice(0, 10)}]</strong> {item.producto} – <em>{item.tipo.toLowerCase()}</em> ({item.cantidad}) por {item.usuario}
            {item.comentario && <span> – {item.comentario}</span>}
          </li>
        ))}
      </ul>
    </div>
  );
}
