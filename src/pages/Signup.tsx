import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { createUserWithEmailAndPassword, sendEmailVerification, updateProfile, signInWithPopup } from 'firebase/auth';
import { doc, setDoc, serverTimestamp, getDoc } from 'firebase/firestore';
import { auth, db, googleProvider } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { UserRole } from '@/types';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldCheck, User, Store, Mail, Lock, Eye, EyeOff, ArrowRight, Loader2 } from 'lucide-react';

export default function Signup() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'tenant' as UserRole,
  });

  const [verificationCode, setVerificationCode] = useState('');
  const [sentCode, setSentCode] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const setRole = (role: UserRole) => {
    setFormData({ ...formData, role });
  };

  const handleGoogleSignup = async () => {
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      const docRef = doc(db, 'users', user.uid);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        await setDoc(docRef, {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
          role: formData.role, // Use the role selected in the UI
          favorites: [],
          createdAt: serverTimestamp()
        });
        toast.success(`Berhasil mendaftar sebagai ${formData.role === 'owner' ? 'Pemilik' : 'Pencari'} Kios!`);
      } else {
        toast.info("Anda sudah memiliki akun, dialihkan ke dashboard.");
      }
      
      navigate('/dashboard');
    } catch (error: any) {
      toast.error("Gagal mendaftar dengan Google.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleStep1 = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      toast.error("Password tidak cocok");
      return;
    }
    if (formData.password.length < 6) {
      toast.error("Password minimal 6 karakter");
      return;
    }

    setLoading(true);
    try {
      // Generate a fake 6-digit code for demonstration as requested
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      setSentCode(code);
      
      // In a real production app, you'd send this via an Email API (SendGrid, Postmark, etc.)
      console.log(`[DEMO ONLY] Kode verifikasi untuk ${formData.email}: ${code}`);
      
      setStep(2);
      toast.success("Kode verifikasi telah dikirim ke email Anda (Check Konsol untuk Demo)");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (verificationCode !== sentCode) {
      toast.error("Kode verifikasi salah");
      return;
    }

    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      const user = userCredential.user;

      await updateProfile(user, {
        displayName: formData.username
      });

      // Save to Firestore
      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        email: formData.email,
        displayName: formData.username,
        role: formData.role,
        favorites: [],
        createdAt: serverTimestamp()
      });

      // Optional: send real firebase email verification
      await sendEmailVerification(user);

      toast.success("Akun berhasil dibuat! Silakan login.");
      navigate('/login');
    } catch (error: any) {
      toast.error(error.message);
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
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-md"
      >
        <Card className="rounded-3xl border-slate-200 shadow-2xl shadow-indigo-900/10 overflow-hidden bg-white">
          <CardHeader className="p-8 pb-0 text-center">
            <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-indigo-600/30">
              <ShieldCheck className="text-white w-6 h-6" />
            </div>
            <CardTitle className="text-3xl font-black text-slate-900 tracking-tight">Daftar CariKios</CardTitle>
            <CardDescription className="text-slate-500 font-medium mt-2">
              {step === 1 ? 'Mulai langkah Anda untuk bisnis yang lebih baik' : 'Masukkan kode yang dikirim ke email Anda'}
            </CardDescription>
          </CardHeader>

          <CardContent className="p-8">
            <AnimatePresence mode="wait">
              {step === 1 ? (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="space-y-6"
                >
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Pilih Peran Dahulu</Label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setRole('tenant')}
                        className={`flex flex-col items-center gap-2 p-4 rounded-xl border transition-all ${
                          formData.role === 'tenant' 
                            ? 'bg-indigo-50 border-indigo-200 text-indigo-600' 
                            : 'bg-white border-slate-100 text-slate-400 hover:border-slate-200'
                        }`}
                      >
                        <User className="w-5 h-5" />
                        <span className="text-[10px] font-black uppercase tracking-widest">Pencari Kios</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setRole('owner')}
                        className={`flex flex-col items-center gap-2 p-4 rounded-xl border transition-all ${
                          formData.role === 'owner' 
                            ? 'bg-indigo-50 border-indigo-200 text-indigo-600' 
                            : 'bg-white border-slate-100 text-slate-400 hover:border-slate-200'
                        }`}
                      >
                        <Store className="w-5 h-5" />
                        <span className="text-[10px] font-black uppercase tracking-widest">Pemilik Kios</span>
                      </button>
                    </div>
                  </div>

                  <Button 
                    type="button" variant="outline" onClick={handleGoogleSignup} 
                    className="w-full h-12 rounded-xl border-slate-200 font-bold text-slate-600"
                    disabled={loading}
                  >
                    <img src="https://www.google.com/favicon.ico" className="w-4 h-4 mr-2" alt="Google" />
                    Sign Up With Google
                  </Button>

                  <div className="relative">
                    <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-slate-100"></span></div>
                    <div className="relative flex justify-center text-[10px] font-black uppercase tracking-widest"><span className="bg-white px-4 text-slate-400">Atau Daftar Manual</span></div>
                  </div>

                  <form onSubmit={handleStep1} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="username" className="text-[10px] font-black uppercase tracking-widest text-slate-400">Username</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-3 w-4 h-4 text-slate-300" />
                        <Input 
                          id="username" name="username" placeholder="johndoe" 
                          required className="pl-10 h-11 border-slate-200 rounded-xl"
                          value={formData.username} onChange={handleChange}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-[10px] font-black uppercase tracking-widest text-slate-400">Email Address</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 w-4 h-4 text-slate-300" />
                        <Input 
                          id="email" name="email" type="email" placeholder="john@example.com" 
                          required className="pl-10 h-11 border-slate-200 rounded-xl"
                          value={formData.email} onChange={handleChange}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="password" className="text-[10px] font-black uppercase tracking-widest text-slate-400">Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 w-4 h-4 text-slate-300" />
                        <Input 
                          id="password" name="password" type={showPassword ? "text" : "password"} 
                          placeholder="••••••••" required className="pl-10 h-11 border-slate-200 rounded-xl"
                          value={formData.password} onChange={handleChange}
                        />
                        <button 
                          type="button" onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-3 text-slate-300 hover:text-slate-500"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword" className="text-[10px] font-black uppercase tracking-widest text-slate-400">Ulangi Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 w-4 h-4 text-slate-300" />
                        <Input 
                          id="confirmPassword" name="confirmPassword" type={showPassword ? "text" : "password"} 
                          placeholder="••••••••" required className="pl-10 h-11 border-slate-200 rounded-xl"
                          value={formData.confirmPassword} onChange={handleChange}
                        />
                      </div>
                    </div>

                    <Button type="submit" className="w-full h-12 rounded-xl bg-indigo-600 hover:bg-indigo-700 font-black uppercase tracking-widest text-xs" disabled={loading}>
                      {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : 'Lanjut Verifikasi'}
                    </Button>
                  </form>
                </motion.div>
              ) : (
                <motion.form
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  onSubmit={handleSignup}
                  className="space-y-6"
                >
                  <div className="space-y-2 text-center">
                    <Label htmlFor="code" className="text-[10px] font-black uppercase tracking-widest text-slate-400">Kode Verifikasi (6 Digit)</Label>
                    <Input 
                      id="code" placeholder="000000" maxLength={6}
                      required className="h-14 border-slate-200 rounded-xl text-center text-3xl font-black tracking-[0.5em]"
                      value={verificationCode} onChange={(e) => setVerificationCode(e.target.value)}
                    />
                  </div>

                  <div className="flex flex-col gap-3">
                    <Button type="submit" className="w-full h-12 rounded-xl bg-indigo-600 hover:bg-indigo-700 font-black uppercase tracking-widest text-xs" disabled={loading}>
                      {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : 'Selesaikan Pendaftaran'}
                    </Button>
                    <Button type="button" variant="ghost" onClick={() => setStep(1)} className="text-xs font-bold text-slate-400 hover:text-indigo-600">
                      Ganti Alamat Email
                    </Button>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>
          </CardContent>

          <CardFooter className="p-8 bg-slate-50 border-t border-slate-100 justify-center">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
              Sudah punya akun?{' '}
              <Link to="/login" className="text-indigo-600 hover:underline">Login Sekarang</Link>
            </p>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
}
