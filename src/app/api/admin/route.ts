import { db } from "@/lib/db";
import { isAdminSessionValid } from "@/lib/adminAuth";

type AdminEntity = "product" | "category" | "promotion" | "business" | "order";

const parseString = (value: unknown) => (typeof value === "string" ? value.trim() : "");
const parseOptionalString = (value: unknown) => {
  const parsed = parseString(value);
  return parsed.length > 0 ? parsed : null;
};
const parseInteger = (value: unknown, fallback = 0) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? Math.trunc(parsed) : fallback;
};
const parseBoolean = (value: unknown) => Boolean(value);

export async function PATCH(request: Request) {
  try {
    if (!(await isAdminSessionValid())) {
      return Response.json({ error: "No autorizado." }, { status: 401 });
    }

    const body = (await request.json()) as { entity?: AdminEntity; id?: string; data?: Record<string, unknown> };

    if (!body.entity || !body.id || !body.data) {
      return Response.json({ error: "Faltan entity, id o data." }, { status: 400 });
    }

    if (body.entity === "product") {
      const current = await db.product.findUnique({ where: { id: body.id } });
      if (!current) {
        return Response.json({ error: "Producto no encontrado." }, { status: 404 });
      }

      const nextPrice = parseInteger(body.data.price, current.price);
      const updated = await db.product.update({
        where: { id: body.id },
        data: {
          name: parseString(body.data.name),
          price: nextPrice,
          description: parseString(body.data.description),
          image: parseString(body.data.image),
          categoryId: parseString(body.data.categoryId),
          categorySlug: null,
          badge: parseOptionalString(body.data.badge),
          isPopular: parseBoolean(body.data.isPopular),
          isAvailable: parseBoolean(body.data.isAvailable),
          stock: body.data.stock === null || body.data.stock === "" ? null : parseInteger(body.data.stock),
          sku: parseOptionalString(body.data.sku),
          sortOrder: parseInteger(body.data.sortOrder),
        },
      });

      if (nextPrice !== current.price) {
        await db.productPriceHistory.create({
          data: {
            productId: updated.id,
            price: nextPrice,
            reason: "Cambio desde panel admin",
          },
        });
      }

      return Response.json({ ok: true, id: updated.id });
    }

    if (body.entity === "category") {
      const updated = await db.category.update({
        where: { id: body.id },
        data: {
          slug: parseString(body.data.slug),
          name: parseString(body.data.name),
          description: parseOptionalString(body.data.description),
          image: parseOptionalString(body.data.image),
          sortOrder: parseInteger(body.data.sortOrder),
          isActive: parseBoolean(body.data.isActive),
        },
      });

      return Response.json({ ok: true, id: updated.id });
    }

    if (body.entity === "promotion") {
      const updated = await db.promotion.update({
        where: { id: body.id },
        data: {
          slug: parseString(body.data.slug),
          title: parseString(body.data.title),
          description: parseOptionalString(body.data.description),
          type: parseString(body.data.type) as "featured" | "badge" | "discount" | "banner",
          badgeText: parseOptionalString(body.data.badgeText),
          discountPercent:
            body.data.discountPercent === null || body.data.discountPercent === ""
              ? null
              : parseInteger(body.data.discountPercent),
          categoryId: parseOptionalString(body.data.categoryId),
          isActive: parseBoolean(body.data.isActive),
          sortOrder: parseInteger(body.data.sortOrder),
        },
      });

      return Response.json({ ok: true, id: updated.id });
    }

    if (body.entity === "business") {
      const updated = await db.businessInfo.update({
        where: { id: body.id },
        data: {
          name: parseString(body.data.name),
          brandDisplay: parseString(body.data.brandDisplay),
          description: parseString(body.data.description),
          phone: parseString(body.data.phone),
          whatsappNumber: parseString(body.data.whatsappNumber),
          instagramHandle: parseString(body.data.instagramHandle),
          instagramUrl: parseString(body.data.instagramUrl),
          addressLine: parseString(body.data.addressLine),
          city: parseString(body.data.city),
          country: parseString(body.data.country),
          mapsUrl: parseOptionalString(body.data.mapsUrl),
          openingDays: parseString(body.data.openingDays),
          openingHours: parseString(body.data.openingHours),
          closedNotice: parseOptionalString(body.data.closedNotice),
          deliveryNote: parseOptionalString(body.data.deliveryNote),
        },
      });

      return Response.json({ ok: true, id: updated.id });
    }

    if (body.entity === "order") {
      const updated = await db.order.update({
        where: { id: body.id },
        data: {
          status: parseString(body.data.status) as "pending" | "paid_simulated" | "sent_to_whatsapp" | "cancelled",
        },
      });

      return Response.json({ ok: true, id: updated.id });
    }

    return Response.json({ error: "Entidad no soportada." }, { status: 400 });
  } catch (error) {
    console.error("Error en admin PATCH:", error);
    return Response.json({ error: "No se pudo guardar el cambio." }, { status: 500 });
  }
}
