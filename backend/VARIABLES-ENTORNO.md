# 🔥 Variables de Entorno para Vercel

## Variables de Firebase (OBLIGATORIAS)

Configura estas variables en el dashboard de Vercel:

### FIREBASE_PROJECT_ID
```
proy-alojamientos
```

### FIREBASE_PRIVATE_KEY_ID
```
9ceca4973018fae5657d5dca592ccb07b442e866
```

### FIREBASE_PRIVATE_KEY
```
-----BEGIN PRIVATE KEY-----
MIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDC/QROOMcAWmBg
1ataXWBCdnpdqwlnp75V1AZemPmH8o990XIkCPF4XkNULuuiuXrHGSuQ8Us7TMVr
87ukK54iJzDLla4LeSiaUefMNUlR1MzqILsc8JaIBdI0Q67h7NjFzzaKBdkoZmyg
B8oAQRO8b1MzvJxjsWmN+XX8Mwv/r/pZxU4i0/RyId6gJbooWnrvlj2s56sanJEZ
QaiXISkfA191ybZywTSoWdQXUQOhGdTPKdNhvIkwcHmCvHwUneVl/PzNTaqSSPq0
SMDdQGToKi3RIWZpqG+IEHBGCh+jn4p2gRKDT2uPB1j9ppWaXu5YlBrrjuc55Isq
ZcZfE44dAgMBAAECggEAGKhFRJ0CcUV8fZJXjmBTfWQdGj44PL7mH1VmDs1adLoU
Mi1ruSnWW0nUSs96JcQ9xfKlYzlYMaIGLx4NwvdvElORZJVDgpjqLQWhgd3VLT9z
QEIuVz0HVCEkUU6jzVcVnIIVHAQcT3MQVnZVsY2JMOGFDHxT7HlxZy4+IMvVvxnp
t4a8OpFq2lTgqQ4P5XtCstNizV+Dz5Ygs6/oofbx+pxMR8fjaMjA1B7gGa+dGRle
SVkWuZadxPUxIVOanouuu8YbJrRo7VJnGU7iT0lgEbipzD5cJ350FgsqAVoV8s3d
W/R7z/t6KK4xtUgelZhIMybQI+mUYNwJt1tqtcdJYQKBgQDuSbG7F2FBwGztkUfy
Og1M9cn548XxinoOPYCTtUO9GxCfl1DBG9oeCp7zrrlcN2arLKYP1z4ENCgsKPTw
s5Qi5LCAjrFBMLUq3xoRc29+rEi/Y7bwHQvRiENZ5VROPnD5MNMOHBSqWxnSsclB
c8f1i83t2dhwf48NMvZj4UlL7QKBgQDRe2Ox5PRoOfR7fkOMmwCFUHT3S1aaSKxF
bJP85nMduSe+lazc6mmQU4K+KkvbWQFBfZb1q3ldgYMBdCMC11JXqIS5AsZ+u/9T
mj62ouUTLPwG5x3/UN8LHixxaOifX1l37r64akdWhQyab/MEfpljO6sfeH34/hAI
pmQvYMTk8QKBgQCQAS1NucVm7RlnQONP+dFL70ZOpF5dqKg2ruhjW6pCQHb9W37M
FT7t5NFGxxLyLfD4BZWeASBTfgnBFkdgp8YgiEA6kQGCOiNic03XugFpdkjIkURf
O86GpGi/jR4z4vx3PBBweHvsr/2dHSBZU9VGCWU8Fuj8o7oZ6fCJT/7xyQKBgQCJ
3RXYjuDW80VWPNvB3oTyN+gylA9zzF4r9nBSoWujZSamBCVW4qMEzCEge/+eZS4x
ZrECD475HfIU89TS2tijPhHTHON7psg7wiiB1CTEgPeAp3wTeqq/y2TeYnet43ej
Oamk/rTiWP/ZZ9Hc5GCYcT2GoaruQm5U8wS+NYZ/UQKBgGNaE/3/ApyBe5TAvC67
sW7P1//JMmI2DeImstocbsULNZTvGdK+hLfiH/ovH+wIQ26NelUWbhOO9EakiM6B
5XaKr3pT2o80YYmyyu0bONpif90OUnJS+UNBivLN6re87oJ7BJviB1aWDStT9t1k
X5U6Y+MQPWVY3rG0/y1M/Xfi
-----END PRIVATE KEY-----
```

### FIREBASE_CLIENT_EMAIL
```
firebase-adminsdk-fbsvc@proy-alojamientos.iam.gserviceaccount.com
```

### FIREBASE_CLIENT_ID
```
104809037414824758023
```

### FIREBASE_AUTH_URI
```
https://accounts.google.com/o/oauth2/auth
```

### FIREBASE_TOKEN_URI
```
https://oauth2.googleapis.com/token
```

### FIREBASE_AUTH_PROVIDER_X509_CERT_URL
```
https://www.googleapis.com/oauth2/v1/certs
```

### FIREBASE_CLIENT_X509_CERT_URL
```
https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-fbsvc%40proy-alojamientos.iam.gserviceaccount.com
```

### FIREBASE_UNIVERSE_DOMAIN
```
googleapis.com
```

## Variables del Servidor (OPCIONALES)

### NODE_ENV
```
production
```

### FRONTEND_URL
```
https://tu-frontend.vercel.app
```
*Reemplaza con la URL real de tu frontend desplegado*

## 📋 Cómo configurar en Vercel:

1. Ve a tu proyecto en Vercel Dashboard
2. Ve a Settings > Environment Variables
3. Agrega cada variable con su valor correspondiente
4. Asegúrate de que estén marcadas para "Production", "Preview" y "Development"

## 🔒 Seguridad

- ✅ Las credenciales ya no están hardcodeadas en el código
- ✅ Las variables se cargan desde el entorno de Vercel
- ✅ El código está listo para producción 
 