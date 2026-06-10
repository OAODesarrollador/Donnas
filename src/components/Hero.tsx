"use client";

import React, { useRef } from "react";
import { ArrowDown, Sparkles } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { Button } from "./ui/Button";

const heroSlides = [
  {
    eyebrow: "100% artesanales",
    title: "Tus donuts favoritas, ahora online.",
    description:
      "Gourmet, frescas y horneadas hoy. Pedí en segundos y retirá o recibilo en casa.",
    image: "/assets/hero_donuts.png",
    alt: "Donuts artesanales surtidas con glaseados premium",
  },
  {
    eyebrow: "Cajas para compartir",
    title: "Armá una caja dulce para cualquier momento.",
    description:
      "Elegí combinaciones listas para regalar, llevar a una juntada o resolver el antojo del día.",
    image: "/assets/donut_box_12.png",
    alt: "Caja de doce donuts artesanales",
  },
  {
    eyebrow: "Combos con café",
    title: "Donuts y bebidas frías en un solo pedido.",
    description:
      "Sumá lattes, cajas y sabores especiales con una experiencia simple desde el celular.",
    image: "/assets/donut_combo.png",
    alt: "Combo de donuts artesanales y bebidas frías",
  },
];

const reversedImageSlides = [...heroSlides].reverse();

export const Hero: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "-66.666%"]);
  const imageY = useTransform(scrollYProgress, [0, 1], ["0%", "66.666%"]);

  const handleScrollToMenu = () => {
    const element = document.getElementById("menu");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section
      ref={sectionRef}
      className="relative min-h-[210vh] bg-brand-cream"
    >
      <div className="sticky top-17.5 flex min-h-[calc(100vh-4.375rem)] items-center py-8 overflow-hidden px-5 pb-24 sm:px-8 md:top-37.5 md:min-h-[calc(100vh-9.375rem)] lg:px-12">
        <div className="relative mx-auto grid w-full max-w-7xl grid-cols-1 items-start gap-7 lg:grid-cols-2 lg:gap-16">
          <div className="relative h-90 overflow-hidden sm:h-107.5 lg:h-130">
            <motion.div style={{ y: textY }} className="h-[300%]">
              {heroSlides.map((slide, index) => (
                <article
                  key={slide.title}
                  className="flex h-1/3 flex-col justify-center gap-5 text-center lg:items-start lg:text-left"
                >
                  <div className="mx-auto inline-flex w-fit items-center gap-2 rounded-full border border-brand-pink-dark/30 bg-white/65 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-brand-cacao shadow-[0_8px_28px_rgba(42,27,20,0.06)] backdrop-blur lg:mx-0">
                    <Sparkles className="h-3.5 w-3.5 text-brand-hazelnut" />
                    {slide.eyebrow}
                  </div>

                  {index === 0 ? (
                    <h1 className="font-serif text-4xl font-bold leading-[1.05] tracking-tight text-brand-cacao sm:text-5xl lg:text-6xl">
                      {slide.title}
                    </h1>
                  ) : (
                    <h2 className="font-serif text-4xl font-bold leading-[1.05] tracking-tight text-brand-cacao sm:text-5xl lg:text-6xl">
                      {slide.title}
                    </h2>
                  )}

                  <p className="mx-auto max-w-xl text-base font-medium leading-relaxed text-brand-cacao/70 sm:text-lg lg:mx-0">
                    {slide.description}
                  </p>

                  <div className="flex justify-center lg:justify-start">
                    <Button
                      variant="primary"
                      size="lg"
                      onClick={handleScrollToMenu}
                      className="w-full max-w-55 whitespace-nowrap sm:w-auto"
                      icon={<ArrowDown className="h-4 w-4 animate-[bounce_1.5s_infinite]" />}
                    >
                      Ordenar
                    </Button>
                  </div>
                </article>
              ))}
            </motion.div>
          </div>

          <div className="relative h-90 overflow-hidden sm:h-107.5 lg:h-130">
            <motion.div style={{ y: imageY }} className="absolute bottom-0 left-0 h-[300%] w-full">
              {reversedImageSlides.map((slide, index) => (
                <div key={slide.image} className="flex h-1/3 items-start justify-center">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.94 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.7, delay: index * 0.08, ease: "easeOut" }}
                    className="relative h-full w-full max-w-135 overflow-hidden rounded-[28px] border border-white/70 bg-white shadow-[0_24px_60px_rgba(42,27,20,0.16)]"
                  >
                    <Image
                      src={slide.image}
                      alt={slide.alt}
                      fill
                      priority={slide.image === heroSlides[0].image}
                      loading={slide.image === heroSlides[0].image ? "eager" : "lazy"}
                      className="object-cover"
                      sizes="(max-width: 1024px) 100vw, 540px"
                    />
                  </motion.div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};
