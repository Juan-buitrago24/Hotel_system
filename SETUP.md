# 🏨 Hotel System - Guía de Instalación y Ejecución

Sistema completo de gestión hotelera con Frontend (React) y Backend (Node.js + MongoDB).

## 📋 Requisitos Previos

- Node.js v16 o superior
- MongoDB instalado y corriendo
- Git (opcional)

## 🚀 Instalación

### 1. Instalar MongoDB

#### Windows:
1. Descarga MongoDB Community Server desde: https://www.mongodb.com/try/download/community
2. Instala siguiendo el asistente
3. MongoDB se ejecutará como servicio automáticamente

#### Verificar MongoDB:
```powershell
mongod --version
```

### 2. Instalar Dependencias del Backend

```powershell
cd backend
npm install
```

### 3. Instalar Dependencias del Frontend

```powershell
cd ..
npm install
```

## ⚙️ Configuración

### Backend (.env)
El archivo `backend/.env` ya está configurado con valores por defecto:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/hotel_system
JWT_SECRET=tu_clave_secreta_super_segura_cambiar_en_produccion
NODE_ENV=development
```

### Frontend (.env)
El archivo `.env` del frontend ya está configurado:
```
VITE_API_URL=http://localhost:5000/api
```

## 🎯 Ejecución

### Opción 1: Ejecutar todo manualmente

#### Terminal 1 - Backend:
```powershell
cd backend
npm run dev
```
El servidor correrá en: http://localhost:5000

#### Terminal 2 - Frontend:
```powershell
npm run dev
```
El cliente correrá en: http://localhost:5173

### Opción 2: Script de inicio rápido

Crea un archivo `start.ps1` en la raíz:
```powershell
# Iniciar MongoDB (si no está como servicio)
# Start-Process mongod

# Iniciar Backend
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd backend; npm run dev"

# Esperar 3 segundos
Start-Sleep -Seconds 3

# Iniciar Frontend
Start-Process powershell -ArgumentList "-NoExit", "-Command", "npm run dev"
```

Ejecutar:
```powershell
.\start.ps1
```

## 👤 Crear Usuario Inicial

Una vez que el backend esté corriendo, crea un usuario administrador:

### Usando PowerShell:
```powershell
$body = @{
    username = "admin"
    password = "admin123"
    name = "Administrador"
    role = "admin"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:5000/api/auth/register" -Method Post -Body $body -ContentType "application/json"
```

### Usando curl:
```powershell
curl -X POST http://localhost:5000/api/auth/register -H "Content-Type: application/json" -d '{\"username\":\"admin\",\"password\":\"admin123\",\"name\":\"Administrador\",\"role\":\"admin\"}'
```

### Crear más usuarios:
```powershell
# Empleado
$body = @{
    username = "empleado"
    password = "emp123"
    name = "Empleado Hotel"
    role = "empleado"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:5000/api/auth/register" -Method Post -Body $body -ContentType "application/json"
```

## 📝 Datos de Prueba

### Crear Habitaciones de Ejemplo:

Primero inicia sesión y guarda el token:
```powershell
$response = Invoke-RestMethod -Uri "http://localhost:5000/api/auth/login" -Method Post -Body '{"username":"admin","password":"admin123"}' -ContentType "application/json"
$token = $response.token
$headers = @{ "Authorization" = "Bearer $token" }
```

Crear habitaciones:
```powershell
# Habitación 101
$room1 = @{
    number = "101"
    type = "simple"
    capacity = 2
    price = 50
    floor = 1
    amenities = @("WiFi", "TV", "Aire acondicionado")
    description = "Habitación simple en el primer piso"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:5000/api/rooms" -Method Post -Body $room1 -Headers $headers -ContentType "application/json"

# Habitación 201
$room2 = @{
    number = "201"
    type = "doble"
    capacity = 4
    price = 80
    floor = 2
    amenities = @("WiFi", "TV", "Minibar", "Balcón")
    description = "Habitación doble con vista"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:5000/api/rooms" -Method Post -Body $room2 -Headers $headers -ContentType "application/json"

# Suite 301
$room3 = @{
    number = "301"
    type = "suite"
    capacity = 6
    price = 150
    floor = 3
    amenities = @("WiFi", "TV", "Jacuzzi", "Sala", "Cocina")
    description = "Suite de lujo"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:5000/api/rooms" -Method Post -Body $room3 -Headers $headers -ContentType "application/json"
```

## 🌐 Acceso a la Aplicación

1. Abre tu navegador
2. Ve a: http://localhost:5173
3. Inicia sesión con:
   - **Usuario:** admin
   - **Contraseña:** admin123

## 📚 Estructura del Proyecto

```
Hotel_system/
├── backend/                 # API REST
│   ├── config/             # Configuración de DB
│   ├── controllers/        # Lógica de negocio
│   ├── models/             # Modelos de datos
│   ├── routes/             # Rutas de la API
│   ├── middleware/         # Middlewares
│   └── server.js           # Punto de entrada
├── src/                    # Frontend React
│   ├── components/         # Componentes React
│   ├── pages/              # Páginas
│   ├── services/           # API client
│   ├── context/            # Context API
│   └── utils/              # Utilidades
└── public/                 # Archivos estáticos
```

## 🔧 Funcionalidades Implementadas

### Backend:
✅ Autenticación JWT
✅ CRUD de Habitaciones
✅ CRUD de Reservas
✅ Gestión de Usuarios
✅ Validación de disponibilidad
✅ Cálculo automático de precios
✅ Roles y permisos

### Frontend:
✅ Login con JWT
✅ Módulo de Reservas
✅ Módulo de Habitaciones
✅ Interfaz responsive
✅ Filtros y búsqueda
✅ Estadísticas visuales
✅ Gestión de estados

## 🐛 Solución de Problemas

### MongoDB no se conecta:
```powershell
# Verificar que MongoDB esté corriendo
Get-Service MongoDB

# Si no está corriendo:
net start MongoDB
```

### Puerto 5000 ocupado:
Cambia el puerto en `backend/.env`:
```
PORT=5001
```
Y en `.env` del frontend:
```
VITE_API_URL=http://localhost:5001/api
```

### Error de CORS:
El backend ya tiene CORS habilitado. Verifica que las URLs coincidan.

## 📖 Documentación de API

Ver documentación completa en: `backend/README.md`

## 🎨 Tecnologías Utilizadas

- **Frontend:** React 18, Vite, Tailwind CSS, Axios, Lucide Icons
- **Backend:** Node.js, Express, MongoDB, Mongoose, JWT, bcrypt
- **Tools:** ESM modules, dotenv, express-validator

## 🚀 Próximas Funcionalidades

- [ ] Dashboard con gráficas
- [ ] Módulo de Huéspedes
- [ ] Reportes en PDF
- [ ] Sistema de pagos
- [ ] Check-in/Check-out QR
- [ ] Notificaciones en tiempo real

## 👨‍💻 Desarrollo

Para contribuir o desarrollar nuevas funcionalidades, consulta las guías en `/docs`

---

**¡Listo para mostrar avances! 🎉**
