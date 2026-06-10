"use client";

import Image from "next/image";
import { Clock, Heart, MapPin, Phone } from "lucide-react";
import type { BusinessInfo } from "@/lib/shopTypes";

const InstagramIcon = (props: React.SVGProps<SVGSVGElement>) => (
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

const footerImages = [
  "/assets/donut_box_12.png",
  "/assets/donut_box_6.png",
  "/assets/donut_combo.png",
  "/assets/hero_donuts.png",
  "/assets/DonnaChocolate.png",
  "/assets/FondoDonnasMenu.jpg",
];

const navLinks = [
  { label: "Inicio", href: "#" },
  { label: "Sabores", href: "#menu" },
  { label: "Cajas", href: "#menu" },
  { label: "Contacto", href: "#contacto" },
];

interface FooterProps {
  businessInfo: BusinessInfo;
}

export const Footer: React.FC<FooterProps> = ({ businessInfo }) => {
  const cityLine = `${businessInfo.city}, ${businessInfo.country}`;

  return (
    <footer id="contacto" className="bg-brand-cacao px-3 pb-28 text-brand-cream md:pb-8">
      <div className="mx-auto max-w-7xl overflow-hidden bg-brand-cacao px-6 py-12 shadow-[0_-14px_40px_rgba(42,27,20,0.16)] sm:px-10 lg:px-14">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-[1.25fr_0.8fr_1.15fr_1.1fr]">
          <div className="flex max-w-xs flex-col gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-pink text-brand-cacao shadow-[0_10px_24px_rgba(228,164,147,0.25)]">
              <Heart className="h-7 w-7 fill-brand-cacao" />
            </div>
            <span className="font-serif text-2xl font-bold tracking-tight text-brand-cream">
              CENTRAL
              <span className="text-brand-pink-dark font-sans font-light">.</span>
              <span className="ml-2 font-sans text-xs font-normal tracking-[0.25em] text-brand-hazelnut">
                DONUTS
              </span>
            </span>
            <p className="text-sm font-medium leading-relaxed text-brand-cream/62">
              {businessInfo.description}
            </p>
          </div>

          <nav className="flex flex-col gap-4">
            <h3 className="text-xs font-black uppercase tracking-[0.18em] text-brand-pink">
              Navegación
            </h3>
            <div className="flex flex-col gap-2.5 text-sm font-bold text-brand-cream/68">
              {navLinks.map((link) => (
                <a key={link.label} href={link.href} className="transition hover:text-brand-pink-dark">
                  {link.label}
                </a>
              ))}
            </div>
          </nav>

          <div className="flex flex-col gap-4">
            <h3 className="text-xs font-black uppercase tracking-[0.18em] text-brand-pink">
              Pedí ahora
            </h3>
            <div className="flex flex-col gap-3 text-sm font-bold text-brand-cream/70">
              <a
                href={`https://wa.me/${businessInfo.whatsappNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 transition hover:text-brand-pink-dark"
              >
                <Phone className="h-4 w-4 text-brand-pink-dark" />
                {businessInfo.phone}
              </a>
              <a
                href={businessInfo.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 transition hover:text-brand-pink-dark"
              >
                <InstagramIcon className="h-4 w-4 text-brand-pink-dark" />
                {businessInfo.instagramHandle}
              </a>
              <div className="mt-2 flex items-start gap-3">
                <Clock className="mt-0.5 h-4 w-4 text-brand-pink-dark" />
                <div>
                  <p className="text-brand-cream">{businessInfo.openingDays}</p>
                  <p className="text-xs font-semibold text-brand-cream/55">{businessInfo.openingHours}</p>
                  {businessInfo.closedNotice && (
                    <p className="mt-1 text-xs font-semibold text-brand-cream/45">
                      {businessInfo.closedNotice}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-4 w-4 text-brand-pink-dark" />
                <div>
                  <p className="text-brand-cream">{businessInfo.addressLine}</p>
                  <p className="text-xs font-semibold text-brand-cream/55">{cityLine}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <h3 className="text-xs font-black uppercase tracking-[0.18em] text-brand-pink">
              Seguinos
            </h3>
            <div className="grid max-w-58 grid-cols-3 gap-2.5">
              {footerImages.map((src) => (
                <a
                  key={src}
                  href={businessInfo.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="relative aspect-square overflow-hidden rounded-lg bg-brand-chocolate shadow-sm transition hover:scale-105"
                  aria-label="Ver Instagram de Central Donuts"
                >
                  <Image
                    src={src}
                    alt=""
                    fill
                    className="object-cover"
                    sizes="80px"
                  />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-4 border-t border-brand-cream/10 pt-6 text-xs font-semibold text-brand-cream/45 md:flex-row md:items-center">
          <p>© {new Date().getFullYear()} Central Donuts. Todos los derechos reservados.</p>
          <p className="flex items-center gap-1.5">
            Hecho con <Heart className="h-3 w-3 fill-brand-pink-dark text-brand-pink-dark" /> para amantes del glaseado.
          </p>
        </div>
      </div>
    </footer>
  );
};
