# Proyecto Ferreteria

Sistema de gestion para ferreteria.

---

## Stack tecnologico

| Componente | Tecnologia             |
| ---------- | ---------------------- |
| Backend    | Node.js + Express 4    |
| Vistas     | EJS (server rendering) |
| ORM        | Sequelize              |
| Base datos | MySQL                  |
| Auth       | JWT + bcrypt           |

---

## rq-01: Producto

Tabla: `Producto`

| Campo       | Tipo         | Requerido | Descripcion           |
| ----------- | ------------ | --------- | --------------------- |
| id          | INT (PK, AI) | Si        | Identificador         |
| nombre      | VARCHAR(150) | Si        | Nombre del producto   |
| descripcion | TEXT         | No        | Descripcion           |
| precio      | DECIMAL(10,2)| Si        | Precio de venta       |
| stock       | INT          | Si        | Cantidad en inventario|
| categoria   | VARCHAR(60)  | Si        | Categoria             |
| created_at  | DATETIME     | Si        | Fecha de creacion     |
| updated_at  | DATETIME     | Si        | Ultima actualizacion  |

---

## rq-02: Categoria

Tabla: `Categoria`

| Campo       | Tipo         | Requerido | Descripcion          |
| ----------- | ------------ | --------- | -------------------- |
| id          | INT (PK, AI) | Si        | Identificador        |
| nombre      | VARCHAR(80)  | Si        | Nombre de categoria  |
| descripcion | TEXT         | No        | Descripcion          |
| created_at  | DATETIME     | Si        | Fecha de creacion    |
| updated_at  | DATETIME     | Si        | Ultima actualizacion |

---

## GEN-04: Usuario

Tabla: `Usuario`

| Campo       | Tipo         | Requerido | Descripcion          |
| ----------- | ------------ | --------- | -------------------- |
| id          | INT (PK, AI) | Si        | Identificador        |
| nombre      | VARCHAR(100) | Si        | Nombre del usuario   |
| email       | VARCHAR(100) | Si        | Email (unico)        |
| password    | VARCHAR(255) | Si        | Contrasena hasheada  |
| rol         | VARCHAR(20)  | Si        | admin / vendedor     |
| activo      | BOOLEAN      | Si        | Usuario activo       |
| created_at  | DATETIME     | Si        | Fecha de creacion    |
| updated_at  | DATETIME     | Si        | Ultima actualizacion |

---

## GEN-02: Variables de entorno

| Variable       | Proposito                       | Local              | Produccion              |
| -------------- | ------------------------------- | ------------------ | ----------------------- |
| `DATABASE_URL` | Conexion MySQL                  | `.env`             | Panel de hosting        |
| `PORT`         | Puerto del servidor             | `3000`             | Asignado automaticamente|
| `NODE_ENV`     | Entorno                         | `development`      | `production`            |
| `JWT_SECRET`   | Clave para firmar tokens JWT    | Valor en `.env`    | Panel de hosting        |
| `CORS_ORIGIN`  | Origen permitido para CORS      | `http://localhost:5173` | URL del front       |

---

## GEN-03: Conexion a BD

Sequelize se conecta mediante `DATABASE_URL` definida en `.env`. Configuracion en `config/database.js`.

---

## GEN-05: Login

Login implementado con JWT almacenado en cookie httpOnly.

- **GET** `/auth/login` - formulario de inicio de sesion
- **POST** `/auth/login` - autentica con email/password, genera JWT
- **GET** `/auth/logout` - limpia cookie, redirige a login
- **GET** `/` - dashboard protegido (requiere autenticacion)

Credenciales de prueba:

| Email                    | Password    | Rol     |
| ------------------------ | ----------- | ------- |
| admin@ferreteria.com     | admin123    | admin   |
| cliente@ferreteria.com   | cliente123  | cliente |

---

## rq-04: CRUD Cotizaciones

Tabla: `Cotizacion` (1:N con `DetalleCotizacion`)

| Campo          | Tipo         | Requerido | Descripcion              |
| -------------- | ------------ | --------- | ------------------------ |
| id             | INT (PK, AI) | Si        | Identificador            |
| cliente_nombre | VARCHAR(150) | Si        | Nombre del cliente       |
| fecha          | DATEONLY     | Si        | Fecha de la cotizacion   |
| total          | DECIMAL(10,2)| Si        | Total calculado          |
| estado         | VARCHAR(20)  | Si        | pendiente/aprobada/rechazada |
| usuario_id     | INT (FK)     | Si        | Usuario que la creo      |

Tabla: `DetalleCotizacion`

| Campo          | Tipo         | Requerido | Descripcion              |
| -------------- | ------------ | --------- | ------------------------ |
| id             | INT (PK, AI) | Si        | Identificador            |
| cotizacion_id  | INT (FK)     | Si        | Cotizacion padre         |
| producto_id    | INT (FK)     | Si        | Producto                 |
| cantidad       | INT          | Si        | Cantidad solicitada      |
| precio_unitario| DECIMAL(10,2)| Si        | Precio al momento        |
| subtotal       | DECIMAL(10,2)| Si        | precio * cantidad        |

### Endpoints

| Metodo | Ruta                          | Descripcion              |
| ------ | ----------------------------- | ------------------------ |
| GET    | `/cotizaciones`               | Lista de cotizaciones    |
| GET    | `/cotizaciones/nueva`         | Formulario nueva         |
| POST   | `/cotizaciones`               | Crear cotizacion         |
| GET    | `/cotizaciones/:id`           | Ver detalle              |
| POST   | `/cotizaciones/:id/agregar`   | Agregar producto         |
| POST   | `/cotizaciones/:id/estado`    | Aprobar/rechazar         |

---

## rq-05: No vender sobre stock

- Al crear cotizacion o agregar producto, se valida que `producto.stock >= cantidad`
- Si no hay stock suficiente, responde **HTTP 409** con mensaje: `Stock insuficiente. "Producto X" tiene Y unidades, solicitaste Z.`
- Al aprobar una cotizacion, se descuenta el stock de cada producto en una transaccion

---

## rq-06: Cotizacion confirmada descuenta stock

- **Borrador (pendiente):** al crear cotizacion NO se descuenta stock
- **Confirmada (aprobada):** al aprobar, SI se descuenta stock de cada producto en transaccion
- Si al aprobar el stock ya no alcanza (otro proceso lo consumio), devuelve **HTTP 409**

---

## Migraciones

| Archivo                       | Tabla              |
| ----------------------------- | ------------------ |
| `...-create-producto.js`      | Producto           |
| `...-create-usuario.js`       | Usuario            |
| `...-create-categoria.js`     | Categoria          |
| `...-create-cotizacion.js`    | Cotizacion + DetalleCotizacion |

---

## Instalacion

```bash
# 1. Instalar dependencias
npm install

# 2. Copiar variables de entorno
cp .env.example .env

# 3. Editar .env con tus credenciales de MySQL
#    DATABASE_URL=mysql://usuario:password@127.0.0.1:3306/ferreteria_dev

# 4. Crear base de datos en MySQL
#    CREATE DATABASE ferreteria_dev;

# 5. Ejecutar migraciones
npm run db:migrate

# 6. Cargar datos de ejemplo
npm run db:seed

# 7. Iniciar servidor
npm start
```

Abrir http://localhost:3000/auth/login

## Scripts

| Comando                  | Accion                            |
| ------------------------ | --------------------------------- |
| `npm start`              | Inicia servidor Express           |
| `npm run db:migrate`     | Ejecuta migraciones pendientes    |
| `npm run db:seed`        | Carga datos de ejemplo            |
| `npm run db:reset`       | Revierte migraciones, recrea y carga seeds |

---

## Matriz de avance

| Requisito | Estado      |
| --------- | ----------- |
| rq-01     | Completado  |
| rq-02     | Completado  |
| rq-04     | Completado  |
| rq-05     | Completado  |
| rq-06     | Completado  |
| GEN-02    | Completado  |
| GEN-03    | Completado  |
| GEN-05    | Completado  |

---

## Estructura del proyecto

```
├── config/database.js
├── middleware/auth.js
├── migrations/
├── models/
│   ├── index.js
│   ├── producto.js
│   ├── usuario.js
│   ├── categoria.js
│   ├── cotizacion.js
│   └── detallecotizacion.js
├── public/css/style.css
├── routes/
│   ├── auth.js
│   ├── index.js
│   └── cotizaciones.js
├── seeders/
├── views/
│   ├── dashboard.ejs
│   ├── error.ejs
│   ├── login.ejs
│   ├── cotizaciones/
│   │   ├── index.ejs
│   │   ├── nueva.ejs
│   │   └── detalle.ejs
│   └── partials/header.ejs
├── .env.example
├── .gitignore
├── .sequelizerc
├── app.js
└── package.json
```
