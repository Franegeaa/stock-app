import { useState } from 'react';
import { api } from '../services/api';

export default function StockForm({ onSuccess }) {
  const [form, setForm] = useState({
    producto: '',
    tipo: 'ingreso',
    cantidad: '',
    usuario: '',
    comentario: ''
  });

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    await api.post('/', form);
    setForm({ ...form, cantidad: '', comentario: '' });
    onSuccess();
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="producto" placeholder="Producto" onChange={handleChange} required />
      <select name="tipo" onChange={handleChange}>
        <option value="ingreso">Ingreso</option>
        <option value="egreso">Egreso</option>
      </select>
      <input type="number" name="cantidad" placeholder="Cantidad" onChange={handleChange} required />
      <input name="usuario" placeholder="Tu nombre" onChange={handleChange} required />
      <input name="comentario" placeholder="Comentario" onChange={handleChange} />
      <button type="submit">Guardar</button>
    </form>
  );
}
