# Sistema Multi-Hotel (Multi-Tenancy)

## Arquitectura para Escalabilidad

Si en el futuro el sistema necesita manejar **múltiples hoteles**, cada uno con sus propios administradores y empleados, aquí está la arquitectura recomendada:

### Opción 1: Multi-Tenancy con Organizaciones (Recomendado)

#### Modelo de Datos

```javascript
// Hotel/Organization Model
const hotelSchema = new mongoose.Schema({
  name: String,               // "Hotel Paradise"
  slug: String,               // "hotel-paradise" (único, para URL)
  domain: String,             // "paradise.hotelmanager.com"
  settings: {
    currency: String,         // "COP", "USD"
    timezone: String,         // "America/Bogota"
    language: String          // "es", "en"
  },
  plan: String,               // "free", "basic", "premium"
  active: Boolean,
  createdAt: Date
});

// User Model (modificado)
const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  name: String,
  email: String,
  
  // NUEVO: Referencia al hotel
  hotel: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Hotel',
    required: true
  },
  
  role: String,               // "super_admin", "hotel_admin", "empleado"
  active: Boolean,
  verified: Boolean
});

// Room Model (modificado)
const roomSchema = new mongoose.Schema({
  // NUEVO: Referencia al hotel
  hotel: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Hotel',
    required: true
  },
  
  number: Number,
  type: String,
  // ... demás campos
});

// Reservation Model (modificado)
const reservationSchema = new mongoose.Schema({
  // NUEVO: Referencia al hotel
  hotel: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Hotel',
    required: true
  },
  
  room: ObjectId,
  guestName: String,
  // ... demás campos
});
```

#### Jerarquía de Roles

```
super_admin (Administrador de la plataforma)
├─ Puede crear nuevos hoteles
├─ Puede ver todos los hoteles
└─ Puede gestionar planes y facturación

hotel_admin (Administrador del hotel)
├─ Solo ve datos de SU hotel
├─ Puede crear empleados de SU hotel
├─ Gestiona habitaciones y reservas de SU hotel
└─ No puede ver otros hoteles

empleado (Empleado del hotel)
├─ Solo ve datos de SU hotel
├─ Permisos limitados dentro de SU hotel
└─ No puede ver otros hoteles
```

#### Middleware de Filtrado por Hotel

```javascript
// backend/middleware/hotel.middleware.js
export const filterByHotel = async (req, res, next) => {
  // Obtener el hotel del usuario autenticado
  const user = await User.findById(req.user.id).populate('hotel');
  
  if (!user.hotel) {
    return res.status(403).json({ message: 'Usuario sin hotel asignado' });
  }
  
  // Si no es super_admin, solo puede ver datos de su hotel
  if (user.role !== 'super_admin') {
    req.hotelFilter = { hotel: user.hotel._id };
  }
  
  req.currentHotel = user.hotel;
  next();
};

// Uso en las rutas
router.get('/rooms', protect, filterByHotel, async (req, res) => {
  // Aplicar filtro de hotel automáticamente
  const rooms = await Room.find(req.hotelFilter || {});
  res.json(rooms);
});
```

#### Proceso de Registro de Nuevo Hotel

```javascript
// POST /api/hotels/register
export const registerHotel = async (req, res) => {
  const { hotelName, adminName, adminEmail, adminPassword } = req.body;
  
  // 1. Crear el hotel
  const hotel = await Hotel.create({
    name: hotelName,
    slug: hotelName.toLowerCase().replace(/\s+/g, '-'),
    plan: 'free',
    active: true
  });
  
  // 2. Crear el administrador del hotel
  const admin = await User.create({
    username: adminEmail.split('@')[0],
    name: adminName,
    email: adminEmail,
    password: await bcrypt.hash(adminPassword, 10),
    hotel: hotel._id,              // ← Asignar al hotel
    role: 'hotel_admin',           // ← Rol de admin del hotel
    verified: false
  });
  
  // 3. Enviar email de verificación
  await sendVerificationEmail(admin);
  
  res.json({ message: 'Hotel registrado. Verifica tu email.' });
};
```

### Opción 2: Bases de Datos Separadas (Máximo Aislamiento)

Cada hotel tiene su propia base de datos MongoDB:

```
HotelParadise_DB
├─ users
├─ rooms
├─ reservations

HotelDeluxe_DB
├─ users
├─ rooms
├─ reservations
```

**Ventajas:**
- ✅ Aislamiento total de datos
- ✅ Mejor para cumplimiento de privacidad (GDPR)
- ✅ Fácil hacer backups por hotel

**Desventajas:**
- ❌ Más complejo de gestionar
- ❌ Costos de infraestructura más altos
- ❌ No se pueden hacer consultas entre hoteles

### Opción 3: Subdominio por Hotel

Cada hotel tiene su propio subdominio:

```
paradise.hotelmanager.com  → Hotel Paradise
deluxe.hotelmanager.com    → Hotel Deluxe
boutique.hotelmanager.com  → Hotel Boutique
```

El subdominio determina qué hotel está accediendo:

```javascript
// backend/middleware/subdomain.middleware.js
export const detectHotel = async (req, res, next) => {
  const subdomain = req.hostname.split('.')[0];
  
  if (subdomain === 'www' || subdomain === 'hotelmanager') {
    // Landing page principal
    return next();
  }
  
  // Buscar hotel por slug
  const hotel = await Hotel.findOne({ slug: subdomain });
  if (!hotel) {
    return res.status(404).json({ message: 'Hotel no encontrado' });
  }
  
  req.currentHotel = hotel;
  next();
};
```

## Implementación Paso a Paso

### Fase 1: Preparación (Actual)
- ✅ Sistema funcional para un solo hotel
- ✅ Roles de admin y empleado
- ✅ Autenticación y autorización

### Fase 2: Agregar Modelo de Hotel (1-2 semanas)
```bash
# 1. Crear modelo Hotel
# 2. Migrar datos existentes a un "Hotel Principal"
# 3. Agregar campo hotel a User, Room, Reservation
# 4. Actualizar todos los queries para filtrar por hotel
```

### Fase 3: Middleware de Multi-Tenancy (1 semana)
```bash
# 1. Crear middleware filterByHotel
# 2. Aplicar a todas las rutas
# 3. Agregar role super_admin
# 4. Crear panel de administración global
```

### Fase 4: Registro de Hoteles (1 semana)
```bash
# 1. Crear formulario de registro de hotel
# 2. Proceso de onboarding para nuevo hotel
# 3. Email de verificación
# 4. Configuración inicial del hotel
```

### Fase 5: Dashboard Multi-Hotel (1 semana)
```bash
# 1. Panel para super_admin con todos los hoteles
# 2. Métricas globales
# 3. Gestión de planes
# 4. Facturación (opcional)
```

## Ejemplo de Uso

### Como Propietario de Hotel Paradise

```javascript
// 1. Registro del hotel
POST /api/hotels/register
{
  "hotelName": "Hotel Paradise",
  "adminName": "Juan Pérez",
  "adminEmail": "juan@paradise.com",
  "adminPassword": "secure123"
}

// 2. Verificar email y hacer login
POST /api/auth/login
{
  "username": "juan",
  "password": "secure123"
}

// 3. Crear empleados de MI hotel
POST /api/users
{
  "name": "María García",
  "email": "maria@paradise.com",
  "role": "empleado"
}
// El empleado automáticamente pertenece a Hotel Paradise

// 4. Crear habitaciones de MI hotel
POST /api/rooms
{
  "number": 101,
  "type": "suite"
}
// La habitación automáticamente pertenece a Hotel Paradise
```

### Como Super Admin (Plataforma)

```javascript
// Ver todos los hoteles
GET /api/admin/hotels
Response: [
  { name: "Hotel Paradise", plan: "premium", rooms: 50, reservations: 120 },
  { name: "Hotel Deluxe", plan: "basic", rooms: 30, reservations: 45 }
]

// Ver métricas globales
GET /api/admin/stats
Response: {
  totalHotels: 15,
  totalRooms: 450,
  totalReservations: 1200,
  totalRevenue: 45000000
}
```

## Costos y Consideraciones

### Opción 1: Multi-Tenancy Simple (Recomendado para empezar)
- **Costo:** Bajo
- **Complejidad:** Media
- **Escalabilidad:** Hasta ~100 hoteles
- **Base de datos:** Una sola MongoDB

### Opción 2: Bases de Datos Separadas
- **Costo:** Alto
- **Complejidad:** Alta
- **Escalabilidad:** Ilimitada
- **Base de datos:** Una por hotel

### Opción 3: Híbrido
- **Costo:** Medio
- **Complejidad:** Alta
- **Escalabilidad:** Muy buena
- **Base de datos:** Una compartida + cache por hotel

## Migración de Sistema Actual

Para migrar el sistema actual a multi-hotel:

```javascript
// Script de migración
async function migrate() {
  // 1. Crear "Hotel Principal"
  const mainHotel = await Hotel.create({
    name: 'Hotel Principal',
    slug: 'principal',
    plan: 'premium',
    active: true
  });
  
  // 2. Asignar todos los usuarios existentes al Hotel Principal
  await User.updateMany({}, { hotel: mainHotel._id });
  
  // 3. Asignar todas las habitaciones al Hotel Principal
  await Room.updateMany({}, { hotel: mainHotel._id });
  
  // 4. Asignar todas las reservas al Hotel Principal
  await Reservation.updateMany({}, { hotel: mainHotel._id });
  
  console.log('✅ Migración completada');
}
```

## Recomendación

Para tu caso, recomiendo empezar con **Opción 1: Multi-Tenancy con Organizaciones**:

1. ✅ Es la más simple de implementar
2. ✅ Suficiente para 50-100 hoteles
3. ✅ Costos de infraestructura bajos
4. ✅ Fácil de migrar después si es necesario

Una vez tengas 50+ hoteles, puedes considerar:
- Sharding de MongoDB por región
- Bases de datos separadas para hoteles premium
- Cache distribuido con Redis

---

**Siguiente paso:** ¿Quieres que implemente el modelo multi-hotel ahora o prefieres terminar las funcionalidades actuales primero?
