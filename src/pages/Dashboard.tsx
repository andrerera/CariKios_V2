import React, { useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/lib/firebase';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  User, 
  Store, 
  Calendar, 
  Heart, 
  MessageSquare, 
  Settings,
  PlusCircle,
  Clock,
  CheckCircle2,
  XCircle,
  MapPin
} from 'lucide-react';
import { MOCK_KIOSKS } from '@/constants';
import KioskCard from '@/components/KioskCard';
import { useNavigate, Link } from 'react-router-dom';

export default function Dashboard() {
  const [user] = useAuthState(auth);
  const [view, setView] = useState('bookings');
  const navigate = useNavigate();

  return (
    <div className="container mx-auto px-6 py-10 min-h-screen">
      <div className="flex flex-col md:flex-row gap-10">
        
        {/* Profile Sidebar */}
        <aside className="w-full md:w-80 shrink-0">
          <Card className="rounded-2xl shadow-sm border-slate-200 bg-white overflow-hidden">
            <div className="bg-slate-50 p-8 text-center border-b border-slate-100">
              <div className="relative inline-block mb-6">
                <div className="w-24 h-24 rounded-full overflow-hidden ring-4 ring-white shadow-xl mx-auto">
                    <img src={user?.photoURL || `https://i.pravatar.cc/150?u=${user?.uid}`} alt="Profile" />
                </div>
              </div>
              <h3 className="text-xl font-black text-slate-900 mb-1">{user?.displayName || 'User Member'}</h3>
              <p className="text-[10px] text-slate-400 uppercase tracking-[0.2em] font-black">Verified Tenant</p>
            </div>
            <CardContent className="p-8">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 flex flex-col items-center">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Booked</span>
                    <span className="text-xl font-black text-indigo-600">4</span>
                </div>
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 flex flex-col items-center">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Favs</span>
                    <span className="text-xl font-black text-indigo-600">12</span>
                </div>
              </div>

              <div className="mt-8 space-y-2">
                 <Button variant="outline" className="w-full rounded-xl border-slate-200 h-11 flex items-center gap-2 justify-start px-4 font-bold text-slate-600 text-xs">
                    <User className="w-4 h-4 text-slate-400" /> Edit Profile
                 </Button>
                 <Button variant="outline" className="w-full rounded-xl border-slate-200 h-11 flex items-center gap-2 justify-start px-4 font-bold text-slate-600 text-xs">
                    <Settings className="w-4 h-4 text-slate-400" /> Pengaturan
                 </Button>
              </div>
            </CardContent>
          </Card>
          
          <div className="mt-8 p-8 rounded-2xl bg-indigo-900 text-white shadow-xl shadow-indigo-900/10">
             <h4 className="text-xs font-black uppercase tracking-widest mb-2">Jadi Owner Kiosk?</h4>
             <p className="text-[11px] font-medium opacity-70 mb-6 leading-relaxed">Kelola properti Anda dengan insight AI dan jangkau jutaan calon tenant strategis.</p>
             <Button variant="secondary" className="w-full rounded-xl h-11 font-black uppercase text-[10px] tracking-widest bg-white/10 hover:bg-white/20 border-none text-white transition-all" asChild>
                <Link to="/owner/create">Buka Lapak</Link>
             </Button>
          </div>
        </aside>

        {/* Main Dashboard Area */}
        <main className="flex-grow">
          <Tabs defaultValue="bookings" className="w-full" onValueChange={setView}>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
                <TabsList className="bg-slate-100 p-1.5 rounded-xl h-auto shrink-0">
                    <TabsTrigger value="bookings" className="rounded-lg py-2.5 px-6 font-bold text-xs uppercase tracking-widest data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm">
                        Rentals
                    </TabsTrigger>
                    <TabsTrigger value="kiosks" className="rounded-lg py-2.5 px-6 font-bold text-xs uppercase tracking-widest data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm">
                        Inventory
                    </TabsTrigger>
                    <TabsTrigger value="favorites" className="rounded-lg py-2.5 px-6 font-bold text-xs uppercase tracking-widest data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm">
                        Wishlist
                    </TabsTrigger>
                </TabsList>

                {view === 'kiosks' && (
                    <Button className="rounded-xl bg-indigo-600 hover:bg-indigo-700 h-11 px-6 text-xs font-black uppercase tracking-widest shadow-xl shadow-indigo-600/20" asChild>
                        <Link to="/owner/create"><PlusCircle className="w-4 h-4 mr-2" /> Pasang Iklan</Link>
                    </Button>
                )}
            </div>

            <TabsContent value="bookings" className="space-y-6 mt-0">
                <div className="grid grid-cols-1 gap-6">
                  <BookingListItem 
                    title="Kiosk Strategis UNESA" 
                    date="24 April 2026, 10:00" 
                    status="Pending" 
                    owner="Budi Santoso"
                    img="https://picsum.photos/seed/k1/400/300"
                  />
                  <BookingListItem 
                    title="Ruko Minimalis Sudirman" 
                    date="21 April 2026, 14:30" 
                    status="Confirmed" 
                    owner="Andi Wijaya"
                    img="https://picsum.photos/seed/k2/400/300"
                  />
                  <BookingListItem 
                    title="Kios ITC Mangga Dua" 
                    date="18 April 2026, 11:00" 
                    status="Cancelled" 
                    owner="Siti Aminah"
                    img="https://picsum.photos/seed/k3/400/300"
                  />
                </div>
            </TabsContent>

            <TabsContent value="kiosks" className="space-y-8 mt-0">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-8">
                     {MOCK_KIOSKS.slice(0, 1).map(k => (
                         <KioskCard key={k.id} kiosk={k} />
                     ))}
                     <button className="border-2 border-dashed border-slate-200 flex flex-col items-center justify-center p-10 bg-slate-50/50 hover:bg-slate-100/50 hover:border-primary/40 transition-all cursor-pointer rounded-2xl min-h-[300px] group" onClick={() => navigate('/owner/create')}>
                         <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center shadow-sm border border-slate-100 mb-4 group-hover:scale-110 transition-transform">
                           <PlusCircle className="w-6 h-6 text-slate-300 group-hover:text-primary transition-colors" />
                         </div>
                         <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">Tambah Unit Kios</p>
                     </button>
                </div>
            </TabsContent>

            <TabsContent value="favorites" className="space-y-8 mt-0">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-8">
                    {MOCK_KIOSKS.map(k => (
                        <KioskCard key={k.id} kiosk={k} />
                    ))}
                </div>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
}

function BookingListItem({ title, date, status, owner, img }: { title: string, date: string, status: string, owner: string, img: string }) {
    const statusColor = {
        'Pending': 'bg-yellow-100 text-yellow-700 border-yellow-200',
        'Confirmed': 'bg-green-100 text-green-700 border-green-200',
        'Cancelled': 'bg-red-100 text-red-700 border-red-200'
    }[status];

    const StatusIcon = {
        'Pending': Clock,
        'Confirmed': CheckCircle2,
        'Cancelled': XCircle
    }[status];

    return (
        <Card className="overflow-hidden rounded-2xl border-none shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-0 flex flex-col sm:flex-row items-stretch">
                <div className="w-full sm:w-48 h-32 sm:h-auto overflow-hidden">
                    <img src={img} className="w-full h-full object-cover" alt={title} referrerPolicy="no-referrer" />
                </div>
                <div className="p-6 flex-grow flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <Badge className={`${statusColor} mb-2 shadow-none flex items-center w-fit gap-1.5`}>
                            <StatusIcon className="w-3 h-3" /> {status}
                        </Badge>
                        <h4 className="text-lg font-bold mb-1">{title}</h4>
                        <div className="flex flex-col text-sm text-muted-foreground">
                            <span className="flex items-center gap-1.5"><Calendar className="w-3 h-3" /> {date}</span>
                            <span className="flex items-center gap-1.5"><User className="w-3 h-3" /> Pemilik: {owner}</span>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="rounded-xl px-4">Detail</Button>
                        {status === 'Confirmed' && <Button size="sm" className="rounded-xl px-4">Hubungi Owner</Button>}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

import { MOCK_KIOSKS as CONST_KIOSKS } from '@/constants';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
