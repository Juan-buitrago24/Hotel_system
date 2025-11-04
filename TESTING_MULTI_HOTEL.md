# Testing del Sistema Multi-Hotel

## ✅ Sistema Implementado

El sistema ya está configurado para manejar múltiples hoteles. Aquí está lo que se hizo:

### 1. Modelos Actualizados
- ✅ `Hotel.model.js` - Nuevo modelo
- ✅ `User.model.js` - Agregado campo `hotel` (ObjectId)
- ✅ `Room.model.js` - Agregado campo `hotel` (ObjectId)
- ✅ `Reservation.model.js` - Agregado campo `hotel` (ObjectId)

### 2. Middleware Creado
- ✅ `hotel.middleware.js` - Filtrado automático por hotel
  - `filterByHotel()` - Filtra queries por hotel del usuario
  - `assignHotel()` - Asigna hotel a nuevos documentos
  - `requireSuperAdmin()` - Solo para super_admin

### 3. Controladores y Rutas
- ✅ `hotel.controller.js` - CRUD de hoteles
- ✅ `hotel.routes.js` - Endpoints de hoteles
- ✅ Rutas actualizadas con filtro de hotel:
  - `room.routes.js`
  - `reservation.routes.js`

### 4. Jerarquía de Roles

```
super_admin (Plataforma)
├─ Ve TODOS los hoteles
├─ Puede crear hoteles
└─ Gestiona facturación

hotel_admin (Administrador del Hotel)
├─ Ve solo SU hotel
├─ Crea empleados de SU hotel
├─ Gestiona habitaciones y reservas
└─ No ve otros hoteles

admin (Compatibilidad)
└─ Equivalente a hotel_admin

empleado (Empleado del Hotel)
├─ Ve solo SU hotel
├─ Permisos limitados
└─ No puede eliminar
```

### 5. Datos Migrados
✅ **Hotel Principal** creado
✅ 3 usuarios migrados (Sebastian, admin, empleado)
✅ 10 habitaciones migradas
✅ 8 reservas migradas

---

## 🧪 Cómo Probar el Sistema Multi-Hotel

### Paso 1: Verificar Usuario Admin

Los usuarios existentes ahora están asignados al "Hotel Principal":

```bash
# Verificar usuarios
node backend/check-users.js
```

Deberías ver que `admin` ahora es `hotel_admin`.

### Paso 2: Iniciar Sesión como Admin

1. Iniciar backend y frontend
2. Login con:
   - Username: `admin`
   - Password: `admin123`

3. Verás todas las habitaciones y reservas del "Hotel Principal"

### Paso 3: Crear un Segundo Hotel

Puedes crear un nuevo hotel de dos formas:

#### Opción A: Desde Postman/API

```bash
POST http://localhost:5000/api/hotels/register
Content-Type: application/json

{
  "hotelName": "Hotel Paradise",
  "adminName": "Juan Pérez",
  "adminEmail": "juan@paradise.com",
  "adminUsername": "juanparadise",
  "adminPassword": "paradise123",
  "phone": "3009876543"
}
```

**Respuesta:**
```json
{
  "message": "Hotel registrado exitosamente...",
  "hotel": {
    "id": "...",
    "name": "Hotel Paradise",
    "slug": "hotel-paradise"
  },
  "admin": {
    "id": "...",
    "username": "juanparadise",
    "email": "juan@paradise.com"
  }
}
```

#### Opción B: Script de prueba

```bash
node backend/create-test-hotel.js
```

### Paso 4: Probar Aislamiento de Datos

1. **Login como admin del Hotel Principal:**
   - Username: `admin`
   - Password: `admin123`
   - Debe ver: 10 habitaciones del Hotel Principal

2. **Login como admin de Hotel Paradise:**
   - Username: `juanparadise`
   - Password: `paradise123`
   - Debe ver: 0 habitaciones (hotel nuevo, sin habitaciones aún)

3. **Crear habitaciones en cada hotel:**
   - Como admin de Hotel Principal: Crea habitación 201
   - Como admin de Hotel Paradise: Crea habitación 101

4. **Verificar que NO se ven las habitaciones del otro hotel**

### Paso 5: Crear Super Admin (Opcional)

Si quieres un usuario que pueda ver TODOS los hoteles:

```javascript
// Desde MongoDB Compass o script
db.users.insertOne({
  username: "superadmin",
  name: "Super Administrador",
  email: "super@hotelmanager.com",
  password: "$2a$10$...", // Hash de password
  role: "super_admin",
  // NO tiene campo hotel
  active: true,
  verified: true
})
```

---

## 🔍 Verificaciones de Seguridad

### Test 1: Empleado no puede ver otros hoteles

```bash
# Login como empleado del Hotel Principal
# Intentar acceder a habitación de Hotel Paradise
GET /api/rooms/{id_de_paradise}
# Debe retornar 404 (no encontrada)
```

### Test 2: Admin no puede modificar otros hoteles

```bash
# Login como admin de Hotel Paradise
# Intentar actualizar habitación del Hotel Principal
PUT /api/rooms/{id_del_principal}
# Debe retornar 404 (no encontrada)
```

### Test 3: Super Admin ve todo

```bash
# Login como super_admin
GET /api/hotels
# Debe retornar lista de TODOS los hoteles

GET /api/rooms
# Sin filtro de hotel (ve todas las habitaciones)
```

---

## 📊 Endpoints del API

### Hoteles

```bash
# Registrar nuevo hotel (público)
POST /api/hotels/register

# Obtener todos los hoteles (solo super_admin)
GET /api/hotels

# Obtener hotel actual del usuario
GET /api/hotels/current

# Obtener hotel por ID
GET /api/hotels/:id

# Actualizar hotel (solo super_admin)
PUT /api/hotels/:id

# Desactivar hotel (solo super_admin)
DELETE /api/hotels/:id
```

### Habitaciones (con filtro automático)

```bash
# Todas las habitaciones DEL HOTEL del usuario
GET /api/rooms

# Una habitación específica (solo si pertenece al hotel)
GET /api/rooms/:id

# Crear habitación (se asigna hotel automáticamente)
POST /api/rooms

# Actualizar habitación (solo si pertenece al hotel)
PUT /api/rooms/:id

# Eliminar habitación (solo si pertenece al hotel)
DELETE /api/rooms/:id
```

### Reservas (con filtro automático)

```bash
# Todas las reservas DEL HOTEL del usuario
GET /api/reservations

# Una reserva específica (solo si pertenece al hotel)
GET /api/reservations/:id

# Crear reserva (se asigna hotel automáticamente)
POST /api/reservations

# Actualizar reserva (solo si pertenece al hotel)
PUT /api/reservations/:id

# Eliminar reserva (solo si pertenece al hotel)
DELETE /api/reservations/:id
```

---

## 💡 Casos de Uso Reales

### Caso 1: Nueva Cadena de Hoteles

Una cadena quiere gestionar 5 hoteles:

1. Registran 5 hoteles (uno por ubicación)
2. Cada hotel tiene su administrador
3. Cada administrador crea sus empleados
4. Cada hotel gestiona sus propias habitaciones/reservas
5. Los datos están completamente aislados

### Caso 2: Hotel Independiente

Un hotel independiente:

1. Se registra como "Hotel Paradise"
2. El propietario es el hotel_admin
3. Crea sus empleados
4. No ve ni puede acceder a datos de otros hoteles

### Caso 3: Plataforma con Super Admin

La plataforma:

1. Super admin ve estadísticas globales
2. Puede crear/desactivar hoteles
3. Gestiona planes (free, basic, premium)
4. No interfiere en operación diaria de cada hotel

---

## 🚀 Próximos Pasos

### Frontend
- [ ] Mostrar nombre del hotel en el header
- [ ] Panel de super_admin para ver todos los hoteles
- [ ] Formulario de registro de hotel

### Backend
- [ ] Enviar email de verificación al registrar hotel
- [ ] Sistema de planes y facturación
- [ ] Límites por plan (ej: free = 10 habitaciones max)
- [ ] API de estadísticas globales para super_admin

### Testing
- [ ] Tests unitarios del middleware filterByHotel
- [ ] Tests de integración multi-hotel
- [ ] Tests de seguridad (intentar acceder a otro hotel)

---

## ❓ Preguntas Frecuentes

**Q: ¿Los usuarios existentes siguen funcionando?**
A: Sí, todos fueron migrados al "Hotel Principal" automáticamente.

**Q: ¿Puedo convertir un empleado en admin?**
A: Sí, solo cambia el role de 'empleado' a 'hotel_admin' en la base de datos.

**Q: ¿Cómo creo un super_admin?**
A: Crea un usuario con role: 'super_admin' y SIN campo hotel.

**Q: ¿Los números de habitación pueden repetirse entre hoteles?**
A: Sí! Cada hotel puede tener su habitación 101. El índice único es por hotel.

**Q: ¿Qué pasa si elimino un hotel?**
A: Se desactiva (active: false), no se elimina. Los datos se preservan.

---

**Estado:** ✅ Sistema Multi-Hotel IMPLEMENTADO y FUNCIONANDO

Para probar todo, solo necesitas:
1. Iniciar backend: `cd backend && npm run dev`
2. Iniciar frontend: `npm run dev`
3. Login con `admin` / `admin123`
4. ¡Crear más hoteles y probar!
