import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, googleProvider } from '@/lib/firebase';
import { signInWithPopup, signOut } from 'firebase/auth';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Home, Search, PlusCircle, Bookmark, Calendar, LogOut, User } from 'lucide-react';

export default function Navbar() {
  const [user] = useAuthState(auth);
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error("Login failed", error);
    }
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white flex-shrink-0">
      <div className="container mx-auto px-6 h-16 flex items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-3 shrink-0">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center shadow-sm">
            <Home className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-900">CariKios</span>
        </Link>

        <div className="flex-1 max-w-md hidden md:block">
          <div className="relative group">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400 group-focus-within:text-primary transition-colors" />
            <input 
              type="text" 
              placeholder="Cari lokasi, nama jalan, atau landmark..." 
              className="w-full pl-10 pr-4 py-2 bg-slate-100 border-none rounded-full text-sm focus:ring-2 focus:ring-primary outline-none transition-all"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  navigate(`/search?q=${(e.target as HTMLInputElement).value}`);
                }
              }}
            />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button className="text-sm font-medium text-slate-600 hover:text-primary transition-colors hidden sm:block">Bantuan</button>
          
          {user ? (
            <div className="flex items-center gap-4">
              <Button variant="secondary" size="sm" asChild className="rounded-lg border border-indigo-100 bg-indigo-50 text-primary hover:bg-indigo-100 transition-colors font-semibold">
                <Link to="/owner/create">Pasang Iklan</Link>
              </Button>
              
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <button className="relative h-9 w-9 rounded-full ring-2 ring-slate-100 p-0.5 hover:ring-primary/30 transition-all outline-none">
                    <Avatar className="h-full w-full">
                      <AvatarImage src={user.photoURL || ''} alt={user.displayName || ''} />
                      <AvatarFallback className="bg-slate-200 text-slate-600 font-bold">{user.displayName?.charAt(0) || 'U'}</AvatarFallback>
                    </Avatar>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 rounded-xl shadow-xl border-slate-200" align="end">
                  <div className="flex items-center justify-start gap-3 p-3 bg-slate-50 border-b border-slate-100 rounded-t-xl">
                    <div className="flex flex-col space-y-0.5">
                      <p className="text-sm font-bold text-slate-900 leading-none">{user.displayName}</p>
                      <p className="text-[11px] leading-none text-slate-500 font-medium">{user.email}</p>
                    </div>
                  </div>
                  <div className="p-1.5">
                    <DropdownMenuItem onClick={() => navigate('/dashboard')} className="rounded-lg cursor-pointer flex items-center gap-2 text-slate-600 focus:text-primary focus:bg-indigo-50">
                        <User className="h-4 w-4" /> <span className="font-medium text-xs">Profile & Dashboard</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate('/dashboard/bookings')} className="rounded-lg cursor-pointer flex items-center gap-2 text-slate-600 focus:text-primary focus:bg-indigo-50">
                        <Calendar className="h-4 w-4" /> <span className="font-medium text-xs">Bookings</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate('/dashboard/favorites')} className="rounded-lg cursor-pointer flex items-center gap-2 text-slate-600 focus:text-primary focus:bg-indigo-50">
                        <Bookmark className="h-4 w-4" /> <span className="font-medium text-xs">Wishlist</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-slate-100 my-1.5" />
                    <DropdownMenuItem 
                      className="rounded-lg text-destructive focus:text-destructive focus:bg-destructive/10 cursor-pointer flex items-center gap-2"
                      onClick={() => signOut(auth)}
                    >
                      <LogOut className="h-4 w-4" /> <span className="font-bold text-xs uppercase tracking-wider">Log out</span>
                    </DropdownMenuItem>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <Button onClick={handleLogin} size="sm" className="rounded-lg bg-primary hover:bg-primary/90 text-white font-bold h-10 px-6 shadow-md shadow-primary/20">
              Mulai Sekarang
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
}
