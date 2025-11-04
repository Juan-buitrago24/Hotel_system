# Restricciones Visuales por Rol

## Resumen
Se implementaron restricciones visuales en toda la aplicación para que los usuarios solo vean las acciones que tienen permitido realizar según su rol.

## Componentes Actualizados

### 1. RoleGuard Component (`src/components/RoleGuard.jsx`)
**Nuevo componente** para renderizado condicional basado en roles.

**Características:**
- `<RoleGuard allowedRoles={['admin']}>` - Renderiza hijos solo si el usuario tiene el rol permitido
- `useRole()` hook con helpers: `isAdmin()`, `isEmpleado()`, `isCliente()`, `hasRole(role)`
- Prop `showMessage` para mostrar mensajes cuando el acceso está restringido
- Prop `fallback` para mostrar contenido alternativo

**Ejemplo de uso:**
```jsx
<RoleGuard allowedRoles={['admin']}>
  <Button onClick={handleDelete}>Eliminar</Button>
</RoleGuard>

// O con el hook
const { isAdmin } = useRole();
if (isAdmin()) {
  // Mostrar contenido solo para admin
}
```

### 2. RoomsPage (`src/pages/RoomsPage.jsx`)
**Restricciones aplicadas:**
- ✅ Botón "Nueva Habitación" solo visible para administradores
- ✅ Mensaje informativo para empleados: "Solo administradores pueden crear nuevas habitaciones"
- ✅ Botones de editar/eliminar en RoomCard solo visibles para administradores
- ✅ Selector de estado de habitación solo editable para administradores

**Implementación:**
```jsx
<RoleGuard allowedRoles={['admin']}>
  <Button onClick={handleCreate}>
    Nueva Habitación
  </Button>
</RoleGuard>

{!isAdmin() && (
  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
    <Lock className="w-4 h-4" />
    <span>Solo administradores pueden crear nuevas habitaciones</span>
  </div>
)}
```

### 3. ReservationsPage (`src/pages/ReservationsPage.jsx`)
**Restricciones aplicadas:**
- ✅ Botón "Nueva Reserva" visible para todos (admin y empleado)
- ✅ Botón eliminar reserva solo visible para administradores
- ✅ Mensaje informativo para empleados sobre sus permisos

**Mensaje para empleados:**
```jsx
{user.role === 'empleado' && (
  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
    <Lock className="w-5 h-5 text-blue-700" />
    <div>
      <p className="font-medium">Permisos de empleado</p>
      <p>Puedes crear y gestionar reservas, pero solo los administradores pueden eliminarlas.</p>
    </div>
  </div>
)}
```

### 4. RoomCard Component (`src/components/RoomCard.jsx`)
**Ya tenía implementadas las restricciones:**
- ✅ Botones de editar/eliminar solo se muestran si `userRole === 'admin'`
- ✅ Selector de estado solo editable para administradores
- ✅ Otros usuarios ven el estado como texto no editable

### 5. ReservationRow Component (`src/components/ReservationRow.jsx`)
**Ya tenía implementadas las restricciones:**
- ✅ Botón eliminar solo se muestra si `canDelete` es true
- ✅ El prop `canDelete` se pasa desde ReservationsTable basado en `userRole === 'admin'`

### 6. Navigation Component (`src/components/Navigation.jsx`)
**Restricciones aplicadas:**
- ✅ Items del menú filtrados según el rol del usuario
- ✅ Dashboard, Reservas y Habitaciones solo visibles para admin y empleado
- ✅ Huéspedes (deshabilitado) solo para admin y empleado
- ✅ Clientes (rol futuro) no verán estas opciones

**Implementación:**
```jsx
const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, enabled: true, roles: ['admin', 'empleado'] },
  { id: 'reservations', label: 'Reservas', icon: Calendar, enabled: true, roles: ['admin', 'empleado'] },
  { id: 'rooms', label: 'Habitaciones', icon: Bed, enabled: true, roles: ['admin', 'empleado'] },
];

const visibleNavItems = navItems.filter(item => 
  item.roles.includes(user?.role)
);
```

## Matriz de Permisos Visuales

| Función | Admin | Empleado | Cliente (futuro) |
|---------|-------|----------|------------------|
| Ver Dashboard | ✅ | ✅ | ❌ |
| Ver Habitaciones | ✅ | ✅ | ❌ |
| Crear Habitación | ✅ | ❌ | ❌ |
| Editar Habitación | ✅ | ❌ | ❌ |
| Eliminar Habitación | ✅ | ❌ | ❌ |
| Cambiar Estado Habitación | ✅ | ❌ | ❌ |
| Ver Reservas | ✅ | ✅ | ❌ |
| Crear Reserva | ✅ | ✅ | ❌ |
| Editar Estado Reserva | ✅ | ✅ | ❌ |
| Eliminar Reserva | ✅ | ❌ | ❌ |
| Ver Calendario | ✅ | ✅ | ❌ |

## Diseño Visual de Restricciones

### Mensajes Informativos
Los mensajes informativos usan el siguiente estilo consistente:
```jsx
<div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-700 flex items-start gap-2">
  <Lock className="w-4 h-4 mt-0.5 flex-shrink-0" />
  <span>Mensaje informativo sobre la restricción</span>
</div>
```

### Estados Visuales
- **Botones ocultos**: No se renderizan si el usuario no tiene permisos
- **Botones deshabilitados**: Se muestran pero no son clickeables (futuro)
- **Mensajes informativos**: Explican por qué ciertas acciones no están disponibles
- **Iconos**: Se usa el ícono `Lock` de lucide-react para indicar restricciones

## Seguridad

### Frontend (Visual)
- ✅ Componentes no se renderizan si el usuario no tiene permisos
- ✅ Mensajes claros sobre restricciones
- ✅ Experiencia de usuario coherente según el rol

### Backend (Funcional)
- ✅ Todos los endpoints protegidos con middleware `authorize(roles)`
- ✅ Validación de roles en el servidor
- ✅ Las restricciones visuales coinciden con las del backend

**IMPORTANTE:** Las restricciones visuales mejoran la UX pero NO son seguridad. La verdadera autorización está en el backend con el middleware `authorize()`.

## Testing

Para probar las restricciones visuales:

1. **Como Administrador:**
   - Debe ver todos los botones y opciones
   - Puede crear, editar y eliminar habitaciones
   - Puede crear y eliminar reservas

2. **Como Empleado:**
   - NO debe ver botón "Nueva Habitación"
   - NO debe ver botones de editar/eliminar en habitaciones
   - NO debe ver botón de eliminar en reservas
   - DEBE ver mensaje informativo en RoomsPage
   - DEBE ver mensaje informativo en ReservationsPage
   - Puede crear reservas y cambiar su estado

3. **Como Cliente (futuro):**
   - No verá Dashboard, Habitaciones ni Reservas en el menú
   - Solo verá la vista pública de habitaciones disponibles

## Próximos Pasos

1. ⏳ **Testing completo** - Probar como admin y empleado
2. ⏳ **Panel de gestión de usuarios** - Para que admins creen usuarios con roles
3. ⏳ **Vista pública de habitaciones** - Para el rol "cliente"
4. ⏳ **Tooltips mejorados** - Usar biblioteca de tooltips más sofisticada
5. ⏳ **Badges de rol** - Mostrar el rol del usuario en el perfil/header

## Archivos Relacionados

- `src/components/RoleGuard.jsx` - Componente principal de restricciones
- `src/pages/RoomsPage.jsx` - Restricciones en habitaciones
- `src/pages/ReservationsPage.jsx` - Restricciones en reservas
- `src/components/RoomCard.jsx` - Restricciones en tarjetas de habitación
- `src/components/ReservationRow.jsx` - Restricciones en filas de reserva
- `src/components/Navigation.jsx` - Filtrado de menú por rol
- `ROLES_Y_PERMISOS.md` - Documentación completa del sistema de roles
- `backend/middleware/auth.middleware.js` - Autorización del backend
