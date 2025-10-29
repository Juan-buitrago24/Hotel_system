# Forzar salida UTF-8 para que se vean bien los emojis
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

Write-Host "🏨 Iniciando Hotel System..." -ForegroundColor Green
Write-Host ""

# Iniciar Backend
Write-Host "📡 Iniciando Backend en puerto 5000..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList @('-NoExit', '-Command', 'cd backend; Write-Host "🚀 Backend Server" -ForegroundColor Green; npm run dev')

# Esperar unos segundos para el backend
Start-Sleep -Seconds 3

# Iniciar Frontend
Write-Host "🎨 Iniciando Frontend en puerto 5173..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList @('-NoExit', '-Command', 'cd frontend; Write-Host "🎨 Frontend Client" -ForegroundColor Blue; npm run dev')

Write-Host ""
Write-Host "✅ Aplicación iniciada!" -ForegroundColor Green
Write-Host ""
Write-Host "📍 Backend:  http://localhost:5000" -ForegroundColor Yellow
Write-Host "📍 Frontend: http://localhost:5173" -ForegroundColor Yellow
Write-Host ""
Write-Host "📚 Lee SETUP.md para crear usuarios y datos de prueba" -ForegroundColor Magenta
