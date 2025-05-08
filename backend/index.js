const express = require('express');
const app = express();
const cors = require('cors');
const apiRoutes = require('./routes/api.js'); // Suponiendo que ese es el archivo

app.use(cors());
app.use(express.json());
app.use('/', apiRoutes);

app.listen(3001, () => console.log('Servidor corriendo en http://localhost:3001'));
