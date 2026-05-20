"use client";

import React from "react";
import { useCart } from "@/context/CartContext";
import { ShoppingBag, Phone, Compass } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const Instagram = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

export const BottomNavBar: React.FC = () => {
  const { cartCount, cartSubtotal, setIsCartOpen } = useCart();

  // Scroll to catalog helper
  const scrollToCatalog = () => {
    const catalog = document.getElementById("menu");
    if (catalog) {
      catalog.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="fixed bottom-6 inset-x-0 z-40 px-4 md:hidden flex justify-center pointer-events-none">
      <div className="w-full max-w-md pointer-events-auto">
        <AnimatePresence mode="wait">
          {cartCount > 0 ? (
            /* LIQUID CART ACTION BUTTON: Renders when cart has items */
            <motion.button
              key="cart-action-btn"
              onClick={() => setIsCartOpen(true)}
              initial={{ scale: 0.8, opacity: 0, y: 30 }}
              animate={{ 
                scale: 1, 
                opacity: 1, 
                y: 0,
                transition: {
                  type: "spring",
                  stiffness: 350,
                  damping: 20
                }
              }}
              exit={{ scale: 0.8, opacity: 0, y: 30, transition: { duration: 0.2 } }}
              whileTap={{ scale: 0.94 }}
              className="w-full flex items-center justify-between bg-brand-cacao text-brand-cream py-4 px-6 rounded-2xl shadow-[0_12px_36px_rgba(42,27,20,0.35)] hover:shadow-[0_16px_40px_rgba(42,27,20,0.45)] border border-brand-cacao/10 text-base font-semibold tracking-wide relative overflow-hidden cursor-pointer select-none"
            >
              {/* Glossy liquid glow effect */}
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-[pulse_2s_infinite] pointer-events-none" />

              <div className="flex items-center gap-3 relative z-10">
                <div className="bg-brand-pink text-brand-cacao w-6 h-6 rounded-full flex items-center justify-center text-xs font-black shadow-[0_2px_8px_rgba(243,210,215,0.4)] animate-bounce">
                  {cartCount}
                </div>
                <span>Ver tu Pedido</span>
              </div>

              <div className="flex items-center gap-2 relative z-10 border-l border-brand-cream/15 pl-4 font-bold text-brand-pink text-lg">
                <ShoppingBag className="w-4 h-4 text-brand-cream" />
                <span>${cartSubtotal.toLocaleString("es-AR")}</span>
              </div>
            </motion.button>
          ) : (
            /* STANDBY SHORTCUT NAVIGATION BAR: Renders when cart is empty */
            <motion.div
              key="default-nav-bar"
              initial={{ scale: 0.9, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 15 }}
              transition={{ duration: 0.25 }}
              className="bg-brand-cacao/90 backdrop-blur-xl border border-white/10 py-3.5 px-6 rounded-2xl flex items-center justify-around shadow-[0_10px_30px_rgba(0,0,0,0.15)] w-full text-brand-cream/80"
            >
              {/* Explorer Shortcut */}
              <button
                onClick={scrollToCatalog}
                className="flex flex-col items-center gap-1 active:scale-95 transition-transform cursor-pointer"
              >
                <Compass className="w-5.5 h-5.5 hover:text-brand-pink transition-colors" />
                <span className="text-[10px] font-medium tracking-wide">Menú</span>
              </button>

              {/* Instagram Shortcut */}
              <a
                href="https://www.instagram.com/centraldonuts00/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center gap-1 active:scale-95 transition-transform cursor-pointer"
              >
                <Instagram className="w-5.5 h-5.5 hover:text-brand-pink transition-colors text-brand-pink" />
                <span className="text-[10px] font-medium tracking-wide">Instagram</span>
              </a>

              {/* WhatsApp Help Shortcut */}
              <a
                href="https://wa.me/5491123456789"
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center gap-1 active:scale-95 transition-transform cursor-pointer"
              >
                <Phone className="w-5.5 h-5.5 text-green-400 hover:text-green-300 transition-colors" />
                <span className="text-[10px] font-medium tracking-wide">WhatsApp</span>
              </a>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
