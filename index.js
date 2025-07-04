const express = require('express');
const cors = require('cors');
const routes = require('./backend/routes');

const app = express();

// CORS básico para desarrollo
app.use(cors({
  origin: '*',
  credentials: true
}));

app.use(express.json());

// Ruta de prueba en la raíz
app.get('/', (req, res) => {
  res.json({
    message: 'Backend funcionando en Vercel',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    endpoints: {
      eventos: '/api/eventos',
      scraping: '/api/eventos/scraping',
      estadisticas: '/api/eventos/estadisticas'
    }
  });
});

// Health check básico
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Rutas de la API
app.use('/api', routes);

// Manejo de errores
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    success: false,
    error: 'Error interno del servidor',
    message: err.message
  });
});

module.exports = app; 