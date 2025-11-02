# 📧 Configuración de Emails con Resend

Este proyecto utiliza [Resend](https://resend.com) para enviar emails reales de verificación y recuperación de contraseña.

## 🚀 Configuración Rápida

### 1. Crear cuenta en Resend

1. Ve a [resend.com](https://resend.com) y crea una cuenta gratuita
2. El plan gratuito incluye:
   - ✅ 100 emails por día
   - ✅ 3,000 emails por mes
   - ✅ Perfecto para desarrollo y pruebas

### 2. Obtener tu API Key

1. Una vez registrado, ve a **API Keys** en el dashboard
2. Haz clic en **Create API Key**
3. Dale un nombre (ej: "Hotel System Development")
4. Copia la API Key generada (la verás solo una vez)

### 3. Configurar el proyecto

Edita el archivo `backend/.env` y actualiza estas variables:

```env
# Resend Email Configuration
RESEND_API_KEY=re_tu_api_key_real_aqui
EMAIL_FROM=Hotel System <onboarding@resend.dev>
FRONTEND_URL=http://localhost:5174
```

**Importante:**
- Reemplaza `re_tu_api_key_real_aqui` con tu API Key real de Resend
- Para desarrollo, puedes usar `onboarding@resend.dev` como remitente
- Para producción, necesitarás configurar tu propio dominio

### 4. (Opcional) Configurar dominio propio

Si quieres enviar emails desde tu propio dominio (ej: `noreply@tuhotel.com`):

1. Ve a **Domains** en el dashboard de Resend
2. Haz clic en **Add Domain**
3. Ingresa tu dominio
4. Configura los registros DNS (MX, TXT, CNAME) según las instrucciones
5. Una vez verificado, actualiza la variable `EMAIL_FROM` en `.env`:

```env
EMAIL_FROM=Hotel System <noreply@tuhotel.com>
```

## 📬 Emails que se envían

### 1. Email de Verificación
- **Cuándo:** Al registrar una cuenta nueva con email
- **Contiene:** Link de verificación válido por 24 horas
- **Template:** Diseño moderno con gradiente morado

### 2. Email de Recuperación de Contraseña
- **Cuándo:** Al solicitar recuperar contraseña
- **Contiene:** Link de reset válido por 1 hora
- **Template:** Diseño moderno con gradiente rosa/rojo

### 3. Email de Confirmación de Cambio
- **Cuándo:** Después de cambiar la contraseña exitosamente
- **Contiene:** Confirmación del cambio con fecha/hora
- **Template:** Diseño moderno con gradiente verde

## 🧪 Probar en Desarrollo

### Modo de Prueba (sin Resend configurado)

Si no tienes configurado Resend, el sistema funcionará en **modo fallback**:
- No se enviarán emails reales
- Los tokens aparecerán en la consola del backend
- Puedes copiar los tokens y usarlos manualmente
- Perfecto para desarrollo local sin configurar nada

### Con Resend Configurado

1. Asegúrate de tener tu API Key en `.env`
2. Reinicia el servidor backend
3. Registra un usuario con un email real
4. Revisa tu bandeja de entrada (o spam)
5. Haz clic en el botón del email para verificar

## 📊 Monitoreo

Puedes ver el estado de tus emails en el dashboard de Resend:
- Emails enviados
- Emails entregados
- Emails rebotados
- Emails abiertos (si habilitas tracking)

## 🔧 Troubleshooting

### Error: "Missing API Key"
- Verifica que `RESEND_API_KEY` esté en tu `.env`
- Asegúrate de reiniciar el servidor después de agregar la variable

### Los emails no llegan
- Revisa la carpeta de spam
- Verifica que el email destino sea válido
- Revisa los logs del dashboard de Resend
- Asegúrate de estar dentro del límite de 100 emails/día

### Error: "Domain not verified"
- Si usas un dominio propio, verifica que esté configurado correctamente
- Para desarrollo, usa `onboarding@resend.dev`

## 🌐 Producción

Para usar en producción:

1. Configura un dominio propio verificado
2. Cambia `NODE_ENV=production` en `.env`
3. Actualiza `FRONTEND_URL` con tu URL de producción
4. Considera aumentar el plan de Resend si necesitas más emails
5. Habilita el tracking de emails si lo necesitas

## 📚 Documentación Adicional

- [Documentación oficial de Resend](https://resend.com/docs)
- [API Reference](https://resend.com/docs/api-reference/introduction)
- [Verificar dominio](https://resend.com/docs/dashboard/domains/introduction)

## 💡 Tips

- **Desarrollo:** Usa `onboarding@resend.dev` para no tener que configurar dominios
- **Testing:** Usa emails temporales como [Mailtrap](https://mailtrap.io) o [MailHog](https://github.com/mailhog/MailHog)
- **Logs:** Revisa la consola del backend para ver si los emails se enviaron correctamente
- **Rate Limits:** Ten en cuenta el límite de 100 emails/día en el plan gratuito

---

¿Necesitas ayuda? Revisa la [documentación de Resend](https://resend.com/docs) o contacta a soporte.
