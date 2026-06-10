"use client";

import React from "react";
import Image from "next/image";
import { ArrowRight, Heart, Phone, Send, ShoppingBag } from "lucide-react";
import { motion } from "framer-motion";
import type { BusinessInfo } from "@/lib/shopTypes";

interface BoxesAndBuyingSectionsProps {
  businessInfo: BusinessInfo;
}

export const BoxesAndBuyingSections: React.FC<BoxesAndBuyingSectionsProps> = ({ businessInfo }) => {
  const steps = [
    {
      icon: <ShoppingBag className="h-8 w-8 text-brand-cacao" />,
      title: "Elegí tus donas",
      description: "y cantidad",
    },
    {
      icon: <Phone className="h-8 w-8 text-brand-pink-dark" />,
      title: "Hacé tu pedido",
      description: `por ${businessInfo.instagramHandle ? "WhatsApp" : "mensaje"}`,
    },
    {
      icon: <Send className="h-8 w-8 text-brand-pink-dark" />,
      title: "Recibilas en la puerta",
      description: "de tu casa",
    },
  ];

  const handleScrollToBoxes = () => {
    document.getElementById("menu")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="como-funciona" className="overflow-hidden bg-brand-cream">
      <div className="bg-brand-pink-dark/90 px-5 py-14 sm:px-8 md:px-12 lg:py-16">
        <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 lg:grid-cols-[0.56fr_0.44fr]">
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.55 }}
            className="relative min-h-70 overflow-visible"
          >
            <div className="relative aspect-[16/9] w-full max-w-165">
              <Image
                src="/assets/donut_box_12.png"
                alt="Caja surtida de donuts para compartir"
                fill
                className="object-contain drop-shadow-[0_30px_44px_rgba(42,27,20,0.22)]"
                sizes="(max-width: 1024px) 100vw, 660px"
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.55, delay: 0.08 }}
            className="relative flex max-w-lg flex-col items-start gap-5 text-brand-cacao"
          >
            <span className="text-xs font-black uppercase tracking-[0.22em] text-brand-cacao/70">
              El plan perfecto
            </span>
            <div className="space-y-1">
              <h2 className="font-serif text-4xl font-black leading-none tracking-tight md:text-5xl">
                Cajas para
              </h2>
              <p className="font-serif text-4xl font-black italic leading-none text-brand-chocolate/78 md:text-5xl">
                compartir.
              </p>
            </div>
            <p className="max-w-sm text-sm font-bold leading-relaxed text-brand-cacao/68">
              6, 12 o 24 donas. Ideal para regalar, festejar o simplemente darte un gusto.
            </p>
            <button
              type="button"
              onClick={handleScrollToBoxes}
              className="inline-flex items-center gap-3 rounded-2xl bg-brand-cacao px-7 py-4 text-sm font-black uppercase tracking-wide text-brand-cream shadow-[0_16px_30px_rgba(42,27,20,0.22)] transition hover:bg-brand-chocolate active:scale-95"
            >
              Ver cajas
              <ArrowRight className="h-4 w-4" />
            </button>
            <Heart className="absolute right-4 top-8 hidden h-24 w-24 text-brand-cream/70 lg:block" strokeWidth={1.5} />
          </motion.div>
        </div>
      </div>

      <div
        aria-hidden="true"
        className="relative h-[clamp(260px,31.25vw,600px)] bg-[url('/assets/DonnasFondoDos.jpg')] bg-cover bg-center bg-no-repeat bg-fixed"
      />

      <div className="relative bg-brand-cream px-5 py-16 sm:px-8 md:px-12 lg:py-18">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 lg:grid-cols-[0.24fr_0.76fr] lg:items-center">
          <div className="flex flex-col gap-3 text-brand-cacao">
            <span className="text-xs font-black uppercase tracking-[0.22em] text-brand-hazelnut/75">
              Así de simple
            </span>
            <div>
              <h2 className="font-serif text-4xl font-black leading-none md:text-5xl">
                Cómo
              </h2>
              <p className="font-serif text-4xl font-black italic leading-none text-brand-pink-dark md:text-5xl">
                comprar
              </p>
            </div>
          </div>

          <div className="relative grid grid-cols-1 gap-8 md:grid-cols-3 md:gap-6">
            <div className="absolute left-[16%] right-[16%] top-14 hidden border-t border-dashed border-brand-pink-dark/50 md:block" />
            {steps.map((step, index) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.45, delay: index * 0.08 }}
                className="relative flex flex-col items-center gap-4 text-center"
              >
                <div className="relative flex h-28 w-28 items-center justify-center rounded-full border border-brand-pink-dark/45 bg-brand-pink/20 shadow-[0_18px_34px_rgba(228,164,147,0.14)]">
                  <div className="flex h-17 w-17 items-center justify-center rounded-full bg-white shadow-sm">
                    {step.icon}
                  </div>
                  <span className="absolute -bottom-3 flex h-7 w-7 items-center justify-center rounded-full bg-brand-pink-dark text-xs font-black text-brand-cacao">
                    {index + 1}
                  </span>
                </div>
                <div className="max-w-45">
                  <h3 className="text-sm font-black leading-snug text-brand-cacao">
                    {step.title}
                  </h3>
                  <p className="text-sm font-semibold leading-snug text-brand-cacao/68">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
