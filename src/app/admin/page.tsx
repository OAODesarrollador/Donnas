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

  let categories;
  let products;
  let promotions;
  let businessInfo;
  let orders;

  try {
    [categories, products, promotions, businessInfo, orders] = await Promise.all([
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
  } catch (error) {
    console.error("Error loading admin dashboard data:", error);

    return (
      <main className="flex min-h-screen items-center justify-center bg-[#F5EFE8] px-5 text-brand-cacao">
        <section className="w-full max-w-xl rounded-2xl bg-white p-8 shadow-sm">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-brand-hazelnut">
            Administración
          </p>
          <h1 className="mt-3 font-serif text-3xl font-black">No se pudo cargar el panel</h1>
          <p className="mt-4 text-sm font-semibold leading-6 text-brand-cacao/70">
            Revisá que Vercel tenga configurada la variable DATABASE_URL y que la base remota tenga
            el esquema creado con Prisma.
          </p>
          <p className="mt-4 rounded-xl bg-brand-cream px-4 py-3 text-xs font-bold text-brand-cacao/65">
            En producción, los detalles técnicos quedan en los logs de Vercel para no exponer datos
            sensibles.
          </p>
        </section>
      </main>
    );
  }

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
