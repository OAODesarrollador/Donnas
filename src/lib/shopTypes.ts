export interface ShopCategory {
  id: string;
  slug: string;
  name: string;
  description?: string | null;
  image?: string | null;
  sortOrder?: number;
}

export interface ShopProduct {
  id: string;
  name: string;
  price: number;
  description: string;
  image: string;
  category: string;
  categoryId?: string;
  categoryName?: string;
  badge?: string | null;
  isPopular?: boolean;
  isAvailable?: boolean;
}

export interface BusinessInfo {
  name: string;
  brandDisplay: string;
  description: string;
  phone: string;
  whatsappNumber: string;
  instagramHandle: string;
  instagramUrl: string;
  addressLine: string;
  city: string;
  country: string;
  mapsUrl?: string | null;
  openingDays: string;
  openingHours: string;
  closedNotice?: string | null;
  deliveryNote?: string | null;
}

export const fallbackBusinessInfo: BusinessInfo = {
  name: "Central Donuts",
  brandDisplay: "CENTRAL.DONUTS",
  description:
    "Elaboramos donuts gourmet de forma 100% artesanal, utilizando materia prima premium para garantizar una explosión de sabor en cada mordisco.",
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
};

export const fallbackCategories: ShopCategory[] = [
  { id: "cat-combos", slug: "combos", name: "Combos", sortOrder: 1 },
  { id: "cat-cajas", slug: "cajas", name: "Cajas", sortOrder: 2 },
  { id: "cat-donuts", slug: "donuts", name: "Donuts", sortOrder: 3 },
  { id: "cat-bebidas", slug: "bebidas", name: "Bebidas", sortOrder: 4 },
];
