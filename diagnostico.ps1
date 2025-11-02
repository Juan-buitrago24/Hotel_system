# Script de diagnostico para verificar el estado del sistema
Write-Host "=== DIAGNOSTICO DEL SISTEMA HOTEL ===" -ForegroundColor Cyan
Write-Host ""

# 1. Verificar Node.js
Write-Host "[1] Node.js:" -ForegroundColor Yellow
try {
    $nodeVersion = node --version
    Write-Host "    [OK] Instalado: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "    [ERROR] No instalado" -ForegroundColor Red
}

# 2. Verificar npm
Write-Host ""
Write-Host "[2] npm:" -ForegroundColor Yellow
try {
    $npmVersion = npm --version
    Write-Host "    [OK] Instalado: v$npmVersion" -ForegroundColor Green
} catch {
    Write-Host "    [ERROR] No instalado" -ForegroundColor Red
}

# 3. Verificar MongoDB instalado
Write-Host ""
Write-Host "[3] MongoDB:" -ForegroundColor Yellow
$mongodPaths = @(
    "C:\Program Files\MongoDB\Server\7.0\bin\mongod.exe",
    "C:\Program Files\MongoDB\Server\6.0\bin\mongod.exe",
    "C:\Program Files\MongoDB\Server\5.0\bin\mongod.exe"
)

$mongoFound = $false
foreach ($path in $mongodPaths) {
    if (Test-Path $path) {
        Write-Host "    [OK] Instalado en: $path" -ForegroundColor Green
        $mongoFound = $true
        break
    }
}

if (-not $mongoFound) {
    $mongodInPath = Get-Command mongod -ErrorAction SilentlyContinue
    if ($mongodInPath) {
        Write-Host "    [OK] Instalado en PATH: $($mongodInPath.Source)" -ForegroundColor Green
        $mongoFound = $true
    } else {
        Write-Host "    [ERROR] No instalado" -ForegroundColor Red
        Write-Host "    Descarga desde: https://www.mongodb.com/try/download/community" -ForegroundColor Yellow
    }
}

# 4. Verificar si MongoDB esta corriendo
Write-Host ""
Write-Host "[4] MongoDB corriendo:" -ForegroundColor Yellow
$mongoProcess = Get-Process -Name mongod -ErrorAction SilentlyContinue
if ($mongoProcess) {
    Write-Host "    [OK] Si (PID: $($mongoProcess.Id))" -ForegroundColor Green
} else {
    # Verificar servicio
    $mongoService = Get-Service -Name MongoDB -ErrorAction SilentlyContinue
    if ($mongoService -and $mongoService.Status -eq 'Running') {
        Write-Host "    [OK] Si (como servicio)" -ForegroundColor Green
    } else {
        Write-Host "    [NO] MongoDB no esta corriendo" -ForegroundColor Red
        if ($mongoFound) {
            Write-Host "    Ejecuta: .\start-mongodb.ps1" -ForegroundColor Yellow
        }
    }
}

# 5. Verificar puerto 27017
Write-Host ""
Write-Host "[5] Puerto 27017 (MongoDB):" -ForegroundColor Yellow
$port27017 = netstat -an | Select-String "27017" | Select-String "LISTENING"
if ($port27017) {
    Write-Host "    [OK] Abierto y escuchando" -ForegroundColor Green
} else {
    Write-Host "    [NO] No esta escuchando" -ForegroundColor Red
}

# 6. Verificar archivo .env
Write-Host ""
Write-Host "[6] Configuracion (.env):" -ForegroundColor Yellow
if (Test-Path ".\backend\.env") {
    Write-Host "    [OK] Archivo existe" -ForegroundColor Green
    $envContent = Get-Content ".\backend\.env" -Raw
    if ($envContent -match "MONGO") {
        Write-Host "    [OK] Variable MONGO_URI configurada" -ForegroundColor Green
    } else {
        Write-Host "    [WARN] Variable MONGO_URI no encontrada" -ForegroundColor Yellow
    }
} else {
    Write-Host "    [ERROR] Archivo no existe" -ForegroundColor Red
}

# 7. Verificar dependencias del backend
Write-Host ""
Write-Host "[7] Dependencias del backend:" -ForegroundColor Yellow
if (Test-Path ".\backend\node_modules") {
    Write-Host "    [OK] Instaladas" -ForegroundColor Green
} else {
    Write-Host "    [NO] No instaladas" -ForegroundColor Red
    Write-Host "    Ejecuta: cd backend; npm install" -ForegroundColor Yellow
}

# 8. Verificar dependencias del frontend
Write-Host ""
Write-Host "[8] Dependencias del frontend:" -ForegroundColor Yellow
if (Test-Path ".\node_modules") {
    Write-Host "    [OK] Instaladas" -ForegroundColor Green
} else {
    Write-Host "    [NO] No instaladas" -ForegroundColor Red
    Write-Host "    Ejecuta: npm install" -ForegroundColor Yellow
}

# Resumen
Write-Host ""
Write-Host "=== RESUMEN ===" -ForegroundColor Cyan

$mongoService = Get-Service -Name MongoDB -ErrorAction SilentlyContinue
if ($mongoProcess -or ($mongoService -and $mongoService.Status -eq 'Running')) {
    Write-Host "[OK] Sistema listo para arrancar el backend" -ForegroundColor Green
    Write-Host ""
    Write-Host "Para iniciar el backend:" -ForegroundColor Yellow
    Write-Host "  .\start-backend.ps1" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "O manualmente:" -ForegroundColor Yellow
    Write-Host "  cd backend" -ForegroundColor Cyan
    Write-Host "  npm run dev" -ForegroundColor Cyan
} else {
    Write-Host "[WARN] MongoDB no esta corriendo" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Pasos siguientes:" -ForegroundColor Yellow
    if (-not $mongoFound) {
        Write-Host "  1. Instala MongoDB Community Edition" -ForegroundColor White
        Write-Host "  2. Ejecuta: .\start-mongodb.ps1" -ForegroundColor Cyan
    } else {
        Write-Host "  1. Ejecuta: .\start-mongodb.ps1" -ForegroundColor Cyan
    }
    Write-Host "  2. Ejecuta: .\start-backend.ps1" -ForegroundColor Cyan
}

Write-Host ""
Write-Host "Para mas informacion, consulta: DATABASE_SETUP.md" -ForegroundColor Gray
