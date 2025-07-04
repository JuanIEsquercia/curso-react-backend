const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('🔥 Configuración de Firebase Admin SDK');
console.log('=====================================\n');

console.log('📋 Pasos a seguir:');
console.log('1. Ve a https://console.firebase.google.com/');
console.log('2. Selecciona tu proyecto: curso-react-12345');
console.log('3. Ve a Configuración del proyecto > Cuentas de servicio');
console.log('4. Haz clic en "Generar nueva clave privada"');
console.log('5. Descarga el archivo JSON\n');

rl.question('¿Ya descargaste el archivo JSON? (s/n): ', (answer) => {
  if (answer.toLowerCase() === 's' || answer.toLowerCase() === 'si') {
    rl.question('Ingresa la ruta completa del archivo JSON descargado: ', (filePath) => {
      try {
        // Leer el archivo JSON
        const jsonContent = fs.readFileSync(filePath, 'utf8');
        const serviceAccount = JSON.parse(jsonContent);
        
        // Crear el archivo de configuración
        const configContent = `const admin = require('firebase-admin');

// Configuración de Firebase Admin SDK
const serviceAccount = ${JSON.stringify(serviceAccount, null, 2)};

// Inicializar Firebase Admin
try {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
  console.log('✅ Firebase Admin inicializado correctamente');
} catch (error) {
  console.error('❌ Error al inicializar Firebase Admin:', error.message);
}

const db = admin.firestore();

module.exports = { admin, db };
`;
        
        // Escribir el archivo de configuración
        fs.writeFileSync(path.join(__dirname, 'firebase-config.js'), configContent);
        
        console.log('\n✅ Configuración completada exitosamente!');
        console.log('📁 Archivo firebase-config.js actualizado');
        console.log('\n🚀 Ahora puedes ejecutar: npm run dev');
        
      } catch (error) {
        console.error('\n❌ Error:', error.message);
        console.log('💡 Asegúrate de que la ruta del archivo sea correcta');
      }
      
      rl.close();
    });
  } else {
    console.log('\n📝 Por favor, sigue los pasos y vuelve a ejecutar este script');
    rl.close();
  }
}); 