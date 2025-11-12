# 🚀 Checklist para Producción en Render

## ✅ Variables de Entorno OBLIGATORIAS para Render

### 🔴 **CRÍTICAS (Sin estas NO funciona)**

```env
# MongoDB Atlas Connection
MONGO_URI=mongodb+srv://<USUARIO>:<PASSWORD>@cluster0.xxxxx.mongodb.net/HotelSystem?retryWrites=true&w=majority&appName=Cluster0

# JWT Secret (genera uno nuevo con: node -e "console.log(require('crypto').randomBytes(64).toString('hex'))")
JWT_SECRET=<GENERA_UNO_NUEVO_AQUI>

# Node Environment
NODE_ENV=production
```

### 🟡 **IMPORTANTES (Para features completas)**

```env
# Cloudinary - Para galería de imágenes (Plan Básico+)
CLOUDINARY_CLOUD_NAME=<TU_CLOUD_NAME>
CLOUDINARY_API_KEY=<TU_API_KEY>
CLOUDINARY_API_SECRET=<TU_API_SECRET>

# Resend - Para emails de verificación y recuperación
RESEND_API_KEY=<TU_RESEND_API_KEY>
EMAIL_FROM=Hotel System <onboarding@resend.dev>

# Frontend URL - Cambia por tu URL de Vercel/Netlify
FRONTEND_URL=https://tu-app.vercel.app
```

### 🟢 **OPCIONALES**

```env
# Puerto (Render lo asigna automáticamente, NO lo configures)
# PORT=5000  ← NO agregar en Render, lo asignan automáticamente
```

---

## 📋 **CÓMO AGREGAR EN RENDER**

### Opción 1: Dashboard Web
1. Ve a tu servicio en Render Dashboard
2. Clic en **"Environment"** en el menú lateral
3. Clic en **"Add Environment Variable"**
4. Agrega cada variable una por una:
   - **Key**: `MONGO_URI`
   - **Value**: `mongodb+srv://hotel_user:...`
5. Clic en **"Save Changes"**

### Opción 2: Archivo render.yaml (Recomendado)
Crea `render.yaml` en la raíz del proyecto:

```yaml
services:
  - type: web
    name: hotel-system-backend
    env: node
    buildCommand: cd backend && npm install
    startCommand: cd backend && npm start
    envVars:
      - key: NODE_ENV
        value: production
      - key: MONGO_URI
        sync: false  # Se configura manualmente en el dashboard
      - key: JWT_SECRET
        generateValue: true
      - key: CLOUDINARY_CLOUD_NAME
        sync: false
      - key: CLOUDINARY_API_KEY
        sync: false
      - key: CLOUDINARY_API_SECRET
        sync: false
      - key: RESEND_API_KEY
        sync: false
      - key: EMAIL_FROM
        value: Hotel System <onboarding@resend.dev>
      - key: FRONTEND_URL
        value: https://tu-app.vercel.app
```

---

## 🔍 **VERIFICAR QUÉ TIENES CONFIGURADO**

Revisa tu dashboard de Render:
- ✅ `MONGO_URI` debe estar presente
- ✅ `JWT_SECRET` debe estar presente
- ✅ `NODE_ENV=production`
- ⚠️ `CLOUDINARY_*` **SIN ESTAS, LA GALERÍA NO FUNCIONA**
- ⚠️ `RESEND_API_KEY` **SIN ESTA, NO SE ENVÍAN EMAILS**

---

## 🎯 **LO QUE FALTA EN LA APP**

### ✅ **IMPLEMENTADO Y FUNCIONAL**
1. ✅ Sistema de autenticación completo
2. ✅ Gestión de habitaciones
3. ✅ Gestión de reservas
4. ✅ Sistema multi-hotel
5. ✅ Límites por plan (Free: 10, Básico: 10, Professional: 100, Enterprise: ∞)
6. ✅ Galería de imágenes con Cloudinary (Básico+)
7. ✅ Control de usuarios y roles (Professional+)
8. ✅ Dark mode completo
9. ✅ Landing page con 4 planes
10. ✅ Restricciones por plan funcionando

### 🚧 **PENDIENTE (OPCIONAL)**
1. ⏳ Módulo de Reportes Avanzados (Enterprise)
   - Gráficas de ocupación
   - Análisis de ingresos
   - Exportación PDF/Excel
   
2. ⏳ API Keys para integraciones (Enterprise)
   - Documentación Swagger
   - API Keys por hotel
   - Webhooks

3. ⏳ Mejoras UX:
   - Notificaciones push
   - Chat en vivo
   - Tour guiado para nuevos usuarios

### ❌ **NO IMPLEMENTADO (NO CRÍTICO)**
- Sistema de pagos (Stripe/PayPal)
- App móvil nativa
- Integración con PMS externos
- Sistema de puntos de fidelidad

---

## 🔐 **SEGURIDAD EN PRODUCCIÓN**

### ✅ **YA IMPLEMENTADO**
- ✅ Passwords hasheados con bcrypt
- ✅ JWT para autenticación
- ✅ CORS configurado
- ✅ Validación de datos con express-validator
- ✅ Rate limiting básico
- ✅ Variables de entorno protegidas

### ⚠️ **RECOMENDACIONES ADICIONALES**
```javascript
// Agregar en server.js para más seguridad
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';
import xss from 'xss-clean';

app.use(helmet()); // Headers de seguridad
app.use(mongoSanitize()); // Prevenir inyección NoSQL
app.use(xss()); // Prevenir XSS
```

---

## 🌐 **CORS PARA FRONTEND**

Si tu frontend está en Vercel/Netlify, actualiza el CORS en `server.js`:

```javascript
// backend/server.js
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'https://tu-app.vercel.app',  // ← Agrega tu URL de producción
  'https://tu-dominio.com'
];

app.use(cors({
  origin: function(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));
```

---

## 📊 **MONITOREO EN PRODUCCIÓN**

### Render Dashboard
- **Logs**: Ve a "Logs" para ver errores en tiempo real
- **Metrics**: Revisa CPU, memoria y respuestas HTTP
- **Deploy**: Historial de deployments

### MongoDB Atlas
- **Metrics**: Conexiones activas, operaciones/segundo
- **Alerts**: Configura alertas para problemas
- **Backups**: Habilita backups automáticos

### Cloudinary Dashboard
- **Usage**: Verifica almacenamiento usado
- **Media Library**: Ve todas las imágenes subidas
- **Transformations**: Optimizaciones aplicadas

### Resend Dashboard
- **Emails**: Ve todos los emails enviados
- **Deliverability**: Tasa de entrega
- **Logs**: Errores de envío

---

## 🚨 **PROBLEMAS COMUNES EN PRODUCCIÓN**

### 1. "Cannot read property 'url' of undefined" (Cloudinary)
**Causa**: Cloudinary no configurado
**Solución**: Agregar `CLOUDINARY_*` variables en Render

### 2. "Emails no se envían"
**Causa**: Resend no configurado
**Solución**: Agregar `RESEND_API_KEY` en Render

### 3. "MongoError: Authentication failed"
**Causa**: Credenciales incorrectas
**Solución**: Verificar `MONGO_URI` en Render

### 4. "CORS Error"
**Causa**: Frontend URL no permitida
**Solución**: Actualizar `allowedOrigins` en server.js

### 5. "Port already in use"
**Causa**: No usar `process.env.PORT`
**Solución**: En server.js debe ser: `const PORT = process.env.PORT || 5000`

---

## ✅ **CHECKLIST FINAL ANTES DE DEPLOY**

```bash
# En tu .env local (NO subir a GitHub)
✅ MONGO_URI configurado
✅ JWT_SECRET seguro
✅ CLOUDINARY_* configurado
✅ RESEND_API_KEY configurado
✅ FRONTEND_URL apunta a producción

# En Render Dashboard
✅ Todas las variables agregadas
✅ NODE_ENV=production
✅ Build command: cd backend && npm install
✅ Start command: cd backend && npm start
✅ Despliegue automático activado (Auto-Deploy)

# Testing
✅ Login funciona
✅ Crear habitación funciona
✅ Subir imágenes funciona (Básico+)
✅ Crear usuarios funciona (Professional+)
✅ Emails se envían
✅ CORS permite frontend
```

---

## 🎉 **TU APP ESTÁ LISTA**

Con estas variables configuradas en Render, tu aplicación tendrá:

1. ✅ **Autenticación completa**
2. ✅ **Gestión de hoteles multi-tenant**
3. ✅ **Galería de imágenes profesional** (Cloudinary)
4. ✅ **Sistema de emails** (Resend)
5. ✅ **Restricciones por plan** funcionando
6. ✅ **100% funcional para hoteles reales**

### 🚀 **Lo ÚNICO que falta (opcional para v2):**
- Reportes avanzados para Enterprise
- API Keys para integraciones
- Sistema de pagos

**¡Tu MVP está completo y listo para producción!** 🎊
