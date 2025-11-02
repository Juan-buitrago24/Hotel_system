# 🔐 Guía de Nuevas Funcionalidades de Autenticación

## Resumen de Cambios

Se han agregado nuevas funcionalidades al sistema de autenticación del Hotel Manager:

1. ✅ **Registro de Usuarios** - Los usuarios pueden crear su propia cuenta
2. ✅ **Actualización de Perfil** - Los usuarios pueden editar su información personal
3. ✅ **Recuperación de Contraseña** - Flujo completo para resetear contraseñas olvidadas
4. ✅ **Verificación de Cuenta** - Sistema de verificación por email (tokens)

---

## 📋 Backend - Cambios Implementados

### 1. Modelo de Usuario Actualizado

**Archivo:** `backend/models/User.model.js`

**Nuevos campos:**
```javascript
{
  verified: Boolean,              // Si la cuenta está verificada
  verificationToken: String,      // Token de verificación (hasheado)
  verificationTokenExpires: Date, // Expiración del token de verificación
  resetPasswordToken: String,     // Token de reset de contraseña (hasheado)
  resetPasswordExpires: Date      // Expiración del token de reset
}
```

**Nuevos métodos:**
- `createVerificationToken()` - Genera token de verificación (válido 24 horas)
- `createPasswordResetToken()` - Genera token de reset (válido 1 hora)

### 2. Nuevos Endpoints

**Archivo:** `backend/controllers/auth.controller.js`

| Endpoint | Método | Descripción | Requiere Auth |
|----------|--------|-------------|---------------|
| `/api/auth/register` | POST | Registro de nuevos usuarios | No |
| `/api/auth/profile` | PUT | Actualizar perfil del usuario | Sí |
| `/api/auth/verify/:token` | GET | Verificar cuenta con token | No |
| `/api/auth/forgot-password` | POST | Solicitar reset de contraseña | No |
| `/api/auth/reset-password/:token` | POST | Resetear contraseña con token | No |

### 3. Validaciones Agregadas

**Registro:**
- Username mínimo 3 caracteres
- Password mínimo 6 caracteres
- Email único (si se proporciona)
- Verificación automática si no hay email

**Actualización de perfil:**
- Validación de contraseña actual para cambio de password
- Verificación de email único
- Re-verificación necesaria al cambiar email

---

## 🎨 Frontend - Nuevos Componentes

### 1. RegisterPage.jsx
**Ubicación:** `src/components/RegisterPage.jsx`

Formulario de registro con:
- Nombre completo
- Usuario
- Email (opcional)
- Contraseña y confirmación
- Validación en tiempo real
- Enlace para volver al login

### 2. ForgotPasswordPage.jsx
**Ubicación:** `src/components/ForgotPasswordPage.jsx`

Página para solicitar reset de contraseña:
- Input de email
- Mensaje de confirmación
- En desarrollo: muestra el token generado
- Enlace para volver al login

### 3. ResetPasswordPage.jsx
**Ubicación:** `src/components/ResetPasswordPage.jsx`

Página para cambiar contraseña con token:
- Nueva contraseña y confirmación
- Validación de token
- Redirección automática al login tras éxito

### 4. ProfilePage.jsx
**Ubicación:** `src/components/ProfilePage.jsx`

Modal de perfil de usuario con:
- Edición de nombre y email
- Cambio de contraseña
- Estado de verificación
- Información de cuenta (username, rol)

### 5. Actualizaciones a Componentes Existentes

**LoginPage.jsx:**
- Enlace "¿Olvidaste tu contraseña?"
- Enlace "Regístrate aquí"

**Header.jsx:**
- Botón de perfil clickeable
- Icono de usuario

**App.jsx:**
- Manejo de rutas de autenticación
- Gestión de tokens de reset en URL
- Control de vistas (login, register, forgot-password, reset-password)

---

## 🚀 Cómo Usar las Nuevas Funcionalidades

### Para Usuarios Finales:

1. **Crear Cuenta:**
   - Clic en "Regístrate aquí" desde el login
   - Completar el formulario
   - Si incluyes email, revisa la consola del backend para el token de verificación

2. **Editar Perfil:**
   - Una vez logueado, clic en tu nombre en el header
   - Edita la información que desees
   - Para cambiar contraseña, ingresa la actual y la nueva

3. **Recuperar Contraseña:**
   - Clic en "¿Olvidaste tu contraseña?" desde el login
   - Ingresa tu email
   - En desarrollo: copia el token de la consola del backend
   - Visita `/reset-password/[token]` o usa el enlace mostrado
   - Ingresa tu nueva contraseña

### Para Desarrolladores:

**Probar registro:**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "password": "password123",
    "name": "Usuario de Prueba",
    "email": "test@example.com"
  }'
```

**Probar actualización de perfil:**
```bash
curl -X PUT http://localhost:5000/api/auth/profile \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "name": "Nuevo Nombre",
    "email": "nuevo@example.com"
  }'
```

**Probar forgot password:**
```bash
curl -X POST http://localhost:5000/api/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com"
  }'
```

**Probar reset password:**
```bash
curl -X POST http://localhost:5000/api/auth/reset-password/TOKEN_AQUI \
  -H "Content-Type: application/json" \
  -d '{
    "password": "newpassword123"
  }'
```

---

## 🔒 Consideraciones de Seguridad

### Implementado:
- ✅ Tokens hasheados con SHA-256
- ✅ Expiración de tokens (1 hora para reset, 24 horas para verificación)
- ✅ Validación de contraseña actual para cambios
- ✅ Mensaje genérico en forgot-password (no revela si el email existe)
- ✅ Contraseñas encriptadas con bcrypt
- ✅ Tokens únicos y aleatorios (crypto.randomBytes)

### Pendiente (para producción):
- ⏳ Integración con servicio de email (SendGrid, Mailgun, AWS SES)
- ⏳ Rate limiting en endpoints sensibles
- ⏳ CAPTCHA en registro y forgot-password
- ⏳ Autenticación de dos factores (2FA)
- ⏳ Registro de intentos de login fallidos
- ⏳ Bloqueo temporal de cuentas tras múltiples intentos

---

## 📧 Integración de Email (TODO)

Actualmente los tokens se muestran en la consola del servidor. Para producción:

1. **Instalar un servicio de email:**
   ```bash
   npm install nodemailer
   # o
   npm install @sendgrid/mail
   ```

2. **Configurar variables de entorno:**
   ```env
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=tu-email@gmail.com
   EMAIL_PASS=tu-password
   ```

3. **Actualizar los controladores:**
   - Reemplazar `console.log` con llamadas al servicio de email
   - Enviar emails con plantillas HTML
   - Incluir enlaces con los tokens

**Ejemplo de implementación:**
```javascript
// backend/utils/email.js
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransporter({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

export const sendVerificationEmail = async (email, token) => {
  const url = `${process.env.FRONTEND_URL}/verify/${token}`;
  await transporter.sendMail({
    to: email,
    subject: 'Verifica tu cuenta - Hotel Manager',
    html: `<p>Haz clic <a href="${url}">aquí</a> para verificar tu cuenta.</p>`
  });
};
```

---

## 🧪 Testing

**Flujo completo de prueba:**

1. Registrar nuevo usuario desde la UI
2. Verificar que aparece el token en la consola del backend
3. Copiar el token y visitar `/verify/[token]` (si hay email)
4. Login con las credenciales
5. Editar perfil desde el header
6. Logout
7. Usar "Olvidé mi contraseña"
8. Copiar token de reset de la consola
9. Visitar la URL de reset mostrada
10. Cambiar contraseña
11. Login con nueva contraseña

---

## 📝 Notas Adicionales

- **Tokens en desarrollo:** Los tokens se muestran en la consola del backend para facilitar el testing
- **Tokens en producción:** Remover la línea que devuelve el token en la respuesta de `forgotPassword`
- **Verificación opcional:** Si no se proporciona email, la cuenta se marca como verificada automáticamente
- **Persistencia:** Los usuarios y tokens se guardan en MongoDB
- **Expiración:** Los tokens expiran automáticamente (verificar campos `*Expires` en la base de datos)

---

## 🐛 Troubleshooting

**Error: "Token inválido o expirado"**
- El token solo es válido por 1 hora (reset) o 24 horas (verificación)
- Asegúrate de usar el token completo (sin espacios)

**Error: "Email ya registrado"**
- Cada email solo puede estar asociado a una cuenta
- Usa otro email o recupera la contraseña de la cuenta existente

**Error: "Contraseña actual incorrecta"**
- Al cambiar contraseña, debes proporcionar la contraseña actual correcta

**No recibo emails**
- En desarrollo, los tokens se muestran en la consola del backend
- Para producción, configura un servicio de email

---

## ✅ Checklist de Implementación Completa

- [x] Modelo de usuario con campos de verificación y reset
- [x] Endpoints de backend para todas las funcionalidades
- [x] Validaciones y seguridad básica
- [x] Componentes de UI para registro, perfil, forgot/reset password
- [x] Integración en App.jsx
- [x] Actualización de API service
- [x] Testing manual
- [ ] Integración de email
- [ ] Rate limiting
- [ ] Testing automatizado
- [ ] Documentación de API (Swagger/OpenAPI)
