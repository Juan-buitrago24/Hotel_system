# Guía de Inicio Rápido - Prueba de Login

## 🚀 Pasos para Iniciar el Sistema

### 1. Iniciar Backend (Terminal 1)
```bash
cd backend
npm run dev
```

**Debe mostrar:**
```
🚀 Servidor corriendo en puerto 5000
✅ MongoDB conectado: 127.0.0.1
```

### 2. Iniciar Frontend (Terminal 2)
```bash
# Desde la raíz del proyecto
npm run dev
```

**Debe mostrar:**
```
➜  Local:   http://localhost:5173/
```

### 3. Abrir el Navegador
Ir a: **http://localhost:5173**

---

## 👥 Credenciales de Prueba

### Opción 1: Usuario Admin
```
Username: admin
Password: admin123
```

### Opción 2: Usuario Empleado
```
Username: empleado
Password: empleado123
```

### Opción 3: Usuario Sebastian (si existe)
```
Username: Sebastian
Password: [la contraseña que usaste al registrarte]
```

---

## ❗ Problemas Comunes

### Problema 1: "Credenciales inválidas"

**Causa:** El username o password son incorrectos.

**Solución:** Verifica que estés usando exactamente:
- Username: `admin` (en minúsculas, sin espacios)
- Password: `admin123`

### Problema 2: Backend no responde

**Síntomas:**
- La página se queda cargando
- Error de red en la consola del navegador

**Solución:**
```bash
# Verificar que el backend esté corriendo
# En una nueva terminal:
curl http://localhost:5000/api/auth/test
# o en PowerShell:
(Invoke-WebRequest http://localhost:5000).StatusCode
```

Si no responde, reinicia el backend:
```bash
cd backend
npm run dev
```

### Problema 3: Puerto 5000 en uso

**Error:**
```
Error: listen EADDRINUSE: address already in use :::5000
```

**Solución:**
```bash
# Encontrar el proceso que usa el puerto 5000
netstat -ano | findstr :5000

# Matar el proceso (reemplaza PID con el número que encontraste)
taskkill /PID <PID> /F

# Reiniciar el backend
cd backend
npm run dev
```

### Problema 4: MongoDB no conecta

**Error:**
```
Error: connect ECONNREFUSED 127.0.0.1:27017
```

**Solución:**
```bash
# Iniciar MongoDB
# Opción 1: Servicio de Windows
net start MongoDB

# Opción 2: MongoDB Compass
# Abrir MongoDB Compass y conectar

# Opción 3: Comando directo
mongod --dbpath C:\data\db
```

---

## 🧪 Verificar que los Usuarios Existen

```bash
# Desde la raíz del proyecto
node backend/check-users.js
```

**Debe mostrar:**
```
📋 Usuarios en la base de datos:

👤 admin (admin)
   Email: admin@hotel.com
   Active: true
   Verified: true

👤 empleado (empleado)
   Email: empleado@hotel.com
   Active: true
   Verified: true
```

---

## 🔍 Debugging del Login

Si aún no funciona, abre la **Consola del Navegador** (F12) y busca errores:

### Error típico 1:
```
POST http://localhost:5173/api/auth/login 404 (Not Found)
```
**Causa:** El proxy de Vite no está configurado correctamente.

**Solución:** Verifica `vite.config.js`:
```javascript
export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true
      }
    }
  }
})
```

### Error típico 2:
```
POST http://localhost:5000/api/auth/login net::ERR_CONNECTION_REFUSED
```
**Causa:** El backend no está corriendo.

**Solución:** Inicia el backend (ver paso 1).

---

## ✅ Login Exitoso

Cuando el login funcione, verás:

1. **En la consola del navegador:**
```javascript
{
  token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  user: {
    id: "...",
    username: "admin",
    name: "Administrador",
    role: "admin",
    verified: true
  }
}
```

2. **En la interfaz:**
- Se cerrará el modal de login
- Aparecerá el Dashboard
- En el header se mostrará tu nombre

---

## 📞 Si Nada Funciona

Prueba el login directamente con curl/PowerShell:

### PowerShell:
```powershell
$body = @{
    username = "admin"
    password = "admin123"
} | ConvertTo-Json

$response = Invoke-RestMethod -Uri "http://localhost:5000/api/auth/login" -Method Post -Body $body -ContentType "application/json"

$response
```

### Git Bash / curl:
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

**Respuesta esperada:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "69098d79d8ed6263f9b8615c",
    "username": "admin",
    "name": "Administrador",
    "role": "admin",
    "email": "admin@hotel.com",
    "verified": true
  }
}
```

---

## 🎯 Siguiente Paso

Una vez que puedas iniciar sesión:
1. ✅ Probar las restricciones visuales (admin vs empleado)
2. ✅ Verificar que los mensajes informativos aparezcan
3. ✅ Confirmar que el backend autoriza correctamente
4. ✅ Subir cambios a GitHub

¿Necesitas ayuda con algún paso específico?
