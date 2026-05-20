"use client";

import React, { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { Catalog } from "@/components/Catalog";
import { HowItWorks } from "@/components/HowItWorks";
import { BottomNavBar } from "@/components/BottomNavBar";
import { CartDrawer } from "@/components/CartDrawer";
import { CheckoutModal } from "@/components/CheckoutModal";
import { Footer } from "@/components/Footer";

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

interface MainShopProps {
  products: Product[];
}

export const MainShop: React.FC<MainShopProps> = ({ products }) => {
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col justify-between relative bg-brand-cream">
      {/* Global Header Bar */}
      <Navbar />

      {/* Main Content Sections */}
      <main className="flex-1">
        <Hero />
        {/* Pass dynamic products from PostgreSQL */}
        <Catalog products={products} />
        <HowItWorks />
      </main>

      {/* Global Footer Information */}
      <Footer />

      {/* Interactive Mobile Dock */}
      <BottomNavBar />

      {/* Cart Slider / Bottom Sheet Overlay */}
      <CartDrawer onCheckout={() => setIsCheckoutOpen(true)} />

      {/* Simulated Mercado Pago Checkout Flow Overlay */}
      <CheckoutModal isOpen={isCheckoutOpen} onClose={() => setIsCheckoutOpen(false)} />
    </div>
  );
};
