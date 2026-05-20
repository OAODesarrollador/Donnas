"use client";

import React from "react";
import { useCart } from "@/context/CartContext";
import { X, Trash2, Plus, Minus, ShoppingBag } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

interface CartDrawerProps {
  onCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ onCheckout }) => {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    updateQuantity,
    removeFromCart,
    cartSubtotal,
    cartCount,
  } = useCart();

  // Handle proceed to checkout
  const handleProceed = () => {
    setIsCartOpen(false);
    onCheckout();
  };

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Backdrop Blur Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsCartOpen(false)}
            className="fixed inset-0 z-50 bg-brand-cacao/80 backdrop-blur-xs cursor-pointer"
          />

          {/* Drawer Container (Side panel on PC, Bottom sheet on Mobile) */}
          <motion.div
            initial={{
              x: typeof window !== "undefined" && window.innerWidth >= 768 ? "100%" : 0,
              y: typeof window !== "undefined" && window.innerWidth < 768 ? "100%" : 0,
            }}
            animate={{ x: 0, y: 0 }}
            exit={{
              x: typeof window !== "undefined" && window.innerWidth >= 768 ? "100%" : 0,
              y: typeof window !== "undefined" && window.innerWidth < 768 ? "100%" : 0,
            }}
            transition={{ type: "spring", damping: 25, stiffness: 220 }}
            className="fixed z-50 bg-[#FDFBF7] flex flex-col shadow-[0_-12px_40px_rgba(0,0,0,0.15)] md:shadow-[-12px_0_40px_rgba(0,0,0,0.15)] border-t md:border-t-0 md:border-l border-brand-cacao/5
              /* Mobile viewport sizes */
              bottom-0 left-0 right-0 max-h-[90vh] rounded-t-[32px] w-full
              /* Desktop viewport sizes */
              md:top-0 md:right-0 md:left-auto md:h-full md:max-h-full md:w-[460px] md:rounded-t-none"
          >
            {/* Drawer Header */}
            <div className="px-6 py-5 border-b border-brand-cacao/5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-brand-hazelnut" />
                <h2 className="font-serif text-lg md:text-xl font-bold text-brand-cacao">Tu Pedido</h2>
                <span className="bg-brand-pink/60 text-brand-cacao text-xs font-black px-2.5 py-0.5 rounded-full">
                  {cartCount}
                </span>
              </div>
              <button
                onClick={() => setIsCartOpen(false)}
                className="p-2 hover:bg-brand-beige/25 rounded-full transition-colors cursor-pointer"
              >
                <X className="w-5.5 h-5.5 text-brand-cacao" />
              </button>
            </div>

            {/* Drawer Body (Cart Items list) */}
            <div className="flex-1 overflow-y-auto px-6 py-4 no-scrollbar flex flex-col gap-4">
              {cart.length === 0 ? (
                /* Empty state */
                <div className="flex flex-col items-center justify-center h-64 text-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-brand-pink/25 flex items-center justify-center text-brand-hazelnut text-2xl">
                    🍩
                  </div>
                  <div>
                    <p className="font-serif text-lg font-bold text-brand-cacao">¡Tu carrito está vacío!</p>
                    <p className="text-xs text-brand-cacao/55 mt-1 max-w-[220px]">
                      Explorá nuestro menú y agregá tus sabores favoritos.
                    </p>
                  </div>
                  <button
                    onClick={() => setIsCartOpen(false)}
                    className="mt-2 text-xs font-bold text-brand-hazelnut hover:text-brand-cacao underline underline-offset-4"
                  >
                    Ver catálogo →
                  </button>
                </div>
              ) : (
                /* Cart Items List */
                cart.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-4 p-3 bg-white rounded-2xl border border-brand-cacao/5 items-center justify-between"
                  >
                    {/* Item Thumbnail */}
                    <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-brand-cream/60 flex-shrink-0">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                        sizes="64px"
                      />
                    </div>

                    {/* Item Metadata */}
                    <div className="flex-1 min-w-0 flex flex-col gap-1.5">
                      <h4 className="font-serif text-sm font-bold text-brand-cacao tracking-tight truncate">
                        {item.name}
                      </h4>
                      <span className="text-xs font-black text-brand-cacao/75">
                        ${item.price.toLocaleString("es-AR")}
                      </span>

                      {/* Quantity Selector inside Thumb zone */}
                      <div className="flex items-center gap-2 mt-1">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-7 h-7 bg-brand-cream/80 hover:bg-brand-beige/40 rounded-lg flex items-center justify-center text-brand-cacao active:scale-90 transition-transform"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="text-xs font-bold text-brand-cacao w-5 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-7 h-7 bg-brand-cream/80 hover:bg-brand-beige/40 rounded-lg flex items-center justify-center text-brand-cacao active:scale-90 transition-transform"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Delete Item Button */}
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="p-2 text-brand-cacao/30 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all active:scale-90"
                    >
                      <Trash2 className="w-4.5 h-4.5" />
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Drawer Footer (Summary & CTAs) */}
            {cart.length > 0 && (
              <div className="px-6 py-6 border-t border-brand-cacao/5 bg-white flex flex-col gap-4 mb-2 md:mb-0">
                {/* Calculations summary */}
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between items-center text-sm font-medium text-brand-cacao/65">
                    <span>Subtotal</span>
                    <span>${cartSubtotal.toLocaleString("es-AR")}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm font-medium text-brand-cacao/65">
                    <span>Envío</span>
                    <span className="text-green-600 font-bold text-xs bg-green-50 px-2 py-0.5 rounded-lg border border-green-100">
                      Coordinar costo
                    </span>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t border-brand-cacao/5 mt-1">
                    <span className="font-serif text-base font-bold text-brand-cacao">Total</span>
                    <span className="font-sans text-xl font-black text-brand-cacao">
                      ${cartSubtotal.toLocaleString("es-AR")}
                    </span>
                  </div>
                </div>

                {/* Primary Liquid Checkout Action */}
                <motion.button
                  onClick={handleProceed}
                  className="w-full bg-brand-cacao text-brand-cream py-4 rounded-2xl font-semibold shadow-[0_8px_24px_rgba(42,27,20,0.15)] hover:bg-brand-chocolate active:scale-95 transition-all text-sm tracking-wide flex items-center justify-center gap-2 cursor-pointer select-none relative overflow-hidden"
                  whileHover={{ scale: 1.015 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent pointer-events-none" />
                  Proceder al Pago
                </motion.button>

                <button
                  onClick={() => setIsCartOpen(false)}
                  className="w-full text-center text-xs font-semibold text-brand-cacao/50 hover:text-brand-cacao transition-colors py-1"
                >
                  Seguir Comprando
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
