import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { 
  MapPin, 
  TrendingUp, 
  Users, 
  School, 
  Building, 
  Wifi, 
  Shield, 
  Cctv, 
  ParkingCircle,
  MessageCircle,
  Calendar,
  Share2,
  Heart,
  ChevronLeft,
  ChevronRight,
  Info,
  BrainCircuit,
  Zap,
  Star
} from 'lucide-react';
import { Kiosk } from '@/types';
import { motion, AnimatePresence } from 'motion/react';
import { geminiService } from '@/lib/gemini';
import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';

export default function KioskDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [kiosk, setKiosk] = useState<Kiosk | null>(null);
  const [loading, setLoading] = useState(true);
  const [activePhoto, setActivePhoto] = useState(0);
  const [isAiAnalyzing, setIsAiAnalyzing] = useState(false);

  // Using mock data filter for now since Firestore might be empty
  useEffect(() => {
    // In real app, fetch from Firestore
    // For now, simulating fetch
    const fetchKiosk = async () => {
      setLoading(true);
      // Simulate network delay
      await new Promise(r => setTimeout(r, 1000));
      
      // Mock data search
      const mockResult = MOCK_KIOSKS.find(k => k.id === id);
      if (mockResult) {
        setKiosk(mockResult);
      }
      setLoading(false);
    };
    fetchKiosk();
  }, [id]);

  const runAnalysis = async () => {
    if (!kiosk) return;
    setIsAiAnalyzing(true);
    try {
      const result = await geminiService.analyzeStrategicLocation(kiosk.address);
      setKiosk({ ...kiosk, strategicData: result });
    } catch (error) {
      console.error("AI Analysis failed", error);
    } finally {
      setIsAiAnalyzing(false);
    }
  };

  if (loading) {
    return <div className="container mx-auto p-20 text-center">Loading...</div>;
  }

  if (!kiosk) {
    return <div className="container mx-auto p-20 text-center">Kiosk tidak ditemukan.</div>;
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Page Header Mini */}
      <div className="bg-white border-b border-slate-200 py-3">
        <div className="container mx-auto px-6">
          <Button variant="ghost" size="sm" className="rounded-lg text-slate-500 hover:text-primary transition-colors font-bold text-xs uppercase tracking-wider p-0 h-auto" onClick={() => navigate(-1)}>
            <ChevronLeft className="w-4 h-4 mr-1" /> Kembali ke Pencarian
          </Button>
        </div>
      </div>

      <div className="container mx-auto px-6 mt-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Main Content */}
          <div className="lg:col-span-8 space-y-10">
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
              <div className="relative aspect-video bg-slate-100 overflow-hidden">
                <img
                  src={kiosk.photos[activePhoto]}
                  className="w-full h-full object-cover transition-transform duration-700"
                  referrerPolicy="no-referrer"
                  alt={kiosk.title}
                />
                
                <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-black/60 to-transparent flex justify-between items-end">
                   <div className="flex gap-2">
                     <span className="bg-primary text-white text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-wider">Top Featured</span>
                     <span className="bg-green-500 text-white text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-wider">Verified</span>
                   </div>
                   <div className="flex gap-1.5 overflow-x-auto max-w-[200px]">
                      {kiosk.photos.map((_, i) => (
                        <button 
                          key={i} 
                          onClick={() => setActivePhoto(i)}
                          className={`w-2 h-2 rounded-full transition-all ${i === activePhoto ? 'bg-white w-4' : 'bg-white/40'}`}
                        />
                      ))}
                   </div>
                </div>
              </div>

              <div className="p-8">
                <div className="flex justify-between items-start gap-4 mb-3">
                  <div className="flex items-center gap-1.5">
                    <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    <span className="text-sm font-black text-slate-800">4.9</span>
                    <span className="text-xs text-slate-400 font-bold ml-1 uppercase">(24 Review)</span>
                  </div>
                  <div className="flex gap-2">
                    <button className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 hover:text-red-500 transition-colors border border-slate-100"><Heart className="w-4 h-4" /></button>
                    <button className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 hover:text-primary transition-colors border border-slate-100"><Share2 className="w-4 h-4" /></button>
                  </div>
                </div>

                <h1 className="text-3xl font-black text-slate-900 tracking-tight leading-[1.1] mb-2">{kiosk.title}</h1>
                <p className="flex items-center text-slate-500 text-[13px] font-semibold">
                  <MapPin className="w-4 h-4 mr-2 text-slate-400" /> {kiosk.address}
                </p>

                <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-10">
                   <div>
                     <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Informasi Kios</h3>
                     <p className="text-slate-600 text-sm leading-relaxed font-medium whitespace-pre-wrap">
                       {kiosk.description}
                     </p>
                   </div>
                   <div>
                     <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Fasilitas Tersedia</h3>
                     <div className="grid grid-cols-2 gap-3">
                        {kiosk.facilities.map(f => (
                          <div key={f} className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-100">
                             <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full"></div>
                             <span className="text-[11px] font-black text-slate-700 uppercase tracking-tight">{f}</span>
                          </div>
                        ))}
                     </div>
                   </div>
                </div>
              </div>
            </div>

            {/* Analysis Box */}
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
               <div className="p-8 border-b border-slate-100 flex items-center justify-between">
                  <div>
                    <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Analisis Strategis</h3>
                    <p className="text-lg font-black text-slate-900 tracking-tight">Kepadatan & Traffic Insights</p>
                  </div>
                  {!kiosk.strategicData && (
                    <Button 
                      onClick={runAnalysis} 
                      disabled={isAiAnalyzing}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl h-10 px-6 font-bold text-xs uppercase tracking-widest shadow-lg shadow-indigo-600/20"
                    >
                       {isAiAnalyzing ? 'Proses...' : 'Jalankan AI Analisis'}
                    </Button>
                  )}
               </div>

               <div className="p-8 bg-slate-50/50">
                  {kiosk.strategicData ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                       <div className="grid grid-cols-1 gap-4">
                          <div className="bg-white p-5 rounded-xl border border-slate-200">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Traffic Kendaraan</p>
                            <p className="text-xl font-black text-indigo-600">{kiosk.strategicData.traffic}</p>
                            <div className="w-full bg-slate-100 h-1.5 mt-3 rounded-full overflow-hidden">
                              <div className="bg-indigo-500 h-full w-[85%] rounded-full shadow-[0_0_8px_rgba(79,70,229,0.4)]"></div>
                            </div>
                          </div>
                          <div className="bg-white p-5 rounded-xl border border-slate-200">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Kepadatan Penduduk</p>
                            <p className="text-xl font-black text-orange-600">{kiosk.strategicData.density}</p>
                            <div className="w-full bg-slate-100 h-1.5 mt-3 rounded-full overflow-hidden">
                              <div className="bg-orange-500 h-full w-[95%] rounded-full shadow-[0_0_8px_rgba(249,115,22,0.4)]"></div>
                            </div>
                          </div>
                       </div>
                       <div>
                          <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Analisis AI</h4>
                          <p className="text-[13px] font-medium text-slate-600 italic leading-relaxed bg-white p-5 rounded-xl border border-slate-100 mb-6">
                            "{kiosk.strategicData.analysis}"
                          </p>
                          <div className="space-y-2">
                             {kiosk.strategicData.proximity.map((p, i) => (
                               <div key={i} className="flex items-center justify-between text-xs py-2 border-b border-slate-100 last:border-0 grow">
                                  <span className="text-slate-500 font-medium">{p.split(' - ')[0]}</span>
                                  <span className="font-black text-slate-900">{p.split(' - ')[1] || 'Dekat'}</span>
                               </div>
                             ))}
                          </div>
                       </div>
                    </div>
                  ) : (
                    <div className="text-center py-10 opacity-40">
                       <Zap className="w-10 h-10 mx-auto mb-4 text-slate-300" />
                       <p className="text-xs font-bold uppercase tracking-widest">Belum Ada Analisis</p>
                    </div>
                  )}
               </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4 lg:sticky lg:top-24 h-fit">
            <Card className="rounded-2xl border-slate-200 overflow-hidden shadow-2xl shadow-indigo-900/10 bg-white">
              <div className="p-8 border-b border-slate-100">
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Harga Sewa Bulanan</p>
                 <div className="flex items-baseline gap-1.5">
                   <span className="text-4xl font-black text-primary tracking-tighter">Rp {kiosk.price.toLocaleString('id-ID')}</span>
                   <span className="text-sm font-medium text-slate-400">/ bln</span>
                 </div>
              </div>
              <div className="p-8 space-y-4">
                 <Button className="w-full h-14 rounded-xl text-sm font-black uppercase tracking-widest bg-indigo-600 hover:bg-indigo-700 shadow-xl shadow-indigo-600/30">
                    Chat Pemilik
                 </Button>
                 <Button variant="outline" className="w-full h-12 rounded-xl text-sm font-bold border-slate-200 text-slate-600 hover:bg-slate-50">
                    Booking Jadwal Survey
                 </Button>
              </div>
              <div className="p-6 bg-slate-50 border-t border-slate-100 flex items-center gap-4">
                 <Avatar className="h-10 w-10 ring-2 ring-white p-0.5 shadow-sm">
                   <AvatarImage src={`https://i.pravatar.cc/150?u=${kiosk.ownerId}`} />
                   <AvatarFallback className="font-bold text-xs uppercase">OW</AvatarFallback>
                 </Avatar>
                 <div className="flex-grow">
                    <p className="text-xs font-black text-slate-900 uppercase">Pemilik Kios</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Verified Owner since 2023</p>
                 </div>
                 <ShieldCheck className="w-5 h-5 text-green-500" />
              </div>
            </Card>

            <div className="mt-6 p-6 bg-indigo-900 rounded-2xl text-white shadow-xl shadow-indigo-900/10">
               <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
                    <Shield className="w-4 h-4" />
                  </div>
                  <h4 className="text-xs font-black uppercase tracking-widest">CariKios Guarantee</h4>
               </div>
               <p className="text-[11px] leading-relaxed font-medium opacity-80">
                 Semua listing yang terpasang di platform kami telah melewati proses verifikasi identitas dan kepemilikan aset secara ketat.
               </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function getFacilityIcon(name: string) {
  const n = name.toLowerCase();
  if (n.includes('listrik')) return <Zap className="w-4 h-4 text-yellow-500" />;
  if (n.includes('wifi')) return <Wifi className="w-4 h-4 text-blue-500" />;
  if (n.includes('cctv')) return <Cctv className="w-4 h-4 text-red-500" />;
  if (n.includes('parkir')) return <ParkingCircle className="w-4 h-4 text-green-500" />;
  if (n.includes('keamanan')) return <Shield className="w-4 h-4 text-indigo-500" />;
  return <Building className="w-4 h-4 text-muted-foreground" />;
}

import { MOCK_KIOSKS } from '@/constants';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ShieldCheck } from 'lucide-react';
