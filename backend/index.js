const express = require('express');
const cors = require('cors');
const app = express();
const stockRoutes = require('./routes/stock.js');

app.use(cors());
app.use(express.json());

app.use('/api/stock', stockRoutes);

app.listen(3001, () => {
  console.log('Servidor backend en puerto 3001');
});
