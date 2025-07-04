const express = require('express');
const EventosController = require('./eventos-controller');

const router = express.Router();
const eventosController = new EventosController();

// Rutas de eventos
router.get('/eventos', (req, res) => eventosController.getEventos(req, res));
router.post('/eventos/scraping', (req, res) => eventosController.ejecutarScraping(req, res));
router.delete('/eventos', (req, res) => eventosController.eliminarEventos(req, res));
router.get('/eventos/estadisticas', (req, res) => eventosController.getEstadisticas(req, res));

// Health check interno
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Backend funcionando correctamente',
    timestamp: new Date().toISOString()
  });
});

module.exports = router; 