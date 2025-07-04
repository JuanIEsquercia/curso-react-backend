let db = null;
let ScrapingService = null;

// Cargar Firebase de forma segura
try {
  const firebaseConfig = require('./firebase-config');
  db = firebaseConfig.db;
  ScrapingService = require('./scraping-service');
} catch (error) {
  console.error('Error al cargar Firebase:', error);
}

class EventosController {
  constructor() {
    if (ScrapingService) {
      this.scrapingService = new ScrapingService();
    }
  }

  // Obtener todos los eventos
  async getEventos(req, res) {
    try {
      if (!db) {
        return res.status(503).json({
          success: false,
          error: 'Firebase no está configurado'
        });
      }

      const eventosRef = db.collection('eventos');
      const snapshot = await eventosRef.orderBy('fecha', 'asc').get();
      
      const eventos = [];
      snapshot.forEach(doc => {
        eventos.push({
          id: doc.id,
          ...doc.data()
        });
      });

      res.json({
        success: true,
        data: eventos,
        count: eventos.length
      });
    } catch (error) {
      console.error('Error al obtener eventos:', error);
      res.status(500).json({
        success: false,
        error: 'Error al obtener eventos'
      });
    }
  }

  // Ejecutar scraping y guardar eventos
  async ejecutarScraping(req, res) {
    try {
      if (!db || !this.scrapingService) {
        return res.status(503).json({
          success: false,
          error: 'Firebase o ScrapingService no está configurado'
        });
      }

      console.log('Iniciando scraping de eventos...');
      
      // Obtener eventos del scraping
      const eventos = await this.scrapingService.scrapeEventos();
      
      if (eventos.length === 0) {
        return res.status(400).json({
          success: false,
          error: 'No se pudieron obtener eventos del scraping'
        });
      }

      // Eliminar eventos existentes
      await this.eliminarTodosLosEventos();

      // Guardar nuevos eventos
      const batch = db.batch();
      const eventosRef = db.collection('eventos');

      eventos.forEach(evento => {
        const docRef = eventosRef.doc(evento.id);
        batch.set(docRef, evento);
      });

      await batch.commit();

      console.log(`Se guardaron ${eventos.length} eventos`);

      res.json({
        success: true,
        message: `Se actualizaron ${eventos.length} eventos`,
        count: eventos.length,
        eventos: eventos
      });
    } catch (error) {
      console.error('Error en scraping:', error);
      res.status(500).json({
        success: false,
        error: 'Error al ejecutar scraping'
      });
    }
  }

  // Eliminar todos los eventos
  async eliminarTodosLosEventos() {
    try {
      const eventosRef = db.collection('eventos');
      const snapshot = await eventosRef.get();
      
      const batch = db.batch();
      snapshot.docs.forEach(doc => {
        batch.delete(doc.ref);
      });
      
      await batch.commit();
      console.log(`Se eliminaron ${snapshot.docs.length} eventos`);
    } catch (error) {
      console.error('Error al eliminar eventos:', error);
      throw error;
    }
  }

  // Eliminar todos los eventos (endpoint)
  async eliminarEventos(req, res) {
    try {
      await this.eliminarTodosLosEventos();
      
      res.json({
        success: true,
        message: 'Todos los eventos han sido eliminados'
      });
    } catch (error) {
      console.error('Error al eliminar eventos:', error);
      res.status(500).json({
        success: false,
        error: 'Error al eliminar eventos'
      });
    }
  }

  // Obtener estadísticas de eventos
  async getEstadisticas(req, res) {
    try {
      const eventosRef = db.collection('eventos');
      const snapshot = await eventosRef.get();
      
      const total = snapshot.size;
      const activos = snapshot.docs.filter(doc => doc.data().estado === 'activo').length;
      
      res.json({
        success: true,
        data: {
          total,
          activos,
          inactivos: total - activos
        }
      });
    } catch (error) {
      console.error('Error al obtener estadísticas:', error);
      res.status(500).json({
        success: false,
        error: 'Error al obtener estadísticas'
      });
    }
  }
}

module.exports = EventosController; 