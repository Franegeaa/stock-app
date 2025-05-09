import React, { useState } from 'react';
import axios from 'axios';

const TechnicianForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    telefono: ''
  });

  const [message, setMessage] = useState(null);

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3001/api/technicians', formData);
      setMessage('Técnico registrado con éxito');
      setFormData({ name: '', email: '', telefono: '' });
    } catch (err) {
      console.error(err);
      setMessage('Hubo un error al registrar el técnico');
    }
  };

  return (
    <div>
      <h2>Registrar Técnico</h2>
      {message && <p>{message}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Nombre:</label>
          <input type="text" name="name" value={formData.name} onChange={handleChange} required />
        </div>
        <div>
          <label>Email:</label>
          <input type="email" name="email" value={formData.email} onChange={handleChange} />
        </div>
        <div>
          <label>Teléfono:</label>
          <input type="text" name="telefono" value={formData.telefono} onChange={handleChange} />
        </div>
        <button type="submit">Guardar</button>
      </form>
    </div>
  );
};

export default TechnicianForm;
