"use client";

import React, { useMemo, useRef } from "react";
import Image from "next/image";
import { ArrowRight, ChevronLeft, ChevronRight, ShoppingBag, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { useCart } from "@/context/CartContext";
import type { ShopCategory, ShopProduct } from "@/lib/shopTypes";
import { isPhotoImage } from "@/lib/imageUtils";

interface FeaturedProductsCarouselProps {
  products: ShopProduct[];
  categories: ShopCategory[];
}

export const FeaturedProductsCarousel: React.FC<FeaturedProductsCarouselProps> = ({ products, categories }) => {
  const { addToCart } = useCart();
  const carouselRef = useRef<HTMLDivElement>(null);
  const flavorsRef = useRef<HTMLDivElement>(null);

  const featuredProducts = useMemo(() => {
    const popularProducts = products.filter((product) => product.isPopular);
    return (popularProducts.length >= 4 ? popularProducts : products).slice(0, 8);
  }, [products]);

  const flavorGroups = useMemo(() => {
    const labels: Record<string, string> = {
      donuts: "Clásicas",
      cajas: "Rellenas",
      combos: "Premium",
      bebidas: "Bebidas",
    };

    return categories
      .map((category) => {
        const sample = products.find((product) => product.category === category.slug);
        return {
          id: category.slug,
          name: labels[category.slug] ?? category.name,
          image: sample?.image ?? "grad-caramel",
        };
      })
      .slice(0, 6);
  }, [categories, products]);

  const scrollCarousel = (direction: "left" | "right") => {
    carouselRef.current?.scrollBy({
      left: direction === "left" ? -320 : 320,
      behavior: "smooth",
    });
  };

  const scrollFlavors = () => {
    flavorsRef.current?.scrollBy({
      left: 220,
      behavior: "smooth",
    });
  };

  const handleScrollToMenu = () => {
    document.getElementById("menu")?.scrollIntoView({ behavior: "smooth" });
  };

  const renderProductVisual = (product: ShopProduct) => {
    if (isPhotoImage(product.image)) {
      return (
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105 [backface-visibility:hidden] [transform:translateZ(0)]"
          sizes="(max-width: 768px) 72vw, 260px"
        />
      );
    }

    const gradientByImage: Record<string, string> = {
      "grad-chocolate": "from-[#2A1B14] via-[#5D4037] to-[#C58A55]",
      "grad-caramel": "from-[#8B5E3C] via-[#E4A493] to-[#FDFBF7]",
      "grad-pistachio": "from-[#5F7F3A] via-[#B9C98C] to-[#FDFBF7]",
      "grad-berry": "from-[#7B1E3A] via-[#E4A493] to-[#FDFBF7]",
      "grad-coffee-1": "from-[#2A1B14] via-[#8B5E3C] to-[#EADBC8]",
      "grad-coffee-2": "from-[#4E3629] via-[#EADBC8] to-[#FDFBF7]",
    };

    return (
      <div className={`flex h-full w-full items-center justify-center bg-gradient-to-br ${gradientByImage[product.image] || "from-brand-pink via-brand-beige to-white"}`}>
        <div className="relative flex h-30 w-30 items-center justify-center rounded-full bg-white/30 shadow-[inset_0_8px_22px_rgba(255,255,255,0.34),0_14px_36px_rgba(42,27,20,0.16)] backdrop-blur">
          <div className="h-21 w-21 rounded-full border-[20px] border-brand-pink-dark bg-transparent shadow-[0_10px_20px_rgba(42,27,20,0.16)]" />
          <div className="absolute h-8 w-8 rounded-full bg-brand-cream" />
          <Sparkles className="absolute right-7 top-7 h-4 w-4 text-brand-cacao/70" />
        </div>
      </div>
    );
  };

  if (featuredProducts.length === 0) {
    return null;
  }

  return (
    <section className="relative overflow-hidden bg-transparent">
      <div className="min-w-0">
          <div className="px-5 py-16 sm:px-8 md:px-12 lg:py-20">
            <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 lg:grid-cols-[0.34fr_0.66fr] lg:items-center">
              <div className="flex max-w-sm flex-col items-start gap-4">
                <span className="text-xs font-black uppercase tracking-[0.22em] text-brand-hazelnut/80">
                  Las más amadas
                </span>
                <div className="space-y-1">
                  <h2 className="font-serif text-4xl font-bold leading-[0.98] tracking-tight text-brand-cacao md:text-5xl">
                    Nuestras
                  </h2>
                  <p className="font-serif text-4xl font-bold italic leading-none text-brand-pink-dark md:text-5xl">
                    favoritas
                  </p>
                </div>
                <p className="text-sm font-medium leading-relaxed text-brand-cacao/68">
                  Las donas que todos eligen y vos también vas a querer.
                </p>
                <button
                  type="button"
                  onClick={handleScrollToMenu}
                  className="mt-2 inline-flex items-center gap-2 rounded-full bg-brand-pink-dark px-5 py-3 text-xs font-black uppercase tracking-wide text-brand-cacao shadow-[0_10px_24px_rgba(228,164,147,0.28)] transition hover:bg-brand-pink active:scale-95"
                >
                  Ver todas
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>

              <div className="relative min-w-0">
                <div className="mb-5 hidden justify-end gap-2 md:flex">
                  <button
                    type="button"
                    onClick={() => scrollCarousel("left")}
                    aria-label="Ver productos anteriores"
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-pink text-brand-cacao shadow-[0_8px_22px_rgba(42,27,20,0.08)] transition hover:bg-brand-pink-dark active:scale-95"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => scrollCarousel("right")}
                    aria-label="Ver más productos"
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-pink text-brand-cacao shadow-[0_8px_22px_rgba(42,27,20,0.08)] transition hover:bg-brand-pink-dark active:scale-95"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </div>

                <div
                  ref={carouselRef}
                  className="no-scrollbar mobile-carousel-scroll flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth pb-4"
                >
                  {featuredProducts.map((product) => (
                    <motion.article
                      key={product.id}
                      className="group relative isolate flex w-63 shrink-0 snap-start flex-col overflow-hidden rounded-2xl border border-white/45 bg-white/35 shadow-[0_10px_26px_rgba(42,27,20,0.035)] backdrop-blur-[1px] [backface-visibility:hidden] [contain:layout_paint] [transform:translateZ(0)]"
                      whileHover={{ y: -4 }}
                      transition={{ type: "spring", stiffness: 320, damping: 24 }}
                    >
                      <div className="relative isolate h-44 overflow-hidden rounded-2xl bg-transparent [backface-visibility:hidden] [transform:translateZ(0)]">
                        {renderProductVisual(product)}
                        {product.badge && (
                          <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-brand-cacao shadow-sm">
                            {product.badge}
                          </span>
                        )}
                      </div>

                      <div className="flex min-h-29 flex-col justify-between gap-4 p-4">
                        <div>
                          <h3 className="line-clamp-2 text-sm font-black leading-snug text-brand-cacao">
                            {product.name}
                          </h3>
                          <p className="mt-1 text-sm font-bold text-brand-cacao/72">
                            ${product.price.toLocaleString("es-AR")}
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={() =>
                            addToCart({
                              id: product.id,
                              name: product.name,
                              price: product.price,
                              image: isPhotoImage(product.image) ? product.image : "/assets/donut_box_6.png",
                              category: product.category,
                              description: product.description,
                            })
                          }
                          className="ml-auto flex h-9 w-9 items-center justify-center rounded-full bg-brand-pink text-brand-cacao transition hover:bg-brand-pink-dark active:scale-95"
                          aria-label={`Agregar ${product.name} al carrito`}
                        >
                          <ShoppingBag className="h-4 w-4" />
                        </button>
                      </div>
                    </motion.article>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-brand-cacao px-5 py-14 text-brand-cream sm:px-8 md:px-12 lg:py-16">
            <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 lg:grid-cols-[0.28fr_0.72fr] lg:items-center">
              <div className="flex max-w-xs flex-col gap-3">
                <span className="text-xs font-black uppercase tracking-[0.22em] text-brand-pink-dark">
                  Explorá
                </span>
                <div>
                  <h2 className="font-serif text-4xl font-bold leading-none md:text-5xl">
                    Nuestros
                  </h2>
                  <p className="font-serif text-4xl font-bold italic leading-none text-brand-pink-dark md:text-5xl">
                    sabores
                  </p>
                </div>
                <p className="text-sm font-medium leading-relaxed text-brand-cream/72">
                  Clásicas, rellenas, premium y ediciones especiales.
                </p>
              </div>

              <div className="relative min-w-0">
                <div
                  ref={flavorsRef}
                  className="no-scrollbar mobile-carousel-scroll flex snap-x snap-mandatory gap-7 overflow-x-auto scroll-smooth pr-12"
                >
                  {flavorGroups.map((flavor) => (
                    <button
                      key={flavor.id}
                      type="button"
                      onClick={handleScrollToMenu}
                      className="group flex w-34 shrink-0 snap-start flex-col items-center gap-3 text-center"
                    >
                      <span className="relative flex h-28 w-28 items-center justify-center overflow-hidden rounded-full bg-white/10 shadow-[0_12px_30px_rgba(0,0,0,0.25)] ring-10 ring-white/6 transition group-hover:scale-105 group-hover:ring-brand-pink-dark/20">
                        {isPhotoImage(flavor.image) ? (
                          <Image
                            src={flavor.image}
                            alt=""
                            fill
                            className="object-cover"
                            sizes="112px"
                          />
                        ) : (
                          <span className="relative flex h-18 w-18 items-center justify-center rounded-full border-[18px] border-brand-pink-dark bg-transparent">
                            <span className="h-5 w-5 rounded-full bg-brand-cacao" />
                          </span>
                        )}
                      </span>
                      <span className="text-sm font-black text-brand-cream">
                        {flavor.name}
                      </span>
                    </button>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={scrollFlavors}
                  aria-label="Ver más sabores"
                  className="absolute right-0 top-10 flex h-12 w-12 items-center justify-center rounded-full bg-brand-pink-dark text-brand-cacao shadow-[0_14px_26px_rgba(0,0,0,0.24)] transition hover:bg-brand-pink active:scale-95"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
      </div>
    </section>
  );
};
