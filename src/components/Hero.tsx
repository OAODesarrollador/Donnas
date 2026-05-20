"use client";

import React from "react";
import { Button } from "./ui/Button";
import { Phone, ArrowDown } from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";

export const Hero: React.FC = () => {
  const handleScrollToMenu = () => {
    const element = document.getElementById("menu");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="relative min-h-[85vh] flex items-center justify-center py-12 px-6 md:px-12 overflow-hidden bg-gradient-to-b from-[#FDFBF7] to-[#FAF6F0]">
      {/* Editorial aesthetic background shapes */}
      <div className="absolute top-0 right-0 w-[40vw] h-[40vw] bg-brand-pink/15 rounded-full filter blur-[100px] pointer-events-none -mr-20 -mt-20" />
      <div className="absolute bottom-0 left-0 w-[30vw] h-[30vw] bg-brand-beige/25 rounded-full filter blur-[80px] pointer-events-none -ml-20 -mb-20" />

      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
        
        {/* Left Column: Premium Copywriting */}
        <div className="lg:col-span-6 flex flex-col items-center lg:items-start text-center lg:text-left gap-6 md:gap-8">
          
          {/* Micro-badge */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="inline-flex items-center gap-2 bg-brand-pink/35 border border-brand-pink-dark/25 px-4 py-1.5 rounded-full text-brand-cacao font-semibold text-xs tracking-wider uppercase"
          >
            🍩 100% Artesanales & Gourmet
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
            className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-brand-cacao leading-[1.1]"
          >
            Tus donuts favoritas, <br className="hidden md:inline" />
            <span className="text-brand-hazelnut relative">
              ahora online
              <span className="absolute bottom-1 left-0 w-full h-[4px] bg-brand-pink rounded-full -z-10 opacity-70" />
            </span>.
          </motion.h1>

          {/* Subhead */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            className="text-base md:text-lg text-brand-cacao/70 font-medium leading-relaxed max-w-lg"
          >
            Gourmet, frescas y horneadas hoy. Disfrutá de la mejor pastelería desde la comodidad de tu celular. Pedí en 30 segundos y retirá o recibilo en casa.
          </motion.p>

          {/* Liquid Action CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
            className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto"
          >
            <Button
              variant="primary"
              size="lg"
              onClick={handleScrollToMenu}
              className="w-full sm:w-auto text-center"
              icon={<ArrowDown className="w-4 h-4 animate-[bounce_1.5s_infinite]" />}
            >
              Hacer Pedido
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="w-full sm:w-auto"
              onClick={() => window.open("https://wa.me/5491123456789", "_blank")}
              icon={<Phone className="w-4 h-4 text-green-500 fill-green-500" />}
            >
              Consultas WhatsApp
            </Button>
          </motion.div>

        </div>

        {/* Right Column: Visual Presentation */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, rotate: -1 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 0.8, delay: 0.2, type: "spring", stiffness: 100 }}
          className="lg:col-span-6 flex justify-center"
        >
          <div className="relative w-full max-w-[480px] aspect-[4/3] sm:aspect-square md:aspect-[4/3] rounded-3xl overflow-hidden shadow-[0_20px_50px_rgba(42,27,20,0.15)] border-4 border-white/60 bg-white">
            <Image
              src="/assets/hero_donuts.png"
              alt="Donuts artesanal gourmet premium"
              fill
              priority
              className="object-cover hover:scale-105 transition-transform duration-[2s] ease-out"
              sizes="(max-w-7xl) 100vw, 500px"
            />
          </div>
        </motion.div>

      </div>
    </section>
  );
};
