// Test rápido del endpoint de dashboard
const testDashboard = async () => {
  try {
    // Primero hacer login para obtener el token
    const loginResponse = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: 'admin',
        password: 'admin123'
      })
    });

    if (!loginResponse.ok) {
      console.log('❌ Error en login:', loginResponse.status);
      return;
    }

    const loginData = await loginResponse.json();
    console.log('✅ Login exitoso');
    console.log('Usuario:', loginData.user.username);
    console.log('Rol:', loginData.user.role);

    // Ahora probar el endpoint de dashboard
    const dashboardResponse = await fetch('http://localhost:5000/api/dashboard/stats', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${loginData.token}`
      }
    });

    if (!dashboardResponse.ok) {
      console.log('❌ Error en dashboard:', dashboardResponse.status);
      const error = await dashboardResponse.json();
      console.log('Error:', error);
      return;
    }

    const dashboardData = await dashboardResponse.json();
    console.log('\n✅ Dashboard stats obtenidas exitosamente:');
    console.log('\n📊 HABITACIONES:');
    console.log('  Total:', dashboardData.rooms.total);
    console.log('  Disponibles:', dashboardData.rooms.available);
    console.log('  Ocupadas:', dashboardData.rooms.occupied);
    console.log('  Mantenimiento:', dashboardData.rooms.maintenance);
    console.log('  Ocupación:', dashboardData.rooms.occupancyRate + '%');

    console.log('\n💰 INGRESOS:');
    console.log('  Hoy:', new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(dashboardData.revenue.today));
    console.log('  Mes:', new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(dashboardData.revenue.month));

    console.log('\n📅 RESERVAS:');
    console.log('  Activas:', dashboardData.reservations.active);
    console.log('  Hoy:', dashboardData.reservations.today);
    console.log('  Mes:', dashboardData.reservations.month);

    console.log('\n👥 USUARIOS:');
    console.log('  Total:', dashboardData.users.total);

    console.log('\n⏰ CHECK-INS PRÓXIMOS:', dashboardData.upcomingCheckIns.length);
    dashboardData.upcomingCheckIns.forEach(ci => {
      console.log(`  - Hab. ${ci.room}: ${ci.guest} (${ci.status})`);
    });

    console.log('\n🔔 CHECK-OUTS PRÓXIMOS:', dashboardData.upcomingCheckOuts.length);
    dashboardData.upcomingCheckOuts.forEach(co => {
      console.log(`  - Hab. ${co.room}: ${co.guest} (${co.status})`);
    });

    if (dashboardData.topRooms && dashboardData.topRooms.length > 0) {
      console.log('\n🏆 HABITACIONES MÁS RESERVADAS:');
      dashboardData.topRooms.forEach((room, index) => {
        console.log(`  ${index + 1}. Hab. ${room.roomNumber} (${room.type}): ${room.reservations} reservas - ${new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(room.revenue)}`);
      });
    }

    console.log('\n✅ Todos los endpoints funcionan correctamente!');

  } catch (error) {
    console.log('❌ Error:', error.message);
  }
};

testDashboard();
