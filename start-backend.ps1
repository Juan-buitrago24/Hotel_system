# Script para verificar MongoDB y arrancar el backend
# Ejecutar como: .\start-backend.ps1

Write-Host "🔍 Verificando conexión a MongoDB..." -ForegroundColor Cyan

# Verificar si MongoDB está corriendo
$mongoProcess = Get-Process -Name mongod -ErrorAction SilentlyContinue

if (-not $mongoProcess) {
    Write-Host "❌ MongoDB no está corriendo" -ForegroundColor Red
    Write-Host ""
    Write-Host "📝 Opciones para iniciar MongoDB:" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "   1. Ejecutar en otra terminal PowerShell:" -ForegroundColor White
    Write-Host "      .\start-mongodb.ps1" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "   2. O iniciar el servicio si MongoDB está instalado como servicio:" -ForegroundColor White
    Write-Host "      Start-Service -Name MongoDB" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "   3. O usar MongoDB Atlas (nube) - edita backend\.env:" -ForegroundColor White
    Write-Host "      MONGO_URI=mongodb+srv://USUARIO:PASSWORD@cluster.mongodb.net/HotelSystem" -ForegroundColor Cyan
    Write-Host ""
    
    $response = Read-Host "¿Quieres intentar iniciar el backend de todas formas? (s/n)"
    if ($response -ne "s" -and $response -ne "S") {
        exit 1
    }
} else {
    Write-Host "✅ MongoDB está corriendo (PID: $($mongoProcess.Id))" -ForegroundColor Green
}

Write-Host ""
Write-Host "🚀 Iniciando backend del Hotel System..." -ForegroundColor Green
Write-Host ""

# Cambiar al directorio backend
Set-Location -Path "C:\Users\jsbui\Hotel_system\backend"

# Verificar que exista node_modules
if (-not (Test-Path ".\node_modules")) {
    Write-Host "📦 Instalando dependencias..." -ForegroundColor Yellow
    npm install
}

# Iniciar el servidor
npm run dev
