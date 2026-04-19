import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '@/lib/firebase';
import { geminiService } from '@/lib/gemini';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, 
  Image as ImageIcon, 
  MapPin, 
  Zap, 
  BrainCircuit, 
  CheckCircle2, 
  AlertCircle,
  TrendingUp,
  Users,
  School
} from 'lucide-react';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';

export default function CreateKiosk() {
  const [user] = useAuthState(auth);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    address: '',
    facilities: '',
    photos: [] as string[]
  });

  const [strategicData, setStrategicData] = useState<any>(null);

  const handleAnalyze = async () => {
    if (!formData.address) return;
    setAnalyzing(true);
    try {
      const result = await geminiService.analyzeStrategicLocation(formData.address);
      setStrategicData(result);
    } catch (error) {
      console.error("Analysis failed", error);
    } finally {
      setAnalyzing(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);
    
    try {
      const kioskData = {
        ownerId: user.uid,
        title: formData.title,
        description: formData.description,
        price: parseInt(formData.price),
        address: formData.address,
        location: { lat: -6.2, lng: 106.8 }, // Placeholder coords
        facilities: formData.facilities.split(',').map(s => s.trim()),
        photos: formData.photos.length > 0 ? formData.photos : ['https://picsum.photos/seed/newkiosk/800/600'],
        status: 'available',
        strategicData: strategicData || null,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };
      
      const docRef = await addDoc(collection(db, 'kiosks'), kioskData);
      navigate(`/kiosk/${docRef.id}`);
    } catch (error) {
      console.error("Error adding kiosk", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto max-w-4xl px-4 py-10">
      <div className="flex items-center gap-4 mb-10">
        <div className="bg-primary/10 text-primary p-3 rounded-2xl">
            <Plus className="w-8 h-8" />
        </div>
        <div>
            <h1 className="text-3xl font-bold tracking-tight">Pasang Iklan Kios</h1>
            <p className="text-muted-foreground">Lengkapi data kios Anda dan dapatkan analisis lokasi dari AI kami.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <div className="lg:col-span-2 space-y-8">
            <Card className="rounded-3xl border-none shadow-sm">
                <CardHeader>
                    <CardTitle>Informasi Dasar</CardTitle>
                    <CardDescription>Berikan judul dan deskripsi yang menarik calon tenant.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="title">Judul Iklan</Label>
                        <Input 
                            id="title" 
                            placeholder="Contoh: Kios Strategis Depan Kampus..." 
                            className="rounded-xl h-12"
                            value={formData.title}
                            onChange={e => setFormData({...formData, title: e.target.value})}
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="description">Deskripsi Lengkap</Label>
                        <Textarea 
                            id="description" 
                            placeholder="Jelaskan kondisi kios, lingkungan sekitar, dan keunggulan lainnya..." 
                            className="rounded-xl min-h-[150px]"
                            value={formData.description}
                            onChange={e => setFormData({...formData, description: e.target.value})}
                            required
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="price">Harga Sewa / Bulan (Rp)</Label>
                            <Input 
                                id="price" 
                                type="number" 
                                placeholder="1500000" 
                                className="rounded-xl h-12"
                                value={formData.price}
                                onChange={e => setFormData({...formData, price: e.target.value})}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="facilities">Fasilitas (Pisahkan koma)</Label>
                            <Input 
                                id="facilities" 
                                placeholder="Wifi, Listrik, Air, AC..." 
                                className="rounded-xl h-12"
                                value={formData.facilities}
                                onChange={e => setFormData({...formData, facilities: e.target.value})}
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card className="rounded-3xl border-none shadow-sm">
                <CardHeader>
                    <CardTitle>Lokasi Detail</CardTitle>
                    <CardDescription>Alamat yang akurat membantu AI kami menganalisis potensi bisnis Anda.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="address">Alamat Lengkap</Label>
                        <div className="flex gap-2">
                            <div className="relative flex-grow">
                                <MapPin className="absolute left-3 top-3.5 w-5 h-5 text-muted-foreground" />
                                <Input 
                                    id="address" 
                                    placeholder="Jl. Lidah Wetan No. 12, Surabaya..." 
                                    className="pl-10 h-12 rounded-xl"
                                    value={formData.address}
                                    onChange={e => setFormData({...formData, address: e.target.value})}
                                    required
                                />
                            </div>
                            <Button 
                                type="button" 
                                variant="secondary" 
                                className="h-12 rounded-xl flex items-center gap-2"
                                onClick={handleAnalyze}
                                disabled={analyzing || !formData.address}
                            >
                                <BrainCircuit className="w-4 h-4" /> 
                                {analyzing ? 'Menganalisis...' : 'Cek AI'}
                            </Button>
                        </div>
                        <p className="text-[10px] text-muted-foreground ml-1">Kami akan menggunakan Google Maps Data untuk analisis ini.</p>
                    </div>

                    {strategicData && (
                        <div className="p-6 bg-indigo-50 border border-indigo-100 rounded-2xl animate-in fade-in slide-in-from-top-2 duration-500">
                             <div className="flex items-center gap-2 mb-4">
                                <Zap className="w-5 h-5 text-indigo-600" />
                                <h4 className="font-bold text-indigo-900">Preview Analisis AI</h4>
                             </div>
                             <div className="grid grid-cols-2 gap-4 mb-4">
                                <div className="space-y-1">
                                    <span className="text-[10px] uppercase font-bold text-indigo-400">Traffic</span>
                                    <div className="flex items-center gap-1.5 font-bold text-indigo-900">
                                        <TrendingUp className="w-4 h-4" /> {strategicData.traffic}
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <span className="text-[10px] uppercase font-bold text-indigo-400">Density</span>
                                    <div className="flex items-center gap-1.5 font-bold text-indigo-900">
                                        <Users className="w-4 h-4" /> {strategicData.density}
                                    </div>
                                </div>
                             </div>
                             <div className="flex flex-wrap gap-1.5 mb-4">
                                {strategicData.proximity.map((p: string) => (
                                    <Badge key={p} variant="secondary" className="bg-white border-indigo-200 text-indigo-700 capitalize">
                                        <MapPin className="w-3 h-3 mr-1" /> {p}
                                    </Badge>
                                ))}
                             </div>
                             <p className="text-xs text-indigo-800 leading-relaxed italic">
                                "{strategicData.analysis}"
                             </p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>

        <div className="lg:col-span-1 space-y-6">
            <Card className="rounded-3xl border-none shadow-sm overflow-hidden">
                <CardHeader className="bg-muted/50">
                    <CardTitle className="text-sm">Foto Produk</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                    <div className="border-2 border-dashed rounded-2xl flex flex-col items-center justify-center p-8 bg-muted/20 hover:bg-muted/40 transition-colors cursor-pointer mb-4">
                        <ImageIcon className="w-10 h-10 text-muted-foreground/30 mb-2" />
                        <span className="text-xs text-muted-foreground">Upload Foto Kios</span>
                    </div>
                    <div className="flex items-start gap-2 text-[10px] text-muted-foreground">
                        <AlertCircle className="w-3 h-3 shrink-0" />
                        <span>Maksimal 10 foto. Gunakan foto yang terang dan jelas untuk menarik tenant.</span>
                    </div>
                </CardContent>
            </Card>

            <div className="space-y-3">
                 <Button type="submit" size="lg" className="w-full h-14 rounded-2xl font-bold shadow-lg shadow-primary/20" disabled={loading}>
                    {loading ? 'Menyimpan...' : 'Tayangkan Iklan Now'}
                 </Button>
                 <Button type="button" variant="ghost" className="w-full h-12 rounded-2xl" onClick={() => navigate(-1)}>
                    Batalkan
                 </Button>
            </div>

            <Card className="rounded-3xl border-none bg-green-50">
                <CardContent className="p-6">
                    <div className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                        <div>
                            <h5 className="font-bold text-green-900 text-sm">Validasi CariKios</h5>
                            <p className="text-[10px] text-green-800 leading-tight">Iklan Anda akan diperiksa tim kami dalam 1x24 jam untuk memastikan kualitas data.</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
      </form>
    </div>
  );
}
