# Hotel System Backend API

API REST para el sistema de gestión hotelera.

## 🚀 Instalación

```bash
cd backend
npm install
```

## ⚙️ Configuración

1. Copia el archivo `.env` y configura las variables:
   - `PORT`: Puerto del servidor (default: 5000)
   - `MONGODB_URI`: URI de conexión a MongoDB
   - `JWT_SECRET`: Clave secreta para JWT
   - `NODE_ENV`: Entorno (development/production)

### Ejemplo de `.env` (útil para desarrollo)

```
PORT=5000
# URL de MongoDB local (si no existe, el servidor intentará conectar a mongodb://127.0.0.1:27017/hotel)
MONGODB_URI=mongodb://127.0.0.1:27017/hotel
JWT_SECRET=mi_clave_secreta
NODE_ENV=development
```

2. Asegúrate de tener MongoDB instalado y corriendo localmente, o usa MongoDB Atlas.

## 🏃‍♂️ Ejecución

```bash
# Modo desarrollo
npm run dev

# Modo producción
npm start
```

## 📚 Endpoints

### Autenticación
- `POST /api/auth/login` - Iniciar sesión
- `POST /api/auth/register` - Registrar usuario
- `GET /api/auth/me` - Obtener usuario actual

### Habitaciones
- `GET /api/rooms` - Listar habitaciones
- `GET /api/rooms/:id` - Obtener habitación
- `POST /api/rooms` - Crear habitación (Admin)
- `PUT /api/rooms/:id` - Actualizar habitación (Admin)
- `DELETE /api/rooms/:id` - Eliminar habitación (Admin)
- `PATCH /api/rooms/:id/status` - Actualizar estado

### Reservas
- `GET /api/reservations` - Listar reservas
- `GET /api/reservations/:id` - Obtener reserva
- `POST /api/reservations` - Crear reserva
- `PUT /api/reservations/:id` - Actualizar reserva
- `DELETE /api/reservations/:id` - Eliminar reserva (Admin)
- `PATCH /api/reservations/:id/status` - Actualizar estado

### Usuarios
- `GET /api/users` - Listar usuarios (Admin)
- `GET /api/users/:id` - Obtener usuario (Admin)
- `PUT /api/users/:id` - Actualizar usuario (Admin)
- `DELETE /api/users/:id` - Desactivar usuario (Admin)

## 🔑 Autenticación

Todas las rutas (excepto login y register) requieren un token JWT en el header:

```
Authorization: Bearer <token>
```

## 👥 Roles

- **admin**: Acceso completo
- **empleado**: Acceso limitado (no puede eliminar)
