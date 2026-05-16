import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SiteContent } from '../constants';
import { 
  Save, Download, Layout, Info, Briefcase, Package, User, Phone, 
  Settings, Image, FileText, LogOut, Upload, Plus, Trash2, 
  ChevronUp, ChevronDown, Zap 
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { fileToBase64 } from '../lib/utils';
import { db } from '../lib/firebase';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';

interface Props {
  content: SiteContent;
  setContent: (content: SiteContent) => void;
}

export default function MahaAdminPage({ content, setContent }: Props) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('hero');
  const [localContent, setLocalContent] = useState<SiteContent>(content);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');

  const handleSave = async () => {
    setSaveStatus('saving');
    try {
      await setDoc(doc(db, 'site', 'content'), {
        ...localContent,
        updatedAt: serverTimestamp()
      }, { merge: true });
      setContent(localContent);
      setSaveStatus('saved');
    } catch (error) {
      console.error('Save failed:', error);
      setSaveStatus('idle');
      alert('Save failed. Please check permissions.');
    }
    setTimeout(() => setSaveStatus('idle'), 2000);
  };

  const handleExport = () => {
     const html = `<!DOCTYPE html><html><head><title>MAHA Marketings Export</title></head><body><script id="site-data" type="application/json">${JSON.stringify(localContent)}</script><h1>Exported Site</h1><p>Visit mahamarketings.com for the live version.</p></body></html>`;
     const blob = new Blob([html], { type: 'text/html' });
     const url = URL.createObjectURL(blob);
     const a = document.createElement('a');
     a.href = url;
     a.download = 'maha-marketings-index.html';
     a.click();
  };

  const tabs = [
    { id: 'hero', label: 'Hero', icon: Image },
    { id: 'about', label: 'About', icon: Info },
    { id: 'portfolio', label: 'Portfolio', icon: Layout },
    { id: 'services', label: 'Services', icon: Briefcase },
    { id: 'rates', label: 'Rates & Cards', icon: Package },
    { id: 'flow', label: 'Workflow', icon: Zap },
    { id: 'team', label: 'Team', icon: User },
    { id: 'contact', label: 'Contact', icon: Phone },
    { id: 'blog', label: 'Blog CMS', icon: FileText },
  ];

  const handleTabClick = (tabId: string) => {
    if (tabId === 'blog') {
      navigate('/blog-admin');
    } else {
      setActiveTab(tabId);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('maha_admin_auth');
    navigate('/login');
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'team' | 'service' | 'portfolio', index: number) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const base64 = await fileToBase64(file);
      if (type === 'team') {
        const next = [...localContent.team];
        next[index] = { ...next[index], avatar: base64 };
        setLocalContent({ ...localContent, team: next });
      } else if (type === 'service') {
        const next = [...localContent.services];
        next[index] = { ...next[index], popImage: base64 };
        setLocalContent({ ...localContent, services: next });
      } else if (type === 'portfolio') {
        const next = [...localContent.portfolio];
        next[index] = { ...next[index], image: base64 };
        setLocalContent({ ...localContent, portfolio: next });
      }
    } catch (error) {
      console.error('Upload failed:', error);
    }
    e.target.value = '';
  };

  const movePortfolioItem = (index: number, direction: 'up' | 'down') => {
    const nextIdx = direction === 'up' ? index - 1 : index + 1;
    if (nextIdx < 0 || nextIdx >= localContent.portfolio.length) return;
    
    const newItems = [...localContent.portfolio];
    [newItems[index], newItems[nextIdx]] = [newItems[nextIdx], newItems[index]];
    setLocalContent({ ...localContent, portfolio: newItems });
  };

  const addPortfolioItem = () => {
    setLocalContent({
      ...localContent,
      portfolio: [
        { name: 'New Client', category: 'Category', image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80', desc: '' },
        ...localContent.portfolio
      ]
    });
  };

  const removePortfolioItem = (index: number) => {
    const newItems = localContent.portfolio.filter((_, i) => i !== index);
    setLocalContent({ ...localContent, portfolio: newItems });
  };

  return (
    <div className="min-h-screen bg-[#0F0F0F] text-white pt-20 pb-20 font-thai">
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-[280px_1fr] gap-12">
        
        {/* SIDEBAR */}
        <aside className="flex flex-col h-[calc(100vh-10rem)]">
          <div className="space-y-4 flex-1">
            <div className="p-8 bg-white/5 rounded-[2.5rem] mb-4">
               <div className="h-12 mb-4">
                 <img src="/logo-3.png" alt="MAHA" referrerPolicy="no-referrer" className="h-full w-auto object-contain" />
               </div>
               <div className="text-[10px] uppercase tracking-widest text-white/30 flex items-center gap-2">
                 <span className="bg-maha-yellow text-maha-black px-2 py-0.5 rounded-full font-black">ADMIN</span>
                 Site Management
               </div>
            </div>
            
            <div className="space-y-2">
               {tabs.map(tab => (
                 <button
                   key={tab.id}
                   onClick={() => handleTabClick(tab.id)}
                   className={`w-full text-left px-8 py-5 rounded-2xl flex items-center gap-4 transition-all ${activeTab === tab.id ? 'bg-maha-yellow text-maha-black font-black shadow-lg shadow-maha-yellow/10' : 'hover:bg-white/5'}`}
                 >
                   <tab.icon size={20} />
                   {tab.label}
                 </button>
               ))}
            </div>

            <div className="pt-8 space-y-4">
               <button onClick={handleSave} className="w-full bg-white/10 hover:bg-white/20 py-5 rounded-2xl flex items-center justify-center gap-2 font-bold transition-all">
                  {saveStatus === 'saving' ? 'Saving...' : saveStatus === 'saved' ? 'Saved! ✓' : <><Save size={18} /> Save Changes</>}
               </button>
               <button onClick={handleExport} className="w-full bg-maha-pink hover:bg-maha-yellow hover:text-maha-black py-5 rounded-2xl flex items-center justify-center gap-2 font-bold transition-all shadow-xl shadow-maha-pink/5">
                  <Download size={18} /> Export & Deploy
               </button>
            </div>
          </div>

          <button 
            onClick={handleLogout}
            className="mt-12 flex items-center gap-4 px-8 py-5 text-white/40 hover:text-maha-pink hover:bg-maha-pink/10 rounded-2xl transition-all"
          >
            <LogOut size={20} /> Logout
          </button>
        </aside>

        {/* EDITOR AREA */}
        <main className="bg-white/5 rounded-[3.5rem] p-12 h-[calc(100vh-10rem)] overflow-y-auto custom-scrollbar">
           <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.2 }}
                className="space-y-10"
              >
                {activeTab === 'hero' && (
                  <div className="space-y-12">
                     <div className="space-y-8">
                        <h3 className="text-3xl font-display text-white italic">MAIN TITLES</h3>
                        <div className="space-y-4">
                           <label className="block text-xs uppercase tracking-widest text-white/30 px-2 font-bold">Headline (3 Lines)</label>
                           {localContent.hero.headline.map((line, i) => (
                              <input 
                                key={i}
                                type="text" 
                                value={line} 
                                onChange={e => {
                                  const next = [...localContent.hero.headline];
                                  next[i] = e.target.value;
                                  setLocalContent({...localContent, hero: {...localContent.hero, headline: next}});
                                }}
                                className="w-full bg-white/5 text-white rounded-[1.5rem] px-8 py-5 focus:ring-2 focus:ring-maha-yellow outline-none transition-all"
                              />
                           ))}
                        </div>
                        <div className="space-y-4">
                           <label className="block text-xs uppercase tracking-widest text-white/30 px-2 font-bold">Subtext (TH)</label>
                           <textarea 
                             value={localContent.hero.subtext}
                             onChange={e => setLocalContent({...localContent, hero: {...localContent.hero, subtext: e.target.value}})}
                             className="w-full bg-white/5 text-white rounded-[1.5rem] px-8 py-5 focus:ring-2 focus:ring-maha-yellow outline-none h-32 resize-none transition-all text-sm"
                           />
                        </div>
                     </div>

                     <div className="space-y-8">
                        <h3 className="text-3xl font-display text-white italic">KPI COUNTERS</h3>
                        <div className="grid grid-cols-2 gap-4">
                           {localContent.hero.kpis.map((kpi, i) => (
                              <div key={i} className="bg-white/5 p-6 rounded-3xl space-y-3">
                                 <input 
                                   value={kpi.label} 
                                   onChange={e => {
                                      const next = [...localContent.hero.kpis];
                                      next[i].label = e.target.value;
                                      setLocalContent({...localContent, hero: {...localContent.hero, kpis: next}});
                                   }}
                                   placeholder="Label"
                                   className="w-full bg-transparent border-none p-0 text-[10px] uppercase tracking-widest text-white/30 outline-none"
                                 />
                                 <input 
                                   value={kpi.value} 
                                   onChange={e => {
                                      const next = [...localContent.hero.kpis];
                                      next[i].value = e.target.value;
                                      setLocalContent({...localContent, hero: {...localContent.hero, kpis: next}});
                                   }}
                                   placeholder="Value"
                                   className="w-full bg-transparent border-none p-0 text-xl font-black outline-none"
                                 />
                              </div>
                           ))}
                        </div>
                     </div>

                     <div className="space-y-8">
                        <h3 className="text-3xl font-display text-white italic">DECO CARDS</h3>
                        <div className="grid gap-6">
                           {localContent.hero.decoCards.map((card, i) => (
                              <div key={i} className="bg-white/5 p-8 rounded-[2rem] grid md:grid-cols-2 gap-6">
                                 <div className="space-y-4">
                                    <label className="text-[10px] uppercase text-white/30 font-bold">Card {i+1} Name</label>
                                    <input 
                                       value={card.title} 
                                       onChange={e => {
                                          const next = [...localContent.hero.decoCards];
                                          next[i].title = e.target.value;
                                          setLocalContent({...localContent, hero: {...localContent.hero, decoCards: next}});
                                       }}
                                       className="w-full bg-white/5 rounded-2xl px-6 py-4 outline-none"
                                    />
                                 </div>
                                 <div className="space-y-4">
                                    <label className="text-[10px] uppercase text-white/30 font-bold">Trend (+ %)</label>
                                    <input 
                                       value={card.trend} 
                                       onChange={e => {
                                          const next = [...localContent.hero.decoCards];
                                          next[i].trend = e.target.value;
                                          setLocalContent({...localContent, hero: {...localContent.hero, decoCards: next}});
                                       }}
                                       className="w-full bg-white/5 rounded-2xl px-6 py-4 outline-none"
                                    />
                                 </div>
                                 <div className="space-y-4">
                                    <label className="text-[10px] uppercase text-white/30 font-bold">Display Value</label>
                                    <input 
                                       value={card.value} 
                                       onChange={e => {
                                          const next = [...localContent.hero.decoCards];
                                          next[i].value = e.target.value;
                                          setLocalContent({...localContent, hero: {...localContent.hero, decoCards: next}});
                                       }}
                                       className="w-full bg-white/5 rounded-2xl px-6 py-4 outline-none"
                                    />
                                 </div>
                                 <div className="space-y-4">
                                    <label className="text-[10px] uppercase text-white/30 font-bold">Bottom Label</label>
                                    <input 
                                       value={card.label} 
                                       onChange={e => {
                                          const next = [...localContent.hero.decoCards];
                                          next[i].label = e.target.value;
                                          setLocalContent({...localContent, hero: {...localContent.hero, decoCards: next}});
                                       }}
                                       className="w-full bg-white/5 rounded-2xl px-6 py-4 outline-none"
                                    />
                                 </div>
                              </div>
                           ))}
                        </div>
                     </div>

                     <div className="space-y-8">
                        <h3 className="text-3xl font-display text-white italic">MARQUEE TEXT (แถบเลื่อน)</h3>
                        <div className="bg-white/5 p-8 rounded-3xl space-y-4">
                           {localContent.hero.marquee.map((text, i) => (
                             <div key={i} className="flex gap-4">
                               <input 
                                 value={text} 
                                 onChange={e => {
                                    const next = [...localContent.hero.marquee];
                                    next[i] = e.target.value;
                                    setLocalContent({...localContent, hero: {...localContent.hero, marquee: next}});
                                 }}
                                 className="flex-1 bg-white/5 rounded-xl px-6 py-3 outline-none"
                               />
                               <button 
                                 onClick={() => {
                                   const next = localContent.hero.marquee.filter((_, idx) => idx !== i);
                                   setLocalContent({...localContent, hero: {...localContent.hero, marquee: next}});
                                 }}
                                 className="p-3 text-white/20 hover:text-maha-pink transition-colors"
                               >
                                 <Trash2 size={18} />
                               </button>
                             </div>
                           ))}
                           <button 
                             onClick={() => setLocalContent({...localContent, hero: {...localContent.hero, marquee: [...localContent.hero.marquee, 'NEW TAG']}})}
                             className="w-full py-3 border-2 border-dashed border-white/10 rounded-xl hover:border-maha-yellow/30 hover:text-maha-yellow transition-all flex items-center justify-center gap-2 text-xs uppercase font-bold"
                           >
                             <Plus size={16} /> Add Marquee Item
                           </button>
                        </div>
                     </div>
                  </div>
                )}

                {activeTab === 'about' && (
                   <div className="space-y-12">
                      <div className="space-y-6">
                         <h3 className="text-3xl font-display italic">ABOUT HEADING</h3>
                         <div className="grid gap-4">
                            {localContent.about.heading.map((line, i) => (
                              <input 
                                key={i}
                                value={line} 
                                onChange={e => {
                                  const next = [...localContent.about.heading];
                                  next[i] = e.target.value;
                                  setLocalContent({...localContent, about: {...localContent.about, heading: next}});
                                }}
                                className="w-full bg-white/5 rounded-2xl px-8 py-5 outline-none font-display text-2xl uppercase" 
                              />
                            ))}
                         </div>
                      </div>

                      <div className="space-y-6">
                         <h3 className="text-3xl font-display italic">FOUR PILLARS</h3>
                         <div className="grid gap-6">
                            {localContent.about.pillars.map((pillar, i) => (
                              <div key={i} className="bg-white/5 p-8 rounded-[2rem] space-y-4">
                                 <div className="flex gap-6 items-start">
                                    <div className="w-12 h-12 bg-maha-pink/10 text-maha-pink rounded-xl flex items-center justify-center shrink-0">
                                       <Zap size={24} />
                                    </div>
                                    <div className="flex-1 space-y-4">
                                       <input 
                                         value={pillar.title} 
                                         onChange={e => {
                                           const next = [...localContent.about.pillars];
                                           next[i].title = e.target.value;
                                           setLocalContent({...localContent, about: {...localContent.about, pillars: next}});
                                         }}
                                         className="w-full bg-transparent border-none p-0 text-xl font-bold outline-none" 
                                       />
                                       <textarea 
                                         value={pillar.desc} 
                                         onChange={e => {
                                           const next = [...localContent.about.pillars];
                                           next[i].desc = e.target.value;
                                           setLocalContent({...localContent, about: {...localContent.about, pillars: next}});
                                         }}
                                         className="w-full bg-white/5 rounded-xl p-4 text-sm resize-none outline-none" 
                                       />
                                    </div>
                                 </div>
                              </div>
                            ))}
                         </div>
                      </div>
                   </div>
                )}

                {activeTab === 'portfolio' && (
                  <div className="space-y-10">
                     <div className="flex justify-between items-center bg-white/5 p-6 rounded-3xl border border-white/5">
                        <div>
                          <h3 className="text-3xl font-display text-white italic uppercase">Portfolio Showcase</h3>
                          <p className="text-[10px] uppercase text-white/20 tracking-widest mt-1">จัดการผลงานลูกค้า เพิ่ม/ลบ และสลับลำดับได้</p>
                        </div>
                        <button 
                          onClick={addPortfolioItem}
                          className="bg-maha-yellow text-maha-black px-8 py-4 rounded-2xl font-black flex items-center gap-2 hover:bg-white transition-all shadow-lg"
                        >
                          <Plus size={18} /> ADD NEW ITEM
                        </button>
                     </div>

                     <div className="grid gap-6">
                        {localContent.portfolio.map((item, i) => (
                           <div key={i} className="group bg-white/5 rounded-[2.5rem] p-10 border border-white/5 hover:bg-white/10 transition-all">
                              <div className="flex flex-col lg:flex-row gap-10">
                                 <div className="flex flex-col gap-4 shrink-0">
                                    <div className="w-full lg:w-48 aspect-video lg:aspect-square rounded-3xl bg-black/40 border border-white/10 relative group/img cursor-pointer overflow-hidden">
                                       {item.image && <img src={item.image} referrerPolicy="no-referrer" className="w-full h-full object-cover" />}
                                       <label className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center opacity-0 group-hover/img:opacity-100 transition-opacity cursor-pointer">
                                          <input 
                                            type="file" 
                                            className="hidden" 
                                            accept="image/*"
                                            onChange={e => handleFileUpload(e, 'portfolio', i)}
                                          />
                                          <Upload size={24} className="mb-2" />
                                          <span className="text-[10px] font-bold">อัปโหลดรูป</span>
                                       </label>
                                    </div>
                                    <div className="flex justify-between gap-2">
                                       <button 
                                         onClick={() => movePortfolioItem(i, 'up')}
                                         disabled={i === 0}
                                         className="flex-1 bg-white/5 hover:bg-white/10 p-4 rounded-xl disabled:opacity-10 transition-all flex items-center justify-center"
                                       >
                                          <ChevronUp size={16} />
                                       </button>
                                       <button 
                                         onClick={() => movePortfolioItem(i, 'down')}
                                         disabled={i === localContent.portfolio.length - 1}
                                         className="flex-1 bg-white/5 hover:bg-white/10 p-4 rounded-xl disabled:opacity-10 transition-all flex items-center justify-center"
                                       >
                                          <ChevronDown size={16} />
                                       </button>
                                    </div>
                                 </div>

                                 <div className="flex-1 space-y-6">
                                    <div className="grid md:grid-cols-2 gap-6">
                                       <div className="space-y-1">
                                          <label className="text-[10px] uppercase text-white/20 pl-4 font-bold">ชื่อลูกค้า</label>
                                          <input 
                                            value={item.name} 
                                            onChange={e => {
                                              const next = [...localContent.portfolio];
                                              next[i] = {...next[i], name: e.target.value};
                                              setLocalContent({...localContent, portfolio: next});
                                            }}
                                            className="w-full bg-white/5 rounded-2xl px-6 py-4 outline-none font-bold"
                                          />
                                       </div>
                                       <div className="space-y-1">
                                          <label className="text-[10px] uppercase text-white/20 pl-4 font-bold">หมวดหมู่</label>
                                          <input 
                                            value={item.category} 
                                            onChange={e => {
                                              const next = [...localContent.portfolio];
                                              next[i] = {...next[i], category: e.target.value};
                                              setLocalContent({...localContent, portfolio: next});
                                            }}
                                            className="w-full bg-white/5 rounded-2xl px-6 py-4 outline-none text-accent"
                                          />
                                       </div>
                                    </div>
                                    <div className="space-y-1">
                                       <label className="text-[10px] uppercase text-white/20 pl-4 font-bold">คำอธิบายงาน (ปรากฏใน Tooltip/Detail)</label>
                                       <textarea 
                                         value={item.desc || ''} 
                                         onChange={e => {
                                           const next = [...localContent.portfolio];
                                           next[i] = {...next[i], desc: e.target.value};
                                           setLocalContent({...localContent, portfolio: next});
                                         }}
                                         placeholder="รายละเอียดผลงาน..."
                                         className="w-full bg-white/5 rounded-2xl px-6 py-4 outline-none h-24 resize-none text-sm font-thai opacity-70"
                                       />
                                    </div>
                                    <div className="flex justify-end pt-2">
                                       <button 
                                         onClick={() => removePortfolioItem(i)}
                                         className="p-4 text-white/10 hover:text-red-500 hover:bg-red-500/10 rounded-2xl transition-all flex items-center gap-2 group/del"
                                       >
                                         <Trash2 size={16} />
                                         <span className="text-[10px] font-bold opacity-0 group-hover/del:opacity-100 uppercase">ลบผลงาน</span>
                                       </button>
                                    </div>
                                 </div>
                              </div>
                           </div>
                        ))}
                     </div>
                  </div>
                )}

                {activeTab === 'rates' && (
                   <div className="space-y-16">
                      <div className="space-y-8">
                         <h3 className="text-3xl font-display italic">MAIN PACKAGES</h3>
                         <div className="grid gap-6">
                            {localContent.packages.map((pkg, i) => (
                              <div key={i} className="bg-white/5 p-8 rounded-[2rem] space-y-6">
                                 <div className="flex justify-between items-start">
                                    <input 
                                      value={pkg.name} 
                                      onChange={e => {
                                        const next = [...localContent.packages];
                                        next[i] = {...next[i], name: e.target.value};
                                        setLocalContent({...localContent, packages: next});
                                      }}
                                      className="bg-transparent text-xl font-black text-maha-yellow outline-none uppercase" 
                                    />
                                    <input 
                                      value={pkg.price} 
                                      onChange={e => {
                                        const next = [...localContent.packages];
                                        next[i] = {...next[i], price: e.target.value};
                                        setLocalContent({...localContent, packages: next});
                                      }}
                                      className="bg-white/10 px-4 py-2 rounded-full text-right w-32 outline-none font-bold" 
                                    />
                                 </div>
                                 <textarea 
                                   value={pkg.desc} 
                                   onChange={e => {
                                     const next = [...localContent.packages];
                                     next[i] = {...next[i], desc: e.target.value};
                                     setLocalContent({...localContent, packages: next});
                                   }}
                                   placeholder="Description"
                                   className="w-full bg-white/5 rounded-xl p-4 text-xs resize-none outline-none h-20" 
                                 />
                                 <div className="space-y-2">
                                    <label className="text-[10px] uppercase font-bold text-white/20">Features (one per line)</label>
                                    <textarea 
                                      value={pkg.items.join('\n')} 
                                      onChange={e => {
                                        const next = [...localContent.packages];
                                        next[i] = {...next[i], items: e.target.value.split('\n')};
                                        setLocalContent({...localContent, packages: next});
                                      }}
                                      className="w-full bg-white/5 rounded-xl p-4 text-xs resize-none outline-none h-32" 
                                    />
                                 </div>
                              </div>
                            ))}
                         </div>
                      </div>

                      <div className="space-y-8">
                         <h3 className="text-3xl font-display italic uppercase">Artwork Rate Card</h3>
                         <div className="grid md:grid-cols-2 gap-6">
                            {localContent.artworkRateCard.map((card, i) => (
                              <div key={i} className="bg-white/5 p-8 rounded-[2rem] space-y-4">
                                 <input value={card.name} onChange={e => {
                                   const next = [...localContent.artworkRateCard];
                                   next[i].name = e.target.value;
                                   setLocalContent({...localContent, artworkRateCard: next});
                                 }} className="w-full bg-transparent p-0 border-none font-bold outline-none" />
                                 <div className="grid grid-cols-2 gap-2">
                                    <div className="space-y-1">
                                       <label className="text-[10px] text-white/30 uppercase">Grade A</label>
                                       <input value={card.grades.A} onChange={e => {
                                         const next = [...localContent.artworkRateCard];
                                         next[i].grades.A = e.target.value;
                                         setLocalContent({...localContent, artworkRateCard: next});
                                       }} className="w-full bg-white/5 rounded-lg px-3 py-2 outline-none text-xs" />
                                    </div>
                                    <div className="space-y-1">
                                       <label className="text-[10px] text-white/30 uppercase">Grade B</label>
                                       <input value={card.grades.B} onChange={e => {
                                         const next = [...localContent.artworkRateCard];
                                         next[i].grades.B = e.target.value;
                                         setLocalContent({...localContent, artworkRateCard: next});
                                       }} className="w-full bg-white/5 rounded-lg px-3 py-2 outline-none text-xs" />
                                    </div>
                                 </div>
                              </div>
                            ))}
                         </div>
                      </div>

                      <div className="space-y-8">
                         <button 
                           onClick={() => setLocalContent({...localContent, addons: [...localContent.addons, {name: 'New Addon', price: '0', desc: '', subText: ''}]})}
                           className="float-right bg-white/10 px-4 py-2 rounded-xl text-xs hover:bg-white/20 transition-all flex items-center gap-2"
                         >
                           <Plus size={14} /> Add Extra
                         </button>
                         <h3 className="text-3xl font-display italic">ADD-ONS (Extras)</h3>
                         <div className="grid gap-4">
                            {localContent.addons.map((addon, i) => (
                              <div key={i} className="bg-white/5 p-6 rounded-2xl flex gap-6 items-center group">
                                 <div className="flex-1 space-y-4">
                                    <div className="flex gap-4">
                                       <input value={addon.name} onChange={e => {
                                          const next = [...localContent.addons];
                                          next[i].name = e.target.value;
                                          setLocalContent({...localContent, addons: next});
                                       }} className="flex-1 bg-transparent p-0 font-bold outline-none" />
                                       <input value={addon.price} onChange={e => {
                                          const next = [...localContent.addons];
                                          next[i].price = e.target.value;
                                          setLocalContent({...localContent, addons: next});
                                       }} className="bg-white/5 px-4 py-1 rounded-lg text-right w-32 outline-none font-bold text-accent" />
                                    </div>
                                    <input value={addon.desc} onChange={e => {
                                       const next = [...localContent.addons];
                                       next[i].desc = e.target.value;
                                       setLocalContent({...localContent, addons: next});
                                    }} className="w-full bg-transparent p-0 text-xs text-white/40 outline-none" placeholder="Description..." />
                                 </div>
                                 <button 
                                   onClick={() => setLocalContent({...localContent, addons: localContent.addons.filter((_, idx) => idx !== i)})}
                                   className="p-3 text-white/10 hover:text-maha-pink opacity-0 group-hover:opacity-100 transition-all"
                                 >
                                   <Trash2 size={16} />
                                 </button>
                              </div>
                            ))}
                         </div>
                      </div>
                   </div>
                )}

                {activeTab === 'flow' && (
                   <div className="space-y-16">
                      <div className="space-y-8">
                         <h3 className="text-3xl font-display italic uppercase">Work Process Steps</h3>
                         <div className="grid gap-6">
                            {localContent.process.map((p, i) => (
                               <div key={i} className="bg-white/5 p-8 rounded-3xl flex gap-6">
                                  <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center shrink-0 text-white/20">{i+1}</div>
                                  <div className="flex-1 space-y-4">
                                     <input value={p.title} onChange={e => {
                                        const next = [...localContent.process];
                                        next[i].title = e.target.value;
                                        setLocalContent({...localContent, process: next});
                                     }} className="w-full bg-transparent p-0 text-xl font-bold outline-none" />
                                     <input value={p.desc} onChange={e => {
                                        const next = [...localContent.process];
                                        next[i].desc = e.target.value;
                                        setLocalContent({...localContent, process: next});
                                     }} className="w-full bg-transparent p-0 text-sm text-white/40 outline-none" />
                                  </div>
                               </div>
                            ))}
                         </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-12">
                         <div className="space-y-8">
                            <h3 className="text-3xl font-display italic">RESULTS (SMART)</h3>
                            <div className="grid gap-4">
                               {localContent.results.goals.map((goal, i) => (
                                 <input key={i} value={goal} onChange={e => {
                                   const next = [...localContent.results.goals];
                                   next[i] = e.target.value;
                                   setLocalContent({...localContent, results: {...localContent.results, goals: next}});
                                 }} className="w-full bg-white/5 rounded-2xl px-6 py-4 outline-none uppercase" />
                               ))}
                            </div>
                         </div>
                         <div className="space-y-8">
                            <h3 className="text-3xl font-display italic">LOYALTY CARD</h3>
                            <div className="bg-maha-yellow/10 border border-maha-yellow/20 p-8 rounded-[2.5rem] space-y-6">
                               <div className="space-y-1">
                                  <label className="text-[10px] text-maha-yellow font-black uppercase">Heading</label>
                                  <input value={localContent.loyalty.title} onChange={e => setLocalContent({...localContent, loyalty: {...localContent.loyalty, title: e.target.value}})} className="w-full bg-maha-yellow/10 rounded-xl px-4 py-3 outline-none text-maha-yellow" />
                               </div>
                               <div className="space-y-1">
                                  <label className="text-[10px] text-maha-yellow font-black uppercase">Description Line</label>
                                  <input value={localContent.loyalty.desc} onChange={e => setLocalContent({...localContent, loyalty: {...localContent.loyalty, desc: e.target.value}})} className="w-full bg-maha-yellow/10 rounded-xl px-4 py-3 outline-none" />
                               </div>
                               <div className="space-y-1">
                                  <label className="text-[10px] text-maha-yellow font-black uppercase">Discount Text</label>
                                  <input value={localContent.loyalty.discount} onChange={e => setLocalContent({...localContent, loyalty: {...localContent.loyalty, discount: e.target.value}})} className="w-full bg-maha-yellow/10 rounded-xl px-4 py-3 outline-none font-bold" />
                               </div>
                               <div className="space-y-1">
                                  <label className="text-[10px] text-maha-yellow font-black uppercase">CTA Message</label>
                                  <input value={localContent.loyalty.cta} onChange={e => setLocalContent({...localContent, loyalty: {...localContent.loyalty, cta: e.target.value}})} className="w-full bg-maha-yellow/10 rounded-xl px-4 py-3 outline-none text-xs" />
                               </div>
                            </div>
                         </div>
                      </div>
                   </div>
                )}

                {activeTab === 'services' && (
                  <div className="space-y-8">
                     <h3 className="text-3xl font-display mb-6 uppercase">OUR SERVICES</h3>
                     <div className="grid md:grid-cols-2 gap-8">
                        {localContent.services.map((service, i) => (
                          <div key={i} className={`p-8 rounded-[2.5rem] space-y-6 border border-white/5 bg-white/5 hover:bg-white/10 transition-all`}>
                             <div className="flex justify-between items-center">
                                <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${service.color || 'bg-white/10'}`}>Service {i + 1}</span>
                             </div>
                             
                             <div className="space-y-4">
                                <div className="space-y-1">
                                   <label className="text-[10px] uppercase tracking-widest text-white/30 px-2">Title</label>
                                   <input 
                                     value={service.title} 
                                     onChange={e => {
                                       const update = [...localContent.services];
                                       update[i] = {...update[i], title: e.target.value};
                                       setLocalContent({...localContent, services: update});
                                     }}
                                     className="w-full bg-white/5 text-white rounded-2xl px-6 py-4 focus:ring-1 focus:ring-maha-yellow outline-none font-bold" 
                                   />
                                </div>
                                <div className="space-y-1">
                                   <label className="text-[10px] uppercase tracking-widest text-white/30 px-2">Description</label>
                                   <textarea 
                                     value={service.desc}
                                     onChange={e => {
                                       const update = [...localContent.services];
                                       update[i] = {...update[i], desc: e.target.value};
                                       setLocalContent({...localContent, services: update});
                                     }}
                                     className="w-full bg-white/5 rounded-2xl p-6 text-sm resize-none focus:ring-1 focus:ring-maha-yellow outline-none h-24"
                                   />
                                </div>
                                <div className="space-y-1">
                                   <label className="text-[10px] uppercase tracking-widest text-white/30 px-2">Pop Image</label>
                                   <div className="flex gap-4 items-center">
                                      <div className="w-16 h-16 rounded-xl bg-white/5 border border-white/10 overflow-hidden shrink-0 group relative cursor-pointer">
                                         {service.popImage && <img src={service.popImage} className="w-full h-full object-cover" />}
                                         <label className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                                            <input 
                                              type="file" 
                                              className="hidden" 
                                              accept="image/*"
                                              onChange={e => handleFileUpload(e, 'service', i)}
                                            />
                                            <Upload size={16} />
                                         </label>
                                      </div>
                                      <input 
                                        value={service.popImage || ''} 
                                        onChange={e => {
                                          const update = [...localContent.services];
                                          update[i] = {...update[i], popImage: e.target.value};
                                          setLocalContent({...localContent, services: update});
                                        }}
                                        placeholder="หรือวาง URL..."
                                        className="flex-1 bg-white/5 text-white rounded-2xl px-6 py-4 focus:ring-1 focus:ring-maha-yellow outline-none font-mono text-[10px]" 
                                      />
                                   </div>
                                </div>
                             </div>
                          </div>
                        ))}
                     </div>
                  </div>
                )}

                {activeTab === 'team' && (
                  <div className="space-y-8">
                     <h3 className="text-3xl font-display mb-6 uppercase">TEAM & FOUNDERS</h3>
                     <div className="grid gap-12">
                        {localContent.team.map((member, i) => (
                          <div key={i} className="bg-white/5 p-10 rounded-[3rem] space-y-6 hover:bg-white/10 transition-all border border-white/5">
                             <div className="flex gap-8">
                                <div className="w-32 h-32 rounded-3xl bg-white/5 overflow-hidden shrink-0 border border-white/10 group relative cursor-pointer">
                                   <img src={member.avatar} referrerPolicy="no-referrer" alt={member.name} className="w-full h-full object-cover" />
                                   <label className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                                      <input 
                                        type="file" 
                                        className="hidden" 
                                        accept="image/*"
                                        onChange={e => handleFileUpload(e, 'team', i)}
                                      />
                                      <Upload size={24} className="mb-2" />
                                      <span className="text-[10px] font-bold">อัปโหลด</span>
                                   </label>
                                </div>
                                <div className="flex-1 space-y-4">
                                   <div className="space-y-1">
                                      <label className="text-[10px] uppercase tracking-widest text-white/30 px-2">Name</label>
                                      <input 
                                        value={member.name} 
                                        onChange={e => {
                                          const next = [...localContent.team];
                                          const update = [...next];
                                          update[i] = {...update[i], name: e.target.value};
                                          setLocalContent({...localContent, team: update});
                                        }}
                                        className="w-full bg-white/5 text-white rounded-2xl px-6 py-4 focus:ring-1 focus:ring-maha-yellow outline-none font-bold" 
                                      />
                                   </div>
                                   <div className="space-y-1">
                                      <label className="text-[10px] uppercase tracking-widest text-white/30 px-2">Role</label>
                                      <input 
                                        value={member.role} 
                                        onChange={e => {
                                          const next = [...localContent.team];
                                          const update = [...next];
                                          update[i] = {...update[i], role: e.target.value};
                                          setLocalContent({...localContent, team: update});
                                        }}
                                        className="w-full bg-white/5 text-white rounded-2xl px-6 py-4 focus:ring-1 focus:ring-maha-yellow outline-none text-xs" 
                                      />
                                   </div>
                                </div>
                             </div>
                             <div className="space-y-1">
                                <label className="text-[10px] uppercase tracking-widest text-white/30 px-2">Avatar URL (หรืออัปโหลดโดยกดรูปด้านบน)</label>
                                <input 
                                  value={member.avatar || ''} 
                                  onChange={e => {
                                    const next = [...localContent.team];
                                    const update = [...next];
                                    update[i] = {...update[i], avatar: e.target.value};
                                    setLocalContent({...localContent, team: update});
                                  }}
                                  placeholder="หรือวาง URL ที่นี่..."
                                  className="w-full bg-white/5 text-white rounded-2xl px-6 py-4 focus:ring-1 focus:ring-maha-yellow outline-none font-mono text-[10px]" 
                                />
                             </div>
                             <div className="space-y-1">
                                <label className="text-[10px] uppercase tracking-widest text-white/30 px-2">Bio</label>
                                <textarea 
                                  value={member.bio}
                                  onChange={e => {
                                    const next = [...localContent.team];
                                    const update = [...next];
                                    update[i] = {...update[i], bio: e.target.value};
                                    setLocalContent({...localContent, team: update});
                                  }}
                                  className="w-full bg-white/5 rounded-2xl p-6 text-sm resize-none focus:ring-1 focus:ring-maha-yellow outline-none h-24"
                                />
                             </div>
                          </div>
                        ))}
                     </div>
                  </div>
                )}

                {activeTab === 'contact' && (
                  <div className="space-y-12">
                     <h3 className="text-3xl font-display mb-6 uppercase italic">Contact Information</h3>
                     <div className="bg-white/5 p-12 rounded-[3.5rem] space-y-8">
                        <div className="space-y-2">
                           <label className="text-[10px] uppercase tracking-widest text-white/30 px-3 font-bold">Email Support</label>
                           <input 
                             value={localContent.contact.email} 
                             onChange={e => setLocalContent({...localContent, contact: {...localContent.contact, email: e.target.value}})}
                             className="w-full bg-white/5 rounded-[1.5rem] px-8 py-5 outline-none font-bold" 
                           />
                        </div>
                        <div className="space-y-2">
                           <label className="text-[10px] uppercase tracking-widest text-white/30 px-3 font-bold">LINE ID</label>
                           <input 
                             value={localContent.contact.line} 
                             onChange={e => setLocalContent({...localContent, contact: {...localContent.contact, line: e.target.value}})}
                             className="w-full bg-white/5 rounded-[1.5rem] px-8 py-5 outline-none font-bold text-accent" 
                           />
                        </div>
                        <div className="space-y-2">
                           <label className="text-[10px] uppercase tracking-widest text-white/30 px-3 font-bold">Response Time Text</label>
                           <input 
                             value={localContent.contact.responseTime} 
                             onChange={e => setLocalContent({...localContent, contact: {...localContent.contact, responseTime: e.target.value}})}
                             className="w-full bg-white/5 rounded-[1.5rem] px-8 py-5 outline-none" 
                           />
                        </div>
                     </div>
                  </div>
                )}

                {!['hero', 'about', 'services', 'rates', 'flow', 'team', 'portfolio', 'contact'].includes(activeTab) && (
                   <div className="py-20 text-center text-white/20">
                      <Layout size={64} className="mx-auto mb-6 opacity-10" />
                      <p className="text-lg">Editor for "{activeTab.toUpperCase()}" placeholder</p>
                   </div>
                )}
              </motion.div>
           </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
