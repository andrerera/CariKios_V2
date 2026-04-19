import React from 'react';
import { Home, Mail, Phone, Instagram, Facebook, Twitter, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-muted/50 border-t pt-20 pb-10">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
          <div className="space-y-6">
            <Link to="/" className="flex items-center gap-2">
              <div className="bg-primary text-primary-foreground p-1.5 rounded-lg">
                <Home className="w-5 h-5" />
              </div>
              <span className="font-bold text-2xl tracking-tight italic">CariKios</span>
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Platform marketplace sewa kios nomor satu di Indonesia. Kami menggunakan teknologi AI untuk membantu pengusaha menemukan lokasi bisnis paling strategis.
            </p>
            <div className="flex gap-4">
              <SocialLink icon={<Instagram className="w-5 h-5" />} />
              <SocialLink icon={<Facebook className="w-5 h-5" />} />
              <SocialLink icon={<Twitter className="w-5 h-5" />} />
            </div>
          </div>
          
          <div>
            <h4 className="font-bold text-lg mb-6">Pencarian Populer</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><Link to="/search?q=Jakarta" className="hover:text-primary transition-colors">Kios Sewa Jakarta</Link></li>
              <li><Link to="/search?q=Surabaya" className="hover:text-primary transition-colors">Kios Sewa Surabaya</Link></li>
              <li><Link to="/search?q=Bandung" className="hover:text-primary transition-colors">Kios Sewa Bandung</Link></li>
              <li><Link to="/search?q=Bali" className="hover:text-primary transition-colors">Kios Sewa Bali</Link></li>
              <li><Link to="/search?q=Medan" className="hover:text-primary transition-colors">Kios Sewa Medan</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold text-lg mb-6">Tautan Penting</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><Link to="/about" className="hover:text-primary transition-colors">Tentang Kami</Link></li>
              <li><Link to="/faq" className="hover:text-primary transition-colors">Pusat Bantuan</Link></li>
              <li><Link to="/terms" className="hover:text-primary transition-colors">Syarat & Ketentuan</Link></li>
              <li><Link to="/privacy" className="hover:text-primary transition-colors">Kebijakan Privasi</Link></li>
              <li><Link to="/contact" className="hover:text-primary transition-colors">Hubungi Kami</Link></li>
            </ul>
          </div>
          
          <div className="space-y-6">
            <h4 className="font-bold text-lg mb-6">Kantor Kami</h4>
            <div className="flex items-start gap-3 text-sm text-muted-foreground">
              <MapPin className="w-5 h-5 shrink-0 text-primary" />
              <span>Gedung CariKios Tech, Sudirman Central Business District (SCBD), Jakarta Selatan 12190</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <Phone className="w-5 h-5 shrink-0 text-primary" />
              <span>+62 (21) 1234-5678</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <Mail className="w-5 h-5 shrink-0 text-primary" />
              <span>halo@carikios.com</span>
            </div>
          </div>
        </div>
        
        <div className="pt-10 border-t text-center text-sm text-muted-foreground">
           <p>© 2026 CariKios Indonesia. Hak Cipta Dilindungi Undang-Undang.</p>
        </div>
      </div>
    </footer>
  );
}

function SocialLink({ icon }: { icon: React.ReactNode }) {
  return (
    <a href="#" className="w-10 h-10 rounded-full border flex items-center justify-center hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-300">
      {icon}
    </a>
  );
}
