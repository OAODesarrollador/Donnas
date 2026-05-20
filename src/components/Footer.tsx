"use client";

import { Phone, MapPin, Clock, Heart } from "lucide-react";

const Instagram = (props: React.SVGProps<SVGSVGElement>) => (
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

export const Footer: React.FC = () => {
  return (
    <footer id="contacto" className="bg-brand-cacao text-brand-cream pt-16 pb-28 md:pb-16 px-6 md:px-12 border-t border-brand-cacao/10">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
        
        {/* Brand Information */}
        <div className="flex flex-col gap-4">
          <span className="font-serif text-2xl font-bold tracking-tight text-brand-cream">
            CENTRAL
            <span className="text-brand-pink font-sans font-light">.</span>
            <span className="font-sans font-normal text-xs tracking-[0.25em] text-brand-pink ml-2">DONUTS</span>
          </span>
          <p className="text-sm text-brand-cream/60 leading-relaxed max-w-sm">
            Elaboramos donuts gourmet de forma 100% artesanal, utilizando materia prima premium para garantizar una explosión de sabor en cada mordisco.
          </p>
          
          {/* Social Links */}
          <div className="flex items-center gap-4 mt-2">
            <a
              href="https://www.instagram.com/centraldonuts00/"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 bg-brand-chocolate hover:bg-brand-pink hover:text-brand-cacao rounded-xl transition-all duration-300 shadow-sm"
              aria-label="Instagram"
            >
              <Instagram className="w-5 h-5" />
            </a>
            <a
              href="https://wa.me/5491123456789"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 bg-brand-chocolate hover:bg-brand-pink hover:text-brand-cacao rounded-xl transition-all duration-300 shadow-sm"
              aria-label="WhatsApp"
            >
              <Phone className="w-5 h-5" />
            </a>
          </div>
        </div>

        {/* Operating Hours */}
        <div className="flex flex-col gap-4">
          <h3 className="text-sm font-semibold tracking-[0.2em] text-brand-pink uppercase">Horarios</h3>
          <div className="flex flex-col gap-3 text-sm text-brand-cream/70">
            <div className="flex items-start gap-3">
              <Clock className="w-4 h-4 text-brand-pink mt-0.5" />
              <div>
                <p className="font-semibold text-brand-cream">Martes a Domingos</p>
                <p className="text-xs text-brand-cream/50 mt-0.5">14:00 a 20:00 hs</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Clock className="w-4 h-4 text-brand-cream/30 mt-0.5" />
              <div>
                <p className="font-medium">Lunes</p>
                <p className="text-xs text-brand-cream/40 mt-0.5">Cerrado (descanso del pastelero)</p>
              </div>
            </div>
          </div>
        </div>

        {/* Location / Shop Address */}
        <div className="flex flex-col gap-4">
          <h3 className="text-sm font-semibold tracking-[0.2em] text-brand-pink uppercase">Ubicación</h3>
          <div className="flex flex-col gap-3 text-sm text-brand-cream/70">
            <div className="flex items-start gap-3">
              <MapPin className="w-4.5 h-4.5 text-brand-pink mt-0.5" />
              <div>
                <p className="font-semibold text-brand-cream">Palermo, CABA</p>
                <p className="text-xs text-brand-cream/50 mt-0.5">Buenos Aires, Argentina</p>
                <a
                  href="https://maps.google.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block text-xs font-semibold text-brand-pink hover:text-brand-pink-dark hover:underline mt-2 transition-all"
                >
                  Ver en Google Maps →
                </a>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Copyright Footer */}
      <div className="max-w-7xl mx-auto border-t border-brand-cream/10 mt-12 pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-brand-cream/40">
        <p>© {new Date().getFullYear()} Central Donuts. Todos los derechos reservados.</p>
        <p className="flex items-center gap-1.5">
          Hecho con <Heart className="w-3 h-3 text-brand-pink fill-brand-pink" /> para amantes del glaseado.
        </p>
      </div>
    </footer>
  );
};
