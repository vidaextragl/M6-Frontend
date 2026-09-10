## 📖 Sobre el proyecto
**Vida Extra** es una aplicación web de billetera virtual orientada a gamers. Permite administrar saldos en distintas monedas, consultar movimientos, realizar conversiones, visualizar beneficios y acceder a herramientas relacionadas con cashback y recompensas.
La plataforma está dividida en dos aplicaciones independientes:
* Un **frontend** desarrollado con React, TypeScript y Vite.
* Un **backend** desarrollado con Express, TypeScript y PostgreSQL.
La interfaz adapta conceptos propios de una aplicación financiera a una identidad visual inspirada en el mundo gamer, manteniendo una navegación clara, protección de rutas y compatibilidad con distintos tamaños de pantalla.
## 🎯 Objetivo
El objetivo de Vida Extra es centralizar operaciones financieras frecuentes dentro de una experiencia digital pensada especialmente para gamers.
El proyecto busca integrar:
* Administración de una billetera multimoneda.
* Consulta de saldos y movimientos.
* Conversión de divisas mediante tipos de cambio.
* Beneficios de cashback y recompensas.
* Asistencia contextual dentro de la aplicación.
* Una interfaz responsive con modos claro y oscuro.
Vida Extra fue desarrollado como un **MVP académico**, aplicando una arquitectura frontend-backend, comunicación mediante una API REST y un flujo de trabajo colaborativo con GitHub.
## ✨ Funcionalidades principales
### Autenticación y usuario
* Registro de nuevos usuarios.
* Inicio y cierre de sesión.
* Protección de páginas privadas.
* Persistencia de la sesión mediante token.
* Consulta y actualización de datos del perfil.
* Redirección de usuarios autenticados y no autenticados según la ruta.
### Dashboard
* Resumen general de la cuenta.
* Visualización del saldo total.
* Información de cashback disponible.
* Acceso a acciones frecuentes.
* Consulta de tipos de cambio.
* Conversor de monedas integrado.
* Vista general del mercado.
### Wallet
* Consulta de billeteras y saldos por moneda.
* Soporte para múltiples monedas.
* Operaciones de depósito y retiro.
* Actualización de los datos de la billetera desde el backend.
### Exchange
* Consulta de tipos de cambio.
* Conversión estimada entre monedas.
* Intercambio de saldo entre billeteras.
* Actualización manual de cotizaciones.
* Uso de proveedores externos de tipos de cambio desde el backend.
### Transacciones
* Historial de movimientos.
* Consulta de transacciones desde la API.
* Filtrado de movimientos.
* Diferenciación entre distintos tipos de operación.
### Cashback y recompensas
* Consulta del cashback acumulado.
* Visualización del progreso mensual.
* Consulta de recompensas disponibles.
* Canje de recompensas mediante el backend.
### Notificaciones y configuración
* Página de notificaciones.
* Marcado y administración visual de notificaciones.
* Configuración del perfil.
* Preferencias de apariencia.
* Compatibilidad con modo claro y oscuro.
* Acceso al perfil desde la barra de navegación.
### Asistente Vida
* Chatbot disponible dentro de las páginas protegidas.
* Consultas relacionadas con saldo, cashback, monedas, transacciones y funcionamiento de Vida Extra.
* Estado de carga mientras se procesa una respuesta.
* Manejo de errores de conexión y opción de reintento.
* Conservación temporal de la conversación durante la navegación.
* Interfaz accesible y adaptada a desktop, tablet y dispositivos móviles.

La interfaz del chatbot se comunica con el endpoint `/chatbot` del backend. El backend contiene una integración con Google Gemini y herramientas internas para consultar información del usuario autenticado.
### Experiencia de usuario
* Diseño responsive para desktop, tablet y móvil.
* Sidebar en pantallas grandes.
* Navegación inferior en dispositivos móviles.
* Tema claro y oscuro.
* Estados de carga y manejo visual de errores.
* Componentes reutilizables.
* Navegación mediante React Router.
## 🛠️ Tecnologías utilizadas
### Frontend
* **React 19** — construcción de la interfaz mediante componentes.
* **TypeScript** — tipado estático del código.
* **Vite 8** — entorno de desarrollo y generación del build.
* **React Router DOM 7** — navegación y protección de rutas.
* **CSS** — estilos propios, temas y diseño responsive.
### Backend
* **Node.js** — entorno de ejecución.
* **Express 5** — servidor HTTP y API REST.
* **TypeScript** — desarrollo tipado del backend.
* **Zod** — validación de datos y contratos.
* **CORS** — comunicación controlada con el frontend.
### Base de datos
* **PostgreSQL** — almacenamiento persistente.
* **node-postgres (`pg`)** — comunicación con PostgreSQL.
* **node-pg-migrate** — creación y ejecución de migraciones.
### Autenticación
* **JSON Web Token (JWT)** — autenticación de las solicitudes.
* **bcrypt** — hash y verificación segura de contraseñas.
* Rutas públicas y protegidas en el frontend.
### APIs y servicios externos
* Proveedores externos para obtener tipos de cambio.
* **Google Gemini** mediante `@google/genai` para el módulo del chatbot.
* **Amazon SES** mediante AWS SDK para el envío de correos configurados por el backend.
### Testing
* **Node Test Runner** para utilidades del chatbot en el frontend.
* **Vitest** para pruebas del backend.
* **Supertest** para pruebas de integración de la API.
### Calidad de código
* **ESLint** en frontend y backend.
* **Prettier** en el backend.
* Configuración estricta de TypeScript.
### Deploy
* **Vercel** para el frontend.
* **Railway** para el backend.
### Herramientas de desarrollo
* Git.
* GitHub.
* npm.
* Visual Studio Code.
## 📁 Estructura del proyecto
El proyecto está organizado en dos repositorios.
### Frontend
```text
M6-Frontend/
├── public/
├── src/
│   ├── api/               # Cliente HTTP y servicios por dominio
│   ├── components/        # Componentes reutilizables
│   │   ├── chatbot/
│   │   ├── exchange-rates/
│   │   ├── layout/
│   │   ├── ui/
│   │   └── wallet/
│   ├── context/           # Contextos de autenticación y tema
│   ├── hooks/             # Hooks personalizados
│   ├── pages/             # Páginas principales
│   ├── routes/            # Rutas públicas y protegidas
│   ├── styles/            # Estilos globales, responsive y temas
│   ├── types/             # Tipos compartidos
│   └── utils/             # Funciones auxiliares
├── tests/                 # Pruebas del frontend
├── package.json
├── vite.config.ts
└── vercel.json
```
### Backend
```text
M6-Backend/
├── src/
│   ├── config/            # Configuración y variables de entorno
│   ├── database/          # Cliente, migraciones y datos de demostración
│   ├── middlewares/       # Autenticación y manejo de errores
│   ├── modules/           # Módulos de la API
│   │   ├── auth/
│   │   ├── chatbot/
│   │   ├── exchange-rates/
│   │   ├── rewards/
│   │   ├── swaps/
│   │   ├── transactions/
│   │   ├── users/
│   │   └── wallets/
│   ├── shared/            # Utilidades compartidas
│   └── server.ts          # Punto de inicio del servidor
├── tests/                 # Pruebas unitarias y de integración
├── package.json
└── railway.json
```
Esta separación permite que el frontend y el backend evolucionen de forma independiente y se comuniquen mediante una API REST.

## 📜 Scripts disponibles
### Frontend
| Comando           | Descripción                                           |
| ----------------- | ----------------------------------------------------- |
| `npm run dev`     | Inicia el entorno de desarrollo con Vite.             |
| `npm run build`   | Comprueba TypeScript y genera el build de producción. |
| `npm run lint`    | Analiza el código con ESLint.                         |
| `npm run preview` | Ejecuta localmente el build generado.                 |
### Backend
| Comando                | Descripción                             |
| ---------------------- | --------------------------------------- |
| `npm run dev`          | Inicia el servidor en modo desarrollo.  |
| `npm run build`        | Compila TypeScript.                     |
| `npm start`            | Ejecuta el servidor compilado.          |
| `npm run lint`         | Analiza el código con ESLint.           |
| `npm test`             | Ejecuta las pruebas con Vitest.         |
| `npm run migrate:up`   | Aplica las migraciones pendientes.      |
| `npm run migrate:down` | Revierte la última migración.           |
| `npm run seed:demo`    | Carga usuarios y datos de demostración. |
## 🌐 Deploy
### Frontend
La aplicación está disponible en:
**https://vida-extra-one.vercel.app/**
### Backend
API desplegada en Railway:
**https://m6-backend-production.up.railway.app/**
Estado del servicio:
**https://m6-backend-production.up.railway.app/health**

## 🔌 API e integración
El frontend utiliza un cliente HTTP centralizado y obtiene la dirección del backend mediante la variable `VITE_API_URL`.
Las solicitudes autenticadas incluyen el token del usuario. La API organiza sus endpoints por dominio:
* `/auth` — registro e inicio de sesión.
* `/users` — información y actualización del usuario.
* `/wallet` — billeteras, saldos, depósitos y retiros.
* `/currencies` — monedas disponibles.
* `/transactions` — historial de movimientos.
* `/exchange-rates` — consulta de tipos de cambio.
* `/exchange` — intercambio entre monedas.
* `/cashback` — información de cashback.
* `/rewards` — recompensas y canjes.
* `/chatbot` — comunicación con Asistente Vida.
Esta arquitectura mantiene separada la interfaz de usuario de la lógica de negocio y del acceso a la base de datos.
## 📱 Responsive Design
Vida Extra incluye estilos específicos para adaptar la aplicación a:
* **Desktop:** navegación lateral y distribución amplia de tarjetas.
* **Tablet:** ajuste de columnas, espacios y paneles.
* **Mobile:** navegación inferior, contenido reorganizado y controles táctiles.
* **Áreas seguras móviles:** consideración del espacio inferior de algunos dispositivos.
* **Chatbot responsive:** launcher y panel adaptados al espacio disponible.
La aplicación también cuenta con modos claro y oscuro utilizando el mismo sistema de temas.
## 🤖 Chatbot — Asistente Vida
**Asistente Vida** es un chatbot integrado en las páginas protegidas de la aplicación. Su interfaz permite realizar preguntas sobre:
* Saldos.
* Cashback.
* Cambio de monedas.
* Movimientos y transacciones.
* Funcionamiento general de Vida Extra.
El frontend envía la consulta al backend mediante una petición autenticada. El backend contiene un módulo basado en Google Gemini con acceso controlado a funciones internas de Vida Extra.
El asistente está diseñado para explicar y orientar. No ejecuta compras, depósitos, retiros o cambios de moneda directamente desde el chat.
Las respuestas se muestran como texto seguro y la interfaz incluye estados de escritura, errores de conexión, reintento, navegación por teclado y adaptación a dispositivos móviles.
> Las respuestas del asistente son orientativas. Los valores monetarios y tipos de cambio pueden variar.
## 🧪 Testing
### Frontend
Actualmente existe una prueba unitaria para las utilidades del chatbot. Verifica:
* Normalización de consultas.
* Bloqueo de mensajes vacíos.
* Longitud máxima aceptada.
* Validación de respuestas del backend.
* Rechazo de respuestas vacías o inválidas.
Ejecutar con:
```bash
node --test tests/unit/components/chatbot.test.ts
```
### Backend
El backend utiliza Vitest y Supertest. La estructura de pruebas incluye casos unitarios y de integración para módulos como:
* Autenticación.
* Wallet.
* Chatbot.
* Tipos de cambio.
* Cashback y recompensas.
* Notificaciones.
* Middlewares y esquemas de validación.
## 👥 Equipo
| Integrante          | Rol                  |
| ------------------- | -------------------- |
| **Juan Elizondo**   | Full Stack Developer |
| **Ciro Castellaro** | Backend Developer    |
| **Lariza Miglio**   | Frontend Developer   |
## 🔄 Flujo de trabajo
El equipo utilizó Git y GitHub para trabajar de manera colaborativa.
El flujo general se basó en:
1. Actualizar la rama `develop`.
2. Crear una rama independiente para cada funcionalidad o corrección.
3. Realizar cambios localizados.
4. Ejecutar verificaciones antes de publicar.
5. Subir la rama al repositorio.
6. Crear un Pull Request hacia `develop`.
7. Revisar y aprobar los cambios antes del merge.
Se utilizaron ramas con convenciones como:
* `feature/...` para nuevas funcionalidades.
* `fix/...` para correcciones.
* `develop` como rama de integración.
## 📌 Estado del proyecto
Vida Extra es un **MVP académico de aplicación web**.
### Implementado en el código
* Autenticación y protección de rutas.
* Dashboard.
* Billetera multimoneda.
* Depósitos y retiros.
* Conversión e intercambio de monedas.
* Tipos de cambio obtenidos mediante el backend.
* Historial de transacciones.
* Cashback y recompensas.
* Notificaciones.
* Configuración y perfil.
* Modos claro y oscuro.
* Diseño responsive.
* Chatbot en frontend y módulo de chatbot en backend.
* Pruebas automatizadas en frontend y backend.
* Configuración de deploy para Vercel y Railway.
### Dependiente de configuración externa
* Disponibilidad de los proveedores de tipos de cambio.
* Envío de correos mediante Amazon SES.
* Respuestas del chatbot mediante Google Gemini.
* Conexión con PostgreSQL.
* Variables de entorno configuradas en los despliegues.
## 📚 Aprendizajes
Durante el desarrollo de Vida Extra se aplicaron conocimientos relacionados con:
* Desarrollo de interfaces con React y TypeScript.
* Arquitectura basada en páginas, componentes, servicios y contextos.
* Construcción de una API REST con Express.
* Diseño y uso de una base de datos PostgreSQL.
* Autenticación mediante JWT.
* Integración entre frontend y backend.
* Consumo de APIs y servicios externos.
* Diseño responsive para diferentes dispositivos.
* Pruebas unitarias y de integración.
* Manejo seguro de variables de entorno.
* Trabajo colaborativo mediante ramas y Pull Requests.
* Organización de tareas dentro de un equipo de desarrollo.
