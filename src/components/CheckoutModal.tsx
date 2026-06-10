"use client";

import React, { useState } from "react";
import { useCart } from "@/context/CartContext";
import { X, ArrowRight, CheckCircle2, CreditCard, Landmark, ShieldCheck } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "./ui/Button";
import type { BusinessInfo } from "@/lib/shopTypes";

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  businessInfo: BusinessInfo;
}

type CheckoutStep = "form" | "mercado-pago" | "success";

export const CheckoutModal: React.FC<CheckoutModalProps> = ({ isOpen, onClose, businessInfo }) => {
  const { cart, cartSubtotal, clearCart } = useCart();
  const [step, setStep] = useState<CheckoutStep>("form");

  // Form states
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [delivery, setDelivery] = useState<"retiro" | "envio">("retiro");
  const [address, setAddress] = useState("");

  // Payment states
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [cardHolder, setCardHolder] = useState("");
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  // Error handling
  const [error, setError] = useState("");
  const [orderId, setOrderId] = useState<string | null>(null);

  // Form submission to Payment step
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) {
      setError("Por favor completa los campos obligatorios.");
      return;
    }
    if (delivery === "envio" && !address.trim()) {
      setError("Por favor ingresa la dirección de entrega.");
      return;
    }
    setError("");
    setStep("mercado-pago");
  };

  // Simulating Mercado Pago payment process
  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessingPayment(true);
    setError("");

    setTimeout(async () => {
      try {
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
        setStep("success");
      } catch (paymentError) {
        setError(paymentError instanceof Error ? paymentError.message : "No se pudo crear la orden.");
        setStep("form");
      } finally {
        setIsProcessingPayment(false);
      }
    }, 2200); // 2.2 second simulated banking transaction
  };

  // WhatsApp redirection
  const handleSendWhatsApp = async () => {
    const formattedCartItems = cart
      .map((item) => `  • ${item.quantity}x ${item.name} ($${(item.price * item.quantity).toLocaleString("es-AR")})`)
      .join("\n");

    const message = `*¡Nuevo pedido aprobado en ${businessInfo.name}!* 🍩🎉
${orderId ? `*Orden:* ${orderId}\n` : ""}

*DATOS DE ENTREGA:*
*Cliente:* ${name}
*Teléfono:* ${phone}
*Modalidad:* ${delivery === "envio" ? `Envío a domicilio` : `Retiro en local (${businessInfo.addressLine})`}
${delivery === "envio" ? `*Dirección:* ${address}\n` : ""}
*DETALLE DEL PEDIDO:*
${formattedCartItems}

*Total:* $${cartSubtotal.toLocaleString("es-AR")}
*Pago:* Aprobado con Mercado Pago (Simulado) 💳✅

_¡Hola Central Donuts! Acabo de abonar mi pedido seguro en la web. Aguardo confirmación del envío/retiro. ¡Muchas gracias!_`;

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
  };

  if (!isOpen) return null;

  return (
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
                      required
                      placeholder="Ej. Juan Pérez"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="bg-white border border-brand-cacao/10 rounded-2xl p-3.5 text-sm focus:outline-none focus:border-brand-hazelnut transition-colors font-medium text-brand-cacao w-full"
                    />
                  </div>

                  {/* Phone Input */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-brand-cacao uppercase tracking-wider">WhatsApp de Contacto *</label>
                    <input
                      type="tel"
                      required
                      placeholder="Ej. 11 2345-6789"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="bg-white border border-brand-cacao/10 rounded-2xl p-3.5 text-sm focus:outline-none focus:border-brand-hazelnut transition-colors font-medium text-brand-cacao w-full"
                    />
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
                          required
                          placeholder="Calle, Altura, Departamento"
                          value={address}
                          onChange={(e) => setAddress(e.target.value)}
                          className="bg-white border border-brand-cacao/10 rounded-2xl p-3.5 text-sm focus:outline-none focus:border-brand-hazelnut transition-colors font-medium text-brand-cacao w-full"
                        />
                        <p className="text-[10px] text-brand-hazelnut font-semibold">
                          * {businessInfo.deliveryNote}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>

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
                      className="px-5 py-3 text-xs"
                      icon={<ArrowRight className="w-4 h-4" />}
                    >
                      Ir al Pago
                    </Button>
                  </div>
                </motion.form>
              )}

              {/* STEP 2: Simulated Mercado Pago Checkout */}
              {step === "mercado-pago" && (
                <motion.form
                  key="step-payment"
                  onSubmit={handlePaymentSubmit}
                  initial={{ opacity: 0, x: -15 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 15 }}
                  className="flex flex-col gap-5 text-brand-cacao"
                >
                  {/* Mercado Pago simulated branding header */}
                  <div className="bg-[#009EE3] p-4.5 rounded-2xl flex items-center justify-between text-white shadow-sm">
                    <div className="flex flex-col gap-0.5">
                      <span className="text-[10px] font-extrabold uppercase tracking-widest opacity-80">Pasarela Segura</span>
                      <span className="font-serif text-lg font-black tracking-tight flex items-center gap-1">
                        mercado <span className="font-sans font-light">pago</span>
                      </span>
                    </div>
                    <div className="bg-white/10 p-1.5 rounded-xl">
                      <ShieldCheck className="w-5 h-5 text-white" />
                    </div>
                  </div>

                  <div className="flex flex-col gap-4 bg-white p-5 rounded-2xl border border-brand-cacao/5">
                    <div className="flex items-center gap-2 text-xs font-bold text-[#009EE3]">
                      <CreditCard className="w-4.5 h-4.5" />
                      <span>TARJETA DE CRÉDITO O DÉBITO</span>
                    </div>

                    {/* Card inputs */}
                    <div className="flex flex-col gap-3.5 mt-2">
                      <input
                        type="text"
                        required
                        placeholder="Número de tarjeta (Simulado)"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, "").slice(0, 16))}
                        className="bg-brand-cream/40 border border-brand-cacao/10 rounded-xl p-3.5 text-xs focus:outline-none focus:border-[#009EE3] font-medium w-full"
                      />

                      <div className="grid grid-cols-2 gap-3">
                        <input
                          type="text"
                          required
                          placeholder="MM/AA"
                          value={cardExpiry}
                          onChange={(e) => setCardExpiry(e.target.value.slice(0, 5))}
                          className="bg-brand-cream/40 border border-brand-cacao/10 rounded-xl p-3.5 text-xs focus:outline-none focus:border-[#009EE3] font-medium w-full text-center"
                        />
                        <input
                          type="text"
                          required
                          placeholder="CVV"
                          value={cardCvv}
                          onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, "").slice(0, 4))}
                          className="bg-brand-cream/40 border border-brand-cacao/10 rounded-xl p-3.5 text-xs focus:outline-none focus:border-[#009EE3] font-medium w-full text-center"
                        />
                      </div>

                      <input
                        type="text"
                        required
                        placeholder="Nombre impreso en tarjeta"
                        value={cardHolder}
                        onChange={(e) => setCardHolder(e.target.value)}
                        className="bg-brand-cream/40 border border-brand-cacao/10 rounded-xl p-3.5 text-xs focus:outline-none focus:border-[#009EE3] font-medium w-full uppercase"
                      />
                    </div>
                  </div>

                  <div className="text-center text-[10px] text-brand-cacao/40 font-semibold flex items-center justify-center gap-1.5">
                    <Landmark className="w-3 h-3" />
                    <span>Conexión cifrada de prueba SSL. Tus datos reales no son recopilados.</span>
                  </div>

                  {/* Checkout Payment CTA buttons */}
                  <div className="grid grid-cols-2 gap-3.5 mt-2">
                    <button
                      type="button"
                      disabled={isProcessingPayment}
                      onClick={() => setStep("form")}
                      className="py-4 border border-brand-cacao/10 rounded-2xl text-xs font-bold text-brand-cacao hover:bg-brand-cream/20 active:scale-95 transition-transform"
                    >
                      Atrás
                    </button>
                    <Button
                      type="submit"
                      variant="secondary"
                      disabled={isProcessingPayment}
                      isLoading={isProcessingPayment}
                      className="bg-[#009EE3] hover:bg-[#0082bc] text-white py-4 rounded-2xl text-xs shadow-md shadow-[#009ee3]/10"
                    >
                      Confirmar Pago
                    </Button>
                  </div>
                </motion.form>
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
                    <h3 className="font-serif text-2xl font-bold text-brand-cacao">¡Pago Aprobado!</h3>
                    <p className="text-xs md:text-sm text-brand-cacao/65 leading-relaxed max-w-xs mx-auto">
                      ¡Excelente, {name}! El pago simulado con Mercado Pago se completó correctamente por un total de *${cartSubtotal.toLocaleString("es-AR")}*.
                      {orderId ? ` Orden registrada: ${orderId}.` : ""}
                    </p>
                  </div>

                  {/* Summary ticket detail */}
                  <div className="w-full bg-white border border-brand-cacao/5 rounded-2xl p-4.5 text-left text-xs flex flex-col gap-2.5 shadow-xs relative">
                    <span className="absolute top-0 right-4 translate-y-[-50%] bg-[#009EE3] text-white font-extrabold px-3 py-1 rounded-full text-[9px] uppercase tracking-wider shadow-sm">
                      MOCK MP OK
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
                    <div className="border-t border-dashed border-brand-cacao/10 my-1.5" />
                    <div className="flex justify-between items-center text-sm font-bold text-brand-cacao">
                      <span>Importe abonado</span>
                      <span className="font-sans text-brand-hazelnut text-base">${cartSubtotal.toLocaleString("es-AR")}</span>
                    </div>
                  </div>

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
  );
};
