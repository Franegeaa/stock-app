import React, { useState } from 'react';
import axios from 'axios';

const ToolForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    stock_total: 0
  });

  const [message, setMessage] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'stock_total' ? parseInt(value) : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:3001/api/tools', formData);
      setMessage('Herramienta registrada con éxito');
      setFormData({ name: '', description: '', stock_total: 0 });
    } catch (err) {
      console.error(err);
      setMessage('Hubo un error al registrar la herramienta');
    }
  };

  return (
    <div>
      <h2>Registrar Herramienta</h2>
      {message && <p>{message}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Nombre:</label>
          <input type="text" name="name" value={formData.name} onChange={handleChange} required />
        </div>
        <div>
          <label>Descripción:</label>
          <input type="text" name="description" value={formData.description} onChange={handleChange} />
        </div>
        <div>
          <label>Stock Total:</label>
          <input type="number" name="stock_total" value={formData.stock_total} onChange={handleChange} required />
        </div>
        <button type="submit">Guardar</button>
      </form>
    </div>
  );
};

export default ToolForm;
