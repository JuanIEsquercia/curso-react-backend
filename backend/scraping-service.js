const axios = require('axios');
const cheerio = require('cheerio');

class ScrapingService {
  constructor() {
    this.baseUrl = 'https://visitcorrientes.tur.ar';
    this.timeout = 15000; // Reducir timeout a 15 segundos
    this.maxEventos = 20; // Ahora el límite es 20
  }

  // Función optimizada para detectar el tipo de evento
  detectarTipoEvento(titulo, descripcion) {
    const texto = (titulo + ' ' + descripcion).toLowerCase();
    
    if (texto.includes('chamamé')) return 'Chamamé';
    if (texto.includes('guitarra clásica') || texto.includes('museo') || texto.includes('teatro')) return 'Cultura';
    if (texto.includes('stand up') || texto.includes('obra de teatro')) return 'Entretenimiento';
    if (texto.includes('música electrónica') || texto.includes('musica electronica')) return 'Música Electrónica';
    if (texto.includes('cumbia') || texto.includes('pop') || texto.includes('clasicos')) return 'Pop';
    
    return 'Evento';
  }

  // Función optimizada para crear descripción
  crearDescripcion(tipo) {
    const descripciones = {
      'Chamamé': 'Presentación de música tradicional correntina',
      'Cultura': 'Evento cultural en Corrientes',
      'Entretenimiento': 'Show de entretenimiento',
      'Música Electrónica': 'Noche de música electrónica y DJs',
      'Pop': 'Concierto de música popular',
      'Evento': 'Evento cultural en Corrientes'
    };
    
    return descripciones[tipo] || 'Evento cultural en Corrientes';
  }

  // Función optimizada para procesar fecha
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
      console.log('🔄 Iniciando scraping optimizado...');
      console.log(`📊 Límite configurado: ${this.maxEventos} eventos`);
      
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

      console.log('✅ Respuesta HTTP exitosa');
      const $ = cheerio.load(response.data);
      const eventos = [];
      let elementosEncontrados = 0;

      // Contar elementos totales encontrados
      const totalElementos = $('.tribe-events-loop .type-tribe_events').length;
      console.log(`🔍 Elementos encontrados en la página: ${totalElementos}`);

      $('.tribe-events-loop .type-tribe_events').each((index, element) => {
        elementosEncontrados++;
        console.log(`📝 Procesando elemento ${elementosEncontrados}/${totalElementos}`);
        // Solo limitamos a 20 por seguridad, pero si hay menos, trae todos
        if (eventos.length >= this.maxEventos) {
          console.log(`⏹️ Límite alcanzado (${this.maxEventos}), parando procesamiento`);
          return false;
        }
        try {
          const $el = $(element);
          const titulo = $el.find('.tribe-events-list-event-title a').text().trim();
          if (!titulo || titulo.length < 3) {
            console.log(`⚠️ Título inválido: "${titulo}"`);
            return;
          }
          const fechaTexto = $el.find('.tribe-event-date-start').text().trim();
          const tipo = $el.find('.tribe-events-list-event-description').text().trim() || 'Evento';
          const ubicacion = $el.find('.tribe-events-venue-details a').text().trim() || 'Corrientes, Argentina';
          const url = $el.find('.tribe-events-list-event-title a').attr('href') || `${this.baseUrl}/eventos/`;
          const fechaISO = this.procesarFecha(fechaTexto);
          const descripcion = this.crearDescripcion(tipo);
          const evento = {
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
          };
          eventos.push(evento);
          console.log(`✅ Evento agregado: "${titulo}" (${eventos.length}/${this.maxEventos})`);
        } catch (error) {
          console.error(`❌ Error al procesar evento ${elementosEncontrados}:`, error.message);
        }
      });

      console.log(`📊 Eventos procesados: ${eventos.length}`);

      if (eventos.length === 0) {
        console.log('⚠️ No se encontraron eventos, usando fallback...');
        return this.crearEventosFallback();
      }

      // Retornar todos los eventos sin eliminar duplicados
      console.log(`✅ Scraping completado: ${eventos.length} eventos`);
      console.log(`📋 Todos los eventos:`, eventos.map(e => e.titulo));
      
      return eventos;

    } catch (error) {
      console.error('❌ Error en scraping:', error.message);
      return this.crearEventosFallback();
    }
  }

  // Eventos de fallback optimizados
  crearEventosFallback() {
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
      }
    ];

    console.log(`✅ Eventos de fallback creados: ${eventos.length} eventos`);
    return eventos;
  }
}

module.exports = ScrapingService; 