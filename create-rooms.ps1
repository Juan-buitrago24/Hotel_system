# Script para crear habitaciones de ejemplo

Write-Host "🏨 Creando habitaciones de ejemplo..." -ForegroundColor Cyan
Write-Host ""

# Solicitar credenciales
$username = Read-Host "Usuario admin"
$password = Read-Host "Contraseña" -AsSecureString
$passwordPlain = [Runtime.InteropServices.Marshal]::PtrToStringAuto([Runtime.InteropServices.Marshal]::SecureStringToBSTR($password))

# Login
Write-Host "🔐 Iniciando sesión..." -ForegroundColor Yellow
$loginBody = @{
    username = $username
    password = $passwordPlain
} | ConvertTo-Json

try {
    $loginResponse = Invoke-RestMethod -Uri "http://localhost:5000/api/auth/login" -Method Post -Body $loginBody -ContentType "application/json"
    $token = $loginResponse.token
    $headers = @{ "Authorization" = "Bearer $token" }
    
    Write-Host "✅ Sesión iniciada" -ForegroundColor Green
    Write-Host ""
    
    # Crear habitaciones
    $rooms = @(
        @{
            number = "101"
            type = "simple"
            capacity = 2
            price = 50
            floor = 1
            status = "disponible"
            amenities = @("WiFi", "TV", "Aire acondicionado")
            description = "Habitación simple en el primer piso con todas las comodidades básicas"
        },
        @{
            number = "102"
            type = "simple"
            capacity = 2
            price = 55
            floor = 1
            status = "disponible"
            amenities = @("WiFi", "TV", "Aire acondicionado", "Minibar")
            description = "Habitación simple con minibar"
        },
        @{
            number = "201"
            type = "doble"
            capacity = 4
            price = 80
            floor = 2
            status = "disponible"
            amenities = @("WiFi", "TV", "Minibar", "Balcón", "Vista al mar")
            description = "Habitación doble con hermosa vista al mar"
        },
        @{
            number = "202"
            type = "doble"
            capacity = 4
            price = 85
            floor = 2
            status = "disponible"
            amenities = @("WiFi", "TV", "Minibar", "Balcón", "Jacuzzi")
            description = "Habitación doble con jacuzzi privado"
        },
        @{
            number = "301"
            type = "suite"
            capacity = 6
            price = 150
            floor = 3
            status = "disponible"
            amenities = @("WiFi", "TV", "Jacuzzi", "Sala", "Cocina", "Terraza")
            description = "Suite de lujo con todas las comodidades"
        },
        @{
            number = "401"
            type = "familiar"
            capacity = 8
            price = 200
            floor = 4
            status = "disponible"
            amenities = @("WiFi", "TV", "Cocina completa", "2 Baños", "Sala", "Comedor", "Terraza")
            description = "Habitación familiar espaciosa, ideal para grupos grandes"
        }
    )
    
    foreach ($room in $rooms) {
        Write-Host "📍 Creando habitación $($room.number)..." -ForegroundColor Cyan
        
        $roomJson = $room | ConvertTo-Json
        
        try {
            $response = Invoke-RestMethod -Uri "http://localhost:5000/api/rooms" -Method Post -Body $roomJson -Headers $headers -ContentType "application/json"
            Write-Host "  ✅ Habitación $($room.number) creada" -ForegroundColor Green
        } catch {
            Write-Host "  ⚠️ Error: $($_.Exception.Message)" -ForegroundColor Yellow
        }
    }
    
    Write-Host ""
    Write-Host "✅ Habitaciones creadas exitosamente!" -ForegroundColor Green
    
} catch {
    Write-Host "❌ Error:" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
}

Write-Host ""
Write-Host "Presiona cualquier tecla para continuar..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
