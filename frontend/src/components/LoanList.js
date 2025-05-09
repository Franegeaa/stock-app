import React, { useEffect, useState } from 'react';

const LoanList = () => {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:3001/loans')
      .then((res) => res.json())
      .then((data) => {
        setLoans(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error al cargar préstamos:', err);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Cargando préstamos...</p>;

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Préstamos registrados</h2>
      <table className="table table-bordered table-hover">
        <thead className="table-light">
          <tr>
            <th>Herramienta</th>
            <th>Técnico</th>
            <th>Cantidad</th>
            <th>Fecha préstamo</th>
            <th>Fecha devolución</th>
            <th>Comentario</th>
          </tr>
        </thead>
        <tbody>
          {loans.map((loan) => (
            <tr key={loan.id}>
              <td>{loan.herramienta}</td>
              <td>{loan.tecnico}</td>
              <td>{loan.cantidad}</td>
              <td>{loan.fecha_prestamo?.split('T')[0]}</td>
              <td>{loan.fecha_devolucion ? loan.fecha_devolucion.split('T')[0] : '-'}</td>
              <td>{loan.comentario || '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LoanList;