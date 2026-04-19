import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Search, MapPin, TrendingUp, ShieldCheck, Zap, ArrowRight, Star } from 'lucide-react';
import KioskCard from '@/components/KioskCard';
import { Kiosk } from '@/types';
import { motion } from 'motion/react';
import { MOCK_KIOSKS } from '@/constants';


export default function Home() {
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/search?q=${search}`);
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative px-6 pt-16 pb-24 overflow-hidden border-b border-slate-100">
        <div className="absolute inset-0 bg-slate-50 overflow-hidden">
           {/* Subtle background pattern */}
           <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#4f46e5 1.5px, transparent 1.5px)', backgroundSize: '30px 30px' }}></div>
           <div className="absolute top-1/4 -right-20 w-96 h-96 bg-indigo-200/30 rounded-full blur-3xl animate-pulse"></div>
           <div className="absolute -bottom-20 -left-20 w-[600px] h-[600px] bg-slate-200/40 rounded-full blur-[100px]"></div>
        </div>
        
        <div className="container mx-auto relative z-10">
          <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-slate-200 shadow-sm mb-10 group hover:border-primary/30 transition-colors">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Marketplace Kios No. 1</span>
                <ArrowRight className="w-3 h-3 text-slate-300 group-hover:text-primary transition-colors" />
              </div>

              <h1 className="text-5xl md:text-7xl font-black tracking-tight text-slate-900 leading-[0.95] mb-8">
                Tumbuh Lebih Cepat di <span className="text-primary italic">Lokasi Terbaik.</span>
              </h1>
              
              <p className="text-lg md:text-xl text-slate-500 font-medium max-w-2xl mx-auto mb-12 leading-relaxed">
                Platform marketplace sewa kios terpercaya dengan analisis lokasi strategis berbasis AI untuk optimasi bisnis Anda.
              </p>

              <form onSubmit={handleSearch} className="flex flex-col sm:flex-row items-stretch gap-3 p-3 bg-white border border-slate-200 rounded-[2rem] shadow-2xl shadow-indigo-900/10 max-w-2xl mx-auto w-full group focus-within:border-primary/40 transition-all">
                <div className="relative flex-grow flex items-center min-w-0">
                  <Search className="absolute left-4 w-5 h-5 text-slate-400 group-focus-within:text-primary transition-colors" />
                  <input 
                    placeholder="Masukan lokasi atau area strategis..." 
                    className="w-full pl-12 pr-4 h-12 bg-transparent outline-none text-slate-900 placeholder:text-slate-400 font-bold"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
                <Button type="submit" size="lg" className="h-12 px-10 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black uppercase text-xs tracking-widest shadow-xl shadow-indigo-600/30 shrink-0">
                  Cari Kios
                </Button>
              </form>

              <div className="mt-12 flex flex-wrap justify-center items-center gap-x-8 gap-y-4">
                 <div className="flex items-center gap-2.5">
                   <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center">
                     <TrendingUp className="w-4 h-4 text-primary" />
                   </div>
                   <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Traffic Heatmap</span>
                 </div>
                 <div className="flex items-center gap-2.5">
                   <div className="w-8 h-8 rounded-full bg-green-50 flex items-center justify-center">
                     <ShieldCheck className="w-4 h-4 text-green-600" />
                   </div>
                   <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Verified Listings</span>
                 </div>
                 <div className="flex items-center gap-2.5">
                   <div className="w-8 h-8 rounded-full bg-orange-50 flex items-center justify-center">
                     <Zap className="w-4 h-4 text-orange-600" />
                   </div>
                   <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">AI Matching</span>
                 </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Mini Section */}
      <section className="bg-slate-900 py-6">
        <div className="container mx-auto px-6">
          <div className="flex flex-wrap justify-center gap-x-16 gap-y-6 text-white uppercase text-[10px] font-black tracking-[0.2em] opacity-80">
            <div className="flex items-center gap-3">
              <span className="text-lg font-black text-indigo-400">12K+</span> Listing Aktif
            </div>
            <div className="flex items-center gap-3">
              <span className="text-lg font-black text-indigo-400">95%</span> Akurasi Lokasi
            </div>
            <div className="flex items-center gap-3">
              <span className="text-lg font-black text-indigo-400">2.4jt</span> Pengunjung Bulanan
            </div>
          </div>
        </div>
      </section>

      {/* Featured Kiosks */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <div className="max-w-xl">
              <span className="text-[10px] font-black text-primary uppercase tracking-widest mb-3 block">High Traffic Zone</span>
              <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight leading-tight">Rekomendasi <span className="text-slate-400 italic font-medium">Smart Match</span> Hari Ini</h2>
              <p className="text-slate-500 font-medium mt-4">Kios pilihan AI dengan potensi ROI tertinggi berdasarkan kepadatan penduduk dan aktivitas komersial.</p>
            </div>
            <Button variant="outline" asChild className="h-12 rounded-xl px-6 border-slate-200 font-bold hover:bg-slate-50 transition-colors">
              <Link to="/search">Eksplor Peta <ArrowRight className="w-4 h-4 ml-2" /></Link>
            </Button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {MOCK_KIOSKS.map(kiosk => (
              <KioskCard key={kiosk.id} kiosk={kiosk} />
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-5xl rounded-3xl bg-primary text-primary-foreground p-12 relative overflow-hidden">
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="max-w-xl text-center md:text-left">
              <h2 className="text-4xl font-bold mb-4">Punya Kios Kosong?</h2>
              <p className="text-lg opacity-90">Pasang iklan gratis di CariKios dan temukan tenant berkualitas untuk bisnis Anda.</p>
            </div>
            <Button size="lg" variant="secondary" className="font-bold px-10 h-14 rounded-2xl shadow-xl">
              Pasang Iklan Sekarang
            </Button>
          </div>
          {/* Decorative circles */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full -ml-32 -mb-32 blur-3xl" />
        </div>
      </section>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <Card className="border-none shadow-none bg-transparent hover:bg-white transition-colors duration-300 p-6">
      <CardHeader className="p-0 mb-4">{icon}</CardHeader>
      <CardTitle className="text-xl mb-2">{title}</CardTitle>
      <p className="text-muted-foreground leading-relaxed">{description}</p>
    </Card>
  );
}


