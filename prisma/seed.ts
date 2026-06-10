import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const categoriesData = [
  {
    id: "cat-combos",
    slug: "combos",
    name: "Combos",
    description: "Cajas y bebidas pensadas para resolver el antojo completo.",
    image: "/assets/donut_combo.png",
    sortOrder: 1,
  },
  {
    id: "cat-cajas",
    slug: "cajas",
    name: "Cajas",
    description: "Presentaciones para regalar, compartir o festejar.",
    image: "/assets/donut_box_12.png",
    sortOrder: 2,
  },
  {
    id: "cat-donuts",
    slug: "donuts",
    name: "Donuts",
    description: "Sabores clásicos, rellenos y ediciones premium.",
    image: "/assets/hero_donuts.png",
    sortOrder: 3,
  },
  {
    id: "cat-bebidas",
    slug: "bebidas",
    name: "Bebidas",
    description: "Cafés fríos y bebidas para acompañar.",
    image: "grad-coffee-1",
    sortOrder: 4,
  },
];

const productsData = [
  {
    id: "combo-1",
    name: "Combo Glaseado Real",
    price: 14500,
    description: "Caja de 6 Donuts Premium a elección + 2 Specialty Iced Lattes. Ideal para compartir un momento de ensueño.",
    image: "/assets/donut_combo.png",
    categoryId: "cat-combos",
    badge: "Recomendado",
    isPopular: true,
    sku: "COMBO-GLASEADO-REAL",
    sortOrder: 1,
  },
  {
    id: "box-12",
    name: "Caja Central x12",
    price: 21000,
    description: "Nuestra caja estrella con 12 de nuestras mejores donuts artesanales surtidas. Presentadas en caja craft de diseño premium.",
    image: "/assets/donut_box_12.png",
    categoryId: "cat-cajas",
    badge: "Más Vendido",
    isPopular: true,
    sku: "CAJA-CENTRAL-12",
    sortOrder: 2,
  },
  {
    id: "box-6",
    name: "Caja Premium x6",
    price: 12000,
    description: "Selección personalizada de 6 donuts artesanales de sabor único. Horneadas, glaseadas y decoradas hoy.",
    image: "/assets/donut_box_6.png",
    categoryId: "cat-cajas",
    isPopular: false,
    sku: "CAJA-PREMIUM-6",
    sortOrder: 3,
  },
  {
    id: "donut-ferrero",
    name: "Donut Ferrero Rocher",
    price: 2400,
    description: "Relleno premium de crema de avellanas (Nutella), bañado en chocolate belga y coronado con avellanas tostadas picadas.",
    image: "grad-chocolate",
    categoryId: "cat-donuts",
    badge: "Gourmet",
    isPopular: true,
    sku: "DONUT-FERRERO",
    sortOrder: 4,
  },
  {
    id: "donut-ddl",
    name: "Donut Tentación de DDL",
    price: 2300,
    description: "Rellena de abundante dulce de leche argentino clásico de repostería, glaseado de vainilla y líneas de chocolate fino.",
    image: "grad-caramel",
    categoryId: "cat-donuts",
    isPopular: false,
    sku: "DONUT-DDL",
    sortOrder: 5,
  },
  {
    id: "donut-pistacchio",
    name: "Donut Pistacho & Limón",
    price: 2500,
    description: "Bañado en chocolate blanco saborizado con pistacho siciliano, lluvia de pistachos tostados y ralladura fina de limón.",
    image: "grad-pistachio",
    categoryId: "cat-donuts",
    badge: "Exclusivo",
    isPopular: false,
    sku: "DONUT-PISTACHIO",
    sortOrder: 6,
  },
  {
    id: "donut-redvelvet",
    name: "Donut Red Velvet Berries",
    price: 2400,
    description: "Masa especial aterciopelada, frosting sedoso de queso crema, reducción artesanal de frutos rojos y copos de chocolate blanco.",
    image: "grad-berry",
    categoryId: "cat-donuts",
    isPopular: false,
    sku: "DONUT-REDVELVET",
    sortOrder: 7,
  },
  {
    id: "drink-macchiato",
    name: "Iced Caramel Macchiato",
    price: 3500,
    description: "Café de especialidad de origen colombiano, leche cremosa fría y abundante jarabe de caramelo artesanal líquido.",
    image: "grad-coffee-1",
    categoryId: "cat-bebidas",
    isPopular: false,
    sku: "DRINK-MACCHIATO",
    sortOrder: 8,
  },
  {
    id: "drink-latte",
    name: "Iced Vainilla Latte",
    price: 3200,
    description: "Doble shot de espresso premium extraído en frío, leche texturizada, jarabe orgánico de vainilla y hielo cristalino.",
    image: "grad-coffee-2",
    categoryId: "cat-bebidas",
    isPopular: false,
    sku: "DRINK-LATTE",
    sortOrder: 9,
  },
];

const comboItemsData = [
  { comboProductId: "combo-1", includedProductId: "box-6", quantity: 1 },
  { comboProductId: "combo-1", includedProductId: "drink-macchiato", quantity: 1 },
  { comboProductId: "combo-1", includedProductId: "drink-latte", quantity: 1 },
];

const promotionsData = [
  {
    id: "promo-productos-destacados",
    slug: "productos-destacados",
    title: "Productos destacados",
    description: "Selección principal para carruseles y productos más elegidos.",
    type: "featured" as const,
    isActive: true,
    sortOrder: 1,
    products: ["combo-1", "box-12", "donut-ferrero"],
  },
  {
    id: "promo-cajas-para-compartir",
    slug: "cajas-para-compartir",
    title: "Cajas para compartir",
    description: "6, 12 o 24 donas. Ideal para regalar, festejar o simplemente darte un gusto.",
    type: "banner" as const,
    categoryId: "cat-cajas",
    isActive: true,
    sortOrder: 2,
    products: ["box-12", "box-6"],
  },
  {
    id: "promo-exclusivo",
    slug: "exclusivo",
    title: "Exclusivo",
    description: "Sabor de edición especial para destacar en el catálogo.",
    type: "badge" as const,
    badgeText: "Exclusivo",
    isActive: true,
    sortOrder: 3,
    products: ["donut-pistacchio"],
  },
];

async function main() {
  console.log("Iniciando sembrado relacional...");

  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.productPriceHistory.deleteMany();
  await prisma.promotionProduct.deleteMany();
  await prisma.promotion.deleteMany();
  await prisma.comboItem.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.businessInfo.deleteMany();

  await prisma.businessInfo.create({
    data: {
      id: "main",
      name: "Central Donuts",
      brandDisplay: "CENTRAL.DONUTS",
      description: "Elaboramos donuts gourmet de forma 100% artesanal, utilizando materia prima premium para garantizar una explosión de sabor en cada mordisco.",
      phone: "+54 9 11 1234-5678",
      whatsappNumber: "5491123456789",
      instagramHandle: "@centraldonuts00",
      instagramUrl: "https://www.instagram.com/centraldonuts00/",
      addressLine: "Barrio República Argentina",
      city: "Formosa",
      country: "Argentina",
      mapsUrl: "https://maps.google.com",
      openingDays: "Martes a Domingos",
      openingHours: "14:00 a 20:00 hs",
      closedNotice: "Lunes cerrado (descanso del pastelero)",
      deliveryNote: "Coordinaremos el costo final del delivery por WhatsApp según tu zona exacta.",
    },
  });

  for (const category of categoriesData) {
    await prisma.category.create({ data: category });
  }

  for (const product of productsData) {
    await prisma.product.create({ data: product });
    await prisma.productPriceHistory.create({
      data: {
        productId: product.id,
        price: product.price,
        reason: "Precio inicial de seed",
      },
    });
  }

  for (const comboItem of comboItemsData) {
    await prisma.comboItem.create({ data: comboItem });
  }

  for (const promotion of promotionsData) {
    const { products, ...promotionData } = promotion;
    await prisma.promotion.create({ data: promotionData });
    for (const [index, productId] of products.entries()) {
      await prisma.promotionProduct.create({
        data: {
          promotionId: promotion.id,
          productId,
          sortOrder: index + 1,
        },
      });
    }
  }

  console.log("Sembrado relacional finalizado con éxito.");
}

main()
  .catch((e) => {
    console.error("Error al sembrar base de datos:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
