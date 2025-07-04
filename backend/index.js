const express = require('express');
const cors = require('cors');
const routes = require('./routes');

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
      health: '/api/health',
      envTest: '/api/env-test',
      eventos: '/api/eventos'
    }
  });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    message: 'Backend funcionando correctamente en Vercel con Firebase',
    environment: process.env.NODE_ENV || 'development'
  });
});

// Variables de entorno test
app.get('/api/env-test', (req, res) => {
  res.json({
    nodeEnv: process.env.NODE_ENV,
    firebaseProjectId: process.env.FIREBASE_PROJECT_ID ? 'Configurado' : 'No configurado',
    firebasePrivateKey: process.env.FIREBASE_PRIVATE_KEY ? 'Configurado' : 'No configurado',
    firebaseClientEmail: process.env.FIREBASE_CLIENT_EMAIL ? 'Configurado' : 'No configurado',
    firebasePrivateKeyId: process.env.FIREBASE_PRIVATE_KEY_ID ? 'Configurado' : 'No configurado',
    firebaseClientId: process.env.FIREBASE_CLIENT_ID ? 'Configurado' : 'No configurado',
    firebaseAuthUri: process.env.FIREBASE_AUTH_URI ? 'Configurado' : 'No configurado',
    firebaseTokenUri: process.env.FIREBASE_TOKEN_URI ? 'Configurado' : 'No configurado',
    firebaseAuthProviderX509CertUrl: process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL ? 'Configurado' : 'No configurado',
    firebaseClientX509CertUrl: process.env.FIREBASE_CLIENT_X509_CERT_URL ? 'Configurado' : 'No configurado',
    firebaseUniverseDomain: process.env.FIREBASE_UNIVERSE_DOMAIN ? 'Configurado' : 'No configurado',
    timestamp: new Date().toISOString()
  });
});

// Test de rutas
app.get('/api/test-routes', (req, res) => {
  res.json({
    message: 'Test de rutas funcionando',
    routes: [
      '/api/health',
      '/api/env-test',
      '/api/eventos',
      '/api/eventos/scraping',
      '/api/eventos/estadisticas'
    ],
    timestamp: new Date().toISOString()
  });
});

// Test de Firebase
app.get('/api/test-firebase', async (req, res) => {
  try {
    const firebaseConfig = require('./firebase-config');
    
    // Verificar si Firebase está disponible
    if (!firebaseConfig.db) {
      return res.status(503).json({
        message: 'Firebase no está configurado',
        error: 'La variable db es null',
        hasAdmin: !!firebaseConfig.admin,
        adminApps: firebaseConfig.admin ? firebaseConfig.admin.apps.length : 0,
        timestamp: new Date().toISOString()
      });
    }

    // Intentar una operación simple de Firestore
    try {
      const testRef = firebaseConfig.db.collection('test');
      await testRef.limit(1).get();
      
      res.json({
        message: 'Firebase cargado y funcionando correctamente',
        hasDb: !!firebaseConfig.db,
        hasAdmin: !!firebaseConfig.admin,
        adminApps: firebaseConfig.admin ? firebaseConfig.admin.apps.length : 0,
        projectId: process.env.FIREBASE_PROJECT_ID,
        timestamp: new Date().toISOString()
      });
    } catch (firestoreError) {
      res.status(500).json({
        message: 'Firebase cargado pero error en Firestore',
        error: firestoreError.message,
        hasDb: !!firebaseConfig.db,
        hasAdmin: !!firebaseConfig.admin,
        adminApps: firebaseConfig.admin ? firebaseConfig.admin.apps.length : 0,
        timestamp: new Date().toISOString()
      });
    }
  } catch (error) {
    res.status(500).json({
      message: 'Error al cargar Firebase',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Test detallado de Firebase
app.get('/api/test-firebase-detailed', async (req, res) => {
  try {
    console.log('🔍 Iniciando test detallado de Firebase...');
    
    const firebaseConfig = require('./firebase-config');
    
    const result = {
      message: 'Diagnóstico detallado de Firebase',
      hasAdmin: !!firebaseConfig.admin,
      adminApps: firebaseConfig.admin ? firebaseConfig.admin.apps.length : 0,
      hasDb: !!firebaseConfig.db,
      projectId: process.env.FIREBASE_PROJECT_ID,
      hasPrivateKey: !!process.env.FIREBASE_PRIVATE_KEY,
      hasClientEmail: !!process.env.FIREBASE_CLIENT_EMAIL,
      hasPrivateKeyId: !!process.env.FIREBASE_PRIVATE_KEY_ID,
      hasClientId: !!process.env.FIREBASE_CLIENT_ID,
      hasAuthUri: !!process.env.FIREBASE_AUTH_URI,
      hasTokenUri: !!process.env.FIREBASE_TOKEN_URI,
      hasAuthProviderX509CertUrl: !!process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
      hasClientX509CertUrl: !!process.env.FIREBASE_CLIENT_X509_CERT_URL,
      hasUniverseDomain: !!process.env.FIREBASE_UNIVERSE_DOMAIN,
      timestamp: new Date().toISOString()
    };
    
    console.log('📊 Resultado del diagnóstico:', result);
    
    res.json(result);
  } catch (error) {
    console.error('❌ Error en test detallado:', error);
    res.status(500).json({
      message: 'Error en test detallado',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Test simple sin Firebase
app.get('/api/test-simple', (req, res) => {
  res.json({
    message: 'Endpoint simple funcionando',
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