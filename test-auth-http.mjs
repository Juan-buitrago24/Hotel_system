import http from 'http';

function testEndpoint(method, path, body = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 5000,
      path: `/api${path}`,
      method: method,
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const req = http.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          resolve({ status: res.statusCode, data: parsed });
        } catch (e) {
          resolve({ status: res.statusCode, data: data });
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    if (body) {
      req.write(JSON.stringify(body));
    }

    req.end();
  });
}

async function runTests() {
  console.log('🚀 Iniciando tests de autenticación...\n');

  // Test 1: Registro
  console.log('📝 Test 1: Registro de usuario');
  try {
    const registerResult = await testEndpoint('POST', '/auth/register', {
      username: `testuser_${Date.now()}`,
      password: 'password123',
      name: 'Usuario de Prueba',
      email: `test${Date.now()}@example.com`
    });
    console.log(`Status: ${registerResult.status}`);
    console.log('Response:', JSON.stringify(registerResult.data, null, 2));
    console.log(registerResult.status === 201 ? '✅ Registro exitoso\n' : '❌ Error en registro\n');
  } catch (error) {
    console.log('❌ Error:', error.message, '\n');
  }

  // Test 2: Forgot Password
  console.log('🔑 Test 2: Forgot Password');
  try {
    const forgotResult = await testEndpoint('POST', '/auth/forgot-password', {
      email: 'test@example.com'
    });
    console.log(`Status: ${forgotResult.status}`);
    console.log('Response:', JSON.stringify(forgotResult.data, null, 2));
    console.log(forgotResult.status === 200 ? '✅ Solicitud exitosa\n' : '❌ Error\n');
  } catch (error) {
    console.log('❌ Error:', error.message, '\n');
  }

  // Test 3: Verificar que el endpoint existe
  console.log('🔍 Test 3: Verificar endpoint /api/auth/register');
  try {
    const result = await testEndpoint('OPTIONS', '/auth/register');
    console.log(`Status: ${result.status}`);
    console.log('✅ Endpoint accesible\n');
  } catch (error) {
    console.log('❌ Error:', error.message, '\n');
  }

  console.log('✅ Tests completados');
}

runTests().catch(console.error);
