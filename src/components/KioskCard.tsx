import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Star, TrendingUp, Users, School, Zap } from 'lucide-react';
import { Kiosk } from '@/types';
import { motion } from 'motion/react';

interface KioskCardProps {
  kiosk: Kiosk;
}

export default function KioskCard({ kiosk }: KioskCardProps) {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="h-full"
    >
      <Card className="overflow-hidden h-full flex flex-col group cursor-pointer border-slate-200 bg-white hover:border-primary/50 hover:shadow-lg hover:shadow-indigo-500/5 transition-all duration-300" onClick={() => navigate(`/kiosk/${kiosk.id}`)}>
        <div className="relative aspect-video overflow-hidden">
          <img 
            src={kiosk.photos[0] || 'https://picsum.photos/seed/kiosk/800/600'} 
            alt={kiosk.title} 
            referrerPolicy="no-referrer"
            className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-105" 
          />
          <div className="absolute top-3 left-3 flex gap-2">
            <span className={`text-[10px] font-bold px-2.5 py-1 rounded-sm uppercase tracking-wide shadow-sm ${
              kiosk.status === 'available' 
              ? 'bg-green-100 text-green-700 border border-green-200' 
              : 'bg-slate-100 text-slate-500 border border-slate-200'
            }`}>
              {kiosk.status === 'available' ? 'Tersedia' : 'Tersewa'}
            </span>
          </div>
          {kiosk.strategicData && (
            <div className="absolute bottom-3 right-3">
               <div className="bg-indigo-600 text-white p-1.5 rounded-lg shadow-lg">
                 <Zap className="w-4 h-4 fill-white" />
               </div>
            </div>
          )}
        </div>
        
        <div className="p-5 flex-grow flex flex-col">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-base font-bold text-slate-900 group-hover:text-primary transition-colors line-clamp-1 leading-tight">{kiosk.title}</h3>
            <div className="flex items-center gap-1 shrink-0 ml-2">
              <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
              <span className="text-xs font-bold text-slate-700">4.9</span>
            </div>
          </div>
          
          <div className="flex items-center text-slate-500 text-xs mb-4">
            <MapPin className="w-3.5 h-3.5 mr-1.5 shrink-0 text-slate-400" />
            <span className="truncate">{kiosk.address}</span>
          </div>

          <div className="mt-auto">
            <div className="flex items-baseline gap-1.5 mb-4">
              <span className="text-2xl font-black text-primary">Rp {kiosk.price.toLocaleString('id-ID')}</span>
              <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">/ bln</span>
            </div>
            
            <div className="flex flex-wrap gap-2 pt-4 border-t border-slate-100">
              {kiosk.facilities.slice(0, 2).map(f => (
                <div key={f} className="flex items-center gap-1.5 text-[10px] font-bold text-slate-600 uppercase tracking-tight">
                  <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full"></div>
                  {f}
                </div>
              ))}
              {kiosk.facilities.length > 2 && (
                <span className="text-[10px] font-bold text-slate-400">+{kiosk.facilities.length - 2}</span>
              )}
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
