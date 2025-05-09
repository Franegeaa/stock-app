import React, { useState } from 'react';
import LoanForm from './components/LoanForm';
import LoanList from './components/LoanList';
import StockManagement from './components/StockManagement';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Nav, Navbar, Container } from 'react-bootstrap';

function App() {
  const [activeTab, setActiveTab] = useState('loans');

  return (
    <div className="container mt-4">
      <Navbar bg="dark" variant="dark">
        <Container>
          <Navbar.Brand>Gestión de Stock</Navbar.Brand>
          <Nav className="me-auto">
            <Nav.Link onClick={() => setActiveTab('loans')} active={activeTab === 'loans'}>Préstamos</Nav.Link>
            <Nav.Link onClick={() => setActiveTab('stock')} active={activeTab === 'stock'}>Stock</Nav.Link>
          </Nav>
        </Container>
      </Navbar>
      <div className="mt-4">
        {activeTab === 'loans' && (
          <div>
            <LoanForm />
            <LoanList />
          </div>
        )}
        {activeTab === 'stock' && <StockManagement />}
      </div>
      <footer className="mt-4 text-center">
        <p>© 2025 Gestión de Stock. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
}

export default App;
