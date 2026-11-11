# Bahía Fix --- API REST

API REST desarrollada con Node.js y Express para la gestión de clientes,
equipos, turnos y reparaciones de Bahía Fix.

## Descripción

El backend expone endpoints REST bajo el prefijo `/api/v1`. Los datos de
demostración se cargan desde `src/data/mock-data.js` y se administran en
memoria. Los cambios realizados durante la ejecución no se conservan al
reiniciar el servidor.

La API está preparada para ser consumida por la aplicación web
`bahia-fix-client`.

## Funcionalidades

-   **Clientes:** listado, consulta por identificador, creación,
    modificación y eliminación.
-   **Equipos:** listado, consulta por identificador, creación,
    modificación y eliminación.
-   **Turnos:** listado, consulta por identificador, creación,
    modificación, eliminación, actualización de estado y consulta de
    resumen.
-   **Reparaciones:** listado, consulta por identificador, creación,
    modificación y eliminación.
-   **Listados:** paginación, búsqueda, filtros y ordenamiento según el
    recurso.
-   **Validaciones:** controles de datos recibidos y relaciones entre
    entidades.
-   **Respuestas HTTP:** estructura uniforme para respuestas correctas y
    errores.
-   **CORS:** permite solicitudes desde el origen configurado mediante
    `CLIENT_URL`.

## Tecnologías

-   Node.js
-   Express
-   CORS
-   dotenv
-   JavaScript con módulos ES

## Requisitos

-   Node.js instalado.
-   npm.
-   El repositorio del frontend para utilizar la aplicación completa.

## Instalación

Clonar el repositorio y acceder a su carpeta:

``` bash
git clone https://github.com/Gianfruu/bahia-fix-api.git
cd bahia-fix-api
```

Instalar las dependencias:

``` bash
npm install
```

## Configuración

Crear un archivo `.env` en la raíz del proyecto tomando como referencia
`.env.example` o `sample.env`:

``` env
PORT=3000
CLIENT_URL=http://localhost:5173
API_PREFIX=/api/v1
```

Variables disponibles:

-   `PORT`: puerto en el que escucha el servidor.
-   `CLIENT_URL`: origen autorizado para las solicitudes del frontend.
-   `API_PREFIX`: prefijo común de las rutas de la API.

## Ejecución

Iniciar el servidor en modo desarrollo:

``` bash
npm run dev
```

Iniciar el servidor normalmente:

``` bash
npm start
```

Por defecto, la API queda disponible en:

``` text
http://localhost:3000
```

La ruta `GET /api/v1/health` permite comprobar el estado del servicio.

## Rutas disponibles

Todas las rutas de los módulos utilizan el prefijo `/api/v1`.

  ------------------------------------------------------------------------
  Recurso                 Ruta base                Operaciones
  ----------------------- ------------------------ -----------------------
  Clientes                `/api/v1/clientes`       GET, POST, GET por ID,
                                                   PUT y DELETE

  Equipos                 `/api/v1/equipos`        GET, POST, GET por ID,
                                                   PUT y DELETE

  Turnos                  `/api/v1/turnos`         GET, POST, GET por ID,
                                                   PUT, PATCH de estado y
                                                   DELETE

  Reparaciones            `/api/v1/reparaciones`   GET, POST, GET por ID,
                                                   PUT y DELETE

  Salud                   `/api/v1/health`         Comprobación del
                                                   servicio
  ------------------------------------------------------------------------

Los listados admiten parámetros de consulta para búsqueda, paginación,
filtros y ordenamiento, según cada recurso.

El resumen de turnos está disponible en:

``` text
GET /api/v1/turnos/resumen
```

## Pruebas con Postman

La colección grupal exportada se encuentra en:

``` text
postman/exports/Bahia_Fix_Coleccion.json
```

Puede importarse desde Postman para ejecutar las solicitudes de los
distintos módulos. Antes de realizar las pruebas, iniciar el servidor y
verificar que la URL y el puerto configurados coincidan con el entorno.

La colección utiliza la variable `base_url`, cuyo valor local
predeterminado es:

``` text
http://localhost:3000/api/v1
```

## Estructura del proyecto

``` text
bahia-fix-api/
├── postman/
│   └── exports/
│       └── Bahia_Fix_Coleccion.json
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
├── sample.env
├── .gitignore
├── package.json
└── README.md
```

## Consideraciones

-   La información se almacena en memoria y se inicializa con datos de
    demostración.
-   Las altas, modificaciones y eliminaciones no se conservan después de
    reiniciar el servidor.
-   La autenticación y los perfiles que se muestran en la interfaz
    pertenecen al flujo simulado del frontend.
-   Esta API no implementa autenticación JWT ni almacenamiento en una
    base de datos persistente.
