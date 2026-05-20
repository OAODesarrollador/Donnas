import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const productsData = [
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
    id: "donut-pistacchio",
    name: "Donut Pistacho & Limón",
    price: 2500,
    description: "Bañado en chocolate blanco saborizado con pistacho siciliano, lluvia de pistachos tostados y ralladura fina de limón.",
    image: "grad-pistachio",
    category: "donuts",
    badge: "Exclusivo",
    isPopular: false,
  },
  {
    id: "donut-redvelvet",
    name: "Donut Red Velvet Berries",
    price: 2400,
    description: "Masa especial aterciopelada, frosting sedoso de queso crema, reducción artesanal de frutos rojos y copos de chocolate blanco.",
    image: "grad-berry",
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
  },
  {
    id: "drink-latte",
    name: "Iced Vainilla Latte",
    price: 3200,
    description: "Doble shot de espresso premium extraído en frío, leche texturizada, jarabe orgánico de vainilla y hielo cristalino.",
    image: "grad-coffee-2",
    category: "bebidas",
    isPopular: false,
  },
];

async function main() {
  console.log("Iniciando sembrado de productos...");

  // Delete all existing products to avoid duplication
  await prisma.product.deleteMany();

  // Create products
  for (const product of productsData) {
    const created = await prisma.product.create({
      data: product,
    });
    console.log(`Producto creado: ${created.name} (${created.id})`);
  }

  console.log("Sembrado finalizado con éxito.");
}

main()
  .catch((e) => {
    console.error("Error al sembrar base de datos:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
