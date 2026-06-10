import { db } from "@/lib/db";
import { AdminDashboard } from "./AdminDashboard";
import { fallbackBusinessInfo } from "@/lib/shopTypes";
import type { AdminDashboardData } from "@/lib/adminTypes";
import { redirect } from "next/navigation";
import { isAdminSessionValid } from "@/lib/adminAuth";

export const revalidate = 0;

export default async function AdminPage() {
  if (!(await isAdminSessionValid())) {
    redirect("/admin/login");
  }

  const [categories, products, promotions, businessInfo, orders] = await Promise.all([
    db.category.findMany({ orderBy: { sortOrder: "asc" } }),
    db.product.findMany({
      include: { category: true },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
    }),
    db.promotion.findMany({ orderBy: { sortOrder: "asc" } }),
    db.businessInfo.findUnique({ where: { id: "main" } }),
    db.order.findMany({
      include: { items: true },
      orderBy: { createdAt: "desc" },
      take: 50,
    }),
  ]);

  const data: AdminDashboardData = {
    categories: categories.map((category) => ({
      id: category.id,
      slug: category.slug,
      name: category.name,
      description: category.description ?? "",
      image: category.image ?? "",
      sortOrder: category.sortOrder,
      isActive: category.isActive,
    })),
    products: products.map((product) => ({
      id: product.id,
      name: product.name,
      price: product.price,
      description: product.description,
      image: product.image,
      categoryId: product.categoryId,
      categoryName: product.category.name,
      badge: product.badge ?? "",
      isPopular: product.isPopular,
      isAvailable: product.isAvailable,
      stock: product.stock,
      sku: product.sku ?? "",
      sortOrder: product.sortOrder,
    })),
    promotions: promotions.map((promotion) => ({
      id: promotion.id,
      slug: promotion.slug,
      title: promotion.title,
      description: promotion.description ?? "",
      type: promotion.type,
      badgeText: promotion.badgeText ?? "",
      discountPercent: promotion.discountPercent,
      categoryId: promotion.categoryId ?? "",
      isActive: promotion.isActive,
      sortOrder: promotion.sortOrder,
    })),
    businessInfo: {
      id: businessInfo?.id ?? "main",
      name: businessInfo?.name ?? fallbackBusinessInfo.name,
      brandDisplay: businessInfo?.brandDisplay ?? fallbackBusinessInfo.brandDisplay,
      description: businessInfo?.description ?? fallbackBusinessInfo.description,
      phone: businessInfo?.phone ?? fallbackBusinessInfo.phone,
      whatsappNumber: businessInfo?.whatsappNumber ?? fallbackBusinessInfo.whatsappNumber,
      instagramHandle: businessInfo?.instagramHandle ?? fallbackBusinessInfo.instagramHandle,
      instagramUrl: businessInfo?.instagramUrl ?? fallbackBusinessInfo.instagramUrl,
      addressLine: businessInfo?.addressLine ?? fallbackBusinessInfo.addressLine,
      city: businessInfo?.city ?? fallbackBusinessInfo.city,
      country: businessInfo?.country ?? fallbackBusinessInfo.country,
      mapsUrl: businessInfo?.mapsUrl ?? fallbackBusinessInfo.mapsUrl ?? "",
      openingDays: businessInfo?.openingDays ?? fallbackBusinessInfo.openingDays,
      openingHours: businessInfo?.openingHours ?? fallbackBusinessInfo.openingHours,
      closedNotice: businessInfo?.closedNotice ?? fallbackBusinessInfo.closedNotice ?? "",
      deliveryNote: businessInfo?.deliveryNote ?? fallbackBusinessInfo.deliveryNote ?? "",
    },
    orders: orders.map((order) => ({
      id: order.id,
      customerName: order.customerName,
      customerPhone: order.customerPhone,
      deliveryMethod: order.deliveryMethod,
      deliveryAddress: order.deliveryAddress ?? "",
      subtotal: order.subtotal,
      total: order.total,
      status: order.status,
      paymentProvider: order.paymentProvider ?? "",
      paymentStatus: order.paymentStatus ?? "",
      createdAt: order.createdAt.toISOString(),
      items: order.items.map((item) => ({
        id: item.id,
        productName: item.productName,
        unitPrice: item.unitPrice,
        quantity: item.quantity,
        lineTotal: item.lineTotal,
      })),
    })),
  };

  return <AdminDashboard initialData={data} />;
}
