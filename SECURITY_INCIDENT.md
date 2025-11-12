# 🚨 INCIDENTE DE SEGURIDAD - CREDENCIALES EXPUESTAS

**Fecha**: 12 de Noviembre 2025
**Severidad**: 🔴 CRÍTICA

## 📋 Credenciales Comprometidas

GitHub ha detectado las siguientes credenciales expuestas en commits públicos:

1. ✅ MongoDB Atlas URI (usuario: `hotel_user`, password: `cwrxriJO3w6dXMIG`)
2. ✅ JWT Secret (`mi_clave_secreta_super_segura_2024`)
3. ✅ Cloudinary credentials (cloud_name, api_key, api_secret)
4. ✅ Resend API Key (`re_XfiPcwdh_QEVvTe2RKv6MhV7cxF6QxNwz`)

---

## 🔴 ACCIÓN INMEDIATA REQUERIDA

### 1. **Rotar Password de MongoDB Atlas** (5 minutos)

```bash
# Pasos:
1. Ir a https://cloud.mongodb.com
2. Clic en "Database Access" (menú lateral)
3. Encontrar usuario "hotel_user"
4. Clic en "Edit"
5. Clic en "Edit Password"
6. Generar nueva contraseña (botón "Autogenerate Secure Password")
7. COPIAR LA NUEVA CONTRASEÑA
8. Clic en "Update User"
```

**Nueva connection string será**:
```
mongodb+srv://hotel_user:<NUEVA_PASSWORD>@cluster0.px6lwr7.mongodb.net/HotelSystem?retryWrites=true&w=majority&appName=Cluster0
```

### 2. **Generar nuevo JWT Secret** (1 minuto)

```bash
# En PowerShell:
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# O en Node REPL:
require('crypto').randomBytes(64).toString('hex')
```

Copia el resultado (será algo como: `a4f8b2e9d3c7a1b5f6e8d2c9a7b4e1f3c8d5a2b9e6f1c4d7a3b8e5f2c9d6a1b4`)

### 3. **Rotar Cloudinary API Secret** (3 minutos)

```bash
# Pasos:
1. Ir a https://console.cloudinary.com
2. Dashboard > Settings (engranaje)
3. Security tab
4. "API Keys" section
5. Clic en "Regenerate API Secret"
6. Copiar el nuevo API Secret
```

### 4. **Rotar Resend API Key** (2 minutos)

```bash
# Pasos:
1. Ir a https://resend.com/api-keys
2. Encontrar tu API key actual
3. Clic en "..." (tres puntos) > "Delete"
4. Clic en "Create API Key"
5. Nombre: "Hotel System Production"
6. Permission: "Sending access"
7. Copiar la nueva API key (empieza con re_)
```

---

## 🔧 Actualizar Variables en Render

Una vez que tengas las NUEVAS credenciales:

### En Render Dashboard:

1. Ve a tu servicio backend en Render
2. Clic en **"Environment"** (menú lateral)
3. **Actualiza cada variable**:

```env
# 🔴 ACTUALIZAR ESTAS:
MONGO_URI=mongodb+srv://hotel_user:<NUEVA_PASSWORD_MONGODB>@cluster0.px6lwr7.mongodb.net/HotelSystem?retryWrites=true&w=majority&appName=Cluster0

JWT_SECRET=<NUEVA_JWT_SECRET_64_CHARS>

CLOUDINARY_API_SECRET=<NUEVO_API_SECRET>

RESEND_API_KEY=<NUEVA_API_KEY>

# ✅ Estas NO cambian (son públicas):
CLOUDINARY_CLOUD_NAME=dmnrpq1ze
CLOUDINARY_API_KEY=199873391723197
EMAIL_FROM=Hotel System <onboarding@resend.dev>
FRONTEND_URL=https://tu-app.vercel.app
NODE_ENV=production
```

4. Clic en **"Save Changes"**
5. Render automáticamente hará **redeploy** con las nuevas variables

---

## 🔧 Actualizar Variables Locales

En tu archivo `backend/.env` local:

```bash
# Actualiza con las NUEVAS credenciales
MONGO_URI=mongodb+srv://hotel_user:<NUEVA_PASSWORD>@cluster0.px6lwr7.mongodb.net/HotelSystem?retryWrites=true&w=majority&appName=Cluster0
JWT_SECRET=<NUEVA_JWT_SECRET>
CLOUDINARY_API_SECRET=<NUEVO_API_SECRET>
RESEND_API_KEY=<NUEVA_API_KEY>
```

⚠️ **NUNCA COMITEAR .env** - Está en .gitignore

---

## 🧹 Limpiar Historial de Git (OPCIONAL)

Las credenciales antiguas siguen en el historial de Git. Para limpiarlas:

### Opción 1: Force Push (Simple pero destructivo)

```bash
# ⚠️ SOLO si trabajas solo y no importa perder historial
git filter-branch --force --index-filter \
  "git rm --cached --ignore-unmatch PRODUCTION_CHECKLIST.md" \
  --prune-empty --tag-name-filter cat -- --all

git push origin --force --all
```

### Opción 2: BFG Repo Cleaner (Recomendado)

```bash
# 1. Descargar BFG: https://rtyley.github.io/bfg-repo-cleaner/
# 2. Crear archivo passwords.txt con las contraseñas comprometidas
# 3. Ejecutar:
java -jar bfg.jar --replace-text passwords.txt Hotel_system.git
cd Hotel_system
git reflog expire --expire=now --all
git gc --prune=now --aggressive
git push origin --force --all
```

### Opción 3: Nada (Más seguro)

Si ya rotaste TODAS las credenciales, las antiguas son inútiles. GitHub seguirá alertando pero no hay peligro real.

---

## ✅ Checklist de Recuperación

```bash
✅ 1. Rotar password de MongoDB Atlas
✅ 2. Generar nuevo JWT Secret
✅ 3. Rotar Cloudinary API Secret
✅ 4. Rotar Resend API Key
✅ 5. Actualizar variables en Render
✅ 6. Actualizar .env local
✅ 7. Reiniciar servicios en Render
✅ 8. Probar login en producción
✅ 9. Probar subir imagen (Cloudinary)
✅ 10. Probar envío de email (Resend)
```

---

## 🚫 Prevención Futura

### Reglas para NO volver a exponer credenciales:

1. ✅ **NUNCA** escribir credenciales reales en archivos de documentación
2. ✅ Usar placeholders: `<TU_PASSWORD_AQUI>` o `XXXXXX`
3. ✅ Verificar que `.env` está en `.gitignore`
4. ✅ Usar `.env.example` con valores falsos
5. ✅ Antes de commit: `git diff` para revisar cambios
6. ✅ Activar pre-commit hooks:

```bash
# Instalar git-secrets
npm install -g git-secrets

# Configurar
git secrets --install
git secrets --register-aws
git secrets --add 'mongodb\+srv://[^"]*'
git secrets --add '[a-zA-Z0-9]{32,}'
```

### Herramientas de Detección:

- **GitGuardian** (gratis): https://www.gitguardian.com
- **TruffleHog**: `docker run --rm -v "$PWD:/pwd" trufflesecurity/trufflehog:latest filesystem /pwd`
- **Gitleaks**: `docker run --rm -v "$PWD:/path" zricethezav/gitleaks:latest detect --source="/path"`

---

## 📊 Impacto del Incidente

### Riesgo si NO rotas credenciales:

- 🔴 **MongoDB**: Atacante puede leer/modificar/eliminar TODA la base de datos
- 🔴 **JWT Secret**: Atacante puede crear tokens falsos y hacerse pasar por cualquier usuario
- 🟡 **Cloudinary**: Atacante puede subir imágenes maliciosas o agotar tu cuota
- 🟡 **Resend**: Atacante puede enviar spam desde tu cuenta

### Riesgo DESPUÉS de rotar:

- ✅ **Credenciales antiguas inútiles** - Atacante no puede acceder
- ⚠️ GitHub seguirá mostrando alertas (es normal, son credenciales muertas)

---

## 🎯 Estado Actual

**Después de este commit**:
- ✅ `PRODUCTION_CHECKLIST.md` ya NO tiene credenciales reales
- ✅ Usa placeholders `<USUARIO>`, `<PASSWORD>`, etc.
- ⏳ **Ahora debes rotar las credenciales en MongoDB/Cloudinary/Resend**
- ⏳ **Luego actualizar en Render con las nuevas**

---

## 🆘 Soporte

Si necesitas ayuda:

1. **MongoDB Atlas**: https://www.mongodb.com/docs/atlas/security/
2. **Cloudinary**: https://support.cloudinary.com
3. **Resend**: https://resend.com/docs
4. **Render**: https://render.com/docs/environment-variables

**Tiempo estimado para rotar todo**: 15-20 minutos ⏱️
