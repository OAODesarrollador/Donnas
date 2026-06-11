"use client";

import React, { useEffect, useRef, useState } from "react";
import Script from "next/script";
import { useCart } from "@/context/CartContext";
import { X, ArrowRight, Banknote, Check, CheckCircle2, Copy, CreditCard, Landmark, ShieldCheck } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "./ui/Button";
import type { BusinessInfo } from "@/lib/shopTypes";

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  businessInfo: BusinessInfo;
}

type CheckoutStep = "form" | "mercado-pago" | "success";
type PaymentMethod = "cash" | "transfer" | "mercado_pago";

declare global {
  interface Window {
    MercadoPago?: new (
      publicKey: string,
      options?: { locale?: string }
    ) => {
      bricks: () => {
        create: (
          type: "wallet",
          containerId: string,
          settings: {
            initialization: { preferenceId: string };
            customization?: Record<string, unknown>;
            callbacks?: Record<string, () => void>;
          }
        ) => Promise<unknown>;
      };
    };
  }
}

const paymentOptions: Array<{
  value: PaymentMethod;
  label: string;
  description: string;
  icon: React.ReactNode;
}> = [
  {
    value: "cash",
    label: "Efectivo",
    description: "Pagás al retirar o recibir.",
    icon: <Banknote className="h-4 w-4" />,
  },
  {
    value: "transfer",
    label: "Transferencia",
    description: "Coordinamos los datos por WhatsApp.",
    icon: <Landmark className="h-4 w-4" />,
  },
  {
    value: "mercado_pago",
    label: "MercadoPago",
    description: "Pago con interfaz oficial.",
    icon: <CreditCard className="h-4 w-4" />,
  },
];

const paymentLabels: Record<PaymentMethod, string> = {
  cash: "Efectivo",
  transfer: "Transferencia",
  mercado_pago: "Mercado Pago",
};

const transferDetails = [
  { label: "Alias", value: "central.donuts.mp" },
  { label: "CVU", value: "0000003100012345678901" },
  { label: "Titular", value: "Central Donuts" },
  { label: "Referencia", value: "Nombre + WhatsApp" },
];

export const CheckoutModal: React.FC<CheckoutModalProps> = ({ isOpen, onClose, businessInfo }) => {
  const { cart, cartSubtotal, clearCart } = useCart();
  const [step, setStep] = useState<CheckoutStep>("form");

  // Form states
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [delivery, setDelivery] = useState<"retiro" | "envio">("retiro");
  const [address, setAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("cash");
  const [touched, setTouched] = useState({
    name: false,
    phone: false,
    address: false,
  });
  const [copiedTransferValue, setCopiedTransferValue] = useState<string | null>(null);

  // Payment states
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [isMercadoPagoReady, setIsMercadoPagoReady] = useState(false);
  const [mpPreferenceId, setMpPreferenceId] = useState<string | null>(null);
  const [mpInitPoint, setMpInitPoint] = useState<string | null>(null);
  const walletContainerRef = useRef<HTMLDivElement | null>(null);
  const walletRenderedForPreference = useRef<string | null>(null);

  // Error handling
  const [error, setError] = useState("");
  const [orderId, setOrderId] = useState<string | null>(null);

  const formErrors = {
    name: name.trim().length < 3 ? "Ingresá tu nombre completo para identificar el pedido." : "",
    phone:
      phone.replace(/\D/g, "").length < 8
        ? "Ingresá un WhatsApp válido con código de área para coordinar el pedido."
        : "",
    address:
      delivery === "envio" && address.trim().length < 6
        ? "Completá calle, altura y cualquier referencia útil para el envío."
        : "",
  };

  const hasFormErrors = Boolean(formErrors.name || formErrors.phone || formErrors.address);

  const markTouched = (field: keyof typeof touched) => {
    setTouched((current) => ({ ...current, [field]: true }));
  };

  const copyTransferValue = async (value: string) => {
    await navigator.clipboard.writeText(value);
    setCopiedTransferValue(value);
    window.setTimeout(() => setCopiedTransferValue(null), 1600);
  };

  useEffect(() => {
    if (step !== "mercado-pago" || !mpPreferenceId || !isMercadoPagoReady || !walletContainerRef.current) {
      return;
    }

    const publicKey = process.env.NEXT_PUBLIC_MP_PUBLIC_KEY;

    if (!publicKey || !window.MercadoPago) {
      return;
    }

    if (walletRenderedForPreference.current === mpPreferenceId) {
      return;
    }

    walletRenderedForPreference.current = mpPreferenceId;
    walletContainerRef.current.innerHTML = "";

    const mercadoPago = new window.MercadoPago(publicKey, { locale: "es-AR" });

    mercadoPago
      .bricks()
      .create("wallet", "mercado-pago-wallet", {
        initialization: {
          preferenceId: mpPreferenceId,
        },
        customization: {
          texts: {
            valueProp: "smart_option",
          },
        },
        callbacks: {
          onError: () => setError("No se pudo cargar la interfaz de Mercado Pago."),
        },
      })
      .catch(() => {
        walletRenderedForPreference.current = null;
        setError("No se pudo cargar la interfaz de Mercado Pago.");
      });
  }, [isMercadoPagoReady, mpPreferenceId, step]);

  const createOrder = async (method: PaymentMethod) => {
    const response = await fetch("/api/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        customerName: name,
        customerPhone: phone,
        deliveryMethod: delivery === "envio" ? "delivery" : "pickup",
        deliveryAddress: delivery === "envio" ? address : undefined,
        paymentMethod: method,
        items: cart.map((item) => ({
          productId: item.id,
          quantity: item.quantity,
        })),
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error ?? "No se pudo crear la orden.");
    }

    setOrderId(result.orderId);
    return result as { orderId: string; total: number };
  };

  const createMercadoPagoPreference = async (createdOrderId: string) => {
    const response = await fetch("/api/mercado-pago/preference", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        orderId: createdOrderId,
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error ?? "No se pudo iniciar Mercado Pago.");
    }

    setMpPreferenceId(result.preferenceId);
    setMpInitPoint(result.sandboxInitPoint ?? result.initPoint ?? null);
  };

  // Form submission to Payment step
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched((current) => ({
      ...current,
      name: true,
      phone: true,
      address: delivery === "envio" ? true : current.address,
    }));

    if (hasFormErrors) {
      setError("");
      return;
    }

    setError("");

    if (paymentMethod === "mercado_pago") {
      if (!process.env.NEXT_PUBLIC_MP_PUBLIC_KEY) {
        setError("Mercado Pago no está configurado.");
        return;
      }

      setIsProcessingPayment(true);
      setMpPreferenceId(null);
      setMpInitPoint(null);
      walletRenderedForPreference.current = null;
      try {
        const createdOrder = await createOrder("mercado_pago");
        await createMercadoPagoPreference(createdOrder.orderId);
        setStep("mercado-pago");
      } catch (mercadoPagoError) {
        setError(mercadoPagoError instanceof Error ? mercadoPagoError.message : "No se pudo iniciar Mercado Pago.");
      } finally {
        setIsProcessingPayment(false);
      }
      return;
    }

    setIsProcessingPayment(true);
    try {
      await createOrder(paymentMethod);
      setStep("success");
    } catch (orderError) {
      setError(orderError instanceof Error ? orderError.message : "No se pudo crear la orden.");
    } finally {
      setIsProcessingPayment(false);
    }
  };

  // WhatsApp redirection
  const handleSendWhatsApp = async () => {
    const formattedCartItems = cart
      .map((item) => `  • ${item.quantity}x ${item.name} ($${(item.price * item.quantity).toLocaleString("es-AR")})`)
      .join("\n");
    const formattedTransferDetails = transferDetails
      .map((detail) => `*${detail.label}:* ${detail.value}`)
      .join("\n");

    const message = `*¡Nuevo pedido aprobado en ${businessInfo.name}!* 🍩🎉
${orderId ? `*Orden:* ${orderId}\n` : ""}

*DATOS DE ENTREGA:*
*Cliente:* ${name}
*Teléfono:* ${phone}
*Modalidad:* ${delivery === "envio" ? `Envío a domicilio` : `Retiro en local (${businessInfo.addressLine})`}
${delivery === "envio" ? `*Dirección:* ${address}\n` : ""}
*Forma de pago:* ${paymentLabels[paymentMethod]}
*DETALLE DEL PEDIDO:*
${formattedCartItems}

*Total:* $${cartSubtotal.toLocaleString("es-AR")}
*Pago:* ${paymentMethod === "mercado_pago" ? "Iniciado con Mercado Pago" : "A coordinar por WhatsApp"}
${paymentMethod === "transfer" ? `\n*DATOS PARA TRANSFERENCIA:*\n${formattedTransferDetails}\n` : ""}

_¡Hola Central Donuts! Acabo de realizar mi pedido en la web. Aguardo confirmación del pago y del envío/retiro. ¡Muchas gracias!_`;

    if (orderId) {
      await fetch("/api/orders", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          orderId,
          whatsappMessage: message,
        }),
      }).catch(() => undefined);
    }

    const whatsappUrl = `https://wa.me/${businessInfo.whatsappNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
    
    // Clear and close
    clearCart();
    onClose();
    setStep("form");
    setOrderId(null);
    setName("");
    setPhone("");
    setAddress("");
    setPaymentMethod("cash");
    setTouched({
      name: false,
      phone: false,
      address: false,
    });
    setMpPreferenceId(null);
    setMpInitPoint(null);
    walletRenderedForPreference.current = null;
  };

  if (!isOpen) return null;

  return (
    <>
      <Script
        id="mercado-pago-sdk"
        src="https://sdk.mercadopago.com/js/v2"
        strategy="afterInteractive"
        onReady={() => setIsMercadoPagoReady(true)}
        onError={() => setError("No se pudo cargar el SDK de Mercado Pago.")}
      />
      <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-cacao/70 backdrop-blur-xs">
        
        {/* Modal Window Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 30 }}
          transition={{ type: "spring", damping: 26, stiffness: 220 }}
          className="relative bg-[#FDFBF7] w-full max-w-lg rounded-3xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.25)] border border-brand-cacao/5 max-h-[92vh] flex flex-col justify-between"
        >
          
          {/* Header */}
          <div className="px-6 py-5 border-b border-brand-cacao/5 flex items-center justify-between bg-white relative z-10 flex-shrink-0">
            <div className="flex items-center gap-2">
              <span className="font-serif font-bold text-base text-brand-cacao">
                Checkout
              </span>
              <span className="text-xs text-brand-hazelnut font-semibold">• Central Donuts</span>
            </div>
            
            {step !== "success" && (
              <button
                onClick={onClose}
                className="p-2 hover:bg-brand-beige/25 rounded-full transition-colors cursor-pointer"
              >
                <X className="w-5 h-5 text-brand-cacao" />
              </button>
            )}
          </div>

          {/* Modal Interactive Area */}
          <div className="flex-1 overflow-y-auto px-6 py-6 no-scrollbar">
            <AnimatePresence mode="wait">
              
              {/* STEP 1: Delivery Details Form */}
              {step === "form" && (
                <motion.form
                  key="step-form"
                  onSubmit={handleFormSubmit}
                  noValidate
                  initial={{ opacity: 0, x: -15 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 15 }}
                  className="flex flex-col gap-5"
                >
                  <div>
                    <h3 className="font-serif text-xl font-bold text-brand-cacao">Tus Datos</h3>
                    <p className="text-xs text-brand-cacao/50 mt-0.5">Ingresá los datos para coordinar el envío o retiro.</p>
                  </div>

                  {error && (
                    <div className="p-3.5 bg-red-50 border border-red-100 rounded-2xl text-xs font-semibold text-red-600">
                      {error}
                    </div>
                  )}

                  {/* Name Input */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-brand-cacao uppercase tracking-wider">Nombre Completo *</label>
                    <input
                      type="text"
                      placeholder="Ej. Juan Pérez"
                      value={name}
                      onBlur={() => markTouched("name")}
                      onChange={(e) => {
                        setName(e.target.value);
                        if (touched.name) markTouched("name");
                      }}
                      aria-invalid={touched.name && Boolean(formErrors.name)}
                      className={`bg-white border rounded-2xl p-3.5 text-sm focus:outline-none transition-colors font-medium text-brand-cacao w-full ${
                        touched.name && formErrors.name
                          ? "border-red-300 focus:border-red-400"
                          : "border-brand-cacao/10 focus:border-brand-hazelnut"
                      }`}
                    />
                    <p className={`min-h-4 text-[10px] font-semibold ${touched.name && formErrors.name ? "text-red-500" : "text-brand-cacao/45"}`}>
                      {touched.name && formErrors.name ? formErrors.name : "Usaremos este nombre para preparar e identificar tu pedido."}
                    </p>
                  </div>

                  {/* Phone Input */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-brand-cacao uppercase tracking-wider">WhatsApp de Contacto *</label>
                    <input
                      type="tel"
                      placeholder="Ej. 11 2345-6789"
                      value={phone}
                      onBlur={() => markTouched("phone")}
                      onChange={(e) => {
                        setPhone(e.target.value);
                        if (touched.phone) markTouched("phone");
                      }}
                      aria-invalid={touched.phone && Boolean(formErrors.phone)}
                      className={`bg-white border rounded-2xl p-3.5 text-sm focus:outline-none transition-colors font-medium text-brand-cacao w-full ${
                        touched.phone && formErrors.phone
                          ? "border-red-300 focus:border-red-400"
                          : "border-brand-cacao/10 focus:border-brand-hazelnut"
                      }`}
                    />
                    <p className={`min-h-4 text-[10px] font-semibold ${touched.phone && formErrors.phone ? "text-red-500" : "text-brand-cacao/45"}`}>
                      {touched.phone && formErrors.phone ? formErrors.phone : "Te escribimos a este número para confirmar pago, retiro o envío."}
                    </p>
                  </div>

                  {/* Delivery Selection */}
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold text-brand-cacao uppercase tracking-wider">Método de entrega</label>
                    <div className="grid grid-cols-2 gap-3.5">
                      <button
                        type="button"
                        onClick={() => setDelivery("retiro")}
                        className={`p-4 rounded-2xl border text-sm font-semibold tracking-wide transition-all cursor-pointer text-center ${
                          delivery === "retiro"
                            ? "border-brand-cacao bg-brand-cacao text-brand-cream shadow-sm"
                            : "border-brand-cacao/10 bg-white text-brand-cacao/80 hover:bg-brand-cream/40"
                        }`}
                      >
                        Retiro en local
                      </button>
                      <button
                        type="button"
                        onClick={() => setDelivery("envio")}
                        className={`p-4 rounded-2xl border text-sm font-semibold tracking-wide transition-all cursor-pointer text-center ${
                          delivery === "envio"
                            ? "border-brand-cacao bg-brand-cacao text-brand-cream shadow-sm"
                            : "border-brand-cacao/10 bg-white text-brand-cacao/80 hover:bg-brand-cream/40"
                        }`}
                      >
                        Envío a domicilio
                      </button>
                    </div>
                  </div>

                  {/* Sliding Address Input if delivery chosen */}
                  <AnimatePresence>
                    {delivery === "envio" && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="flex flex-col gap-1.5 overflow-hidden"
                      >
                        <label className="text-xs font-bold text-brand-cacao uppercase tracking-wider">Dirección de Entrega *</label>
                        <input
                          type="text"
                          placeholder="Calle, Altura, Departamento"
                          value={address}
                          onBlur={() => markTouched("address")}
                          onChange={(e) => {
                            setAddress(e.target.value);
                            if (touched.address) markTouched("address");
                          }}
                          aria-invalid={touched.address && Boolean(formErrors.address)}
                          className={`bg-white border rounded-2xl p-3.5 text-sm focus:outline-none transition-colors font-medium text-brand-cacao w-full ${
                            touched.address && formErrors.address
                              ? "border-red-300 focus:border-red-400"
                              : "border-brand-cacao/10 focus:border-brand-hazelnut"
                          }`}
                        />
                        <p className={`min-h-4 text-[10px] font-semibold ${touched.address && formErrors.address ? "text-red-500" : "text-brand-cacao/45"}`}>
                          {touched.address && formErrors.address
                            ? formErrors.address
                            : businessInfo.deliveryNote ?? "Coordinaremos el costo final del envío por WhatsApp."}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Payment Selection */}
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold text-brand-cacao uppercase tracking-wider">Forma de pago</label>
                    <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3">
                      {paymentOptions.map((option) => (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => setPaymentMethod(option.value)}
                          className={`flex min-h-24 flex-col items-start justify-between gap-2 rounded-2xl border p-3.5 text-left transition-all cursor-pointer ${
                            paymentMethod === option.value
                              ? "border-brand-cacao bg-brand-cacao text-brand-cream shadow-sm"
                              : "border-brand-cacao/10 bg-white text-brand-cacao/80 hover:bg-brand-cream/40"
                          }`}
                        >
                          <span className="flex items-center gap-2 text-xs font-black">
                            {option.icon}
                            {option.label}
                          </span>
                          <span
                            className={`text-[10px] font-semibold leading-snug ${
                              paymentMethod === option.value ? "text-brand-cream/70" : "text-brand-cacao/50"
                            }`}
                          >
                            {option.description}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Summary Footer bar inside Checkout */}
                  <div className="flex justify-between items-center bg-brand-cream/50 border border-brand-cacao/5 rounded-2xl p-4.5 mt-2">
                    <div className="flex flex-col">
                      <span className="text-[10px] text-brand-cacao/50 font-bold uppercase tracking-widest">Total a abonar</span>
                      <span className="text-lg font-black text-brand-cacao">${cartSubtotal.toLocaleString("es-AR")}</span>
                    </div>
                    
                    {/* Bouncy flow normal Button at bottom */}
                    <Button
                      type="submit"
                      variant="primary"
                      disabled={isProcessingPayment}
                      isLoading={isProcessingPayment}
                      className="px-5 py-3 text-xs"
                      icon={<ArrowRight className="w-4 h-4" />}
                    >
                      {paymentMethod === "mercado_pago" ? "Ir al Pago" : "Confirmar"}
                    </Button>
                  </div>
                </motion.form>
              )}

              {/* STEP 2: Mercado Pago Checkout */}
              {step === "mercado-pago" && (
                <motion.div
                  key="step-payment"
                  initial={{ opacity: 0, x: -15 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 15 }}
                  className="flex flex-col gap-5 text-brand-cacao"
                >
                  {/* Mercado Pago branding header */}
                  <div className="bg-[#009EE3] p-4.5 rounded-2xl flex items-center justify-between text-white shadow-sm">
                    <div className="flex flex-col gap-0.5">
                      <span className="text-[10px] font-extrabold uppercase tracking-widest opacity-80">Checkout oficial</span>
                      <span className="font-serif text-lg font-black tracking-tight flex items-center gap-1">
                        mercado <span className="font-sans font-light">pago</span>
                      </span>
                    </div>
                    <div className="bg-white/10 p-1.5 rounded-xl">
                      <ShieldCheck className="w-5 h-5 text-white" />
                    </div>
                  </div>

                  <div className="flex flex-col gap-4 rounded-2xl border border-brand-cacao/5 bg-white p-5">
                    <div className="flex items-center gap-2 text-xs font-bold text-[#009EE3]">
                      <CreditCard className="w-4.5 h-4.5" />
                      <span>MEDIOS DE PAGO HABILITADOS POR MERCADO PAGO</span>
                    </div>

                    <div
                      id="mercado-pago-wallet"
                      ref={walletContainerRef}
                      className="min-h-12 w-full"
                    />

                    {!isMercadoPagoReady && (
                      <div className="rounded-xl border border-brand-cacao/5 bg-brand-cream/35 p-3 text-center text-xs font-semibold text-brand-cacao/55">
                        Cargando interfaz de Mercado Pago...
                      </div>
                    )}

                    {mpInitPoint && (
                      <a
                        href={mpInitPoint}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block rounded-xl border border-[#009EE3]/20 bg-[#009EE3]/5 px-4 py-3 text-center text-xs font-black text-[#007eb5] transition hover:bg-[#009EE3]/10"
                      >
                        Abrir Mercado Pago en una nueva ventana
                      </a>
                    )}
                  </div>

                  <div className="text-center text-[10px] text-brand-cacao/40 font-semibold flex items-center justify-center gap-1.5">
                    <Landmark className="w-3 h-3" />
                    <span>El pago se procesa en Mercado Pago con tus credenciales de prueba.</span>
                  </div>

                  {/* Checkout Payment CTA buttons */}
                  <div className="grid grid-cols-1 gap-3.5 mt-2">
                    <button
                      type="button"
                      disabled={isProcessingPayment}
                      onClick={() => setStep("form")}
                      className="py-4 border border-brand-cacao/10 rounded-2xl text-xs font-bold text-brand-cacao hover:bg-brand-cream/20 active:scale-95 transition-transform"
                    >
                      Atrás
                    </button>
                  </div>
                </motion.div>
              )}

              {/* STEP 3: Order Completed successfully */}
              {step === "success" && (
                <motion.div
                  key="step-success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center text-center gap-6 py-6"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, delay: 0.15 }}
                    className="w-16 h-16 text-green-500 bg-green-50 rounded-full flex items-center justify-center border-2 border-green-100"
                  >
                    <CheckCircle2 className="w-10 h-10 fill-green-50" />
                  </motion.div>

                  <div className="flex flex-col gap-2">
                    <h3 className="font-serif text-2xl font-bold text-brand-cacao">
                      {paymentMethod === "mercado_pago" ? "¡Pedido iniciado!" : "¡Pedido Confirmado!"}
                    </h3>
                    <p className="text-xs md:text-sm text-brand-cacao/65 leading-relaxed max-w-xs mx-auto">
                      ¡Excelente, {name}! {paymentMethod === "mercado_pago" ? "Registramos tu pedido y el pago quedó iniciado en Mercado Pago" : `Registramos tu pedido con pago por ${paymentLabels[paymentMethod]}`} por un total de *${cartSubtotal.toLocaleString("es-AR")}*.
                      {orderId ? ` Orden registrada: ${orderId}.` : ""}
                    </p>
                  </div>

                  {/* Summary ticket detail */}
                  <div className="w-full bg-white border border-brand-cacao/5 rounded-2xl p-4.5 text-left text-xs flex flex-col gap-2.5 shadow-xs relative">
                    <span className={`absolute top-0 right-4 translate-y-[-50%] px-3 py-1 rounded-full text-[9px] font-extrabold uppercase tracking-wider shadow-sm text-white ${
                      paymentMethod === "mercado_pago" ? "bg-[#009EE3]" : "bg-brand-hazelnut"
                    }`}>
                      {paymentMethod === "mercado_pago" ? "MERCADO PAGO" : paymentLabels[paymentMethod]}
                    </span>
                    <div className="flex justify-between items-center text-brand-cacao/50">
                      <span>Cliente</span>
                      <span className="font-bold text-brand-cacao">{name}</span>
                    </div>
                    <div className="flex justify-between items-center text-brand-cacao/50">
                      <span>WhatsApp</span>
                      <span className="font-bold text-brand-cacao">{phone}</span>
                    </div>
                    <div className="flex justify-between items-center text-brand-cacao/50">
                      <span>Entrega</span>
                      <span className="font-bold text-brand-cacao">
                        {delivery === "envio" ? "Envío a domicilio" : "Retiro en local"}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-brand-cacao/50">
                      <span>Pago</span>
                      <span className="font-bold text-brand-cacao">{paymentLabels[paymentMethod]}</span>
                    </div>
                    <div className="border-t border-dashed border-brand-cacao/10 my-1.5" />
                    <div className="flex justify-between items-center text-sm font-bold text-brand-cacao">
                      <span>{paymentMethod === "mercado_pago" ? "Importe abonado" : "Importe total"}</span>
                      <span className="font-sans text-brand-hazelnut text-base">${cartSubtotal.toLocaleString("es-AR")}</span>
                    </div>
                  </div>

                  {paymentMethod === "transfer" && (
                    <div className="w-full rounded-2xl border border-brand-hazelnut/25 bg-white p-4 text-left shadow-xs">
                      <div className="mb-3">
                        <h4 className="text-sm font-black text-brand-cacao">Transferí con estos datos</h4>
                        <p className="mt-0.5 text-[10px] font-semibold text-brand-cacao/50">
                          Copiá el alias o CVU y enviá el comprobante por WhatsApp junto al pedido.
                        </p>
                      </div>
                      <div className="flex flex-col gap-2">
                        {transferDetails.map((detail) => (
                          <div
                            key={detail.label}
                            className="flex items-center justify-between gap-3 rounded-xl border border-brand-cacao/5 bg-brand-cream/35 px-3 py-2.5"
                          >
                            <div className="min-w-0">
                              <p className="text-[9px] font-black uppercase tracking-widest text-brand-cacao/40">
                                {detail.label}
                              </p>
                              <p className="truncate text-xs font-bold text-brand-cacao">{detail.value}</p>
                            </div>
                            <button
                              type="button"
                              onClick={() => copyTransferValue(detail.value)}
                              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-brand-cacao/10 bg-white text-brand-cacao transition hover:bg-brand-cacao hover:text-brand-cream"
                              aria-label={`Copiar ${detail.label}`}
                            >
                              {copiedTransferValue === detail.value ? (
                                <Check className="h-4 w-4" />
                              ) : (
                                <Copy className="h-4 w-4" />
                              )}
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <p className="text-[10px] text-brand-cacao/50 font-bold max-w-xs mt-1">
                    ⚠️ CRÍTICO: Para ultimar detalles del retiro o envío, hacé clic en el botón de abajo y envianos el resumen del ticket directo a nuestro WhatsApp comercial.
                  </p>

                  {/* Giant premium bouncy liquid button to trigger WhatsApp redirect */}
                  <motion.button
                    onClick={handleSendWhatsApp}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-full bg-[#25D366] hover:bg-[#1ebd59] text-white py-4.5 rounded-2xl font-bold text-sm shadow-[0_10px_28px_rgba(37,211,102,0.25)] flex items-center justify-center gap-2 cursor-pointer select-none border border-[#1ebd59]/20 relative overflow-hidden"
                  >
                    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                      <path d="M12.031 2a9.967 9.967 0 0 0-8.835 15.22L2 22l5.006-1.312a9.967 9.967 0 0 0 14.963-8.656A9.97 9.97 0 0 0 12.031 2zm4.77 13.075c-.26.745-1.5 1.357-2.07 1.425-.57.07-1.14.26-3.62-.77-2.98-1.24-4.88-4.29-5.03-4.49-.15-.2-1.21-1.61-1.21-3.07 0-1.46.76-2.18 1.03-2.47.26-.3.57-.37.76-.37.19 0 .37.01.53.02.17.01.4.06.61.56.22.53.76 1.84.82 1.97.07.13.11.29.02.48-.09.18-.18.3-.35.5-.17.2-.36.45-.51.6-.17.18-.35.38-.15.73.2.34.88 1.45 1.88 2.34 1.29 1.15 2.38 1.5 2.71 1.67.33.16.53.14.72-.08.2-.23.83-.97 1.05-1.3.23-.33.45-.27.76-.15.3.12 1.94.92 2.27 1.09.33.16.56.24.64.38.08.14.08.82-.18 1.56z" />
                    </svg>
                    <span>Enviar Pedido a WhatsApp</span>
                  </motion.button>
                </motion.div>
              )}

            </AnimatePresence>
          </div>

        </motion.div>
      </div>
      </AnimatePresence>
    </>
  );
};
