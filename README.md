# Hotel System

Proyecto React + Vite + Tailwind + Lucide 

### Comandos
- `npm install` — instalar dependencias
- `npm run dev` — levantar servidor de desarrollo (Vite)
- `npm run build` — construir para producción
- `npm run preview` — vista previa de la build


🔑 Credenciales de prueba
Rol	Usuario	Contraseña
Administrador	admin	admin123
Empleado	empleado	emp123

🧠 Conceptos implementados

Autenticación simulada con usuarios en memoria.

Componentes reutilizables para formularios y botones.

Uso de Lucide React para íconos interactivos.

Diseño responsive con utilidades Tailwind.

Ruteo interno basado en componentes.

🏨 Hotel System

Sistema web para la gestión de un hotel, desarrollado con React + Vite.
Permite el manejo de autenticación, administración de usuarios, reservas y visualización de datos desde una interfaz moderna y responsiva.

⚙️ Estructura del Proyecto

El proyecto está organizado siguiendo una arquitectura cliente-servidor, aunque en esta versión inicial solo se implementa el frontend, con un backend simulado dentro del código.

🖥️ Frontend

Desarrollado con React, Vite y TailwindCSS.

📁 Carpetas principales
Carpeta	Descripción
src/components/	Componentes reutilizables de la interfaz (botones, formularios, tarjetas, etc.)
src/pages/	Vistas principales del sistema (Login, Dashboard, Reservas, etc.)
src/context/	Manejo del estado global (Context API) para sesión y datos compartidos
src/constants/	Datos simulados del backend (usuarios, configuración, reservas)
src/utils/	Funciones auxiliares y utilidades comunes
src/App.jsx	Estructura principal de la aplicación y enrutamiento
src/main.jsx	Punto de entrada del proyecto

🧠 Funcionalidades actuales

Autenticación de usuarios (administrador y empleado)

Gestión visual de reservas

Simulación de estados globales (sesión activa, datos de usuario)

Interfaz responsiva con diseño moderno

🗄️ Backend (Simulado)

Por ahora, el backend está simulado en memoria dentro del mismo frontend.
Los datos se almacenan en archivos JS bajo src/constants/ y se manejan mediante Context API.

No existe aún conexión real a base de datos ni API REST.
En la siguiente etapa, se implementará un backend real con:

Node.js + Express

Base de datos: MySQL o MongoDB

Endpoints REST para manejar usuarios, reservas y autenticación

🧩 Tecnologías utilizadas
Tecnología	Uso
React	Framework para la interfaz de usuario
Vite	Entorno de desarrollo rápido y eficiente
TailwindCSS	Estilos CSS utilitarios
Context API	Manejo de estado global
JavaScript (ES6)	Lógica del sistema
npm	Gestión de dependencias
🚀 Instalación y ejecución

Clonar el repositorio:

git clone https://github.com/tu-usuario/Hotel_system.git
cd Hotel_system


Instalar dependencias:

npm install


Iniciar el servidor de desarrollo:

npm run dev


Abrir en el navegador:

http://localhost:5173/

🧱 Estructura futura (con backend real)
Hotel_system/
├── backend/
│   ├── server.js
│   ├── routes/
│   ├── controllers/
│   ├── models/
│   └── package.json
└── frontend/
    ├── src/
    └── ...

📌 Estado del proyecto

🚧 Versión actual: Desarrollo del frontend funcional con backend simulado.
🧩 Próximos pasos:

Implementar API REST con Node.js y Express.

Conectar base de datos (MySQL/MongoDB).

Añadir autenticación JWT y control de roles.
