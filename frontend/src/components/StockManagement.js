import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Card, Form, Table, Container } from 'react-bootstrap';

const StockManagement = () => {
  const [stock, setStock] = useState([]);
  const [newItem, setNewItem] = useState({ herramienta: '', cantidad: 0 });
  const [editingId, setEditingId] = useState(null);
  const [editingValue, setEditingValue] = useState(0);

  useEffect(() => {
    axios.get('http://localhost:3001/stock')
      .then((res) => setStock(res.data))
      .catch((err) => console.error(err));
  }, []);

  const handleAddStock = async () => {
    try {
      const response = await axios.post('http://localhost:3001/stock', newItem);
      setStock([...stock, response.data]);
      setNewItem({ herramienta: '', cantidad: 0 });
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3001/stock/${id}`);
      setStock(stock.filter((item) => item.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (id, cantidad) => {
    setEditingId(id);
    setEditingValue(cantidad);
  };

  const handleUpdate = async (id) => {
    try {
      await axios.put(`http://localhost:3001/stock/${id}`, { cantidad: editingValue });
      setStock(stock.map((item) => (item.id === id ? { ...item, cantidad: editingValue } : item)));
      setEditingId(null);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Container className="mt-4">
      <h2>Gestión de Stock</h2>
      <Card className="p-3 mb-4">
        <Form.Control className="mb-2" placeholder="Herramienta" value={newItem.herramienta} onChange={(e) => setNewItem({ ...newItem, herramienta: e.target.value })} />
        <Form.Control className="mb-2" type="number" placeholder="Cantidad" value={newItem.cantidad} onChange={(e) => setNewItem({ ...newItem, cantidad: parseInt(e.target.value) })} />
        <Button variant="primary" onClick={handleAddStock}>Agregar</Button>
      </Card>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Herramienta</th>
            <th>Cantidad</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {stock.map((item) => (
            <tr key={item.id}>
                {console.log(item)}
              <td>{item.herramienta}</td>
              <td>
                {editingId === item.id ? (
                  <Form.Control type="number" value={editingValue} onChange={(e) => setEditingValue(parseInt(e.target.value))} />
                ) : (
                  item.cantidad
                )}
              </td>
              <td>
                {editingId === item.id ? (
                  <Button variant="success" onClick={() => handleUpdate(item.id)}>Guardar</Button>
                ) : (
                  <Button variant="warning" onClick={() => handleEdit(item.id, item.cantidad)}>Editar</Button>
                )}
                <Button variant="danger" onClick={() => handleDelete(item.id)} className="ms-2">Eliminar</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default StockManagement;
