# 🔥 Configuración de Firebase Admin SDK

## 📋 Pasos para Configurar las Credenciales

### 1. Ir a la Consola de Firebase
- Abre: https://console.firebase.google.com/
- Inicia sesión con tu cuenta de Google
- Selecciona tu proyecto: `curso-react-12345`

### 2. Acceder a Configuración del Proyecto
- En el menú lateral izquierdo, haz clic en el ícono de engranaje ⚙️
- Selecciona **"Configuración del proyecto"**

### 3. Ir a Cuentas de Servicio
- En la pestaña **"General"**, busca la sección **"Cuentas de servicio"**
- Haz clic en **"Firebase Admin SDK"**

### 4. Generar Nueva Clave Privada
- Haz clic en **"Generar nueva clave privada"**
- Aparecerá un mensaje de confirmación
- Haz clic en **"Generar clave"**
- Se descargará automáticamente un archivo JSON

### 5. Configurar el Backend
- Abre el archivo `backend/firebase-config.js`
- Reemplaza todo el contenido del objeto `serviceAccount` con el contenido del archivo JSON descargado
- Guarda el archivo

### 6. Verificar la Configuración
- Ejecuta el backend: `npm run dev`
- Deberías ver: "✅ Firebase Admin inicializado correctamente"

## 📁 Estructura del Archivo JSON

El archivo descargado tendrá esta estructura:
```json
{
  "type": "service_account",
  "project_id": "curso-react-12345",
  "private_key_id": "abc123...",
  "private_key": "-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n",
  "client_email": "firebase-adminsdk-xxxxx@curso-react-12345.iam.gserviceaccount.com",
  "client_id": "123456789...",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/..."
}
```

## ⚠️ Importante

- **Nunca subas** el archivo JSON con las credenciales a GitHub
- **Mantén las credenciales seguras** y no las compartas
- **Usa variables de entorno** en producción

## 🆘 Si Tienes Problemas

1. **Error de credenciales**: Verifica que copiaste todo el contenido del JSON
2. **Error de proyecto**: Asegúrate de que el `project_id` coincida con tu proyecto
3. **Error de permisos**: Verifica que las reglas de Firestore permitan escritura

## 🎯 Próximo Paso

Una vez configurado, ejecuta:
```bash
cd backend
npm run dev
``` 