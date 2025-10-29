# 🏨 Hotel System - Sistema de Gestión Hotelera

Sistema completo de gestión hotelera con Frontend (React + Vite + Tailwind) y Backend (Node.js + Express + MongoDB).

## ✨ Características

### Backend API (Node.js + Express + MongoDB)
- ✅ **Autenticación JWT** - Sistema seguro de login con tokens
- ✅ **CRUD Completo de Habitaciones** - Gestión total de habitaciones
- ✅ **CRUD Completo de Reservas** - Reservas con validación de disponibilidad
- ✅ **Gestión de Usuarios** - Roles (Admin/Empleado) y permisos
- ✅ **Validaciones** - Validación de datos con express-validator
- ✅ **Cálculo Automático** - Precios calculados según estancia
- ✅ **Control de Estados** - Estados de habitaciones y reservas

### Frontend (React 18 + Vite + Tailwind CSS)
- ✅ **Módulo de Reservas** - Crear, editar, eliminar reservas
- ✅ **Módulo de Habitaciones** - Gestión completa con filtros
- ✅ **Dashboard Visual** - Estadísticas en tiempo real
- ✅ **Diseño Responsive** - Funciona en móvil, tablet y desktop
- ✅ **Filtros Avanzados** - Búsqueda por estado, tipo, piso
- ✅ **Interfaz Moderna** - UI/UX profesional con Tailwind
- ✅ **Gestión de Estados** - React Context + useState

## 🚀 Inicio Rápido

### Requisitos
- Node.js v16+
- MongoDB instalado y corriendo

### Instalación

```bash
# 1. Instalar dependencias del backend
cd backend
npm install

# 2. Instalar dependencias del frontend
cd ..
npm install
```

### Ejecución

#### Opción 1: Script automático (Windows)
```powershell
.\start.ps1
```

#### Opción 2: Manual

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
npm run dev
```

### Crear Usuario y Datos

**1. Crear usuario administrador:**
```powershell
.\create-admin.ps1
```

**2. Crear habitaciones de ejemplo:**
```powershell
.\create-rooms.ps1
```

### Acceder
- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:5000
- **Credenciales:** admin / admin123

## 📁 Estructura del Proyecto

```
Hotel_system/
├── backend/                    # Backend API
│   ├── config/                # Configuración de base de datos
│   ├── controllers/           # Lógica de negocio
│   │   ├── auth.controller.js
│   │   ├── room.controller.js
│   │   ├── reservation.controller.js
│   │   └── user.controller.js
│   ├── models/                # Modelos de MongoDB
│   │   ├── User.model.js
│   │   ├── Room.model.js
│   │   └── Reservation.model.js
│   ├── routes/                # Rutas de la API
│   │   ├── auth.routes.js
│   │   ├── room.routes.js
│   │   ├── reservation.routes.js
│   │   └── user.routes.js
│   ├── middleware/            # Middlewares de autenticación
│   └── server.js              # Servidor Express
│
├── src/                       # Frontend React
│   ├── components/           # Componentes reutilizables
│   │   ├── Button.jsx
│   │   ├── Header.jsx
│   │   ├── Navigation.jsx
│   │   ├── RoomCard.jsx
│   │   ├── RoomModal.jsx
│   │   ├── ReservationRow.jsx
│   │   └── ...
│   ├── pages/                # Páginas principales
│   │   ├── RoomsPage.jsx
│   │   └── ReservationsPage.jsx
│   ├── services/             # Cliente API
│   │   └── api.js
│   ├── context/              # Context API
│   └── utils/                # Utilidades
│
├── SETUP.md                  # Guía detallada de instalación
├── start.ps1                 # Script de inicio automático
├── create-admin.ps1          # Crear usuario admin
└── create-rooms.ps1          # Crear habitaciones de prueba
```

## 🎯 Módulos Implementados

### 1. 🔐 Autenticación
- Login con JWT
- Registro de usuarios
- Roles y permisos (Admin/Empleado)
- Protección de rutas

### 2. 🏨 Gestión de Habitaciones
- Crear/Editar/Eliminar habitaciones (Admin)
- Filtros por estado, tipo y piso
- Estados: Disponible, Ocupada, Limpieza, Mantenimiento
- Tipos: Simple, Doble, Suite, Familiar
- Servicios y amenidades
- Estadísticas visuales

### 3. 📅 Gestión de Reservas
- Crear/Editar/Eliminar reservas
- Validación de disponibilidad
- Cálculo automático de precios
- Estados: Pendiente, Confirmada, En curso, Completada, Cancelada
- Información de huéspedes
- Vista de calendario

## 🔧 API Endpoints

### Autenticación
```
POST   /api/auth/login       - Iniciar sesión
POST   /api/auth/register    - Registrar usuario
GET    /api/auth/me          - Obtener usuario actual
```

### Habitaciones
```
GET    /api/rooms            - Listar habitaciones
GET    /api/rooms/:id        - Obtener habitación
POST   /api/rooms            - Crear habitación (Admin)
PUT    /api/rooms/:id        - Actualizar habitación (Admin)
DELETE /api/rooms/:id        - Eliminar habitación (Admin)
PATCH  /api/rooms/:id/status - Actualizar estado
```

### Reservas
```
GET    /api/reservations           - Listar reservas
GET    /api/reservations/:id       - Obtener reserva
POST   /api/reservations           - Crear reserva
PUT    /api/reservations/:id       - Actualizar reserva
DELETE /api/reservations/:id       - Eliminar reserva (Admin)
PATCH  /api/reservations/:id/status - Actualizar estado
```

## 🛠️ Tecnologías

### Backend
- **Node.js** - Runtime de JavaScript
- **Express** - Framework web
- **MongoDB** - Base de datos NoSQL
- **Mongoose** - ODM para MongoDB
- **JWT** - Autenticación con tokens
- **bcryptjs** - Encriptación de contraseñas
- **express-validator** - Validación de datos

### Frontend
- **React 18** - Librería UI
- **Vite** - Build tool
- **Tailwind CSS** - Framework CSS
- **Axios** - Cliente HTTP
- **Lucide React** - Iconos
- **Context API** - Gestión de estado

## 📚 Documentación Adicional

- [SETUP.md](./SETUP.md) - Guía detallada de instalación
- [backend/README.md](./backend/README.md) - Documentación del API

## 🎨 Capturas de Pantalla

### Módulo de Habitaciones
- Vista en grid con cards
- Filtros por estado, tipo y piso
- Estadísticas visuales
- Gestión completa (CRUD)

### Módulo de Reservas
- Tabla de reservas
- Calendario visual
- Formulario completo
- Validación de disponibilidad

## 🚧 Próximas Funcionalidades

- [ ] Dashboard con gráficas estadísticas
- [ ] Módulo de Huéspedes completo
- [ ] Sistema de reportes en PDF
- [ ] Integración de pagos
- [ ] Check-in/Check-out con QR
- [ ] Notificaciones en tiempo real (WebSockets)
- [ ] Chat interno
- [ ] Sistema de inventarios
- [ ] Gestión de servicios adicionales

## 📝 Comandos Útiles

```bash
# Desarrollo
npm run dev              # Frontend en modo desarrollo
cd backend && npm run dev # Backend en modo desarrollo

# Producción
npm run build            # Compilar frontend
npm run preview          # Vista previa de producción
```

## 🐛 Solución de Problemas

Ver [SETUP.md](./SETUP.md) para soluciones a problemas comunes.

## 👥 Roles y Permisos

### Administrador
- Acceso total a todas las funcionalidades
- Crear/Editar/Eliminar habitaciones
- Crear/Editar/Eliminar reservas
- Gestión de usuarios

### Empleado
- Ver todas las habitaciones
- Crear y editar reservas
- Actualizar estados
- No puede eliminar

## 📄 Licencia

Este proyecto es de código abierto para fines educativos.

---

**Desarrollado con ❤️ para mostrar avances del proyecto**
