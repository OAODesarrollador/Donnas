"use client";

import React from "react";
import { Compass, CreditCard, Send, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export const HowItWorks: React.FC = () => {
  const steps = [
    {
      num: "01",
      icon: <Compass className="w-8 h-8 text-brand-cacao" />,
      title: "Elegís",
      desc: "Navegás por nuestro menú y armás tu caja ideal de donuts premium y bebidas en pocos clics.",
    },
    {
      num: "02",
      icon: <CreditCard className="w-8 h-8 text-brand-cacao" />,
      title: "Pagás",
      desc: "Abonás de forma rápida y ultra-segura con Mercado Pago usando tarjetas o dinero en cuenta.",
    },
    {
      num: "03",
      icon: <Send className="w-8 h-8 text-brand-cacao" />,
      title: "Retirás o Recibís",
      desc: "Retirás por nuestro local en Palermo o coordinamos el envío rápido directo a tu domicilio.",
    },
  ];

  return (
    <section id="como-funciona" className="py-20 px-6 md:px-12 bg-white relative overflow-hidden">
      {/* Decorative premium sparkles */}
      <div className="absolute top-12 left-12 w-6 h-6 opacity-20 text-brand-hazelnut">
        <Sparkles className="w-full h-full animate-[spin_8s_infinite_linear]" />
      </div>

      <div className="max-w-7xl mx-auto flex flex-col gap-16 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col items-center text-center gap-4">
          <span className="text-xs font-bold uppercase tracking-widest text-brand-hazelnut bg-brand-pink/30 px-3 py-1 rounded-full">
            Simple & Ágil
          </span>
          <h2 className="font-serif text-3xl md:text-5xl font-bold tracking-tight text-brand-cacao">
            ¿Cómo Funciona?
          </h2>
          <p className="text-sm md:text-base text-brand-cacao/60 font-medium max-w-sm">
            Disfrutar de la pastelería artesanal nunca fue tan fácil. Tres pasos y a disfrutar.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
          
          {/* Connector line for large screens */}
          <div className="hidden md:block absolute top-1/2 left-[10%] right-[10%] h-[1px] bg-brand-cacao/10 -z-10" />

          {steps.map((step, idx) => (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ delay: idx * 0.15, duration: 0.6 }}
              key={step.num}
              className="flex flex-col items-center text-center gap-6 bg-brand-cream/40 border border-brand-cacao/5 p-8 rounded-3xl relative shadow-sm hover:shadow-md transition-shadow duration-300"
            >
              {/* Step number badge */}
              <span className="absolute -top-4 bg-brand-cacao text-brand-cream text-xs font-bold px-3 py-1.5 rounded-full border-2 border-[#FDFBF7]">
                {step.num}
              </span>

              {/* Icon Container */}
              <div className="p-5 bg-brand-pink/40 border border-brand-pink rounded-2xl shadow-sm hover:scale-105 transition-transform">
                {step.icon}
              </div>

              {/* Step text */}
              <div className="flex flex-col gap-2">
                <h3 className="font-serif text-xl font-bold text-brand-cacao tracking-tight">
                  {step.title}
                </h3>
                <p className="text-xs md:text-sm text-brand-cacao/65 leading-relaxed font-medium">
                  {step.desc}
                </p>
              </div>
            </motion.div>
          ))}

        </div>

      </div>
    </section>
  );
};
