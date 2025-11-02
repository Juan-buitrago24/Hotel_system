# 🏨 Guía de Configuración de Base de Datos - Hotel System

## ✅ Estado Actual

- ✅ Archivo `.env` configurado en `backend/`
- ✅ Código actualizado para conectar a MongoDB
- ⏳ Pendiente: Instalar y ejecutar MongoDB

## 🎯 Opciones para la Base de Datos

Tienes 3 opciones para conectar la base de datos:

---

## Opción 1: MongoDB Local (Recomendado para desarrollo)

### 📥 Paso 1: Instalar MongoDB Community Edition

#### Método A: Instalador MSI (Recomendado)
1. Descarga MongoDB Community Server desde:
   ```
   https://www.mongodb.com/try/download/community
   ```
2. Ejecuta el instalador `.msi`
3. Durante la instalación:
   - Selecciona "Complete" installation
   - ✅ Marca "Install MongoDB as a Service" (recomendado)
   - ✅ Marca "Install MongoDB Compass" (GUI opcional pero útil)

#### Método B: Chocolatey (si tienes Chocolatey instalado)
```powershell
choco install mongodb
```

### 🚀 Paso 2: Iniciar MongoDB

#### Si instalaste como servicio (recomendado):
```powershell
# Verificar si el servicio existe
Get-Service -Name MongoDB

# Iniciar el servicio
Start-Service -Name MongoDB

# Verificar que está corriendo
Get-Service -Name MongoDB
```

#### Si NO instalaste como servicio, usa el script incluido:
```powershell
# En una terminal PowerShell separada (dejar abierta):
.\start-mongodb.ps1
```

O manualmente:
```powershell
# Crear carpeta de datos
New-Item -Path "C:\data\db" -ItemType Directory -Force

# Iniciar MongoDB (ajusta la ruta a tu versión)
& "C:\Program Files\MongoDB\Server\7.0\bin\mongod.exe" --dbpath "C:\data\db"
```

### ▶️ Paso 3: Iniciar el Backend

```powershell
# Opción fácil - usa el script:
.\start-backend.ps1

# O manualmente:
cd backend
npm run dev
```

Deberías ver:
```
✅ MongoDB conectado: 127.0.0.1
🚀 Servidor corriendo en puerto 5000
```

---

## Opción 2: MongoDB Atlas (Cloud - Gratis)

Si prefieres no instalar MongoDB localmente:

### 📝 Paso 1: Crear cuenta en MongoDB Atlas
1. Ve a: https://www.mongodb.com/cloud/atlas
2. Crea una cuenta gratuita
3. Crea un cluster (selecciona el plan FREE - M0)

### 🔑 Paso 2: Obtener la Connection String
1. En Atlas, haz clic en "Connect" en tu cluster
2. Selecciona "Connect your application"
3. Copia la connection string (parecida a):
   ```
   mongodb+srv://usuario:<password>@cluster0.xxxxx.mongodb.net/HotelSystem?retryWrites=true&w=majority
   ```

### ⚙️ Paso 3: Actualizar el archivo .env
Edita `backend\.env` y reemplaza la línea de MONGO_URI:
```properties
MONGO_URI=mongodb+srv://USUARIO:PASSWORD@cluster0.xxxxx.mongodb.net/HotelSystem?retryWrites=true&w=majority
JWT_SECRET=tu_clave_secreta_aqui
NODE_ENV=development
```

**Importante:** Reemplaza `USUARIO`, `PASSWORD` y `cluster0.xxxxx` con tus credenciales reales de MongoDB Atlas.

### ▶️ Paso 4: Iniciar el Backend
```powershell
cd backend
npm run dev
```

---

## Opción 3: Docker (Para usuarios avanzados)

Si tienes Docker Desktop instalado:

```powershell
# Iniciar MongoDB en un contenedor
docker run -d -p 27017:27017 --name mongodb-hotel mongo:latest

# Iniciar el backend
cd backend
npm run dev
```

Para detener:
```powershell
docker stop mongodb-hotel
```

---

## 🧪 Verificar la Conexión

Una vez iniciado el backend, verifica en el navegador:
```
http://localhost:5000
```

Deberías ver:
```json
{
  "message": "Hotel System API funcionando correctamente"
}
```

---

## 🔧 Solución de Problemas

### Error: "failed to connect to server"
- ✅ Verifica que MongoDB esté corriendo: `Get-Process -Name mongod`
- ✅ Verifica el puerto 27017: `netstat -an | findstr 27017`

### Error: "Authentication failed"
- ✅ Revisa las credenciales en tu connection string de Atlas
- ✅ Verifica que tu IP esté en la whitelist de Atlas

### Error: "The uri parameter must be a string, got undefined"
- ✅ Verifica que el archivo `backend\.env` existe
- ✅ Verifica que la variable `MONGO_URI` o `MONGODB_URI` esté definida

### MongoDB no arranca
- ✅ Verifica que la carpeta `C:\data\db` existe
- ✅ Verifica permisos de escritura en esa carpeta
- ✅ Revisa los logs en: `C:\data\db\mongod.log`

---

## 📚 Próximos Pasos

Una vez que la conexión funcione:

1. **Crear usuario admin inicial:**
   ```powershell
   .\create-admin.ps1
   ```

2. **Crear habitaciones de prueba:**
   ```powershell
   .\create-rooms.ps1
   ```

3. **Iniciar el frontend:**
   ```powershell
   npm run dev
   ```

---

## 🆘 ¿Necesitas Ayuda?

Si tienes problemas, copia el mensaje de error completo que aparece en la terminal cuando ejecutas `npm run dev` en el backend.
