import React, { useState, useEffect } from 'react';
import axios from 'axios';

const LoanForm = () => {
  const [tools, setTools] = useState([]);
  const [technicians, setTechnicians] = useState([]);
  const [form, setForm] = useState({
    tool_id: '',
    technician_id: '',
    cantidad: '',
    comentario: ''
  });

  useEffect(() => {
    axios.get('http://localhost:3001/tools').then(res => setTools(res.data));
    axios.get('http://localhost:3001/technicians').then(res => setTechnicians(res.data));
  }, []);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    await axios.post('http://localhost:3001/loans', form);
    alert('Préstamo registrado');
    setForm({ tool_id: '', technician_id: '', cantidad: '', comentario: '', fecha_devolucion: '' });
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border rounded bg-light">
      <h5>Registrar préstamo</h5>
      <select className="form-select mb-2" name="tool_id" value={form.tool_id} onChange={handleChange}>
        <option value="">Herramienta</option>
        {tools.map(tool => (
          <option key={tool.id} value={tool.id}>{tool.name}</option>
        ))}
      </select>
      <select className="form-select mb-2" name="technician_id" value={form.technician_id} onChange={handleChange}>
        <option value="">Técnico</option>
        {technicians.map(tech => (
          <option key={tech.id} value={tech.id}>{tech.name}</option>
        ))}
      </select>
      <input
        type="number"
        name="cantidad"
        value={form.cantidad}
        onChange={handleChange}
        placeholder="Cantidad"
        className="form-control mb-2"
      />
      <input
        type="text"
        name="comentario"
        value={form.comentario}
        onChange={handleChange}
        placeholder="Comentario"
        className="form-control mb-2"
      />
      <input
        type="date"
        name="fecha_devolucion"
        value={form.fecha_devolucion}
        onChange={handleChange}
        placeholder="Fecha de devolución"
        className="form-control mb-2"
      />
      <button className="btn btn-primary" type="submit">Guardar</button>
    </form>
  );
};

export default LoanForm;
