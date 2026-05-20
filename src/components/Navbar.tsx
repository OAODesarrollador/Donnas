"use client";

import React, { useState } from "react";
import { useCart } from "@/context/CartContext";
import { ShoppingBag, Menu, X, Phone } from "lucide-react";
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

export const Navbar: React.FC = () => {
  const { setIsCartOpen, cartCount, cartSubtotal } = useCart();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: "Menú", href: "#menu" },
    { name: "Combos", href: "#combos" },
    { name: "Cómo Funciona", href: "#como-funciona" },
    { name: "Contacto", href: "#contacto" },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-[#FDFBF7]/80 backdrop-blur-md border-b border-brand-cacao/5 py-4 px-6 md:px-12 transition-all duration-300">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo Brand */}
          <a href="#" className="flex items-center gap-2 group">
            <span className="font-serif text-xl md:text-2xl font-bold tracking-tight text-brand-cacao flex items-center gap-1.5">
              CENTRAL
              <span className="text-brand-pink text-3xl leading-none font-sans font-light select-none">.</span>
              <span className="font-sans font-normal text-sm tracking-[0.25em] text-brand-hazelnut mt-1">DONUTS</span>
            </span>
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-sm font-semibold tracking-wide text-brand-cacao/75 hover:text-brand-cacao transition-colors duration-200 relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-brand-pink after:scale-x-0 hover:after:scale-x-100 after:origin-left after:transition-transform after:duration-300"
              >
                {link.name}
              </a>
            ))}
          </nav>

          {/* Right Section Actions */}
          <div className="flex items-center gap-4">
            {/* Desktop Cart Indicator Button */}
            <motion.button
              onClick={() => setIsCartOpen(true)}
              className="hidden md:flex items-center gap-3 bg-brand-cacao text-brand-cream py-2.5 px-5 rounded-2xl font-medium text-sm transition-all hover:bg-brand-chocolate shadow-[0_4px_12px_rgba(42,27,20,0.1)] active:scale-95 cursor-pointer select-none"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              <div className="relative">
                <ShoppingBag className="w-4 h-4" />
                {cartCount > 0 && (
                  <span className="absolute -top-2.5 -right-2.5 bg-brand-pink text-brand-cacao text-[10px] font-extrabold w-4.5 h-4.5 rounded-full flex items-center justify-center border-2 border-brand-cacao animate-bounce">
                    {cartCount}
                  </span>
                )}
              </div>
              <span className="font-semibold">Carrito</span>
              {cartCount > 0 && (
                <span className="text-xs text-brand-pink font-bold border-l border-brand-cream/20 pl-2">
                  ${cartSubtotal.toLocaleString("es-AR")}
                </span>
              )}
            </motion.button>

            {/* Mobile Actions: Hamburger Icon */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-brand-cacao/90 hover:text-brand-cacao focus:outline-none transition-colors"
              aria-label="Toggle Menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Panel (Framer Motion Drawer) */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="fixed inset-x-0 top-[65px] bottom-0 z-30 bg-[#FDFBF7] flex flex-col p-8 md:hidden border-t border-brand-cacao/5"
          >
            <nav className="flex flex-col gap-6 mt-8">
              {navLinks.map((link, idx) => (
                <motion.a
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-2xl font-semibold font-serif text-brand-cacao hover:text-brand-hazelnut transition-colors py-2 border-b border-brand-cacao/5"
                >
                  {link.name}
                </motion.a>
              ))}
            </nav>

            <div className="mt-auto flex flex-col gap-4 mb-16">
              <a
                href="https://www.instagram.com/centraldonuts00/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-3 bg-white border border-brand-cacao/10 text-brand-cacao py-4 rounded-2xl font-semibold shadow-sm active:scale-95 transition-transform"
              >
                <Instagram className="w-5 h-5 text-pink-600" />
                Seguinos en Instagram
              </a>
              <a
                href="https://wa.me/5491123456789"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-3 bg-green-50 text-green-700 border border-green-100 py-4 rounded-2xl font-semibold shadow-sm active:scale-95 transition-transform"
              >
                <Phone className="w-5 h-5" />
                WhatsApp Directo
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
