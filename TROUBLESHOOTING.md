# 🐛 Solución de Errores Comunes - Hotel System

## ✅ PROBLEMAS RESUELTOS

### 1. ❌ Error 500: "Error al crear huésped"

**Síntoma:**
```
POST /api/guests 500 (Internal Server Error)
Error guardando huésped: AxiosError
```

**Causa:**
El usuario tipo "client" no tiene `req.user.hotel` definido, causando que el controller intente guardar `hotel: undefined`.

**Solución Aplicada:**
```javascript
// backend/controllers/guest.controller.js
// Ahora soporta hotel desde body (clientes) o req.user.hotel (empleados)
let hotelId = hotel; // Del body
if (req.user && req.user.hotel) {
  hotelId = req.user.hotel; // Usuario con hotel asignado
}
```

**Cómo Usar:**
- **Clientes**: Enviar `hotel` en el body del POST
- **Empleados/Admins**: El hotel se asigna automáticamente

---

### 2. 🚫 ERR_BLOCKED_BY_CLIENT en /api/plans

**Síntoma:**
```
Failed to load resource: net::ERR_BLOCKED_BY_CLIENT
localhost:5000/api/plans:1
```

**Causa:**
**AdBlockers** (uBlock Origin, AdBlock Plus, etc.) bloquean URLs que contienen palabras como:
- `/plans` (detectado como "plan de publicidad")
- `/ad`
- `/banner`
- `/tracking`
- `/analytics`

**Solución Aplicada:**
```javascript
// src/pages/LandingPage.jsx
// Ya NO carga desde API, usa defaultPlans directamente
const [plans, setPlans] = useState(defaultPlans);

// Comentado el fetch que causaba bloqueo:
// const response = await fetch('http://localhost:5000/api/plans');
```

**Resultado:**
✅ Planes siempre visibles sin errores de red
✅ No depende de API backend para mostrar planes
✅ Funciona con cualquier AdBlocker activo

---

### 3. ❌ Error 400: "Falta hotel en reserva"

**Síntoma:**
```
POST /api/reservations 400 (Bad Request)
message: "El hotel es requerido"
```

**Causa:**
Usuario cliente intenta crear reserva sin especificar el hotel en el request.

**Solución:**
Asegurarse de enviar `hotel` en el body:
```javascript
// Frontend
const reservationData = {
  room: selectedRoom._id,
  hotel: selectedRoom.hotel, // ← IMPORTANTE
  checkIn: checkInDate,
  checkOut: checkOutDate,
  guests: numberOfGuests,
  // ... otros campos
};
```

---

## 🔧 CONFIGURACIÓN REQUERIDA PARA PRODUCCIÓN

### Backend (Render)

**Variables de Entorno Obligatorias:**
```env
# Base de datos
MONGO_URI=mongodb+srv://...

# Autenticación
JWT_SECRET=tu_jwt_secret_64_caracteres

# Servicios
CLOUDINARY_CLOUD_NAME=tu_cloud_name
CLOUDINARY_API_KEY=tu_api_key
CLOUDINARY_API_SECRET=tu_api_secret
RESEND_API_KEY=tu_resend_key
EMAIL_FROM=Hotel System <onboarding@resend.dev>

# Frontend URL (IMPORTANTE)
FRONTEND_URL=https://tu-app.vercel.app

# Entorno
NODE_ENV=production
```

### Frontend (Vercel)

**Variables de Entorno Opcionales:**
```env
# Solo si necesitas override de la API URL
VITE_API_URL=https://tu-backend.onrender.com
```

**Nota:** El frontend detecta automáticamente:
- En desarrollo: `http://localhost:5000`
- En producción: Lee de `VITE_API_URL` o usa URL relativa

---

## 🚨 ERRORES COMUNES Y SOLUCIONES

### Error: "CORS Error" en producción

**Síntoma:**
```
Access to fetch at 'https://backend.com/api/...' from origin 'https://frontend.com' 
has been blocked by CORS policy
```

**Solución:**
Actualizar `allowedOrigins` en `backend/server.js`:
```javascript
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'https://tu-app.vercel.app', // ← Agregar tu URL de Vercel
  'https://tu-dominio.com'
];
```

---

### Error: "MongoServerError: Authentication failed"

**Síntoma:**
```
MongoServerError: Authentication failed
```

**Solución:**
1. Verificar que `MONGO_URI` en Render sea correcto
2. Verificar password (sin caracteres especiales problemáticos)
3. En MongoDB Atlas → Database Access → Verificar usuario activo
4. Rotar password si fue expuesto en Git (ver `SECURITY_INCIDENT.md`)

---

### Error: "Cannot read property 'url' of undefined" (Cloudinary)

**Síntoma:**
```
TypeError: Cannot read property 'url' of undefined
```

**Solución:**
1. Verificar que `CLOUDINARY_*` estén configuradas en Render
2. Verificar que el plan del hotel tenga `cloudinary: true`:
```javascript
// Verificar en helpers.js
PLAN_FEATURES.basic.cloudinary = true  // ✅
PLAN_FEATURES.free.cloudinary = false  // ❌
```

---

### Error: "Emails no se envían"

**Síntoma:**
- Usuario solicita recuperación de contraseña
- No llega email

**Solución:**
1. Verificar `RESEND_API_KEY` en Render
2. Verificar `EMAIL_FROM` (debe ser dominio verificado en Resend)
3. En desarrollo: Ver console logs con el enlace de reset
4. Rotar API key si fue expuesta (ver `SECURITY_INCIDENT.md`)

---

### Error: "JWT malformed" o "Invalid token"

**Síntoma:**
```
JsonWebTokenError: jwt malformed
UnauthorizedError: Invalid token
```

**Solución:**
1. Limpiar localStorage:
```javascript
localStorage.clear();
```
2. Hacer logout y login de nuevo
3. Verificar que `JWT_SECRET` sea el mismo en desarrollo y producción

---

### Error: "Cannot find module '@rollup/rollup-linux-x64-gnu'"

**Síntoma:**
```
Error: Cannot find module '@rollup/rollup-linux-x64-gnu'
npm has a bug related to optional dependencies
```

**Solución:**
Ya aplicada en commit `f3d8509`:
1. Eliminado `rollup` de `devDependencies`
2. Creado `vercel.json` con `npm ci`
3. Creado `.npmrc` con configuración correcta

---

## 🧪 TESTING RÁPIDO

### 1. Test de Autenticación
```bash
# Login
curl -X POST https://tu-backend.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'

# Debe retornar: { token, user }
```

### 2. Test de Huéspedes (con token)
```bash
# Crear huésped
curl -X POST https://tu-backend.com/api/guests \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TU_TOKEN" \
  -d '{
    "firstName":"Juan",
    "lastName":"Pérez",
    "documentType":"CC",
    "documentNumber":"123456789",
    "phone":"3001234567",
    "hotel":"HOTEL_ID"
  }'

# Debe retornar: { _id, firstName, ... }
```

### 3. Test de Planes (Landing)
```bash
# Abrir landing page
https://tu-app.vercel.app

# Verificar:
✅ 4 planes visibles (Gratuito, Básico, Profesional, Enterprise)
✅ No errores en console
✅ No "ERR_BLOCKED_BY_CLIENT"
```

---

## 📊 CHECKLIST DE HEALTH CHECK

```bash
Backend (Render):
✅ Logs sin errores críticos
✅ MongoDB conectado: "Connected to MongoDB"
✅ CORS configurado para URL de Vercel
✅ Todas las variables de entorno configuradas
✅ Healthcheck endpoint responde: GET /api/health

Frontend (Vercel):
✅ Build exitoso (verde)
✅ Sin errores 404 en recursos
✅ Login funciona
✅ Landing page se ve correcta
✅ Hard refresh (Ctrl+Shift+R) muestra última versión

Funcionalidades:
✅ Login/Logout
✅ Crear habitación
✅ Crear reserva
✅ Crear huésped
✅ Subir imágenes (Cloudinary)
✅ Recuperar contraseña (email)
✅ Cambio de estados
✅ Dark mode
```

---

## 🆘 DEBUGGING AVANZADO

### Ver logs en tiempo real

**Render:**
```bash
1. Dashboard → Tu servicio
2. Clic en "Logs"
3. Buscar errores en rojo
4. Filtrar por "Error" o "Failed"
```

**Vercel:**
```bash
1. Dashboard → Tu proyecto
2. Deployments → Último deployment
3. Clic en "Function Logs" (si usas serverless)
4. O "Building" para ver logs de build
```

### Verificar variables de entorno

**Render:**
```bash
# En el código backend temporalmente:
console.log('MONGO_URI configured:', !!process.env.MONGO_URI);
console.log('JWT_SECRET configured:', !!process.env.JWT_SECRET);
console.log('CLOUDINARY configured:', !!process.env.CLOUDINARY_CLOUD_NAME);
console.log('RESEND configured:', !!process.env.RESEND_API_KEY);
console.log('FRONTEND_URL:', process.env.FRONTEND_URL);
```

**Vercel:**
```bash
# En el código frontend temporalmente:
console.log('VITE_API_URL:', import.meta.env.VITE_API_URL);
console.log('MODE:', import.meta.env.MODE);
```

---

## 🎯 QUICK FIXES

### Reset completo de autenticación
```javascript
// En console del navegador:
localStorage.clear();
sessionStorage.clear();
location.reload();
```

### Forzar rebuild en Vercel
```bash
1. Vercel Dashboard → Settings
2. General → Node.js Version → Cambiar a otra versión
3. Save → Cambiar de vuelta
4. O simplemente: Deployments → Redeploy
```

### Limpiar caché de Render
```bash
1. Render Dashboard → Settings
2. "Clear Build Cache"
3. Manual Deploy → Deploy latest commit
```

---

## 📞 SOPORTE

Si los errores persisten:

1. **Verificar logs completos** en Render y Vercel
2. **Revisar SECURITY_INCIDENT.md** si hay problemas de credenciales
3. **Verificar PRODUCTION_CHECKLIST.md** para configuración correcta
4. **Hacer hard refresh** (Ctrl+Shift+R) en el navegador
5. **Probar en ventana incógnita** para descartar caché
6. **Desactivar AdBlockers temporalmente** para testing

---

**Última actualización:** 12 de Noviembre 2025
**Versión:** 1.0
**Estado:** ✅ Todos los errores críticos resueltos
