const express = require('express');
const router = express.Router();
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Crear/conectar a la base de datos
const dbPath = path.resolve(__dirname, '../db/database.sqlite');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) return console.error('Error al abrir la base de datos', err.message);
  console.log('Base de datos conectada');
});

// Crear tabla si no existe
db.serialize(() => {
  // Tabla de herramientas
  db.run(`
    CREATE TABLE IF NOT EXISTS tools (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT,
      stock_total INTEGER NOT NULL DEFAULT 0
    )
  `);

  // Tabla de técnicos
  db.run(`
    CREATE TABLE IF NOT EXISTS technicians (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT,
      telefono TEXT
    )
  `);

  // Tabla de préstamos
  db.run(`
    CREATE TABLE IF NOT EXISTS loans (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      tool_id INTEGER NOT NULL,
      technician_id INTEGER NOT NULL,
      cantidad INTEGER NOT NULL,
      fecha_prestamo TEXT NOT NULL,
      fecha_devolucion TEXT,
      comentario TEXT,
      FOREIGN KEY (tool_id) REFERENCES tools(id),
      FOREIGN KEY (technician_id) REFERENCES technicians(id)
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS stock (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  herramienta TEXT NOT NULL,
  cantidad INT NOT NULL
  )
  `);  
  console.log("Tablas creadas o verificadas correctamente.");
});

router.get('/loans', (req, res) => {
  const sql = `
    SELECT 
      loans.id,
      tools.name AS herramienta,
      technicians.name AS tecnico,
      loans.cantidad,
      loans.fecha_prestamo,
      loans.fecha_devolucion,
      loans.comentario
    FROM loans
    JOIN tools ON loans.tool_id = tools.id
    JOIN technicians ON loans.technician_id = technicians.id
    ORDER BY loans.fecha_prestamo DESC
  `;

  db.all(sql, [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

router.get('/stock', async (req, res) => {
  db.all('SELECT * FROM stock', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

router.post('/stock', async (req, res) => {
  const { herramienta, cantidad } = req.body;
  const sql = `
    INSERT INTO stock (herramienta, cantidad)
    VALUES (?, ?)
  `;
  const params = [herramienta, cantidad];
  db.run(sql, params, function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ message: 'Herramienta agregada', id: this.lastID });
  })
});

router.put('/stock/:id', async (req, res) => {
  const { id } = req.params;
  const { cantidad } = req.body;

  db.run(
    'UPDATE stock SET cantidad = ? WHERE id = ?',
    [cantidad, id],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      if (this.changes === 0) return res.status(404).json({ error: 'Registro no encontrado' });

      // Si el registro se actualizó, devuelve el objeto actualizado
      db.get('SELECT * FROM stock WHERE id = ?', [id], (err, row) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(row);
      });
    }
  );
});

router.delete('/stock/:id', async (req, res) => {
  const { id } = req.params;
  db.run('DELETE FROM stock WHERE id = ?', [id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    if (this.changes === 0) return res.status(404).json({ error: 'Registro no encontrado' });
    res.sendStatus(204);
  });
});

router.post('/technicians', (req, res) => {
  const { name, email, telefono } = req.body;

  if (!name) {
    return res.status(400).json({ error: 'El nombre es obligatorio' });
  }

  const sql = `
    INSERT INTO technicians (name, email, telefono)
    VALUES (?, ?, ?)
  `;
  const params = [name, email, telefono];

  db.run(sql, params, function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ message: 'Técnico agregado', id: this.lastID });
  });
});

router.post('/tools', (req, res) => {
  const { name, description, stock_total } = req.body;

  if (!name || stock_total == null) {
    return res.status(400).json({ error: 'Nombre y stock_total son obligatorios' });
  }

  const sql = `
    INSERT INTO tools (name, description, stock_total)
    VALUES (?, ?, ?)
  `;
  const params = [name, description, stock_total];

  db.run(sql, params, function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ message: 'Herramienta agregada', id: this.lastID });
  });
});

// POST: registrar un préstamo
router.post('/loans', (req, res) => {
  const { tool_id, technician_id, cantidad, comentario } = req.body;
  const fecha_prestamo = new Date().toISOString();

  const sql = `
    INSERT INTO loans (tool_id, technician_id, cantidad, fecha_prestamo, comentario)
    VALUES (?, ?, ?, ?, ?)
  `;
  const params = [tool_id, technician_id, cantidad, fecha_prestamo, comentario];

  db.run(sql, params, function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ message: 'Préstamo registrado', id: this.lastID });
  });
});

// GET herramientas
router.get('/tools', (req, res) => {
  db.all('SELECT * FROM tools', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// GET técnicos
router.get('/technicians', (req, res) => {
  db.all('SELECT * FROM technicians', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});


module.exports = router;
