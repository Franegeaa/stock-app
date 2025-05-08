import { useEffect, useState } from 'react';
import { api } from '../services/api';

export default function StockList() {
  const [movimientos, setMovimientos] = useState([]);

  const fetchMovimientos = async () => {
    const res = await api.get('/');
    setMovimientos(res.data);
  };

  useEffect(() => {
    fetchMovimientos();
  }, []);

  return (
    <div>
      <h2>Historial</h2>
      <ul>
        {movimientos.map((m) => (
          <li key={m.id}>
            [{m.fecha.split('T')[0]}] {m.producto} - {m.tipo} ({m.cantidad}) por {m.usuario}
          </li>
        ))}
      </ul>
    </div>
  );
}
