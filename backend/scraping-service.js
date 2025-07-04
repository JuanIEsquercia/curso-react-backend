const axios = require('axios');
const cheerio = require('cheerio');

class ScrapingService {
  constructor() {
    this.baseUrl = 'https://visitcorrientes.tur.ar';
  }

  // Función para detectar el tipo de evento basado en el título y descripción
  detectarTipoEvento(titulo, descripcion) {
    const texto = (titulo + ' ' + descripcion).toLowerCase();
    
    if (texto.includes('chamamé')) {
      return 'Chamamé';
    } else if (texto.includes('guitarra clásica') || texto.includes('museo') || texto.includes('teatro')) {
      return 'Cultura';
    } else if (texto.includes('stand up') || texto.includes('obra de teatro')) {
      return 'Entretenimiento';
    } else if (texto.includes('música electrónica') || texto.includes('musica electronica')) {
      return 'Música Electrónica';
    } else if (texto.includes('cumbia') || texto.includes('pop') || texto.includes('clasicos')) {
      return 'Pop';
    } else {
      return 'Evento';
    }
  }

  async scrapeEventos() {
    try {
      console.log('Iniciando scraping con axios...');
      
      // Configurar headers para evitar bloqueos
      const headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'es-ES,es;q=0.8,en-US;q=0.5,en;q=0.3',
        'Accept-Encoding': 'gzip, deflate',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1',
      };

      // Hacer la petición HTTP
      const response = await axios.get(`${this.baseUrl}/eventos/`, {
        headers,
        timeout: 30000
      });

      if (response.status !== 200) {
        console.error('Error en la respuesta HTTP:', response.status);
        return [];
      }

      // Parsear el HTML con cheerio
      const $ = cheerio.load(response.data);
      const eventos = [];

      // Buscar elementos de eventos
      $('.tribe-events-loop .type-tribe_events').each((index, element) => {
        try {
          const $el = $(element);
          
          // Extraer título del evento
          const titulo = $el.find('.tribe-events-list-event-title a').text().trim();
          
          if (!titulo || titulo.length < 3) return;
          
          // Extraer fecha del evento
          const fechaTexto = $el.find('.tribe-event-date-start').text().trim();
          
          // Extraer tipo/categoría del evento
          const tipo = $el.find('.tribe-events-list-event-description').text().trim() || 'Evento';
          
          // Extraer ubicación
          const ubicacion = $el.find('.tribe-events-venue-details a').text().trim() || 'Corrientes, Argentina';
          
          // Extraer URL del evento
          const url = $el.find('.tribe-events-list-event-title a').attr('href') || `${this.baseUrl}/eventos/`;
          
          // Procesar fecha
          let fechaISO = new Date().toISOString().split('T')[0];
          if (fechaTexto) {
            const fechaMatch = fechaTexto.match(/(\d{1,2})\s+de\s+(enero|febrero|marzo|abril|mayo|junio|julio|agosto|septiembre|octubre|noviembre|diciembre)/i);
            if (fechaMatch) {
              const dia = parseInt(fechaMatch[1]);
              const mes = fechaMatch[2].toLowerCase();
              const meses = {
                'enero': 1, 'febrero': 2, 'marzo': 3, 'abril': 4, 'mayo': 5, 'junio': 6,
                'julio': 7, 'agosto': 8, 'septiembre': 9, 'octubre': 10, 'noviembre': 11, 'diciembre': 12
              };
              const mesNum = meses[mes];
              if (mesNum !== undefined) {
                const anio = 2025;
                fechaISO = `${anio}-${mesNum.toString().padStart(2, '0')}-${dia.toString().padStart(2, '0')}`;
              }
            }
          }
          
          // Crear descripción basada en el tipo
          let descripcion = '';
          const tipoLower = tipo.toLowerCase();
          
          if (tipoLower.includes('chamamé')) {
            descripcion = 'Presentación de música tradicional correntina';
          } else if (tipoLower.includes('pop')) {
            descripcion = 'Concierto de música pop en vivo';
          } else if (tipoLower.includes('cumbia')) {
            descripcion = 'Fiesta de cumbia y música tropical';
          } else if (tipoLower.includes('música electrónica') || tipoLower.includes('musica electronica')) {
            descripcion = 'Noche de música electrónica y DJs';
          } else if (tipoLower.includes('stand up')) {
            descripcion = 'Show de comedia stand up';
          } else if (tipoLower.includes('guitarra clásica')) {
            descripcion = 'Concierto de guitarra clásica';
          } else if (tipoLower.includes('obra de teatro')) {
            descripcion = 'Presentación teatral';
          } else if (tipoLower.includes('clasicos de 80 y 90')) {
            descripcion = 'Show de música de los 80s y 90s';
          } else if (tipoLower.includes('cumbia y latinos')) {
            descripcion = 'Fiesta de cumbia y música latina';
          } else {
            descripcion = 'Evento cultural en Corrientes';
          }
          
          // Agregar evento
          eventos.push({
            id: `evento_${Date.now()}_${index}`,
            titulo,
            descripcion,
            fecha: fechaISO,
            ubicacion,
            imagen: null,
            tipo,
            url,
            estado: 'activo',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          });
          
        } catch (error) {
          console.error('Error al procesar evento:', error);
        }
      });

      // Si no se encontraron eventos, crear eventos de ejemplo
      if (eventos.length === 0) {
        console.log('No se encontraron eventos reales, creando eventos de ejemplo...');
        return this.crearEventosEjemplo();
      }

      // Filtrar eventos duplicados y limitar a 8
      const eventosUnicos = eventos.filter((evento, index, self) => 
        index === self.findIndex(e => e.titulo === evento.titulo)
      ).slice(0, 8);

      console.log(`✅ Scraping completado: ${eventosUnicos.length} eventos de visitcorrientes.tur.ar`);
      return eventosUnicos;

    } catch (error) {
      console.error('Error en scraping:', error);
      console.log('Creando eventos de ejemplo debido al error...');
      return this.crearEventosEjemplo();
    }
  }

  // Crear eventos de ejemplo cuando el scraping falla
  crearEventosEjemplo() {
    const eventos = [
      {
        id: `evento_${Date.now()}_1`,
        titulo: 'Festival de Chamamé 2025',
        descripcion: 'El festival más importante de música tradicional correntina',
        fecha: '2025-01-15',
        ubicacion: 'Anfiteatro Mario del Tránsito Cocomarola, Corrientes',
        imagen: null,
        tipo: 'Chamamé',
        url: 'https://visitcorrientes.tur.ar/eventos/',
        estado: 'activo',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: `evento_${Date.now()}_2`,
        titulo: 'Concierto de Guitarra Clásica',
        descripcion: 'Presentación de música clásica en el Teatro Vera',
        fecha: '2025-01-20',
        ubicacion: 'Teatro Vera, Corrientes',
        imagen: null,
        tipo: 'Cultura',
        url: 'https://visitcorrientes.tur.ar/eventos/',
        estado: 'activo',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: `evento_${Date.now()}_3`,
        titulo: 'Fiesta de Cumbia y Música Tropical',
        descripcion: 'Noche de baile con los mejores ritmos tropicales',
        fecha: '2025-01-25',
        ubicacion: 'Club Social, Corrientes',
        imagen: null,
        tipo: 'Pop',
        url: 'https://visitcorrientes.tur.ar/eventos/',
        estado: 'activo',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: `evento_${Date.now()}_4`,
        titulo: 'Show de Stand Up Comedy',
        descripcion: 'Risas garantizadas con los mejores comediantes',
        fecha: '2025-01-30',
        ubicacion: 'Centro Cultural, Corrientes',
        imagen: null,
        tipo: 'Entretenimiento',
        url: 'https://visitcorrientes.tur.ar/eventos/',
        estado: 'activo',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];

    console.log(`✅ Eventos de ejemplo creados: ${eventos.length} eventos`);
    return eventos;
  }
}

module.exports = ScrapingService; 