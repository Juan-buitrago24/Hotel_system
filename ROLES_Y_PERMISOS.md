# 👥 Sistema de Roles y Permisos - Hotel System

## 🎭 Roles Disponibles

### 1. **Admin (Administrador)**
- **Acceso Total** al sistema
- Puede crear, editar y eliminar usuarios
- Gestión completa de habitaciones
- Gestión completa de reservas
- Acceso al Dashboard con estadísticas
- Puede asignar roles a otros usuarios

### 2. **Empleado (Employee)**
- Acceso limitado al sistema
- **Puede:**
  - Ver habitaciones
  - Crear y gestionar reservas
  - Actualizar estado de habitaciones
  - Ver su propio perfil
  - Acceder al Dashboard (solo visualización)
- **NO puede:**
  - Eliminar habitaciones
  - Crear/eliminar usuarios
  - Cambiar roles de otros usuarios
  - Modificar configuraciones del sistema

### 3. **Cliente (Customer)** - 🚧 Próximamente
- Acceso público/limitado
- **Podrá:**
  - Ver habitaciones disponibles
  - Hacer reservas para sí mismo
  - Ver sus propias reservas
  - Actualizar su perfil
  - Cancelar sus reservas (según políticas)
- **NO podrá:**
  - Ver todas las reservas del sistema
  - Modificar habitaciones
  - Acceder al Dashboard
  - Ver información de otros clientes

---

## 🔐 Matriz de Permisos

| Funcionalidad | Admin | Empleado | Cliente (futuro) |
|---------------|-------|----------|------------------|
| **Dashboard** | ✅ | ✅ | ❌ |
| **Ver habitaciones** | ✅ | ✅ | ✅ |
| **Crear habitaciones** | ✅ | ❌ | ❌ |
| **Editar habitaciones** | ✅ | ✅ | ❌ |
| **Eliminar habitaciones** | ✅ | ❌ | ❌ |
| **Cambiar estado habitación** | ✅ | ✅ | ❌ |
| **Ver todas las reservas** | ✅ | ✅ | ❌ |
| **Ver mis reservas** | ✅ | ✅ | ✅ |
| **Crear reservas** | ✅ | ✅ | ✅ |
| **Editar cualquier reserva** | ✅ | ✅ | ❌ |
| **Editar mis reservas** | ✅ | ✅ | ✅ |
| **Cancelar cualquier reserva** | ✅ | ✅ | ❌ |
| **Cancelar mis reservas** | ✅ | ✅ | ✅ |
| **Ver todos los usuarios** | ✅ | ❌ | ❌ |
| **Crear usuarios** | ✅ | ❌ | ❌ |
| **Editar cualquier usuario** | ✅ | ❌ | ❌ |
| **Editar mi perfil** | ✅ | ✅ | ✅ |
| **Eliminar usuarios** | ✅ | ❌ | ❌ |
| **Asignar roles** | ✅ | ❌ | ❌ |

---

## 📝 Cómo Crear Usuarios con Roles

### Opción 1: Registro Público (Solo Empleado)
- Usuarios que se registran por sí mismos obtienen rol **"empleado"** por defecto
- URL: `/register`
- No requiere autenticación

### Opción 2: Creación por Admin (Cualquier Rol)
- Solo los **administradores** pueden crear usuarios con rol específico
- Endpoint: `POST /api/users` (requiere rol admin)
- Puede asignar rol: `admin`, `empleado`, `cliente`

### Opción 3: Script de Línea de Comandos
Para crear el primer administrador, usa:
```bash
cd backend
node create-admin.js
```

---

## 🔄 Flujo de Verificación por Rol

### Admin
- ✅ Acceso inmediato (puede no requerir verificación de email)
- Configuración opcional de email

### Empleado
- ⚠️ Requiere verificación de email para funciones completas
- Acceso limitado hasta verificar

### Cliente
- ⚠️ **Requiere** verificación de email obligatoria
- No puede hacer reservas sin verificar

---

## 🛠️ Implementación Técnica

### En el Backend (Controlador)
```javascript
// Proteger ruta solo para admins
router.post('/users', protect, authorize('admin'), createUser);

// Proteger ruta para admins y empleados
router.get('/reservations', protect, authorize('admin', 'empleado'), getReservations);
```

### En el Frontend (Componente)
```javascript
// Mostrar botón solo para admin
{user.role === 'admin' && (
  <Button onClick={handleDelete}>Eliminar</Button>
)}

// Deshabilitar función para cliente
<Button disabled={user.role === 'cliente'}>
  Editar Habitación
</Button>
```

---

## 🚀 Próximas Implementaciones

1. **Rol Cliente:**
   - Página pública de habitaciones
   - Sistema de reservas self-service
   - Portal de cliente con mis reservas

2. **Permisos Granulares:**
   - Sistema de permisos individuales (can_create, can_delete, etc.)
   - Roles personalizables

3. **Auditoría:**
   - Log de acciones por usuario
   - Historial de cambios

---

## 📞 Contacto de Soporte
Para más información sobre roles y permisos, consulta con el administrador del sistema.
