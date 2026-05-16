import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Lock, LogIn, ArrowRight } from 'lucide-react';
import { loginWithGoogle, auth } from '../lib/firebase';

export default function LoginPage() {
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // If already logged in, check if authorized and redirect
    const unsub = auth.onAuthStateChanged((user) => {
      if (user) {
        if (user.email === 'thitirath.thaw@gmail.com') {
          navigate('/admin');
        } else {
          setError('บัญชีนี้ไม่ได้รับอนุญาตให้เข้าใช้งานส่วน Admin');
        }
      }
    });
    return () => unsub();
  }, [navigate]);

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setError('');
    try {
      const result = await loginWithGoogle();
      const user = result.user;
      
      if (user.email === 'thitirath.thaw@gmail.com') {
        navigate('/admin');
      } else {
        setError('บัญชีนี้ไม่ใช่บัญชี Admin ของ MAHA');
        // Sign out if not admin to avoid being stuck in an unauthorized state
        await auth.signOut();
      }
    } catch (err: any) {
      console.error('Login error:', err);
      setError('เกิดข้อผิดพลาดในการเข้าสู่ระบบ: ' + (err.message || 'Unknown error'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center px-6 transition-colors duration-500">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-20 w-[600px] h-[600px] bg-maha-yellow/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-1/4 -right-20 w-[600px] h-[600px] bg-maha-pink/5 blur-[120px] rounded-full" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-surface border border-border p-10 rounded-[3rem] shadow-2xl relative z-10"
      >
        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-accent text-maha-black rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-accent/20">
            <Lock size={32} />
          </div>
          <h1 className="text-3xl font-display uppercase italic font-black text-text">Admin Access</h1>
          <p className="text-text/40 font-thai mt-2 text-sm">เข้าสู่ระบบด้วย Google Account ของ Admin</p>
        </div>

        <div className="space-y-6">
          <button 
            onClick={handleGoogleLogin}
            disabled={isLoading}
            className="w-full bg-white text-maha-black py-5 rounded-2xl font-black uppercase text-sm tracking-widest flex items-center justify-center gap-4 hover:bg-accent transition-all shadow-xl shadow-white/5 disabled:opacity-50"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-maha-black/20 border-t-maha-black rounded-full animate-spin" />
            ) : (
              <>
                <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5" />
                Sign in with Google <ArrowRight size={18} />
              </>
            )}
          </button>

          {error && (
            <motion.div 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-maha-pink text-xs font-thai font-bold text-center bg-maha-pink/10 py-3 rounded-xl px-4"
            >
              {error}
            </motion.div>
          )}

          <div className="flex items-center gap-4 px-4">
             <div className="h-px bg-border flex-1" />
             <span className="text-[10px] text-text/20 uppercase tracking-widest font-black">Authorized Email</span>
             <div className="h-px bg-border flex-1" />
          </div>
          <p className="text-center text-[10px] text-text/30 font-mono">thitirath.thaw@gmail.com</p>
        </div>

        <div className="mt-10 pt-8 border-t border-border text-center">
          <button 
            onClick={() => navigate('/')}
            className="text-[10px] uppercase tracking-widest text-text/30 hover:text-accent font-black transition-colors"
          >
            Return to Website
          </button>
        </div>
      </motion.div>
    </div>
  );
}
