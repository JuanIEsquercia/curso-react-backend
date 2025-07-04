const express = require('express');
const EventosController = require('./eventos-controller');

const router = express.Router();
const eventosController = new EventosController();

// Rutas de eventos
router.get('/eventos', (req, res) => eventosController.getEventos(req, res));
router.post('/eventos/scraping', (req, res) => eventosController.ejecutarScraping(req, res));
router.delete('/eventos', (req, res) => eventosController.eliminarEventos(req, res));
router.get('/eventos/estadisticas', (req, res) => eventosController.getEstadisticas(req, res));

// Ruta de prueba
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Backend funcionando correctamente',
    timestamp: new Date().toISOString()
  });
});

// Ruta de diagnóstico para scraping
router.get('/test-scraping', async (req, res) => {
  try {
    const ScrapingService = require('./scraping-service');
    const scrapingService = new ScrapingService();
    
    console.log('Probando scraping...');
    const eventos = await scrapingService.scrapeEventos();
    
    res.json({
      success: true,
      message: 'Prueba de scraping completada',
      count: eventos.length,
      eventos: eventos,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error en prueba de scraping:', error);
    res.status(500).json({
      success: false,
      error: 'Error en prueba de scraping',
      details: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

module.exports = router; 