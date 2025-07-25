# Backend de Scraping de Eventos

Backend para realizar scraping de eventos de la página oficial de Corrientes y almacenarlos en Firebase.

## Instalación

```bash
npm install
```

## Configuración

1. Crear archivo `.env` con las variables de entorno:
```
PORT=3001
NODE_ENV=development
```

2. Configurar Firebase Admin SDK en `firebase-config.js`

## Uso

### Desarrollo
```bash
npm run dev
```

### Producción
```bash
npm start
```

## Endpoints

### GET /api/eventos
Obtiene todos los eventos almacenados.

### POST /api/eventos/scraping
Ejecuta el scraping y actualiza la base de datos.

### DELETE /api/eventos
Elimina todos los eventos de la base de datos.

### GET /api/eventos/estadisticas
Obtiene estadísticas de eventos.

### GET /api/health
Verifica el estado del servidor.

## Estructura

- `server.js` - Servidor principal
- `routes.js` - Definición de rutas
- `eventos-controller.js` - Controlador de eventos
- `scraping-service.js` - Servicio de scraping con Puppeteer
- `firebase-config.js` - Configuración de Firebase
- `config.js` - Configuración general #   c u r s o - r e a c t - b a c k e n d  
 