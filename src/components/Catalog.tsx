"use client";

import React, { useState } from "react";
import { useCart } from "@/context/CartContext";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, Star, Coffee, Sparkles } from "lucide-react";
import Image from "next/image";

interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  image: string;
  category: string;
  badge?: string | null;
  isPopular?: boolean;
}

interface CatalogProps {
  products: Product[];
}

export const Catalog: React.FC<CatalogProps> = ({ products }) => {
  const { addToCart } = useCart();
  const [activeCategory, setActiveCategory] = useState<string>("todos");

  const categories = [
    { id: "todos", name: "Todos" },
    { id: "combos", name: "Combos" },
    { id: "cajas", name: "Cajas" },
    { id: "donuts", name: "Donuts" },
    { id: "bebidas", name: "Bebidas" },
  ];

  const filteredProducts = activeCategory === "todos"
    ? products
    : products.filter((p) => p.category === activeCategory);

  // Renders a modern CSS glassmorphic aesthetic gradient card for non-photo items
  const renderCardVisual = (product: Product) => {
    if (product.image.startsWith("/assets")) {
      return (
        <div className="relative w-full h-full">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
            sizes="(max-w-7xl) 100vw, 300px"
          />
        </div>
      );
    }

    // Modern glass-art gradient styles for individual products
    const gradients: Record<string, string> = {
      "grad-chocolate": "from-[#5D4037] via-[#4E342E] to-[#3E2723] text-amber-200",
      "grad-caramel": "from-[#E65100] via-[#F57C00] to-[#FF9800] text-amber-100",
      "grad-pistachio": "from-[#7CB342] via-[#689F38] to-[#558B2F] text-yellow-100",
      "grad-berry": "from-[#C2185B] via-[#AD1457] to-[#880E4F] text-pink-100",
      "grad-coffee-1": "from-[#3E2723] via-[#4E342E] to-[#D7CCC8] text-[#8B5E3C]",
      "grad-coffee-2": "from-[#EFEBE9] via-[#D7CCC8] to-[#BCAAA4] text-brand-cacao",
    };

    const isCoffee = product.category === "bebidas";

    return (
      <div className={`w-full h-full bg-gradient-to-tr ${gradients[product.image] || "from-brand-beige to-brand-pink"} flex flex-col items-center justify-center p-6 relative overflow-hidden group-hover:opacity-95 transition-opacity`}>
        <div className="absolute inset-0 bg-white/5 backdrop-blur-[1px] pointer-events-none" />
        {/* Abstract design elements */}
        <div className="absolute w-24 h-24 rounded-full border border-white/10 -top-8 -right-8 animate-pulse" />
        <div className="absolute w-32 h-32 rounded-full border border-white/5 -bottom-12 -left-12" />
        
        {isCoffee ? (
          <Coffee className="w-16 h-16 opacity-85 scale-90 group-hover:scale-100 transition-transform duration-500" />
        ) : (
          <div className="relative flex items-center justify-center">
            {/* Donut design circle */}
            <div className="w-20 h-20 rounded-full border-[20px] border-current opacity-80 scale-90 group-hover:scale-100 transition-transform duration-500 flex items-center justify-center">
              <div className="w-4 h-4 rounded-full bg-[#FAF6F0]" />
            </div>
            <Sparkles className="w-6 h-6 absolute -top-2 -right-2 animate-[spin_10s_infinite_linear] opacity-75 text-brand-pink" />
          </div>
        )}
        <span className="font-serif text-2xl font-bold mt-4 tracking-wide opacity-20 select-none uppercase">🍩 CD</span>
      </div>
    );
  };

  return (
    <section id="menu" className="py-20 px-6 md:px-12 bg-[#FAF6F0]/50 border-t border-brand-cacao/5">
      <div className="max-w-7xl mx-auto flex flex-col gap-12">
        
        {/* Section Heading */}
        <div className="flex flex-col items-center text-center gap-4">
          <h2 className="font-serif text-3xl md:text-5xl font-bold tracking-tight text-brand-cacao">
            Explorá el Menú
          </h2>
          <p className="text-sm md:text-base text-brand-cacao/60 font-medium max-w-md">
            Seleccioná tus sabores preferidos y armá tu pedido en un instante. Cada bocado está elaborado con amor.
          </p>
        </div>

        {/* Categories Tabs Selector */}
        <div className="flex items-center justify-start md:justify-center overflow-x-auto no-scrollbar gap-2.5 pb-2">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-5 py-2.5 rounded-full text-sm font-semibold tracking-wide transition-all duration-300 whitespace-nowrap active:scale-95 cursor-pointer select-none ${
                activeCategory === cat.id
                  ? "bg-brand-cacao text-brand-cream shadow-[0_6px_16px_rgba(42,27,20,0.12)]"
                  : "bg-white text-brand-cacao/75 hover:bg-brand-beige/25 border border-brand-cacao/5"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Product Cards Grid */}
        <motion.div 
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-4"
        >
          <AnimatePresence mode="popLayout">
            {filteredProducts.map((product) => (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.45 }}
                key={product.id}
                className="group bg-white rounded-3xl overflow-hidden border border-brand-cacao/5 hover:border-brand-cacao/10 shadow-[0_8px_30px_rgb(42,27,20,0.03)] hover:shadow-[0_12px_40px_rgba(42,27,20,0.07)] flex flex-col justify-between transition-all duration-500"
              >
                {/* Visual Area (Photo or Glass Graphic) */}
                <div className="w-full aspect-[4/3] relative overflow-hidden bg-brand-cream/50">
                  {renderCardVisual(product)}
                  
                  {/* Badge Label */}
                  {product.badge && (
                    <span className="absolute top-4 left-4 bg-brand-cacao/90 backdrop-blur-sm text-brand-cream text-[10px] font-bold tracking-widest px-3 py-1.5 rounded-xl uppercase">
                      {product.badge}
                    </span>
                  )}

                  {/* Popular Star */}
                  {product.isPopular && (
                    <div className="absolute top-4 right-4 bg-brand-pink text-brand-cacao p-2 rounded-xl shadow-md border border-white/20">
                      <Star className="w-4 h-4 fill-brand-cacao text-brand-cacao animate-pulse" />
                    </div>
                  )}
                </div>

                {/* Content Info Area */}
                <div className="p-6 md:p-7 flex flex-col flex-1 gap-4 justify-between">
                  <div className="flex flex-col gap-2">
                    <h3 className="font-serif text-xl font-bold text-brand-cacao tracking-tight group-hover:text-brand-hazelnut transition-colors">
                      {product.name}
                    </h3>
                    <p className="text-xs md:text-sm text-brand-cacao/65 leading-relaxed font-medium">
                      {product.description}
                    </p>
                  </div>

                  {/* Bottom Price & Add Action Button */}
                  <div className="flex items-center justify-between pt-2 border-t border-brand-cacao/5 mt-auto">
                    <div className="flex flex-col">
                      <span className="text-[10px] text-brand-cacao/45 font-bold uppercase tracking-widest">Precio</span>
                      <span className="font-sans text-xl font-black text-brand-cacao">${product.price.toLocaleString("es-AR")}</span>
                    </div>

                    <motion.button
                      onClick={() => addToCart({
                        id: product.id,
                        name: product.name,
                        price: product.price,
                        image: product.image.startsWith("/assets") ? product.image : "/assets/donut_box_6.png", // fallback image in cart
                        category: product.category,
                        description: product.description
                      })}
                      className="bg-brand-pink hover:bg-brand-pink-dark text-brand-cacao p-3 rounded-2xl flex items-center justify-center shadow-md shadow-brand-pink/20 hover:shadow-brand-pink/40 border border-brand-pink-dark/5 transition-all cursor-pointer select-none active:scale-95"
                      whileHover={{ scale: 1.07, rotate: 5 }}
                      whileTap={{ scale: 0.92, rotate: -5 }}
                    >
                      <ShoppingBag className="w-5 h-5 text-brand-cacao" />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

      </div>
    </section>
  );
};
