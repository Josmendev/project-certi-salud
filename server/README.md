# Server - Project Certi Salud

<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

Este es el servidor (Backend) del proyecto **Certi Salud**. Está construido con **NestJS** y **MySQL** como gestor de base de datos.

## 🚀 Arquitectura de Software – Backend (API RESTful)

### 📌 Tecnologías Utilizadas

- **Lenguaje de Programación:** JavaScript / TypeScript
- **Entorno de Ejecución:** Node.js
- **Framework:** NestJS 🚀
- **ORM:** TypeORM 🗄️
- **Gestor de Base de Datos:**
  - **MySQL** (Almacenamiento de datos)
  - **Redis** (Almacenamiento temporal en memoria)
- **Modelador / Administrador de Base de Datos:** MySQL Workbench / TablePlus 🛠️
- **Contenerización:** Docker 🐳
- **Documentación:** Swagger 📄
- **Testing:**
  - **Jest** (Pruebas Unitarias e Integración 🔍)
  - **Postman / Insomnia** (Pruebas Funcionales 📡)

### 🏗️ Estilo y Patrón de Arquitectura y Patrones de Diseño

- **Estilo de Arquitectura:** Cliente / Servidor (Monolítica)
- **Patrón de Arquitectura:** Modular (Propuesta por Nest) usando conceptos de MVC
- **Patrones de Diseño:**
  - **Estructurales:** Adapters, Decorators
  - **De Comportamiento:** Strategy

## 📦 Instalación y Ejecución

1. Clonar el repositorio:

   ```sh
   git clone https://github.com/JosmenDev/project-certi-salud.git
   cd project-certi-salud/backend
   ```

2. Instalar las dependencias con PNPM:

   ```sh
   pnpm install
   ```

3. Configurar las variables de entorno:

   - Clonar el archivo `.env.template` y renombrarlo a `.env`
   - Modificar las variables de entorno según sea necesario

4. Levantar la base de datos con Docker:

   ```sh
   docker-compose up -d
   ```

5. Iniciar el servidor en modo desarrollo:

   ```sh
   pnpm start:dev
   ```

6. Ejecutar el proceso de seed para poblar la base de datos con registros iniciales

   ```sh
   http://localhost:3002/api/v1/seed
   ```

   - Usuario de acceso: **70125834**
   - Contraseña: **70125834**

