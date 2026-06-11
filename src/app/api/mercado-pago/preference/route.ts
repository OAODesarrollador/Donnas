import { db } from "@/lib/db";

interface CreatePreferenceRequest {
  orderId?: string;
}

export async function POST(request: Request) {
  try {
    const accessToken = process.env.MP_ACCESS_TOKEN;

    if (!accessToken) {
      return Response.json({ error: "Mercado Pago no está configurado." }, { status: 500 });
    }

    const body = (await request.json()) as CreatePreferenceRequest;

    if (!body.orderId) {
      return Response.json({ error: "Falta orderId." }, { status: 400 });
    }

    const order = await db.order.findUnique({
      where: {
        id: body.orderId,
      },
      include: {
        items: true,
      },
    });

    if (!order) {
      return Response.json({ error: "Orden no encontrada." }, { status: 404 });
    }

    if (order.paymentProvider !== "mercado_pago") {
      return Response.json({ error: "La orden no corresponde a Mercado Pago." }, { status: 400 });
    }

    const origin = new URL(request.url).origin;
    const backUrl = `${origin}/?checkout_order=${order.id}`;
    const canUseBackUrls = origin.startsWith("https://");
    const checkoutPreference = {
      items: order.items.map((item) => ({
        id: item.id,
        title: item.productName,
        quantity: item.quantity,
        unit_price: item.unitPrice,
        currency_id: "ARS",
      })),
      payer: {
        name: order.customerName,
        phone: {
          number: order.customerPhone,
        },
      },
      ...(canUseBackUrls
        ? {
            back_urls: {
              success: `${backUrl}&payment_status=success`,
              failure: `${backUrl}&payment_status=failure`,
              pending: `${backUrl}&payment_status=pending`,
            },
            auto_return: "approved",
          }
        : {}),
      external_reference: order.id,
      metadata: {
        order_id: order.id,
      },
      statement_descriptor: "CENTRAL DONUTS",
    };

    const preferenceResponse = await fetch("https://api.mercadopago.com/checkout/preferences", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(checkoutPreference),
    });

    const preference = await preferenceResponse.json();

    if (!preferenceResponse.ok) {
      console.error("Error creando preferencia de Mercado Pago:", preference);
      return Response.json({ error: "No se pudo crear la preferencia de Mercado Pago." }, { status: 502 });
    }

    return Response.json({
      preferenceId: preference.id,
      initPoint: preference.init_point,
      sandboxInitPoint: preference.sandbox_init_point,
    });
  } catch (error) {
    console.error("Error conectando con Mercado Pago:", error);
    return Response.json({ error: "No se pudo conectar con Mercado Pago." }, { status: 500 });
  }
}
