# Bahía Fix — API

API REST desarrollada con Node.js y Express para la gestión de clientes, equipos, turnos y reparaciones del sistema Bahía Fix.

## Descripción

El backend expone endpoints REST bajo el prefijo `/api/v1`. Los datos se gestionan mediante estructuras en memoria cargadas desde `src/data/mock-data.js`; por lo tanto, los cambios realizados durante la ejecución no se conservan al reiniciar el servidor.

La API está preparada para ser consumida por la aplicación web `bahia-fix-client`.

## Funcionalidades

- **Clientes:** listado, consulta por identificador, creación, modificación y eliminación.
- **Equipos:** listado, consulta por identificador, creación, modificación y eliminación.
- **Turnos:** listado, consulta, creación, modificación, eliminación, actualización de estado y consulta de resumen.
- **Reparaciones:** listado, consulta, creación, modificación y eliminación.
- **Consultas de listados:** paginación, búsqueda, filtros y ordenamiento, según el módulo.
- **Respuestas HTTP:** estructura uniforme para respuestas correctas y errores.
- **CORS:** permite solicitudes desde el origen configurado mediante `CLIENT_URL`.

## Tecnologías

- Node.js
- Express
- CORS
- dotenv
- JavaScript con módulos ES

## Requisitos

- Node.js instalado.
- npm.
- El repositorio del frontend para utilizar la aplicación completa.

## Instalación

Clonar el repositorio y acceder a su carpeta:

```bash
git clone https://github.com/Gianfruu/bahia-fix-api.git
cd bahia-fix-api
```

Instalar las dependencias:

```bash
npm install
```

## Configuración

Crear un archivo `.env` en la raíz del proyecto. Se puede tomar como referencia `.env.example`:

```env
PORT=3000
CLIENT_URL=http://localhost:5173
API_PREFIX=/api/v1
```

- `PORT`: puerto en el que escucha el servidor.
- `CLIENT_URL`: origen autorizado para las solicitudes del frontend.
- `API_PREFIX`: prefijo común de las rutas de la API.

## Ejecución

Iniciar el servidor en modo desarrollo:

```bash
npm run dev
```

Iniciar el servidor normalmente:

```bash
npm start
```

Por defecto, la API queda disponible en:

```text
http://localhost:3000
```

La ruta raíz `GET /` permite comprobar que el servicio está funcionando. También se dispone de la ruta de salud bajo `/api/v1/health`.

## Rutas disponibles

Todas las rutas de los módulos utilizan el prefijo `/api/v1`.

| Recurso | Ruta base | Operaciones |
|---|---|---|
| Clientes | `/api/v1/clientes` | GET, POST, GET por ID, PUT y DELETE |
| Equipos | `/api/v1/equipos` | GET, POST, GET por ID, PUT y DELETE |
| Turnos | `/api/v1/turnos` | GET, POST, GET por ID, PUT, PATCH de estado y DELETE |
| Reparaciones | `/api/v1/reparaciones` | GET, POST, GET por ID, PUT y DELETE |
| Salud | `/api/v1/health` | Comprobación del servicio |

Los listados admiten parámetros de consulta para búsqueda, paginación, filtros y ordenamiento de acuerdo con cada recurso. En Turnos también se encuentra disponible el resumen en `/api/v1/turnos/resumen`.

## Estructura del proyecto

```text
bahia-fix-api/
├── src/
│   ├── data/
│   │   └── mock-data.js
│   ├── middlewares/
│   │   └── not-found.middleware.js
│   ├── routes/
│   │   ├── clientes.routes.js
│   │   ├── equipos.routes.js
│   │   ├── health.routes.js
│   │   ├── reparaciones.routes.js
│   │   ├── turnos.routes.js
│   │   └── index.js
│   ├── app.js
│   └── server.js
├── .env.example
├── package.json
└── README.md
```

## Pruebas de endpoints

La colección de solicitudes de Postman se encuentra dentro del repositorio, en:

```text
postman/collections/Bahía Fix - Colección grupal/
```

Puede importarse desde Postman para ejecutar las solicitudes de los distintos módulos. Para probar los endpoints, primero debe estar iniciado el servidor.

## Consideraciones

- La información se almacena en memoria y se inicializa con datos de demostración.
- Las altas, modificaciones y eliminaciones no se persisten después de reiniciar el servidor.
- La autenticación y los perfiles de acceso que se muestran en la interfaz corresponden al flujo de demostración del frontend; no representan un sistema de autenticación JWT implementado en esta API.
