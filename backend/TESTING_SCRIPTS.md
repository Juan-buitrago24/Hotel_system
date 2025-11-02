# 🧪 Scripts de Desarrollo - Gestión de Usuarios

Scripts útiles para desarrollo y testing del sistema.

## 📋 Scripts Disponibles

### 1. Eliminar Usuario por Email (Recomendado para Testing)

**Uso rápido:**
```powershell
cd backend
npm run delete-email tu@email.com
```

O directamente:
```powershell
node delete-by-email.js tu@email.com
```

**Ejemplo:**
```powershell
npm run delete-email juanbuitrago801@gmail.com
```

Este script:
- ✅ Busca el usuario por email
- ✅ Muestra la información del usuario
- ✅ Lo elimina de la base de datos
- ✅ Te permite crear la cuenta nuevamente

### 2. Gestor Interactivo de Usuarios

**Uso:**
```powershell
cd backend
npm run delete-users
```

Este script te muestra un menú interactivo donde puedes:
- 👁️ Ver todos los usuarios en la base de datos
- 🗑️ Eliminar un usuario específico por username
- ⚠️ Eliminar TODOS los usuarios (con doble confirmación)

### 3. Probar Envío de Emails con Resend

**Uso:**
```powershell
cd backend
npm run test-resend
```

Te pedirá un email y enviará un email de prueba para verificar que Resend esté funcionando.

## 🔄 Flujo de Testing Recomendado

Como tienes el plan gratuito de Resend con solo 1 email verificado, este es el flujo ideal:

### Paso 1: Registrar y Probar
1. Registra tu cuenta con tu email personal
2. Revisa tu bandeja y verifica el email de verificación
3. Prueba todas las funcionalidades

### Paso 2: Eliminar para Volver a Testear
```powershell
npm run delete-email tu@email.com
```

### Paso 3: Volver a Registrar
1. Registra nuevamente con el mismo email
2. Recibirás un nuevo email de verificación
3. Sigue probando

## 📊 Ver Usuarios en la Base de Datos

Si solo quieres ver qué usuarios tienes sin eliminar nada:

```powershell
npm run delete-users
# Luego selecciona opción 3 (Salir sin hacer cambios)
```

## 💡 Consejos

### Para Testing Intensivo
Si vas a hacer muchas pruebas, puedes:
1. Usar el mismo email una y otra vez (eliminándolo entre pruebas)
2. O crear usuarios sin email (se verifican automáticamente)

### Usuarios sin Email
Cuando creas un usuario SIN proporcionar email:
- ✅ Se marca como verificado automáticamente
- ✅ Puede iniciar sesión inmediatamente
- ❌ No recibirá emails (obviamente)
- ✅ Perfecto para testing rápido

### Verificar Límites de Resend
- Plan gratuito: 100 emails/día, 3,000/mes
- Solo puedes verificar 1 email de destino
- Todos los emails deben ir a ese email verificado

## 🚨 Importante

Estos scripts son **solo para desarrollo**. En producción:
- No incluyas estos scripts en el servidor
- Usa el panel de administración para gestionar usuarios
- Nunca elimines usuarios directamente de la base de datos

## 📝 Ejemplos Prácticos

### Ejemplo 1: Testing Rápido de Registro
```powershell
# 1. Eliminar si existe
npm run delete-email juan@example.com

# 2. Registrar usuario en el frontend
# (Usar el formulario de registro)

# 3. Verificar email
# (Hacer clic en el enlace del email)

# 4. Testear funcionalidades
# (Login, perfil, etc.)

# 5. Repetir desde paso 1
```

### Ejemplo 2: Limpiar Base de Datos Completa
```powershell
npm run delete-users
# Seleccionar opción 2
# Confirmar con "si"
# Confirmar con "ELIMINAR TODO"
```

### Ejemplo 3: Ver Estado Actual
```powershell
npm run delete-users
# Verás lista de todos los usuarios
# Seleccionar opción 3 para salir
```

## 🔧 Troubleshooting

### Error: "No se encontró el usuario"
- Verifica que el email sea exactamente el mismo
- Usa `npm run delete-users` para ver qué usuarios existen

### Error: "Conectar a MongoDB"
- Asegúrate de que MongoDB esté corriendo
- Verifica la variable `MONGO_URI` en `.env`

### Script no ejecuta
- Verifica que estés en la carpeta `backend`
- Asegúrate de tener Node.js instalado
- Ejecuta `npm install` primero

---

¿Necesitas ayuda? Revisa el código de los scripts en:
- `delete-users.js` - Gestor interactivo
- `delete-by-email.js` - Eliminar por email
- `test-resend.js` - Probar emails
