# 🚀 Proyecto de Autenticación con Express y PostgreSQL

Este proyecto es una API de autenticación basada en **Node.js**, **Express** y **PostgreSQL**. Permite el registro e inicio de sesión de usuarios con contraseñas encriptadas utilizando `bcryptjs`. Además, se incluyen características como el manejo de CORS y la configuración de variables de entorno con `dotenv`.

## 📌 Tecnologías Utilizadas

- **[Node.js](https://nodejs.org/)**: Entorno de ejecución para JavaScript.
- **[Express](https://expressjs.com/)**: Framework para construir aplicaciones web y APIs.
- **[PostgreSQL](https://www.postgresql.org/)**: Sistema de gestión de bases de datos relacional.
- **[bcryptjs](https://www.npmjs.com/package/bcryptjs)**: Biblioteca para encriptar contraseñas.
- **[CORS](https://www.npmjs.com/package/cors)**: Middleware para habilitar el intercambio de recursos entre diferentes orígenes.
- **[dotenv](https://www.npmjs.com/package/dotenv)**: Carga variables de entorno desde un archivo `.env`.
- **[pg](https://www.npmjs.com/package/pg)**: Cliente de PostgreSQL para Node.js.
- **[animate.css](https://animate.style/)**: Biblioteca de animaciones CSS.
- **[sweetalert2](https://sweetalert2.github.io/#download)**: Biblioteca oara alerts JS

## 📌 Descripción de las Dependencias

| 📦 Dependencia | 🔍 Descripción                                                                                                      |
| -------------- | ------------------------------------------------------------------------------------------------------------------- |
| `express`      | Framework para manejar rutas y peticiones HTTP.                                                                     |
| `dotenv`       | Carga las variables de entorno desde el archivo `.env`.                                                             |
| `bcryptjs`     | Permite encriptar y comparar contraseñas de forma segura.                                                           |
| `cors`         | Habilita el Cross-Origin Resource Sharing (CORS) para permitir peticiones de otros dominios.                        |
| `pg`           | Cliente de PostgreSQL para conectar y realizar consultas en la base de datos.                                       |
| `path`         | Módulo nativo de Node.js para trabajar con rutas de archivos. _(No es necesario instalarlo, ya viene con Node.js)._ |
| `animate.css`  | Biblioteca de animaciones CSS para mejorar la experiencia visual.                                                   |
| `sweetalert2`  | Biblioteca de alerts JS para mejorar la experiencia visual.                                                         |

## 🛠️ Instalación y Configuración

1. **Instalar dependencias**:
   ```bash
   npm install express dotenv bcryptjs cors pg animate.css sweetalert2 --save
   ```
2. **Configuración**:

   ```bash
    CAMBIAR EL "DATABASE_URL" DEL ARCHIVO .env POR LA URL DEL SERVIDOR

    El "initDB.js" solo se ejecuta "UNA" vez al principio, es para la creación de la tabla usuarios

    "nodemon server.js" para iniciar la conexión con el servidor y la bd
   ```

## IMPORTANTE

⚠️ **IMPORTANTE:** NO EJECUTAR CONECTADO A LA RED DEL COLEGIO
