# Script para crear usuario administrador inicial

Write-Host "👤 Creando usuario administrador..." -ForegroundColor Cyan

$body = @{
    username = "admin"
    password = "admin123"
    name = "Administrador"
    email = "admin@hotel.com"
    role = "admin"
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "http://localhost:5000/api/auth/register" -Method Post -Body $body -ContentType "application/json"
    
    Write-Host "✅ Usuario administrador creado exitosamente!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Credenciales:" -ForegroundColor Yellow
    Write-Host "  Usuario: admin" -ForegroundColor White
    Write-Host "  Contraseña: admin123" -ForegroundColor White
    Write-Host ""
    Write-Host "Token: $($response.token)" -ForegroundColor Gray
    
} catch {
    Write-Host "❌ Error al crear usuario:" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    Write-Host ""
    Write-Host "Asegúrate de que el backend esté corriendo en http://localhost:5000" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Presiona cualquier tecla para continuar..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
