// Script de prueba para endpoints de autenticación
const API_URL = 'http://localhost:5000/api';

// Test 1: Registro de usuario
async function testRegister() {
  console.log('\n🧪 Test 1: Registro de usuario');
  console.log('================================');
  
  try {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: 'testuser_' + Date.now(),
        password: 'password123',
        name: 'Usuario de Prueba',
        email: 'test' + Date.now() + '@example.com'
      })
    });

    const data = await response.json();
    console.log('Status:', response.status);
    console.log('Response:', JSON.stringify(data, null, 2));

    if (response.ok) {
      console.log('✅ Registro exitoso');
      return data;
    } else {
      console.log('❌ Error en registro:', data.message);
      return null;
    }
  } catch (error) {
    console.log('❌ Error de red:', error.message);
    return null;
  }
}

// Test 2: Login
async function testLogin() {
  console.log('\n🧪 Test 2: Login');
  console.log('================');
  
  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: 'testuser',
        password: 'password123'
      })
    });

    const data = await response.json();
    console.log('Status:', response.status);
    console.log('Response:', JSON.stringify(data, null, 2));

    if (response.ok) {
      console.log('✅ Login exitoso');
      return data;
    } else {
      console.log('❌ Error en login:', data.message);
      return null;
    }
  } catch (error) {
    console.log('❌ Error de red:', error.message);
    return null;
  }
}

// Test 3: Forgot Password
async function testForgotPassword(email) {
  console.log('\n🧪 Test 3: Forgot Password');
  console.log('============================');
  
  try {
    const response = await fetch(`${API_URL}/auth/forgot-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });

    const data = await response.json();
    console.log('Status:', response.status);
    console.log('Response:', JSON.stringify(data, null, 2));

    if (response.ok) {
      console.log('✅ Solicitud de reset exitosa');
      if (data.resetToken) {
        console.log('🔑 Token (dev):', data.resetToken);
      }
      return data;
    } else {
      console.log('❌ Error:', data.message);
      return null;
    }
  } catch (error) {
    console.log('❌ Error de red:', error.message);
    return null;
  }
}

// Test 4: Actualizar perfil
async function testUpdateProfile(token) {
  console.log('\n🧪 Test 4: Actualizar Perfil');
  console.log('==============================');
  
  try {
    const response = await fetch(`${API_URL}/auth/profile`, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        name: 'Nombre Actualizado'
      })
    });

    const data = await response.json();
    console.log('Status:', response.status);
    console.log('Response:', JSON.stringify(data, null, 2));

    if (response.ok) {
      console.log('✅ Perfil actualizado');
      return data;
    } else {
      console.log('❌ Error:', data.message);
      return null;
    }
  } catch (error) {
    console.log('❌ Error de red:', error.message);
    return null;
  }
}

// Ejecutar todos los tests
async function runAllTests() {
  console.log('🚀 Iniciando tests de autenticación...');
  console.log('======================================\n');

  // Test 1: Registro
  const registerData = await testRegister();
  
  if (registerData && registerData.token) {
    // Test 3: Forgot password con el email registrado
    if (registerData.user.email) {
      await testForgotPassword(registerData.user.email);
    }

    // Test 4: Actualizar perfil
    await testUpdateProfile(registerData.token);
  }

  // Test 2: Login (intentar con usuario existente)
  await testLogin();

  console.log('\n✅ Tests completados');
}

// Ejecutar
runAllTests();
