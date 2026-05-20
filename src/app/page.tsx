import React from "react";
import { db } from "@/lib/db";
import { MainShop } from "./MainShop";

// Indica a Next.js que revalide esta ruta en cada request (consultas en vivo a la DB)
export const revalidate = 0;

export default async function Home() {
  let dbProducts = [];

  try {
    // Consulta directa a la base de datos PostgreSQL en el servidor
    dbProducts = await db.product.findMany({
      orderBy: {
        createdAt: "asc",
      },
    });
  } catch (error) {
    console.error("⚠️ Error consultando PostgreSQL (Usando fallback de desarrollo):", error);
    
    // Fallback robusto en desarrollo si la base de datos no está levantada o configurada aún en .env
    dbProducts = [
      {
        id: "combo-1",
        name: "Combo Glaseado Real",
        price: 14500,
        description: "Caja de 6 Donuts Premium a elección + 2 Specialty Iced Lattes. Ideal para compartir un momento de ensueño.",
        image: "/assets/donut_combo.png",
        category: "combos",
        badge: "Recomendado",
        isPopular: true,
      },
      {
        id: "box-12",
        name: "Caja Central x12",
        price: 21000,
        description: "Nuestra caja estrella con 12 de nuestras mejores donuts artesanales surtidas. Presentadas en caja craft de diseño premium.",
        image: "/assets/donut_box_12.png",
        category: "cajas",
        badge: "Más Vendido",
        isPopular: true,
      },
      {
        id: "box-6",
        name: "Caja Premium x6",
        price: 12000,
        description: "Selección personalizada de 6 donuts artesanales de sabor único. Horneadas, glaseadas y decoradas hoy.",
        image: "/assets/donut_box_6.png",
        category: "cajas",
        isPopular: false,
      },
      {
        id: "donut-ferrero",
        name: "Donut Ferrero Rocher",
        price: 2400,
        description: "Relleno premium de crema de avellanas (Nutella), bañado en chocolate belga y coronado con avellanas tostadas picadas.",
        image: "grad-chocolate",
        category: "donuts",
        badge: "Gourmet",
        isPopular: true,
      },
      {
        id: "donut-ddl",
        name: "Donut Tentación de DDL",
        price: 2300,
        description: "Rellena de abundante dulce de leche argentino clásico de repostería, glaseado de vainilla y líneas de chocolate fino.",
        image: "grad-caramel",
        category: "donuts",
        isPopular: false,
      },
      {
        id: "drink-macchiato",
        name: "Iced Caramel Macchiato",
        price: 3500,
        description: "Café de especialidad de origen colombiano, leche cremosa fría y abundante jarabe de caramelo artesanal líquido.",
        image: "grad-coffee-1",
        category: "bebidas",
        isPopular: false,
      }
    ];
  }

  // Renderiza el componente cliente e inyecta los productos cargados del servidor
  return <MainShop products={dbProducts} />;
}
