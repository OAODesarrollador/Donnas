import type { Metadata, Viewport } from "next";
import { Outfit, Playfair_Display } from "next/font/google";
import { CartProvider } from "@/context/CartContext";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Central Donuts | Tienda Online Premium",
  description: "Pedí tus donuts artesanales y gourmet favoritas de Central Donuts. Proceso rápido, simple y premium pensado para Instagram. Retiro en Palermo o envío a domicilio.",
  keywords: ["donuts", "donas", "gourmet", "central donuts", "buenos aires", "palermo", "tienda online", "mercado pago"],
  authors: [{ name: "Central Donuts" }],
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${outfit.variable} ${playfair.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-brand-cream text-brand-cacao select-none">
        <CartProvider>
          {children}
        </CartProvider>
      </body>
    </html>
  );
}
