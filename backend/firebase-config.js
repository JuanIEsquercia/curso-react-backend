const admin = require('firebase-admin');

// 🔥 CONFIGURACIÓN DE FIREBASE ADMIN SDK
// 
// Para configurar las credenciales:
// 1. Ve a https://console.firebase.google.com/
// 2. Selecciona tu proyecto
// 3. Ve a Configuración del proyecto > Cuentas de servicio
// 4. Haz clic en "Generar nueva clave privada"
// 5. Descarga el archivo JSON
// 6. Configura las variables de entorno en Vercel

// Usar variables de entorno en lugar de credenciales hardcodeadas
const serviceAccount = {
  "type": "service_account",
  "project_id": process.env.FIREBASE_PROJECT_ID || "proy-alojamientos",
  "private_key_id": process.env.FIREBASE_PRIVATE_KEY_ID,
  "private_key": process.env.FIREBASE_PRIVATE_KEY ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n') : undefined,
  "client_email": process.env.FIREBASE_CLIENT_EMAIL,
  "client_id": process.env.FIREBASE_CLIENT_ID,
  "auth_uri": process.env.FIREBASE_AUTH_URI || "https://accounts.google.com/o/oauth2/auth",
  "token_uri": process.env.FIREBASE_TOKEN_URI || "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL || "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": process.env.FIREBASE_CLIENT_X509_CERT_URL,
  "universe_domain": process.env.FIREBASE_UNIVERSE_DOMAIN || "googleapis.com"
};

// Verificar que las credenciales estén configuradas
const requiredFields = ['FIREBASE_PRIVATE_KEY', 'FIREBASE_CLIENT_EMAIL', 'FIREBASE_PROJECT_ID'];
const missingFields = requiredFields.filter(field => !process.env[field]);

if (missingFields.length > 0) {
  console.warn('⚠️ Variables de entorno de Firebase faltantes:', missingFields.join(', '));
  console.warn('💡 Configura las variables de entorno en Vercel para que Firebase funcione');
}

// Inicializar Firebase Admin solo si las credenciales están disponibles
let adminInstance = null;
let dbInstance = null;

try {
  if (process.env.FIREBASE_PRIVATE_KEY && process.env.FIREBASE_CLIENT_EMAIL) {
    adminInstance = admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
    dbInstance = adminInstance.firestore();
    console.log('✅ Firebase Admin inicializado correctamente');
    console.log('📊 Proyecto:', process.env.FIREBASE_PROJECT_ID || 'proy-alojamientos');
  } else {
    console.warn('⚠️ Firebase no inicializado - faltan credenciales');
  }
} catch (error) {
  console.error('❌ Error al inicializar Firebase Admin:', error.message);
  console.log('💡 Verifica que las credenciales sean correctas');
}

module.exports = { 
  admin: adminInstance, 
  db: dbInstance 
}; 