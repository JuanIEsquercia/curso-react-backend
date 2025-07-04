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

// TEMPORAL: Endpoint de diagnóstico para scraping
router.get('/debug-scraping', async (req, res) => {
  try {
    const ScrapingService = require('./scraping-service');
    const scrapingService = new ScrapingService();
    
    console.log('🔍 Iniciando diagnóstico de scraping...');
    
    // Obtener eventos sin límite para diagnóstico
    const eventos = await scrapingService.scrapeEventos();
    
    // Verificar si son eventos reales o fallback
    const esFallback = eventos.some(evento => 
      evento.titulo === 'Festival de Chamamé 2025' || 
      evento.titulo === 'Concierto de Guitarra Clásica' ||
      evento.titulo === 'Fiesta de Cumbia y Música Tropical'
    );
    
    res.json({
      success: true,
      message: 'Diagnóstico de scraping completado',
      count: eventos.length,
      esFallback: esFallback,
      maxEventosConfigurado: scrapingService.maxEventos,
      eventos: eventos.map(e => ({
        titulo: e.titulo,
        tipo: e.tipo,
        fecha: e.fecha
      })),
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error en diagnóstico de scraping:', error);
    res.status(500).json({
      success: false,
      error: 'Error en diagnóstico de scraping',
      details: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

module.exports = router; 