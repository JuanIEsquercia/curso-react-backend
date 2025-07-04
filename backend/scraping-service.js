const axios = require('axios');
const cheerio = require('cheerio');

class ScrapingService {
  constructor() {
    this.baseUrl = 'https://visitcorrientes.tur.ar';
    this.timeout = 15000;
    this.maxEventos = 20;
  }

  // Función simplificada para procesar fecha
  procesarFecha(fechaTexto) {
    if (!fechaTexto) return new Date().toISOString().split('T')[0];
    
    const fechaMatch = fechaTexto.match(/(\d{1,2})\s+de\s+(enero|febrero|marzo|abril|mayo|junio|julio|agosto|septiembre|octubre|noviembre|diciembre)/i);
    if (!fechaMatch) return new Date().toISOString().split('T')[0];
    
    const meses = {
      'enero': 1, 'febrero': 2, 'marzo': 3, 'abril': 4, 'mayo': 5, 'junio': 6,
      'julio': 7, 'agosto': 8, 'septiembre': 9, 'octubre': 10, 'noviembre': 11, 'diciembre': 12
    };
    
    const dia = parseInt(fechaMatch[1]);
    const mes = meses[fechaMatch[2].toLowerCase()];
    const anio = 2025;
    
    if (mes === undefined) return new Date().toISOString().split('T')[0];
    
    return `${anio}-${mes.toString().padStart(2, '0')}-${dia.toString().padStart(2, '0')}`;
  }

  async scrapeEventos() {
    try {
      console.log('🔄 Iniciando scraping de eventos...');
      
      const headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'es-ES,es;q=0.8,en;q=0.5',
        'Connection': 'keep-alive'
      };

      const response = await axios.get(`${this.baseUrl}/eventos/`, {
        headers,
        timeout: this.timeout
      });

      if (response.status !== 200) {
        throw new Error(`HTTP ${response.status}`);
      }

      const $ = cheerio.load(response.data);
      const eventos = [];

      $('.tribe-events-loop .type-tribe_events').each((index, element) => {
        if (eventos.length >= this.maxEventos) return false;
        
        try {
          const $el = $(element);
          const titulo = $el.find('.tribe-events-list-event-title a').text().trim();
          
          if (!titulo || titulo.length < 3) return;
          
          const fechaTexto = $el.find('.tribe-event-date-start').text().trim();
          const tipo = $el.find('.tribe-events-list-event-description').text().trim() || 'Evento';
          const ubicacion = $el.find('.tribe-events-venue-details a').text().trim() || 'Corrientes, Argentina';
          const url = $el.find('.tribe-events-list-event-title a').attr('href') || `${this.baseUrl}/eventos/`;
          
          const fechaISO = this.procesarFecha(fechaTexto);
          
          const evento = {
            id: `evento_${Date.now()}_${index}`,
            titulo,
            descripcion: `Evento cultural en Corrientes`,
            fecha: fechaISO,
            ubicacion,
            imagen: null,
            tipo,
            url,
            estado: 'activo',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          };
          
          eventos.push(evento);
          
        } catch (error) {
          console.error('Error al procesar evento:', error.message);
        }
      });

      if (eventos.length === 0) {
        console.log('⚠️ No se encontraron eventos');
        return [];
      }

      console.log(`✅ Scraping completado: ${eventos.length} eventos`);
      return eventos;

    } catch (error) {
      console.error('❌ Error en scraping:', error.message);
      return [];
    }
  }
}

module.exports = ScrapingService; 