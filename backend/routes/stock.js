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
db.run(`
  CREATE TABLE IF NOT EXISTS stock (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    producto TEXT,
    tipo TEXT,
    cantidad INTEGER,
    fecha TEXT,
    usuario TEXT,
    comentario TEXT
  )
`);

router.get('/', (req, res) => {
  db.all('SELECT * FROM stock ORDER BY fecha DESC', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

router.post('/', (req, res) => {
  const { producto, tipo, cantidad, usuario, comentario } = req.body;
  const fecha = new Date().toISOString();

  const sql = `
    INSERT INTO stock (producto, tipo, cantidad, fecha, usuario, comentario)
    VALUES (?, ?, ?, ?, ?, ?)
  `;
  const params = [producto, tipo, cantidad, fecha, usuario, comentario];

  db.run(sql, params, function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ message: 'Movimiento registrado', id: this.lastID });
  });
});

module.exports = router;
