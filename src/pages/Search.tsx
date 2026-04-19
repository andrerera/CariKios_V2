import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Search as SearchIcon, MapPin, SlidersHorizontal, ArrowUpDown } from 'lucide-react';
import KioskCard from '@/components/KioskCard';
import { MOCK_KIOSKS } from '@/constants';
import { Kiosk } from '@/types';
import { motion } from 'motion/react';

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [results, setResults] = useState<Kiosk[]>(MOCK_KIOSKS);
  const [priceRange, setPriceRange] = useState([0, 5000000]);
  const [showFilters, setShowFilters] = useState(true);

  useEffect(() => {
    const q = searchParams.get('q')?.toLowerCase() || '';
    const filtered = MOCK_KIOSKS.filter(k => 
      k.title.toLowerCase().includes(q) || 
      k.address.toLowerCase().includes(q) ||
      k.description.toLowerCase().includes(q)
    ).filter(k => k.price >= priceRange[0] && k.price <= priceRange[1]);
    
    setResults(filtered);
  }, [searchParams, priceRange]);

  const handleSearchClick = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchParams({ q: query });
  };

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="flex flex-col md:flex-row gap-10">
        
        {/* Filters Sidebar */}
        <aside className={`${showFilters ? 'w-full md:w-64' : 'w-0'} transition-all duration-500 overflow-hidden shrink-0`}>
          <div className="sticky top-24 space-y-10">
            <section>
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">Filter Pencarian</h3>
              <div className="space-y-6">
                <div className="space-y-4">
                  <Label className="text-[13px] font-bold text-slate-700">Range Harga (Bulanan)</Label>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex flex-col gap-1.5">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Min</span>
                      <Input value="0" readOnly className="h-9 text-xs border-slate-200 bg-slate-50 text-center font-bold" />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Max</span>
                      <Input value={`${(priceRange[1]/1000000).toFixed(1)}jt`} readOnly className="h-9 text-xs border-slate-200 bg-slate-50 text-center font-bold" />
                    </div>
                  </div>
                  <div className="pt-2 px-1">
                    <Slider
                      defaultValue={[0, 5000000]}
                      max={10000000}
                      step={500000}
                      value={priceRange}
                      onValueChange={(val) => setPriceRange(val as number[])}
                      className="text-primary"
                    />
                  </div>
                </div>

                <div className="space-y-4 pt-4 border-t border-slate-100">
                  <Label className="text-[13px] font-bold text-slate-700">Fasilitas Utama</Label>
                  <div className="grid grid-cols-1 gap-2.5">
                    {['Wifi', 'Air Bersih', 'Listrik', 'CCTV', 'Security', 'Parkir'].map(f => (
                      <div key={f} className="flex items-center group cursor-pointer">
                        <Checkbox id={f} className="rounded-md border-slate-300 data-[state=checked]:bg-primary" />
                        <Label htmlFor={f} className="ml-3 text-[13px] font-medium text-slate-600 group-hover:text-primary transition-colors cursor-pointer">
                          {f}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-4 pt-4 border-t border-slate-100">
                  <Label className="text-[13px] font-bold text-slate-700">Lokasi Strategis</Label>
                  <div className="grid grid-cols-1 gap-3">
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <Checkbox checked className="rounded-md border-slate-300 data-[state=checked]:bg-primary" />
                      <span className="text-[13px] font-medium text-slate-600 group-hover:text-primary transition-colors">Dekat Kampus</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <Checkbox className="rounded-md border-slate-300 data-[state=checked]:bg-primary" />
                      <span className="text-[13px] font-medium text-slate-600 group-hover:text-primary transition-colors">Pusat Perkantoran</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <Checkbox checked className="rounded-md border-slate-300 data-[state=checked]:bg-primary" />
                      <span className="text-[13px] font-medium text-slate-600 group-hover:text-primary transition-colors">High Traffic Zone</span>
                    </label>
                  </div>
                </div>
              </div>
            </section>

            <div className="pt-6 border-t border-slate-100">
              <div className="bg-indigo-900 text-white p-5 rounded-2xl shadow-xl shadow-indigo-900/10">
                 <div className="flex items-center gap-2 mb-2">
                   <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse shadow-[0_0_8px_rgba(74,222,128,0.5)]"></div>
                   <p className="text-[10px] font-black opacity-60 uppercase tracking-widest">Smart Match Active</p>
                 </div>
                 <p className="text-xs leading-relaxed font-medium">Temukan kios yang paling sesuai dengan target pasar Anda menggunakan AI.</p>
                 <Button variant="secondary" size="sm" className="w-full mt-4 rounded-xl bg-white/10 hover:bg-white/20 border-none text-white font-bold h-9">
                    Fitur Premium
                 </Button>
              </div>
            </div>
          </div>
        </aside>

        {/* Results Area */}
        <main className="flex-grow">
          <div className="flex flex-col gap-8">
            
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-black text-slate-900 tracking-tight">Katalog Kios Sewa</h1>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Ditemukan {results.length} Listing Tersedia</p>
              </div>

              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="h-10 rounded-xl border-slate-200 flex items-center gap-2 px-4 font-bold text-slate-600">
                  <ArrowUpDown className="w-4 h-4" /> <span>Terbaru</span>
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="md:hidden h-10 rounded-xl"
                  onClick={() => setShowFilters(!showFilters)}
                >
                  <SlidersHorizontal className="w-4 h-4 mr-2" /> Filter
                </Button>
              </div>
            </div>

            {results.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-8">
                {results.map(k => (
                  <KioskCard key={k.id} kiosk={k} />
                ))}
              </div>
            ) : (
              <div className="text-center py-40 border-2 border-dashed border-slate-200 rounded-[2rem] bg-slate-50/50">
                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm border border-slate-100">
                  <SearchIcon className="w-8 h-8 text-slate-300" />
                </div>
                <h3 className="text-xl font-black text-slate-900 mb-2">Tidak ada kios ditemukan</h3>
                <p className="text-sm text-slate-500 max-w-xs mx-auto mb-8 font-medium">Kami tidak menemukan kios di area ini. Coba perluas jangkauan pencarian Anda.</p>
                <Button variant="secondary" className="rounded-xl font-bold px-8" onClick={() => { setQuery(''); setSearchParams({}); }}>
                  Hapus Semua Filter
                </Button>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
