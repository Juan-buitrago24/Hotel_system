# 🎬 GUÍA RÁPIDA DE DEMOSTRACIÓN

## ⚡ INICIO RÁPIDO (5 minutos)

### 1. Verificar MongoDB
```powershell
# Verificar si está corriendo
Get-Service MongoDB

# Si no está corriendo:
net start MongoDB
```

### 2. Iniciar Todo Automáticamente
```powershell
.\start.ps1
```

Esto abrirá 2 ventanas:
- ✅ Backend en http://localhost:5000
- ✅ Frontend en http://localhost:5173

### 3. Crear Usuario (Primera vez)
```powershell
.\create-admin.ps1
```
Credenciales: **admin / admin123**

### 4. Crear Habitaciones (Primera vez)
```powershell
.\create-rooms.ps1
```
Ingresar: **admin** y **admin123**

### 5. Abrir Navegador
```
http://localhost:5173
```

---

## 🎯 DEMOSTRACIÓN PASO A PASO

### PARTE 1: LOGIN (1 min)
1. Abrir http://localhost:5173
2. Ingresar: `admin` / `admin123`
3. Click en "Iniciar Sesión"
4. ✅ Muestra pantalla principal

**Destacar:**
- Autenticación con JWT
- Diseño moderno con gradientes
- Iconos Lucide React

---

### PARTE 2: MÓDULO HABITACIONES (7 min)

#### Ver Habitaciones
1. Click en pestaña "Habitaciones"
2. ✅ Mostrar grid de cards
3. ✅ Explicar información de cada card:
   - Número de habitación
   - Tipo (Simple, Doble, Suite, Familiar)
   - Capacidad
   - Precio por noche
   - Estado con colores
   - Servicios/Amenidades

**Destacar:**
- Diseño responsive
- Cards con gradientes
- Información clara y visual

#### Estadísticas
1. Mostrar las 4 tarjetas superiores:
   - 🟢 Disponibles
   - 🔴 Ocupadas
   - 🟡 Limpieza
   - 🟠 Mantenimiento

**Destacar:**
- Cálculo automático
- Colores diferenciados
- Actualización en tiempo real

#### Filtros
1. Abrir sección de filtros
2. Seleccionar "Estado: Disponible"
3. ✅ Mostrar solo disponibles
4. Cambiar a "Tipo: Suite"
5. ✅ Filtrar por tipo
6. Seleccionar "Piso: 3"
7. ✅ Filtrar por piso
8. Click en "Limpiar filtros"

**Destacar:**
- Filtros múltiples
- Búsqueda rápida
- UX intuitiva

#### Crear Habitación (Admin)
1. Click en botón "Nueva Habitación"
2. Llenar formulario:
   - Número: `402`
   - Tipo: `Suite`
   - Capacidad: `6`
   - Precio: `180`
   - Piso: `4`
   - Estado: `Disponible`
   - Servicios: `WiFi, TV, Jacuzzi, Vista panorámica`
   - Descripción: `Suite de lujo con vista espectacular`
3. Click en "Crear Habitación"
4. ✅ Ver nueva habitación en el grid

**Destacar:**
- Validaciones en frontend y backend
- Formulario completo
- Feedback visual inmediato

#### Editar Habitación
1. Click en "Editar" en cualquier habitación
2. Cambiar precio: `$200`
3. Agregar servicio: `Servicio de habitaciones`
4. Click en "Actualizar Habitación"
5. ✅ Ver cambios reflejados

**Destacar:**
- Edición sin recargar página
- Datos precargados
- Actualización en tiempo real

#### Cambiar Estado
1. En una habitación, click en el dropdown de estado
2. Cambiar de "Disponible" a "Limpieza"
3. ✅ Ver estadísticas actualizarse
4. ✅ Ver color cambiar

**Destacar:**
- Cambio instantáneo
- Actualización automática de estadísticas
- Sincronización con backend

---

### PARTE 3: MÓDULO RESERVAS (7 min)

#### Ver Reservas
1. Click en pestaña "Reservas"
2. ✅ Ver tabla de reservas (vacía si es primera vez)

#### Crear Reserva
1. Click en botón "Nueva Reserva"
2. Llenar formulario:
   - Nombre: `Carlos Rodríguez`
   - Email: `carlos@email.com`
   - Teléfono: `+57 300 123 4567`
   - Habitación: Seleccionar una disponible
   - Entrada: Fecha de hoy
   - Salida: 3 días después
   - Huéspedes: `2`
   - Notas: `Llegada tarde, favor dejar llaves en recepción`
3. Click en "Crear Reserva"
4. ✅ Ver reserva en la tabla

**Destacar:**
- Validación de disponibilidad
- Solo muestra habitaciones disponibles
- Cálculo automático de precio (días × precio/noche)
- Validación de fechas (salida > entrada)

#### Detalles de la Reserva
1. Mostrar columnas de la tabla:
   - Nombre del huésped + email
   - Número de habitación (con badge azul)
   - Fecha de entrada (formato local)
   - Fecha de salida
   - Estado (con dropdown)
   - **Precio total calculado** 💰

**Destacar:**
- Información completa del huésped
- Formato de fechas localizado
- Precio calculado automáticamente
- Visual claro y organizado

#### Cambiar Estado de Reserva
1. Click en dropdown de estado
2. Cambiar de "Pendiente" a "Confirmada"
3. ✅ Ver cambio de color
4. Cambiar a "En Curso"
5. ✅ Ver habitación cambiar a "Ocupada" automáticamente

**Destacar:**
- Sincronización automática
- Cuando reserva pasa a "En Curso" → Habitación a "Ocupada"
- Cuando reserva "Completada" → Habitación a "Limpieza"
- Lógica de negocio en backend

#### Calendario (si hay tiempo)
1. Mostrar vista de calendario
2. Ver reservas marcadas en fechas

---

### PARTE 4: BACKEND/CÓDIGO (5 min)

#### Mostrar Estructura
```
backend/
├── models/           ← Modelos MongoDB
├── controllers/      ← Lógica de negocio
├── routes/          ← Endpoints API
├── middleware/      ← Autenticación
└── server.js        ← Servidor Express
```

#### Mostrar Código Destacado

**1. Modelo de Habitación** (`models/Room.model.js`)
```javascript
// Mostrar schema con validaciones
// Destacar: tipos de datos, validaciones, defaults
```

**2. Controller de Reservas** (`controllers/reservation.controller.js`)
```javascript
// Mostrar función createReservation
// Destacar:
// - Validación de disponibilidad
// - Cálculo de precio
// - Manejo de errores
```

**3. Middleware de Auth** (`middleware/auth.middleware.js`)
```javascript
// Mostrar protect y authorize
// Destacar: verificación de JWT, roles
```

**4. API Client Frontend** (`src/services/api.js`)
```javascript
// Mostrar interceptors
// Destacar: agregado automático de token
```

---

### PARTE 5: CARACTERÍSTICAS TÉCNICAS (3 min)

#### Seguridad
- ✅ JWT para autenticación
- ✅ Contraseñas encriptadas con bcrypt
- ✅ Protección de rutas
- ✅ Roles y permisos (Admin/Empleado)
- ✅ Validación de datos en frontend y backend

#### Base de Datos
- ✅ MongoDB con Mongoose
- ✅ Modelos relacionados (refs)
- ✅ Validaciones a nivel de schema
- ✅ Índices para búsquedas rápidas
- ✅ Timestamps automáticos

#### Frontend
- ✅ React 18 con Hooks
- ✅ Context API para estado global
- ✅ Axios con interceptors
- ✅ Tailwind CSS responsive
- ✅ Componentes reutilizables
- ✅ Manejo de estados de carga
- ✅ Manejo de errores con feedback

#### API REST
- ✅ RESTful design
- ✅ HTTP status codes correctos
- ✅ Respuestas JSON consistentes
- ✅ Paginación preparada
- ✅ Filtros en queries
- ✅ Documentación en README

---

## 🎯 PUNTOS CLAVE A DESTACAR

### 1. Arquitectura Full-Stack Profesional
```
Frontend (React) ←→ API REST (Express) ←→ Database (MongoDB)
```

### 2. Funcionalidades Completas
- ✅ CRUD completo en 2 módulos
- ✅ Autenticación y autorización
- ✅ Validaciones en ambos lados
- ✅ Cálculos automáticos
- ✅ Sincronización de estados

### 3. Código de Calidad
- ✅ Modular y organizado
- ✅ Separación de responsabilidades
- ✅ Componentes reutilizables
- ✅ Manejo de errores
- ✅ Código limpio

### 4. UX/UI Moderna
- ✅ Diseño responsive
- ✅ Colores y gradientes
- ✅ Feedback visual
- ✅ Estados de carga
- ✅ Iconos y animaciones

---

## 📊 DATOS PARA MENCIONAR

- **Tiempo de desarrollo:** 2-3 horas
- **Líneas de código:** ~3,300
- **Archivos creados:** 47
- **Endpoints API:** 13
- **Componentes React:** 15+
- **Modelos de datos:** 3
- **Tecnologías:** 12+

---

## 💡 PREGUNTAS FRECUENTES

### ¿Es escalable?
✅ Sí, arquitectura modular lista para crecer

### ¿Es seguro?
✅ Sí, JWT + bcrypt + validaciones + roles

### ¿Funciona en móvil?
✅ Sí, diseño responsive con Tailwind

### ¿Se puede desplegar?
✅ Sí, backend en Heroku/Railway, frontend en Vercel/Netlify

### ¿Qué sigue?
- Dashboard con gráficas
- Módulo de huéspedes
- Reportes PDF
- Sistema de pagos
- App móvil

---

## 🚨 SOLUCIÓN RÁPIDA DE PROBLEMAS

### Backend no inicia
```powershell
cd backend
npm install
npm run dev
```

### Frontend no inicia
```powershell
npm install
npm run dev
```

### MongoDB no conecta
```powershell
net start MongoDB
# O
mongod
```

### No hay habitaciones
```powershell
.\create-rooms.ps1
```

### Error de login
```powershell
.\create-admin.ps1
```

---

## ✅ CHECKLIST PRE-DEMO

- [ ] MongoDB corriendo
- [ ] Backend iniciado (puerto 5000) ✓
- [ ] Frontend iniciado (puerto 5173) ✓
- [ ] Usuario admin creado ✓
- [ ] 6 habitaciones creadas ✓
- [ ] Navegador abierto ✓
- [ ] Código en VS Code ✓

---

**¡LISTO PARA IMPRESIONAR! 🚀**

Recuerda:
1. Hablar con confianza
2. Mostrar el código limpio
3. Destacar la arquitectura
4. Mencionar próximos pasos
5. Responder preguntas con seguridad

**¡ÉXITO EN TU DEMOSTRACIÓN! 🎉**
