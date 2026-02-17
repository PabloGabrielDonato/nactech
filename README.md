# nactech | iPhone Repair Management System

Sistema de administración minimalista y funcional para servicios técnicos de reparación de iPhone.

## Características
- **Dashboard**: Resumen de reparaciones activas, ingresos y stock crítico.
- **Reparaciones**: Gestión completa de órdenes (Cliente, Equipo, IMEI, Contraseña, Estado).
- **Clientes**: Base de datos de clientes con historial (nombre, DNI, teléfono).
- **Stock**: Inventario categorizado (Fundas, Cargadores, Repuestos) con control de cantidades.
- **Finanzas**: Separación de ingresos por reparación vs ventas y reporte de rentabilidad.
- **Diseño**: Minimalista (estilo Apple), 100% responsive y modo oscuro por defecto.

## Tecnologías
- **Next.js 16** (App Router)
- **Tailwind CSS 4**
- **Lucide React** (Iconografía)
- **Prisma** (Listo para conectar a base de datos)

## Cómo levantar el proyecto

### 1. Clonar o descargar los archivos
Asegúrate de estar en la carpeta raíz del proyecto.

### 2. Instalar dependencias
```bash
npm install
```

### 3. Configurar la Base de Datos (Opcional)
El proyecto incluye una configuración de **Prisma** lista para usar con SQLite. Para inicializarla:
```bash
npx prisma db push
```
*Nota: Se han incluido datos de prueba (mock data) en la UI para que el sistema sea funcional inmediatamente sin necesidad de base de datos externa.*

### 4. Iniciar en modo desarrollo
```bash
npm run dev
```
La aplicación estará disponible en `http://localhost:3000`.

## Estructura del Proyecto
- `/src/app`: Páginas y ruteo (Dashboard, Reparaciones, Clientes, etc.)
- `/src/components`: Componentes reutilizables (Sidebar, Layout).
- `/src/data`: Información estática (Lista de modelos de iPhone).
- `/src/lib`: Utilidades y configuración de base de datos.

---
Desarrollado para **nactech**.
