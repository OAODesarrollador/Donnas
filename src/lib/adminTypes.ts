export interface AdminCategory {
  id: string;
  slug: string;
  name: string;
  description: string;
  image: string;
  sortOrder: number;
  isActive: boolean;
}

export interface AdminProduct {
  id: string;
  name: string;
  price: number;
  description: string;
  image: string;
  categoryId: string;
  categoryName: string;
  badge: string;
  isPopular: boolean;
  isAvailable: boolean;
  stock: number | null;
  sku: string;
  sortOrder: number;
}

export interface AdminPromotion {
  id: string;
  slug: string;
  title: string;
  description: string;
  type: "featured" | "badge" | "discount" | "banner";
  badgeText: string;
  discountPercent: number | null;
  categoryId: string;
  isActive: boolean;
  sortOrder: number;
}

export interface AdminBusinessInfo {
  id: string;
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
  mapsUrl: string;
  openingDays: string;
  openingHours: string;
  closedNotice: string;
  deliveryNote: string;
}

export interface AdminOrderItem {
  id: string;
  productName: string;
  unitPrice: number;
  quantity: number;
  lineTotal: number;
}

export interface AdminOrder {
  id: string;
  customerName: string;
  customerPhone: string;
  deliveryMethod: "pickup" | "delivery";
  deliveryAddress: string;
  subtotal: number;
  total: number;
  status: "pending" | "paid_simulated" | "sent_to_whatsapp" | "cancelled";
  paymentProvider: string;
  paymentStatus: string;
  createdAt: string;
  items: AdminOrderItem[];
}

export interface AdminDashboardData {
  categories: AdminCategory[];
  products: AdminProduct[];
  promotions: AdminPromotion[];
  businessInfo: AdminBusinessInfo;
  orders: AdminOrder[];
}
