import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db, googleProvider } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { toast } from 'sonner';
import { motion } from 'motion/react';
import { LogIn, Mail, Lock, Eye, EyeOff, Loader2 } from 'lucide-react';

export default function Login() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast.success("Login Berhasil!");
      navigate('/dashboard');
    } catch (error: any) {
      toast.error("Email atau password salah.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      // Check if profile exists
      const docRef = doc(db, 'users', user.uid);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        // Create skeleton profile for new Google user
        await setDoc(docRef, {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
          role: 'tenant', // Default role
          favorites: [],
          createdAt: serverTimestamp()
        });
        toast.success("Akun Google berhasil didaftarkan sebagai Pencari Kios!");
      } else {
        toast.success(`Selamat datang kembali, ${user.displayName}!`);
      }
      
      navigate('/dashboard');
    } catch (error: any) {
      toast.error("Gagal login dengan Google.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-200/20 rounded-full blur-3xl -mr-64 -mt-64" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-slate-400/10 rounded-full blur-3xl -ml-64 -mb-64" />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative z-10 w-full max-w-md"
      >
        <Card className="rounded-3xl border-slate-200 shadow-2xl shadow-indigo-900/10 overflow-hidden bg-white">
          <CardHeader className="p-8 pb-0 text-center">
            <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-indigo-600/30">
              <LogIn className="text-white w-6 h-6" />
            </div>
            <CardTitle className="text-3xl font-black text-slate-900 tracking-tight">Selamat Datang</CardTitle>
            <CardDescription className="text-slate-500 font-medium mt-2">
              Masuk untuk mengelola kios atau mencari peluang baru.
            </CardDescription>
          </CardHeader>

          <CardContent className="p-8">
            <Button 
              type="button" variant="outline" onClick={handleGoogleLogin} 
              className="w-full h-12 rounded-xl border-slate-200 font-bold text-slate-600 mb-6"
              disabled={loading}
            >
              <img src="https://www.google.com/favicon.ico" className="w-4 h-4 mr-2" alt="Google" />
              Sign In With Google
            </Button>

            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-slate-100"></span></div>
              <div className="relative flex justify-center text-[10px] font-black uppercase tracking-widest"><span className="bg-white px-4 text-slate-400">Atau masuk dengan email</span></div>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-[10px] font-black uppercase tracking-widest text-slate-400">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 w-4 h-4 text-slate-300" />
                  <Input 
                    id="email" type="email" placeholder="john@example.com" 
                    required className="pl-10 h-11 border-slate-200 rounded-xl"
                    value={email} onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="password" className="text-[10px] font-black uppercase tracking-widest text-slate-400">Password</Label>
                  <button type="button" className="text-[10px] font-black text-indigo-600 uppercase tracking-widest hover:underline">Lupa Password?</button>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 w-4 h-4 text-slate-300" />
                  <Input 
                    id="password" type={showPassword ? "text" : "password"} 
                    placeholder="••••••••" required className="pl-10 h-11 border-slate-200 rounded-xl"
                    value={password} onChange={(e) => setPassword(e.target.value)}
                  />
                  <button 
                    type="button" onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-slate-300 hover:text-slate-500"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <Button type="submit" className="w-full h-12 rounded-xl bg-indigo-600 hover:bg-indigo-700 font-black uppercase tracking-widest text-xs" disabled={loading}>
                {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : 'Masuk Sekarang'}
              </Button>
            </form>
          </CardContent>

          <CardFooter className="p-8 bg-slate-50 border-t border-slate-100 justify-center">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
              Belum punya akun?{' '}
              <Link to="/signup" className="text-indigo-600 hover:underline">Daftar Gratis</Link>
            </p>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
}
