import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
  MapPin,
  TrendingUp,
  Users,
  Eye,
  BarChart3,
  Loader2,
  ArrowRight
} from 'lucide-react';
import KioskCard from '@/components/KioskCard';
import { useNavigate, Link } from 'react-router-dom';
import { Kiosk, Booking } from '@/types';
import { motion, AnimatePresence } from 'motion/react';

export default function Dashboard() {
  const { user, profile, loading: authLoading } = useAuth();
  const [view, setView] = useState('overview');
  const navigate = useNavigate();
  const [myKiosks, setMyKiosks] = useState<Kiosk[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user && profile) {
      fetchDashboardData();
    }
  }, [user, profile]);

  const fetchDashboardData = async () => {
    if (!user || !profile) return;
    setLoading(true);
    try {
      if (profile.role === 'owner') {
        // Fetch owner's kiosks
        const kQuery = query(collection(db, 'kiosks'), where('ownerId', '==', user.uid));
        const kSnap = await getDocs(kQuery);
        const kiosksData = kSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Kiosk));
        setMyKiosks(kiosksData);

        // Fetch bookings for owner's kiosks
        const bQuery = query(collection(db, 'bookings'), where('ownerId', '==', user.uid));
        const bSnap = await getDocs(bQuery);
        setBookings(bSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Booking)));
      } else {
        // Fetch tenant's bookings
        const bQuery = query(collection(db, 'bookings'), where('tenantId', '==', user.uid));
        const bSnap = await getDocs(bQuery);
        setBookings(bSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Booking)));
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) return <div className="h-screen flex items-center justify-center bg-white"><Loader2 className="animate-spin text-indigo-600" /></div>;

  const isOwner = profile?.role === 'owner';

  return (
    <div className="container mx-auto px-4 md:px-6 py-10 min-h-screen bg-slate-50/50">
      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Profile Sidebar */}
        <aside className="w-full lg:w-80 shrink-0 space-y-6">
          <Card className="rounded-[2.5rem] border-slate-200 overflow-hidden shadow-xl shadow-slate-200/50 bg-white border-none">
            <div className="h-24 bg-indigo-600 relative">
              <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(white 1px, transparent 1px)', backgroundSize: '12px 12px' }}></div>
            </div>
            <CardContent className="px-6 pb-8 -mt-12 text-center relative z-10">
              <div className="relative inline-block mb-4">
                <div className="w-24 h-24 rounded-3xl bg-white p-1 ring-4 ring-slate-50 shadow-lg">
                  <div className="w-full h-full rounded-2xl bg-slate-100 flex items-center justify-center overflow-hidden">
                    {user?.photoURL ? (
                      <img src={user.photoURL} alt={profile?.displayName} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-indigo-50 text-indigo-300">
                        <User className="w-10 h-10" />
                      </div>
                    )}
                  </div>
                </div>
                <div className="absolute bottom-1 -right-1 w-8 h-8 bg-green-500 border-4 border-white rounded-xl flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                </div>
              </div>
              
              <h2 className="text-xl font-black text-slate-900 tracking-tight leading-none mb-1">{profile?.displayName || user?.displayName}</h2>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 flex items-center justify-center gap-1">
                 {isOwner ? <Store className="w-3 h-3" /> : <User className="w-3 h-3" />}
                 {isOwner ? 'Owner Kios' : 'Pencari Kios'}
              </p>

              <div className="mt-8 grid grid-cols-2 gap-3 uppercase text-[10px] font-black tracking-widest leading-none">
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <span className="text-indigo-600 text-lg block mb-1">{isOwner ? myKiosks.length : '12'}</span>
                  <span className="text-slate-400">{isOwner ? 'Unit' : 'Favorit'}</span>
                </div>
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <span className="text-indigo-600 text-lg block mb-1">{bookings.length}</span>
                  <span className="text-slate-400">Order</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <nav className="flex flex-col gap-1">
            <NavItem icon={<BarChart3 />} label="Overview" active={view === 'overview'} onClick={() => setView('overview')} />
            {isOwner && (
              <>
                <NavItem icon={<Store />} label="Inventori Kios" active={view === 'my-kiosks'} onClick={() => setView('my-kiosks')} />
              </>
            )}
            <NavItem icon={<Calendar />} label={isOwner ? "Booking Masuk" : "Jadwal Survei"} active={view === 'bookings'} onClick={() => setView('bookings')} />
            {!isOwner && <NavItem icon={<Heart />} label="Favorit Saya" active={view === 'favorites'} onClick={() => setView('favorites')} />}
            <NavItem icon={<MessageSquare />} label="Chat & Pesan" active={view === 'chats'} onClick={() => setView('chats')} />
            <NavItem icon={<Settings />} label="Pengaturan" active={view === 'settings'} onClick={() => setView('settings')} />
          </nav>

          {isOwner && (
            <div className="p-6 rounded-[2rem] bg-slate-900 text-white relative overflow-hidden group">
              <div className="relative z-10">
                <h4 className="text-xs font-black uppercase tracking-widest mb-2 text-indigo-400">Owner Insight</h4>
                <p className="text-[11px] font-medium opacity-70 mb-4 leading-relaxed">Tingkatkan eksposur kios Anda dengan fitur Premium Ads.</p>
                <Button className="w-full rounded-xl h-10 bg-indigo-600 hover:bg-indigo-700 font-bold uppercase text-[10px] tracking-widest border-none">Upgrade Akun</Button>
              </div>
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-600/10 rounded-full blur-3xl -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700"></div>
            </div>
          )}
        </aside>

        {/* Main Dashboard Area */}
        <div className="flex-1 space-y-8">
          <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="text-5xl font-black text-slate-900 tracking-tighter uppercase italic leading-[0.85]">
                {view === 'overview' ? 'DASHBOARD' : view.toUpperCase().replace('-', ' ')}
              </h1>
              <div className="flex items-center gap-2 mt-2">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                <p className="text-slate-500 font-bold text-[10px] uppercase tracking-widest leading-none">
                  Status: Operasional Aktif • {new Date().toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}
                </p>
              </div>
            </div>
            {isOwner && (
              <Button asChild className="rounded-2xl bg-indigo-600 hover:bg-indigo-700 shadow-xl shadow-indigo-600/20 px-8 h-12 font-black uppercase text-xs tracking-widest border-none text-white">
                <Link to="/owner/create">Pasang Iklan Baru <PlusCircle className="ml-2 w-4 h-4" /></Link>
              </Button>
            )}
          </header>

          <AnimatePresence mode="wait">
            <motion.div
              key={view}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {view === 'overview' && (
                <div className="space-y-8">
                  {/* Analytic Stats */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <StatCard icon={<Eye />} label={isOwner ? "Total Tayangan" : "Kios Dilihat"} value={isOwner ? "4.2K" : "24"} change="+12%" />
                    <StatCard icon={<Users />} label={isOwner ? "Calon Tenant" : "Respon Owner"} value={isOwner ? "18" : "95%"} change="+5%" />
                    <StatCard icon={<TrendingUp />} label={isOwner ? "Konversi Sewa" : "Peluang Hemat"} value={isOwner ? "3.2%" : "Rp 2jt"} change="+0.8%" />
                  </div>

                  <Card className="rounded-[2.5rem] border-none shadow-xl shadow-slate-200/40 overflow-hidden bg-white">
                    <CardHeader className="p-8 pb-0 flex flex-row items-center justify-between">
                      <CardTitle className="text-xl font-black tracking-tighter text-slate-900 border-l-4 border-indigo-600 pl-4 uppercase">Aktivitas Terkini</CardTitle>
                      <Button variant="ghost" className="text-[10px] font-black uppercase tracking-widest text-indigo-600 hover:bg-indigo-50">
                        Lihat Semua <ArrowRight className="ml-1 w-3 h-3" />
                      </Button>
                    </CardHeader>
                    <CardContent className="p-8">
                      <div className="space-y-4">
                        {bookings.length > 0 ? (
                          bookings.slice(0, 3).map(booking => (
                            <ActivityItem key={booking.id} booking={booking} isOwner={isOwner} />
                          ))
                        ) : (
                          <div className="text-center py-16 p-8 bg-slate-50/50 rounded-[2.5rem] border-2 border-dashed border-slate-100">
                            <Clock className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                            <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Belum ada aktivitas baru</p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {view === 'bookings' && (
                <div className="space-y-6">
                  {bookings.length > 0 ? (
                    bookings.map(booking => (
                      <BookingCard key={booking.id} booking={booking} isOwner={isOwner} />
                    ))
                  ) : (
                    <EmptyState icon={<Calendar />} title="Antrean Kosong" description="Daftar pesanan survei atau status sewa akan muncul di sini." />
                  )}
                </div>
              )}

              {view === 'my-kiosks' && isOwner && (
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
                   {myKiosks.length > 0 ? (
                     myKiosks.map(kiosk => <KioskCard key={kiosk.id} kiosk={kiosk} />)
                   ) : (
                      <div className="col-span-full">
                        <EmptyState 
                          icon={<Store />} 
                          title="Inventori Kosong" 
                          description="Mulai pasang iklan kios strategis Anda sekarang untuk mendapatkan calon penyewa terbaik."
                          action={<Button asChild className="mt-8 rounded-2xl bg-indigo-600 hover:bg-indigo-700 h-12 px-8 font-black uppercase text-xs tracking-widest border-none text-white"><Link to="/owner/create">Pasang Iklan Sekarang</Link></Button>}
                        />
                      </div>
                   )}
                 </div>
              )}

              {(view === 'favorites' || view === 'chats' || view === 'settings') && (
                <EmptyState icon={<Settings />} title="Halaman Pengembangan" description="Fitur ini sedang dalam tahap optimalisasi untuk kenyamanan Anda." />
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

function NavItem({ icon, label, active, onClick }: { icon: React.ReactNode, label: string, active: boolean, onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={`flex items-center gap-4 px-6 py-4 rounded-2xl transition-all duration-300 group ${
        active 
          ? 'bg-white text-indigo-600 shadow-xl shadow-slate-200/50 border border-slate-100' 
          : 'text-slate-400 hover:text-indigo-600 hover:bg-white/50'
      }`}
    >
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
        active ? 'bg-indigo-50 text-indigo-600' : 'bg-slate-50 text-slate-300 group-hover:bg-indigo-50 group-hover:text-indigo-600'
      }`}>
        {React.cloneElement(icon as React.ReactElement<any>, { className: "w-5 h-5 font-black" })}
      </div>
      <span className="text-[10px] font-black uppercase tracking-[0.2em] text-left leading-tight">{label}</span>
      {active && <div className="ml-auto w-1.5 h-1.5 bg-indigo-600 rounded-full shadow-lg shadow-indigo-600/50"></div>}
    </button>
  );
}

function StatCard({ icon, label, value, change }: { icon: React.ReactNode, label: string, value: string, change: string }) {
  return (
    <Card className="rounded-[2.5rem] border-none shadow-xl shadow-slate-200/30 bg-white overflow-hidden group hover:shadow-2xl transition-all duration-500">
      <CardContent className="p-8">
        <div className="flex justify-between items-start mb-6">
          <div className="w-14 h-14 bg-indigo-50 rounded-2xl group-hover:bg-indigo-600 group-hover:text-white transition-all duration-500 flex items-center justify-center text-indigo-600">
            {React.cloneElement(icon as React.ReactElement<any>, { className: "w-6 h-6" })}
          </div>
          <Badge className="bg-green-50 text-green-600 border border-green-100/50 text-[10px] font-black uppercase tracking-widest px-3 py-1 shadow-none">{change}</Badge>
        </div>
        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">{label}</p>
        <h3 className="text-4xl font-black text-slate-900 tracking-tighter leading-none">{value}</h3>
      </CardContent>
    </Card>
  );
}

function ActivityItem({ booking, isOwner }: { booking: Booking, isOwner: boolean }) {
  return (
    <div className="flex items-center gap-4 p-5 bg-slate-50/50 rounded-3xl border border-slate-100/50 hover:bg-slate-50 transition-colors">
      <div className="w-14 h-14 rounded-2xl bg-white border border-slate-100 flex items-center justify-center shrink-0 shadow-sm">
         <Calendar className="w-6 h-6 text-indigo-600" />
      </div>
      <div className="flex-grow overflow-hidden">
        <p className="text-sm font-black text-slate-900 leading-tight truncate">
          {isOwner ? 'Permintaan survei baru' : 'Survei Kios Berhasil Didaftarkan'}
        </p>
        <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1">ID: #{booking.id.slice(0, 8)} • {new Date(booking.surveyDate).toLocaleDateString()}</p>
      </div>
      <Badge className={`rounded-xl uppercase text-[9px] font-black tracking-widest h-8 px-4 flex items-center ${
        booking.status === 'confirmed' ? 'bg-green-100 text-green-700' : 
        booking.status === 'pending' ? 'bg-orange-100 text-orange-700' : 'bg-red-100 text-red-700'
      }`}>
        {booking.status}
      </Badge>
    </div>
  );
}

function BookingCard({ booking, isOwner }: { booking: Booking, isOwner: boolean }) {
  return (
    <Card className="rounded-[2.5rem] border-none overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 bg-white group">
      <div className="flex flex-col md:flex-row">
        <div className="w-full md:w-64 h-48 md:h-auto bg-slate-100 shrink-0 relative overflow-hidden">
          <img src={`https://picsum.photos/seed/${booking.kioskId}/600/400`} alt="Kiosk" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" referrerPolicy="no-referrer" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
          <div className="absolute bottom-4 left-4">
            <Badge className="bg-indigo-600 border-none text-[9px] font-black uppercase tracking-[0.2em] px-3 py-1">SURVEI AKTIF</Badge>
          </div>
        </div>
        <CardContent className="p-8 flex-grow flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="space-y-4">
            <div>
              <div className="flex items-center gap-2 text-slate-400 mb-2">
                <MapPin className="w-3 h-3" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em]">Kiosk Area Strategis</span>
              </div>
              <h3 className="text-2xl font-black text-slate-900 tracking-tight leading-none mb-1">
                {isOwner ? 'Review Calon Tenant' : 'Konfirmasi Survei Kios'}
              </h3>
            </div>
            
            <div className="flex flex-wrap gap-6">
              <div className="space-y-1">
                <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">Jadwal Pertemuan</p>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-indigo-600" />
                  <span className="text-sm font-bold text-slate-700 italic">{booking.surveyDate}</span>
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">{isOwner ? 'Pemohon' : 'Pemilik'}</p>
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-indigo-600" />
                  <span className="text-sm font-bold text-slate-700 italic">User ID: {isOwner ? booking.tenantId.slice(0, 8) : booking.ownerId.slice(0, 8)}...</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-end gap-4 shrink-0">
            <Badge className={`rounded-2xl px-6 py-2.5 uppercase text-[10px] font-black tracking-[0.2em] border-none shadow-sm ${
              booking.status === 'confirmed' ? 'bg-green-100 text-green-700' : 
              booking.status === 'pending' ? 'bg-orange-100 text-orange-700' : 'bg-red-100 text-red-700'
            }`}>
              {booking.status}
            </Badge>
            <div className="flex gap-2">
              <Button variant="ghost" className="text-slate-400 hover:text-indigo-600 font-black uppercase text-[10px] tracking-widest">Detail</Button>
              <Button className="rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-black uppercase text-[10px] tracking-widest px-6 h-10 border-none">Chat</Button>
            </div>
          </div>
        </CardContent>
      </div>
    </Card>
  );
}

function EmptyState({ icon, title, description, action }: { icon: React.ReactNode, title: string, description: string, action?: React.ReactNode }) {
  return (
    <div className="text-center py-24 bg-white rounded-[3rem] border-none shadow-xl shadow-slate-200/30 flex flex-col items-center justify-center p-8">
      <div className="w-24 h-24 bg-slate-50 rounded-[2.5rem] flex items-center justify-center mb-6 text-slate-200">
         {React.cloneElement(icon as React.ReactElement<any>, { className: "w-10 h-10" })}
      </div>
      <h3 className="text-3xl font-black text-slate-900 uppercase italic tracking-tighter leading-none">{title}</h3>
      <p className="text-slate-400 font-medium max-w-xs mx-auto mt-4 leading-relaxed">{description}</p>
      {action}
    </div>
  );
}
