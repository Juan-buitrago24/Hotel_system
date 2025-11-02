# Script para iniciar MongoDB en Windows
# Ejecutar como: .\start-mongodb.ps1

Write-Host "🔍 Verificando instalación de MongoDB..." -ForegroundColor Cyan

# Rutas comunes de instalación de MongoDB
$mongodPaths = @(
    "C:\Program Files\MongoDB\Server\7.0\bin\mongod.exe",
    "C:\Program Files\MongoDB\Server\6.0\bin\mongod.exe",
    "C:\Program Files\MongoDB\Server\5.0\bin\mongod.exe",
    "C:\Program Files\MongoDB\Server\4.4\bin\mongod.exe",
    "$env:ProgramFiles\MongoDB\Server\7.0\bin\mongod.exe",
    "$env:ProgramFiles\MongoDB\Server\6.0\bin\mongod.exe"
)

$mongodPath = $null
foreach ($path in $mongodPaths) {
    if (Test-Path $path) {
        $mongodPath = $path
        Write-Host "✅ MongoDB encontrado en: $path" -ForegroundColor Green
        break
    }
}

if ($null -eq $mongodPath) {
    # Intentar encontrar mongod en el PATH
    $mongodInPath = Get-Command mongod -ErrorAction SilentlyContinue
    if ($mongodInPath) {
        $mongodPath = $mongodInPath.Source
        Write-Host "✅ MongoDB encontrado en PATH: $mongodPath" -ForegroundColor Green
    } else {
        Write-Host "❌ MongoDB no está instalado o no se encuentra en las rutas comunes." -ForegroundColor Red
        Write-Host ""
        Write-Host "📥 Descarga MongoDB Community desde:" -ForegroundColor Yellow
        Write-Host "   https://www.mongodb.com/try/download/community" -ForegroundColor Yellow
        Write-Host ""
        Write-Host "   O instala con Chocolatey:" -ForegroundColor Yellow
        Write-Host "   choco install mongodb" -ForegroundColor Yellow
        exit 1
    }
}

# Crear directorio de datos si no existe
$dataPath = "C:\data\db"
if (-not (Test-Path $dataPath)) {
    Write-Host "📁 Creando directorio de datos: $dataPath" -ForegroundColor Cyan
    New-Item -Path $dataPath -ItemType Directory -Force | Out-Null
}

# Verificar si MongoDB ya está corriendo
$mongoProcess = Get-Process -Name mongod -ErrorAction SilentlyContinue
if ($mongoProcess) {
    Write-Host "⚠️  MongoDB ya está corriendo (PID: $($mongoProcess.Id))" -ForegroundColor Yellow
    Write-Host "   Para detenerlo usa: Stop-Process -Name mongod" -ForegroundColor Yellow
    exit 0
}

# Iniciar MongoDB
Write-Host ""
Write-Host "🚀 Iniciando MongoDB..." -ForegroundColor Green
Write-Host "   Datos en: $dataPath" -ForegroundColor Gray
Write-Host "   Puerto: 27017" -ForegroundColor Gray
Write-Host ""
Write-Host "💡 Para detener MongoDB, cierra esta ventana o presiona Ctrl+C" -ForegroundColor Yellow
Write-Host ""

& $mongodPath --dbpath $dataPath
