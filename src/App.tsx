import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { DEFAULT_CONTENT, SiteContent } from './constants';
import { Sun, Moon, Sparkle } from 'lucide-react';
import { useTheme } from './context/ThemeContext.tsx';
import IndexPage from './pages/IndexPage';
import MahaAdminPage from './pages/MahaAdminPage';
import BlogPage from './pages/BlogPage';
import BlogPostPage from './pages/BlogPostPage';
import BlogAdminPage from './pages/BlogAdminPage';
import LoginPage from './pages/LoginPage';
import PriceCalculator from './components/PriceCalculator';
import { db, auth, handleFirestoreError, OperationType } from './lib/firebase';
import { doc, setDoc, onSnapshot, serverTimestamp } from 'firebase/firestore';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState(auth.currentUser);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    return auth.onAuthStateChanged((u) => {
      setUser(u);
      setLoading(false);
    });
  }, []);

  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;
  
  // Check if admin email matches the authorized one
  // Note: Firestore rules also enforce this, but UI blocking is better for UX
  const isAdmin = user.email === 'thitirath.thaw@gmail.com';
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center p-6 text-center">
        <div>
          <h1 className="text-maha-pink text-4xl font-display uppercase italic mb-4">Unauthorized</h1>
          <p className="text-text/60">คุณไม่มีสิทธิ์เข้าถึงหน้านี้ เฉพาะ Admin เท่านั้น</p>
          <button 
            onClick={() => auth.signOut().then(() => window.location.href = '/login')}
            className="mt-8 text-accent underline uppercase tracking-widest text-xs"
          >
            Logout and try another account
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

const CustomCursor = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isPointer, setIsPointer] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      const target = e.target as HTMLElement;
      setIsPointer(
        window.getComputedStyle(target).cursor === 'pointer' || 
        target.tagName === 'A' || 
        target.tagName === 'BUTTON'
      );
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div 
      className="custom-cursor difference-mode"
      style={{ left: position.x, top: position.y, transform: `translate(-50%, -50%)` }}
    >
      <motion.div 
        animate={{ 
          scale: isPointer ? 1.5 : 1,
          rotate: isPointer ? 180 : 0
        }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        <Sparkle 
          size={32} 
          className="text-white fill-white" 
          strokeWidth={1.5}
        />
      </motion.div>
    </div>
  );
};

const Navigation = ({ onOpenCalc }: { onOpenCalc: () => void }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const { pathname } = useLocation();
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 w-full z-50 h-[80px] transition-all duration-300 ${isScrolled ? 'bg-bg/90 backdrop-blur-md' : 'bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
        <a href="/" className="flex items-center h-10 md:h-14">
           <img 
             src={theme === 'dark' ? '/logo-0.png' : '/logo-1.png'} 
             alt="MAHA Marketings" 
             className="h-full w-auto object-contain"
           />
        </a>
        
        <div className="hidden lg:flex items-center gap-6 text-[10px] font-bold uppercase tracking-widest text-text">
          <a href="/#about" className="hover:text-accent transition-colors shrink-0">About Us</a>
          <a href="/#services" className="hover:text-accent transition-colors shrink-0">Our Service</a>
          <a href="/#pricing" className="hover:text-accent transition-colors shrink-0">Work with us</a>
          <a href="/#portfolio" className="hover:text-accent transition-colors shrink-0">Portfolio</a>
          <a href="/#team" className="hover:text-accent transition-colors shrink-0">Team</a>
          <button onClick={onOpenCalc} className="text-accent hover:text-maha-pink transition-colors shrink-0">Price Calculator</button>
          <a href="/#contact" className="hover:text-maha-pink transition-colors shrink-0">Contact Us</a>
          
          <div className="h-4 w-px bg-border mx-2" />
          
          <button 
            onClick={toggleTheme}
            className="p-2 hover:bg-surface rounded-full transition-colors text-text"
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-accent" /> : <Moon className="w-4 h-4 text-text" />}
          </button>

          <a href="/blog" className={`bg-maha-pink text-white px-6 py-2 rounded-full flex items-center gap-1 hover:bg-accent hover:text-maha-black transition-all ${pathname === '/blog' ? 'ring-1 ring-maha-pink ring-offset-2 ring-offset-bg' : ''}`}>
             ✦ บทความ
          </a>
        </div>
        
        <div className="lg:hidden flex items-center gap-4">
          <button 
            onClick={toggleTheme}
            className="p-2 hover:bg-surface rounded-full transition-colors text-text"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-accent" /> : <Moon className="w-4 h-4 text-text" />}
          </button>
          <button className="text-accent bg-surface px-4 py-2 rounded-full text-[10px] uppercase font-bold">
            Menu
          </button>
        </div>
      </div>
    </nav>
  );
};

import { leadService } from './services/leadService';

export default function App() {
  const { theme } = useTheme();
  const [content, setContent] = useState<SiteContent>(DEFAULT_CONTENT);
  const [loading, setLoading] = useState(true);
  const [isCalcOpen, setIsCalcOpen] = useState(false);
  const [prefilledMessage, setPrefilledMessage] = useState<string>('');

  useEffect(() => {
    const path = 'site/content';
    // Real-time sync with Firestore for site content
    const unsub = onSnapshot(doc(db, 'site', 'content'), (snap) => {
      if (snap.exists()) {
        setContent(snap.data() as SiteContent);
      } else {
        // Initialize if empty
        setDoc(doc(db, 'site', 'content'), { ...DEFAULT_CONTENT, updatedAt: serverTimestamp() }).catch(e => {
          console.warn('Initial content creation failed (likely permissions), using default.', e);
        });
      }
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, path);
      setLoading(false);
    });

    return () => unsub();
  }, []);

  useEffect(() => {
    if (isCalcOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isCalcOpen]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
        <div className="text-maha-yellow font-display animate-pulse text-2xl tracking-[0.5em] italic">MAHA</div>
      </div>
    );
  }

  return (
    <Router>
      <div className="relative overflow-hidden">
        <div className="noise-overlay" />
        <CustomCursor />
        <Navigation onOpenCalc={() => setIsCalcOpen(true)} />
        
        <Routes>
          <Route path="/" element={
            <IndexPage 
              content={content} 
              onOpenCalc={() => setIsCalcOpen(true)} 
              initialMessage={prefilledMessage}
            />
          } />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/blog/:id" element={<BlogPostPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/blog-admin" element={
            <ProtectedRoute>
              <BlogAdminPage />
            </ProtectedRoute>
          } />
          <Route path="/admin" element={
            <ProtectedRoute>
              <MahaAdminPage content={content} setContent={setContent} />
            </ProtectedRoute>
          } />
        </Routes>

        <AnimatePresence>
          {isCalcOpen && (
            <div className="fixed inset-0 z-[100] overflow-y-auto overflow-x-hidden">
               {/* BACKDROP */}
               <motion.div 
                 initial={{ opacity: 0 }} 
                 animate={{ opacity: 1 }} 
                 exit={{ opacity: 0 }} 
                 onClick={() => setIsCalcOpen(false)}
                 className="fixed inset-0 bg-black/90 backdrop-blur-md z-0" 
               />
               
               {/* MODAL CONTENT CONTAINER */}
               <div className="relative z-10 min-h-full flex items-center justify-center p-4 md:p-12 pointer-events-none">
                 <div className="w-full max-w-4xl pointer-events-auto">
                    <PriceCalculator 
                      content={content}
                      onClose={() => setIsCalcOpen(false)} 
                      onContact={async (summary) => {
                        setPrefilledMessage(summary);
                        try {
                          await leadService.submitLead({
                            name: 'Price Quote User',
                            email: 'guest@maha.marketings',
                            phone: '-',
                            message: summary,
                            source: 'price_calculator'
                          });
                        } catch (e) {
                          console.error('Lead failed:', e);
                        }
                        // Small timeout to allow state sync before index page scrolls
                        setTimeout(() => setPrefilledMessage(''), 1000);
                      }}
                    />
                 </div>
               </div>
            </div>
          )}
        </AnimatePresence>

        <footer className="bg-bg p-12">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-8">
            <div>
               <div className="mb-6 h-16">
                 <img 
                   src={theme === 'dark' ? '/logo-0.png' : '/logo-1.png'} 
                   alt="MAHA Marketings" 
                   className="h-full w-auto object-contain"
                 />
               </div>
               <p className="text-text/50 text-sm max-w-xs">Grow Luck. Create Wealth. Elevate Success.</p>
            </div>
            <div className="grid grid-cols-2 gap-12 text-sm text-text">
              <div className="flex flex-col gap-2">
                <span className="text-text/30 uppercase text-xs tracking-widest mb-2">Agency</span>
                <a href="#about" className="hover:text-accent transition-colors">About</a>
                <a href="#services" className="hover:text-accent transition-colors">Services</a>
                <a href="#portfolio" className="hover:text-accent transition-colors">Our Work</a>
              </div>
              <div className="flex flex-col gap-2">
                <span className="text-text/30 uppercase text-xs tracking-widest mb-2">Social</span>
                <a href="#" className="hover:text-maha-pink transition-colors">Facebook</a>
                <a href="#" className="hover:text-maha-pink transition-colors">TikTok</a>
                <a href="#" className="hover:text-maha-pink transition-colors">Instagram</a>
              </div>
            </div>
          </div>
          <div className="max-w-7xl mx-auto mt-20 pt-8 text-[10px] uppercase tracking-widest text-text/20">
            © 2025 MAHA Marketings. All rights reserved.
          </div>
        </footer>
      </div>
    </Router>
  );
}
