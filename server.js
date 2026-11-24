require('dotenv').config();
const express = require('express');
const cors = require('cors');
const conectarBD = require('./config/db');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/productos', require('./routes/productos'));
app.use('/api/usuarios', require('./routes/usuarios'));
app.use('/api/reportes', require('./routes/reportes'));

app.use((req, res) => res.status(404).json({ error: 'Ruta no encontrada' }));

const PORT = process.env.PORT || 3000;
conectarBD().then(() => {
  app.listen(PORT, () => console.log(`Servidor en http://localhost:${PORT}`));
});
