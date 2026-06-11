import { db } from "@/lib/db";

interface OrderRequestItem {
  productId: string;
  quantity: number;
}

interface CreateOrderRequest {
  customerName: string;
  customerPhone: string;
  deliveryMethod: "pickup" | "delivery";
  deliveryAddress?: string;
  paymentMethod?: "cash" | "transfer" | "mercado_pago";
  items: OrderRequestItem[];
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as CreateOrderRequest;

    if (!body.customerName?.trim() || !body.customerPhone?.trim()) {
      return Response.json({ error: "Faltan datos del cliente." }, { status: 400 });
    }

    if (!["pickup", "delivery"].includes(body.deliveryMethod)) {
      return Response.json({ error: "Método de entrega inválido." }, { status: 400 });
    }

    if (body.deliveryMethod === "delivery" && !body.deliveryAddress?.trim()) {
      return Response.json({ error: "Falta la dirección de entrega." }, { status: 400 });
    }

    const paymentMethod = body.paymentMethod ?? "mercado_pago";

    if (!["cash", "transfer", "mercado_pago"].includes(paymentMethod)) {
      return Response.json({ error: "Forma de pago inválida." }, { status: 400 });
    }

    const requestedItems = body.items
      .filter((item) => item.productId && Number.isInteger(item.quantity) && item.quantity > 0)
      .map((item) => ({
        productId: item.productId,
        quantity: Math.min(item.quantity, 99),
      }));

    if (requestedItems.length === 0) {
      return Response.json({ error: "El pedido no tiene productos." }, { status: 400 });
    }

    const products = await db.product.findMany({
      where: {
        id: {
          in: requestedItems.map((item) => item.productId),
        },
        isAvailable: true,
      },
    });

    if (products.length !== new Set(requestedItems.map((item) => item.productId)).size) {
      return Response.json({ error: "Uno o más productos no están disponibles." }, { status: 400 });
    }

    const productById = new Map(products.map((product) => [product.id, product]));
    const orderItems = requestedItems.map((item) => {
      const product = productById.get(item.productId);
      if (!product) {
        throw new Error(`Producto no encontrado: ${item.productId}`);
      }

      return {
        productId: product.id,
        productName: product.name,
        unitPrice: product.price,
        quantity: item.quantity,
        lineTotal: product.price * item.quantity,
        productImage: product.image,
      };
    });

    const subtotal = orderItems.reduce((total, item) => total + item.lineTotal, 0);

    const order = await db.order.create({
      data: {
        customerName: body.customerName.trim(),
        customerPhone: body.customerPhone.trim(),
        deliveryMethod: body.deliveryMethod,
        deliveryAddress: body.deliveryMethod === "delivery" ? body.deliveryAddress?.trim() : null,
        subtotal,
        total: subtotal,
        status: "pending",
        paymentProvider: paymentMethod,
        paymentStatus: "pending",
        items: {
          create: orderItems,
        },
      },
      include: {
        items: true,
      },
    });

    return Response.json({ orderId: order.id, total: order.total, items: order.items });
  } catch (error) {
    console.error("Error creando orden:", error);
    return Response.json({ error: "No se pudo crear la orden." }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = (await request.json()) as { orderId?: string; whatsappMessage?: string };

    if (!body.orderId) {
      return Response.json({ error: "Falta orderId." }, { status: 400 });
    }

    const order = await db.order.update({
      where: {
        id: body.orderId,
      },
      data: {
        status: "sent_to_whatsapp",
        whatsappMessage: body.whatsappMessage,
      },
    });

    return Response.json({ orderId: order.id, status: order.status });
  } catch (error) {
    console.error("Error actualizando orden:", error);
    return Response.json({ error: "No se pudo actualizar la orden." }, { status: 500 });
  }
}
