"use client";

import React, { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { FeaturedProductsCarousel } from "@/components/FeaturedProductsCarousel";
import { BoxesAndBuyingSections } from "@/components/BoxesAndBuyingSections";
import { Catalog } from "@/components/Catalog";
import { BottomNavBar } from "@/components/BottomNavBar";
import { CartDrawer } from "@/components/CartDrawer";
import { CheckoutModal } from "@/components/CheckoutModal";
import { Footer } from "@/components/Footer";
import type { BusinessInfo, ShopCategory, ShopProduct } from "@/lib/shopTypes";

interface MainShopProps {
  products: ShopProduct[];
  categories: ShopCategory[];
  businessInfo: BusinessInfo;
}

export const MainShop: React.FC<MainShopProps> = ({ products, categories, businessInfo }) => {
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col justify-between relative bg-brand-cream">
      {/* Global Header Bar */}
      <Navbar businessInfo={businessInfo} />

      {/* Main Content Sections */}
      <main className="flex-1">
        <Hero />
        <FeaturedProductsCarousel products={products} categories={categories} />
        <BoxesAndBuyingSections businessInfo={businessInfo} />
        {/* Pass dynamic products from PostgreSQL */}
        <Catalog products={products} categories={categories} />
      </main>

      {/* Global Footer Information */}
      <Footer businessInfo={businessInfo} />

      {/* Interactive Mobile Dock */}
      <BottomNavBar businessInfo={businessInfo} />

      {/* Cart Slider / Bottom Sheet Overlay */}
      <CartDrawer onCheckout={() => setIsCheckoutOpen(true)} />

      {/* Simulated Mercado Pago Checkout Flow Overlay */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        businessInfo={businessInfo}
      />
    </div>
  );
};
