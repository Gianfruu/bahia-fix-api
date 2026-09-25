# Bahía Fix - API RESTful de Gestión de Turnos y Reparaciones (Backend)

## Grupo Nro 5
* **Campagnucci Gianfranco** (Responsable del grupo / Desarrollador) - campagnuccig@gmail.com
* **Painenahuel Luna Ignacio** (Desarrollador) - Campionrexprohard@gmail.com
* **Cutropia Ramiro** (Desarrollador) - ramirocarlosc2323@gmail.com

---

## Presentación de la API REST

El repositorio **bahia-fix-api** contiene la lógica de negocio, persistencia de datos y servicios backend para la plataforma **Bahía Fix**. Proporciona los endpoints RESTful necesarios para dar soporte al cliente web, gestionando la autenticación, control de accesos basados en roles, flujo de garantías oficiales, administración de órdenes de trabajo, cálculo de presupuestos e integración con MySQL mediante Sequelize ORM.

---

## Arquitectura y Lógica de Negocio Principal

El sistema backend maneja la lógica diferenciada de reparación y garantía:

```text
                  Petición HTTP (Client)
                            │
                            ▼
                    Ruta / Middleware (JWT)
                            │
                            ▼
                       Controlador
                            │
                            ▼
                       Servicio (Lógica de Negocio)
                            │
            ┌───────────────┴───────────────┐
            ▼                               ▼
  [Equipo en Garantía]            [Fuera de Garantía]
 - Valida Comprobante            - Genera Presupuesto
 - Asigna Costo $0 al Cliente    - Requiere Aprobación Cliente
 - Registra Cobro a Marca        - Asigna Costos de Flete
            └───────────────┬───────────────┘
                            ▼
                     Modelo (Sequelize)
                            │
                            ▼
                      Base de Datos (MySQL)
```

### Reglas de Negocio Clave
1. **Garantía Oficial:** Si se adjunta un comprobante válido, los costos de mano de obra y repuestos se registran a costo cero para el cliente y se acumulan en la cuenta de liquidación con el fabricante.
2. **Fuera de Garantía:** Se genera un presupuesto digital que requiere la aprobación del cliente antes de iniciar la reparación.
3. **Logística de Envíos:** Permite asociar gastos de flete a las órdenes pertenecientes a clientes de Bahía Blanca.
4. **Seguridad:** Las rutas están protegidas mediante middlewares que verifican los permisos del token JWT según el rol (`Cliente`, `Recepcion`, `Mecanico`, `Admin`).

---

## Tecnologías Utilizadas

* **Entorno de Ejecución:** Node.js
* **Framework Web:** Express.js
* **Base de Datos:** MySQL
* **ORM:** Sequelize
* **Autenticación:** JSON Web Tokens (JWT)
* **Seguridad:** Bcrypt.js (cifrado de contraseñas), Cors
* **Despliegue:** Render

---

## Estructura del Proyecto Backend

El backend está organizado siguiendo una arquitectura por capas basada en controladores, servicios y repositorios/modelos:

```text
bahia-fix-api/
│
├── src/
│   ├── config/             # Configuración de BD, JWT y variables globales
│   ├── controllers/        # Procesamiento de peticiones y respuestas HTTP
│   │   ├── authController.js
│   │   ├── appointmentController.js
│   │   ├── orderController.js
│   │   ├── quoteController.js
│   │   └── userController.js
│   ├── database/           # Instancia de Sequelize y conexión a MySQL
│   ├── middlewares/        # Validaciones de JWT, roles y manejo de errores
│   │   ├── authMiddleware.js
│   │   └── roleMiddleware.js
│   ├── models/             # Definición de entidades Sequelize y Relaciones
│   │   ├── User.js
│   │   ├── Equipment.js
│   │   ├── Appointment.js
│   │   ├── WorkOrder.js
│   │   ├── SparePart.js
│   │   └── Warranty.js
│   ├── routes/             # Definición de endpoints de la API
│   ├── services/           # Lógica pura de negocio y cálculos
│   └── utils/              # Módulos auxiliares del backend como helpers, constantes y generadores de tokens
├── .env.example            # Plantilla de variables de entorno
├── package.json
└── README.md
```

---

## Esquema Simplificado de Base de Datos

```text
USUARIOS (id, nombre, email, password, rol)
   │
   ├───< EQUIPOS (id, cliente_id, tipo, marca, modelo, numero_serie)
   │        │
   │        └───< ORDENES_TRABAJO (id, equipo_id, estado, es_garantia, costo_flete)
   │                 │
   │                 ├───< PRESUPUESTOS (id, orden_id, costo_mano_obra, total, estado)
   │                 └───< REPUESTOS_UTILIZADOS (id, orden_id, repuesto_id, cantidad)
   │
   └───< TURNOS (id, cliente_id, equipo_id, fecha, estado)
```

---

## Instalación y Configuración Local

### Requisitos Previos
* Node.js (v18+)
* MySQL Server en ejecución

### 1. Clonar el Repositorio

```bash
git clone https://github.com/Gianfruu/bahia-fix-api.git
cd bahia-fix-api
```

### 2. Instalar Dependencias

```bash
npm install
```

### 3. Configurar Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto basándote en `.env.example`:

```env
PORT=3001
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=tu_password
DB_NAME=bahia_fix_db
DB_PORT=3306
JWT_SECRET=clave_secreta_jwt_bahia_fix
```

### 4. Inicializar la Base de Datos y Servidor

Asegúrate de haber creado la base de datos en MySQL:

```sql
CREATE DATABASE bahia_fix_db;
```

Inicia el servidor en entorno de desarrollo:

```bash
npm run dev
```

El servidor estará corriendo en `http://localhost:3001`.

---

## Principales Endpoints de la API

### Autenticación
* `POST /api/auth/register` - Registro de usuarios
* `POST /api/auth/login` - Inicio de sesión y obtención de token JWT

### Turnos (Clientes / Recepción)
* `GET /api/turnos` - Listado de turnos
* `POST /api/turnos` - Solicitud de nuevo turno

### Órdenes de Trabajo y Taller
* `GET /api/ordenes` - Listar órdenes de trabajo (Filtros por estado/mecánico)
* `POST /api/ordenes` - Registrar ingreso de equipo (Recepción)
* `PUT /api/ordenes/:id/estado` - Actualizar estado de reparación (Mecánicos)

### Presupuestos y Garantías
* `POST /api/presupuestos` - Crear diagnóstico y presupuesto (Mecánicos)
* `PATCH /api/presupuestos/:id/aprobar` - Aprobar/Rechazar presupuesto (Cliente)
* `POST /api/garantias/validar` - Validar documentación de garantía (Admin/Recepción)

---

## Funcionalidades esperadas del backend

- Autenticación segura con Bcrypt y JWT.
- Middlewares de autorización por rol (`checkRole(['Admin', 'Mecanico'])`).
- Modelado de modelos y relaciones en Sequelize.
- Endpoint para procesamiento de garantías y presupuesto a $0.
- Cálculo automático de presupuestos (Repuestos mas la Mano de Obra).
- Métricas y reportes para el panel administrativo.
