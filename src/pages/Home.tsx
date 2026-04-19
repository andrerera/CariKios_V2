import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Search, MapPin, TrendingUp, ShieldCheck, Zap, ArrowRight, Loader2 } from 'lucide-react';
import KioskCard from '@/components/KioskCard';
import { Kiosk } from '@/types';
import { motion } from 'motion/react';
import { MOCK_KIOSKS } from '@/constants';

export default function Home() {
  const [search, setSearch] = useState('');
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null);
  const [nearKiosks, setNearKiosks] = useState<Kiosk[]>([]);
  const [locLoading, setLocLoading] = useState(false);
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/search?q=${search}`);
  };

  const getNearKiosks = () => {
    setLocLoading(true);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          setUserLocation({ lat, lng });
          
          // Sort MOCK_KIOSKS by distance (simplified Haversine or simple Euclidean for demo)
          const sorted = [...MOCK_KIOSKS].sort((a, b) => {
            const distA = Math.sqrt(Math.pow(a.location.lat - lat, 2) + Math.pow(a.location.lng - lng, 2));
            const distB = Math.sqrt(Math.pow(b.location.lat - lat, 2) + Math.pow(b.location.lng - lng, 2));
            return distA - distB;
          });
          
          setNearKiosks(sorted.slice(0, 3));
          setLocLoading(false);
        },
        (error) => {
          console.error("Error getting location:", error);
          setLocLoading(false);
          // Fallback to first 3
          setNearKiosks(MOCK_KIOSKS.slice(0, 3));
        }
      );
    } else {
      setLocLoading(false);
      setNearKiosks(MOCK_KIOSKS.slice(0, 3));
    }
  };

  useEffect(() => {
    getNearKiosks();
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      {/* Hero Section */}
      <section className="relative px-6 pt-16 pb-24 overflow-hidden">
        <div className="absolute inset-0 bg-white overflow-hidden">
           {/* High Density Pattern */}
           <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(#4f46e5 1px, transparent 1px), linear-gradient(90deg, #4f46e5 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
           <div className="absolute top-1/4 -right-20 w-96 h-96 bg-indigo-100/50 rounded-full blur-3xl"></div>
        </div>
        
        <div className="container mx-auto relative z-10">
          <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-slate-900 mb-8 border border-slate-800 shadow-xl">
                <span className="text-[9px] font-black text-indigo-400 uppercase tracking-[0.3em]">NEW GEN MARKETPLACE</span>
              </div>

              <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-slate-900 leading-[0.85] mb-8 uppercase italic">
                Cari Kios <span className="text-indigo-600">Strategis</span> Tanpa Ribet.
              </h1>
              
              <p className="text-base md:text-lg text-slate-500 font-bold max-w-2xl mx-auto mb-12 leading-tight uppercase tracking-tight opacity-70">
                Optimasi Bisnis Anda dengan Data Lokasi Akurat, Transparansi Harga, dan Analisis AI.
              </p>

              <form onSubmit={handleSearch} className="flex flex-col sm:flex-row items-stretch gap-2 p-2 bg-white border-2 border-slate-100 rounded-3xl shadow-2xl shadow-indigo-900/10 max-w-2xl mx-auto w-full group focus-within:border-indigo-600/20 transition-all">
                <div className="relative flex-grow flex items-center min-w-0">
                  <Search className="absolute left-4 w-5 h-5 text-slate-300 group-focus-within:text-indigo-600 transition-colors" />
                  <input 
                    placeholder="Masukan Area atau Landmark..." 
                    className="w-full pl-12 pr-4 h-12 bg-transparent outline-none text-slate-900 placeholder:text-slate-300 font-black uppercase text-xs tracking-widest"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
                <Button type="submit" size="lg" className="h-12 px-10 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black uppercase text-xs tracking-widest border-none">
                  SEARCH
                </Button>
              </form>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Near Location Section */}
      <section className="py-20 bg-white border-y border-slate-100">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
            <div className="max-w-xl">
              <div className="flex items-center gap-2 mb-3">
                <MapPin className="w-4 h-4 text-indigo-600" />
                <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">GPS Intelligence</span>
              </div>
              <h2 className="text-4xl font-black text-slate-900 tracking-tighter uppercase italic leading-none">Terdekat <span className="text-slate-300">Dari Anda</span></h2>
              <p className="text-slate-400 font-bold text-xs uppercase tracking-widest mt-4">Kios di radius terdekat berbasis lokasi GPS aktif Anda saat ini.</p>
            </div>
            <Button variant="ghost" onClick={getNearKiosks} className="h-12 rounded-xl px-6 font-black uppercase text-[10px] tracking-widest text-indigo-600 hover:bg-indigo-50 border-none" disabled={locLoading}>
              {locLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Zap className="w-4 h-4 mr-2" />}
              Refresh Lokasi
            </Button>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {nearKiosks.length > 0 ? (
              nearKiosks.map(kiosk => (
                <KioskCard key={kiosk.id} kiosk={kiosk} />
              ))
            ) : (
              [1, 2, 3].map(i => (
                 <div key={i} className="h-80 bg-slate-50 rounded-[2.5rem] animate-pulse"></div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <div className="bg-indigo-600 py-4 flex overflow-hidden whitespace-nowrap border-y border-indigo-500">
        <div className="flex animate-marquee gap-12 items-center">
            {[1, 2, 3, 4, 5].map(i => (
                <div key={i} className="flex items-center gap-10">
                    <span className="text-white font-black uppercase text-[10px] tracking-[0.4em] flex items-center gap-4">
                        <TrendingUp className="w-4 h-4 text-indigo-300" /> +24% Market Growth
                    </span>
                    <span className="text-white font-black uppercase text-[10px] tracking-[0.4em] flex items-center gap-4">
                        <ShieldCheck className="w-4 h-4 text-indigo-300" /> 100% Verifikasi Legal
                    </span>
                    <span className="text-white font-black uppercase text-[10px] tracking-[0.4em] flex items-center gap-4">
                        <Zap className="w-4 h-4 text-indigo-300" /> AI-Driven Analysis
                    </span>
                </div>
            ))}
        </div>
      </div>

      {/* Featured Kiosks */}
      <section className="py-24 bg-slate-50">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <div className="max-w-xl">
              <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest mb-3 block">High ROI Predictor</span>
              <h2 className="text-4xl font-black text-slate-900 tracking-tighter uppercase italic leading-none">Smart <span className="text-slate-300">Analysis</span> Match</h2>
              <p className="text-slate-400 font-bold text-xs uppercase tracking-widest mt-4">Kios pilihan AI dengan potensi ROI tertinggi berbasis traffic data.</p>
            </div>
            <Button asChild className="h-12 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-black uppercase text-[10px] tracking-widest px-8 shadow-2xl shadow-slate-900/20 border-none">
              <Link to="/search">Lihat Semua Kios <ArrowRight className="w-4 h-4 ml-2" /></Link>
            </Button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {MOCK_KIOSKS.slice(3, 6).map(kiosk => (
              <KioskCard key={kiosk.id} kiosk={kiosk} />
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-24 px-6 mb-20">
        <div className="container mx-auto max-w-6xl rounded-[3rem] bg-indigo-600 text-white p-12 relative overflow-hidden shadow-3xl shadow-indigo-600/30">
          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-12">
            <div className="max-w-2xl text-center lg:text-left">
              <h2 className="text-5xl md:text-6xl font-black uppercase italic tracking-tighter leading-none mb-6">Punya Kios <br/> <span className="text-indigo-200">Kosong?</span></h2>
              <p className="text-lg font-bold opacity-80 uppercase tracking-tight max-w-md">Pasang iklan di CariKios dan temukan tenant berkualitas dengan analisis target market instan.</p>
            </div>
            <div className="shrink-0">
               <Button size="lg" className="bg-white text-indigo-600 hover:bg-indigo-50 font-black uppercase text-xs tracking-[0.2em] px-12 h-16 rounded-[2rem] shadow-2xl border-none">
                 Mulai Pasang Iklan
               </Button>
            </div>
          </div>
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/10 rounded-full -mr-64 -mt-64 blur-3xl" />
          <div className="absolute -bottom-32 -left-32 w-[600px] h-[600px] bg-slate-900/20 rounded-full blur-3xl animate-pulse" />
        </div>
      </section>
    </div>
  );
}


