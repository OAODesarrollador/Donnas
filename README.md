# 🍩 Central Donuts - Documentación Técnica y Manual del Sistema

[![Next.js Version](https://img.shields.io/badge/Next.js-16.2.6-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![React Version](https://img.shields.io/badge/React-19.2.4-blue?style=flat-square&logo=react)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![Prisma Version](https://img.shields.io/badge/Prisma-7.8.0-2D3748?style=flat-square&logo=prisma)](https://www.prisma.io/)
[![Database](https://img.shields.io/badge/Database-PostgreSQL_17%2F18-4169E1?style=flat-square&logo=postgresql)](https://www.postgresql.org/)

Este repositorio contiene la plataforma web e-commerce boutique y landing page premium diseñada a medida para **Central Donuts** (`@centraldonuts00`). Este documento proporciona una visión exhaustiva de la arquitectura del sistema, las decisiones de diseño de interfaz (UX/UI), el stack tecnológico utilizado, la base de datos relacional y las instrucciones necesarias para el despliegue y mantenimiento del software.

---

## 📖 Índice

1. [🎨 Concepto y Filosofía de Diseño (UX/UI)](#-concepto-y-filosofía-de-diseño-uxui)
2. [💻 Stack Tecnológico Completo](#-stack-tecnológico-completo)
3. [🗄️ Arquitectura de Base de Datos (Relacional - PostgreSQL)](#️-arquitectura-de-base-de-datos-relacional---postgresql)
4. [⚙️ Patrón de Conexión en Prisma 7 (Driver Adapter)](#️-patrón-de-conexión-en-prisma-7-driver-adapter)
5. [📦 Desglose Detallado de Módulos y Componentes](#-desglose-detallado-de-módulos-y-componentes)
6. [🚀 Guía de Instalación, Configuración y Siembra](#-guía-de-instalación-configuración-y-siembra)
7. [📁 Estructura del Directorio del Proyecto](#-estructura-del-directorio-del-proyecto)
8. [🛡️ Robustez y Optimización WebView (Instagram)](#️-robustez-y-optimización-webview-instagram)

---

## 🎨 Concepto y Filosofía de Diseño (UX/UI)

La prioridad absoluta del sistema es **Mobile-First**, diseñada para lograr una tasa de conversión óptima cuando los usuarios hacen clic en el enlace único de la biografía de Instagram de la marca. 

### Decisiones Estéticas (Premium Branding)
* **Paleta de Colores de Especialidad:**
  * `Fondo Crema Suave` (`#FDFBF7`): Un lienzo elegante que simula el papel manteca de repostería artesanal.
  * `Cacao Profundo` (`#2A1B14`): Usado en textos y elementos estructurales para dar contraste artesanal y legibilidad sofisticada.
  * `Rosa Glaseado` (`#F3D2C9`): El color de acento principal que evoca el glaseado fresco y las texturas dulces de las donuts.
  * `Tostado Cálido` (`#EADBC8`): Tono secundario de cohesión para separadores y tarjetas de productos.
* **Tipografía de Alta Gama:**
  * **Playfair Display:** Usada en títulos editoriales clásicos para dotar a la marca de una identidad sofisticada y de alta gama.
  * **Outfit:** Fuente sans-serif contemporánea seleccionada por su legibilidad en pantallas pequeñas, ideal para la rápida asimilación de precios y descripciones.
* **Físicas de Interacción Líquida:** Inspiradas en las últimas guías de diseño de Apple para iOS 17. Todos los botones principales poseen animaciones elásticas de rebote (`spring`) desarrolladas mediante **Framer Motion**, dando una respuesta visual que emula la vibración de un botón físico al hacer clic o tocar la pantalla de un smartphone.

---

## 💻 Stack Tecnológico Completo

El sistema está construido sobre un stack de tecnologías frontend y backend modernas, seleccionadas para garantizar máxima velocidad de carga (instant-loading), mantenibilidad y estabilidad:

* **Core & Renderizado:** [Next.js 16.2.6 (App Router)](https://nextjs.org/) con soporte para **React 19.2.4** y compilador en tiempo real **Turbopack**. La página principal está estructurada como un *Server Component* para realizar consultas directas y eficientes a la base de datos en el servidor, garantizando SEO óptimo y velocidad de carga ultrarrápida.
* **Tipado Seguro:** [TypeScript 5](https://www.typescriptlang.org/) para mitigar errores en tiempo de compilación y robustecer el flujo de datos.
* **Estilos y Layouts:** [Tailwind CSS v4](https://tailwindcss.com/) configurado de forma declarativa directamente desde `@theme` en el archivo CSS global (`globals.css`), logrando un build ultra-optimizado sin archivos de configuración redundantes.
* **Animaciones de Interfaz:** [Framer Motion 12.3.9](https://www.framer.com/motion/) para transiciones suaves de componentes, animaciones de distribución en cuadrículas de productos y respuestas de resorte.
* **Base de Datos:** [PostgreSQL 17/18](https://www.postgresql.org/) como motor relacional, ideal para manejar de forma robusta la persistencia de productos, precios y categorías en entornos locales y en la nube.
* **ORM (Object-Relational Mapping):** [Prisma v7.8.0](https://www.prisma.io/) para la abstracción de consultas y modelado de datos tipo-seguro.
* **Gestión de Estado:** React Context API (`CartProvider` en `CartContext.tsx`) con persistencia local persistida mediante `localStorage` para garantizar la consistencia de los artículos de compra entre recargas y cierres accidentales.

---

## 🗄️ Arquitectura de Base de Datos (Relacional - PostgreSQL)

La base de datos del sistema es de tipo **Relacional**, implementada sobre **PostgreSQL**. Se utiliza esta estructura por sobre motores NoSQL debido a la necesidad de mantener consistencia estricta en los tipos de datos comerciales (precios enteros, IDs relacionales y clasificaciones de catálogo).

### Estructura de la Tabla `Product`
El modelo de datos está definido dentro del archivo de esquema [prisma/schema.prisma](file:///d:/Donnas/prisma/schema.prisma):

```prisma
model Product {
  id          String   @id @default(uuid())
  name        String
  price       Int      // Almacenado como entero en ARS (ej. 14500)
  description String
  image       String   // Ruta en public/assets o gradiente CSS
  category    String   // "combos", "cajas", "donuts", "bebidas"
  badge       String?  // Etiqueta opcional (ej. "Más Vendido", "Recomendado")
  isPopular   Boolean  @default(false)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

### Detalle de Campos y Tipos de Datos (PostgreSQL Nativo)
* `id` (`UUID` / `VARCHAR(36)`): Clave primaria generada automáticamente mediante el algoritmo UUID de forma aleatoria, impidiendo la predicción de identificadores de productos.
* `name` (`VARCHAR(255)`): Nombre comercial del producto gastronómico.
* `price` (`INTEGER`): Precio del producto almacenado en pesos argentinos (ARS). Se almacena deliberadamente como un número entero (`Int`) para evitar errores de redondeo de punto flotante en cálculos monetarios del carrito.
* `description` (`TEXT`): Descripción extendida de los ingredientes, combinaciones o presentación comercial del producto.
* `image` (`TEXT` / `VARCHAR(500)`): Almacena la ruta del recurso fotográfico local de alta resolución (ej. `/assets/donut_box_12.png`) o un gradiente CSS estilizado con la paleta de la marca (ej. `grad-chocolate`).
* `category` (`VARCHAR(50)`): Clasificación principal del producto usada para el filtrado dinámico en la UI. Permite los valores indexados: `combos`, `cajas`, `donuts`, `bebidas`.
* `badge` (`VARCHAR(50)` - *Nullable*): Etiqueta promocional opcional para destacar productos especiales.
* `isPopular` (`BOOLEAN`): Indicador binario utilizado en el backend para pre-filtrar y priorizar productos destacados en la cabecera del catálogo.
* `createdAt` / `updatedAt` (`TIMESTAMP`): Fechas de control operacional del sistema para auditorías de base de datos.

---

## ⚙️ Patrón de Conexión en Prisma 7 (Driver Adapter)

Con el lanzamiento de **Prisma 7.8.0**, se introdujo una arquitectura modular y descentralizada de conexión a base de datos. Los motores TCP rústicos tradicionales ya no se declaran directamente dentro del archivo `schema.prisma`. 

En su lugar, este proyecto implementa el patrón **Driver Adapter** utilizando el controlador oficial de PostgreSQL para Node (`pg`) y el adaptador oficial de Prisma (`@prisma/adapter-pg`).

### 1. Configuración de Entorno (`prisma.config.ts`)
Para posibilitar la sincronización de esquemas y migraciones sin inyectar URLs en el archivo `.prisma`, se creó [prisma.config.ts](file:///d:/Donnas/prisma.config.ts) en la raíz:

```typescript
import "dotenv/config";
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    url: env("DATABASE_URL"),
  },
});
```

### 2. Singleton del Cliente de Datos (`src/lib/db.ts`)
Para evitar la duplicación de conexiones (sobrecarga de sockets de PostgreSQL) durante la recarga en caliente de Next.js, implementamos un cliente Singleton en [src/lib/db.ts](file:///d:/Donnas/src/lib/db.ts) que inicializa el adaptador de manera segura:

```typescript
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const createPrismaClient = () => {
  const connectionString = process.env.DATABASE_URL;
  const pool = new Pool({ connectionString });
  const adapter = new PrismaPg(pool);
  return new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });
};

export const db = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;
```

---

## 📦 Desglose Detallado de Módulos y Componentes

El frontend está estructurado bajo una filosofía modular con componentes reutilizables altamente responsivos y adaptados a todos los tamaños de pantalla (móviles, tablets y ordenadores):

### 1. `Navbar` Global ([Navbar.tsx](file:///d:/Donnas/src/components/Navbar.tsx))
* Barra superior flotante con efecto *glassmorphism* que se funde con el fondo crema mediante desenfoque de fondo (`backdrop-blur-md bg-[#FDFBF7]/80`).
* En computadoras muestra enlaces de categorías editoriales y un botón indicador del carrito con contador reactivo.
* En móviles, colapsa en un discreto botón hamburguesa animado con panel deslizable lateral a pantalla completa para mantener el foco visual.

### 2. `BottomNavBar` de Acción Móvil ([BottomNavBar.tsx](file:///d:/Donnas/src/components/BottomNavBar.tsx))
* Diseñada estratégicamente para la zona ergonómica del pulgar.
* **Cuando el carrito está vacío:** Muestra enlaces de navegación rápida a WhatsApp de atención, Instagram oficial y catálogo general.
* **Cuando el usuario agrega productos:** Transiciona de forma líquida y orgánica en un **botón elástico gigante flotante** que muestra el costo del pedido. Esto evita que el usuario tenga que estirar la mano hacia la parte superior, aumentando radicalmente la conversión del checkout.

### 3. Catálogo de Productos ([Catalog.tsx](file:///d:/Donnas/src/components/Catalog.tsx))
* Grilla de productos responsiva de hasta 3 columnas en PC y 1 columna en móviles.
* Posee una barra de filtros dinámicos categorizados (Combos, Cajas, Donuts, Bebidas) con animaciones de distribución fluida al reordenarse.
* Renderiza tarjetas premium con visuales fotográficas reales y gradientes sofisticados, destacando los productos populares con etiquetas promocionales personalizadas.

### 4. Carrito Híbrido ([CartDrawer.tsx](file:///d:/Donnas/src/components/CartDrawer.tsx))
* **Responsividad Adaptiva:** 
  * En **PC y Computadoras**, se despliega como un elegante panel lateral deslizable (*Drawer*).
  * En **Móviles y Teléfonos**, se transforma en una **hoja inferior interactiva (bottom-sheet)** que sube desde el borde inferior de la pantalla.
* Permite el ajuste inmediato de cantidades, la visualización en tiempo real de subtotales y la eliminación rápida de ítems.

### 5. Checkout con Pasarela y Envío ([CheckoutModal.tsx](file:///d:/Donnas/src/components/CheckoutModal.tsx))
* **Paso 1: Información de Entrega:** Captura nombre, teléfono y modalidad de envío (Retiro en local en Palermo Soho o Envío a Domicilio con cálculo de costo logístico dinámico).
* **Paso 2: Terminal Interactiva Mercado Pago:** Simula un flujo de pago con tarjeta con animaciones visuales de aprobación rápida.
* **Paso 3: Éxito y Ticket WhatsApp:** Al aprobar el pago, se genera una plantilla estructurada y codificada mediante URI en español, lista para enviarse al WhatsApp del comercio de un solo toque:
  ```text
  ¡Hola Central Donuts! 🍩
  Acabo de realizar un pedido:
  
  *Cliente:* Juan Perez
  *WhatsApp:* +54 9 11 1234-5678
  *Entrega:* Envío a Domicilio (Av. Santa Fe 1234, CABA)
  *Método de Pago:* Mercado Pago (Aprobado)
  
  *Detalle del Pedido:*
  - 1x Caja Central x12 ($21.000)
  - 1x Combo Glaseado Real ($14.500)
  
  *Envío:* $2.500
  *Total:* $38.000
  ```

---

## 🚀 Guía de Instalación, Configuración y Siembra

Sigue el ciclo de vida de instalación para levantar de forma exitosa el proyecto con la base de datos relacional integrada:

### Prerrequisitos
Tener instalado en tu sistema:
1. **Node.js** (Versión 18 o superior recomendada).
2. **PostgreSQL** activo en tu máquina local o en la nube (el instalador por defecto configurará el puerto `5432`).

### Paso 1: Clonar el Repositorio e Instalar Paquetes
Abre tu consola de comandos en la carpeta raíz y ejecuta:
```bash
npm install
```

### Paso 2: Configurar las Variables de Entorno (`.env`)
Crea un archivo llamado `.env` en la raíz del proyecto (basándote en `.env.example`). Introduce la cadena de conexión de tu PostgreSQL:
```env
# URL de conexión local de PostgreSQL (Con contraseña por defecto o la configurada en tu instalación)
DATABASE_URL="postgresql://postgres:okydoky@localhost:5432/central_donuts?schema=public"
```
*(Nota: El sistema detectará automáticamente el puerto `5432`. El usuario del superadministrador es `postgres` y la contraseña local descubierta durante la auditoría del sistema es `okydoky`).*

### Paso 3: Generar los Módulos de Prisma Client
Genera los tipos integrales y bindings de TypeScript para interactuar con la base de datos:
```bash
npx prisma generate
```

### Paso 4: Sincronizar el Esquema y Crear las Tablas
Corre la sincronización del esquema para indicarle a Prisma que cree la base de datos `central_donuts` y la tabla `Product` en tu PostgreSQL local:
```bash
npx prisma db push
```

### Paso 5: Sembrar la Base de Datos con el Catálogo Gourmet
Ejecuta el script de siembra automática para vaciar duplicados y poblar la tabla con las 9 donuts, combos y bebidas specialty premium reales de la marca:
```bash
npx ts-node --compiler-options "{\"module\":\"CommonJS\"}" prisma/seed.ts
```

### Paso 6: Levantar en Modo Desarrollo
Inicia el servidor en tiempo real de Next.js (con compilación ultra rápida Turbopack):
```bash
npm run dev
```
Accede desde tu navegador a [http://localhost:3000](http://localhost:3000).

### Paso 7: Compilar en Modo Producción
Para verificar la optimización estática de las páginas, validación de tipos estáticos y pre-renderizado del Server Component, ejecuta:
```bash
npm run build
```

---

## 📁 Estructura del Directorio del Proyecto

```text
central-donuts/
├── prisma/
│   ├── schema.prisma      # Declaración relacional de tablas de base de datos
│   └── seed.ts            # Script de población (Catálogo Premium) con adapter de pg
├── public/
│   └── assets/            # Activos fotográficos reales de alta fidelidad
├── src/
│   ├── app/
│   │   ├── globals.css    # Definición de Tailwind v4 y variables globales de color
│   │   ├── layout.tsx     # Contenedor raíz, tipografías Outfit/Playfair y CartProvider
│   │   ├── page.tsx       # Server Component que realiza la consulta SQL mediante Prisma
│   │   └── MainShop.tsx   # Client-side Shell que sincroniza filtros, carrito y modales
│   ├── components/
│   │   ├── ui/
│   │   │   └── Button.tsx # Botón con física elástica Framer Motion estilo iOS 17
│   │   ├── Navbar.tsx     # Menú superior glassmorphic colapsable responsivo
│   │   ├── BottomNavBar.tsx# Dock del pulgar optimizado ergonómicamente
│   │   ├── Catalog.tsx    # Cuadrícula responsiva de productos con animaciones
│   │   ├── CartDrawer.tsx # Carrito híbrido responsivo lateral/hoja inferior
│   │   └── CheckoutModal.tsx# Checkout multipaso, pasarela simulada de tarjeta y WhatsApp
│   ├── context/
│   │   └── CartContext.tsx# Estado React Context y persistencia de items en LocalStorage
│   └── lib/
│       └── db.ts          # Inicializador singleton de Prisma Client con PrismaPg
├── prisma.config.ts       # Configuración global del entorno operativo de base de datos
├── package.json           # Declaración de dependencias del framework y scripts
├── tsconfig.json          # Reglas del compilador de TypeScript
└── README.md              # Documentación y manual del sistema (Este archivo)
```

---

## 🛡️ Robustez y Optimización WebView (Instagram)

Cuando una aplicación web se abre a través del navegador integrado de aplicaciones móviles como Instagram o Facebook, suelen surgir fricciones de compatibilidad. Esta plataforma fue optimizada activamente para resolver estas limitantes de forma preventiva:

1. **Prevención de Zoom de Entradas en iOS (WebView Safari):** Añadimos configuraciones específicas de viewport en los metadatos de Next.js (`maximumScale: 1`, `userScalable: false`) para impedir que los inputs de tarjeta o de entrega del checkout disparen el molesto efecto de auto-zoom e inestabilidad visual típico de iPhones en WebViews.
2. **Evitar Fallos de Carga por Turbopack e SSR en Lucide React:** Encontramos que el compilador Turbopack presentaba fallos en SSR al importar ciertos iconos de redes sociales directamente desde librerías de paquetes de Node. Solucionamos esta vulnerabilidad escribiendo vectores SVG nativos integrados directamente en el código para el icono de Instagram, garantizando un despliegue robusto, sin retardos de renderizado de librerías ni errores del servidor.
3. **Mantenimiento Eficiente de Sesión:** El carrito se guarda automáticamente en `localStorage`. Si el usuario navega a otra aplicación o recibe una llamada telefónica y regresa a Instagram, el carrito no se vacía, asegurando una retención superior del cliente.

---

🍩 *Desarrollado y documentado con los más altos estándares de ingeniería de software para potenciar las ventas digitales de Central Donuts.*
