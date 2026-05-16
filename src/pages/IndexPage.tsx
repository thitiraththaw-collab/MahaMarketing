/// <reference types="vite/client" />
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { SiteContent } from '../constants';
import { ArrowUpRight, Calculator, Plus, Minus, Check, X, Search, Filter, Target, BarChart3, Palette, Trophy, MessageSquare, Compass, Rocket, FileText, TrendingUp } from 'lucide-react';

interface Props {
  content: SiteContent;
  onOpenCalc: () => void;
  initialMessage?: string;
}

import { leadService } from '../services/leadService';

export default function IndexPage({ content, onOpenCalc, initialMessage }: Props) {
  const [activeTab, setActiveTab] = useState(0);
  const [message, setMessage] = useState('');

  const FloatingDeco = ({ src, className, duration = 5, delay = 0, yOffset = 20, rotate = 0, tint = false }: { src: string, className: string, duration?: number, delay?: number, yOffset?: number, rotate?: number, tint?: boolean }) => (
    <motion.img
      src={src}
      className={`absolute pointer-events-none z-0 ${className} ${tint ? 'contrast-[1.1] brightness-[1.1] sepia saturate-[8] hue-rotate-[15deg]' : ''}`}
      initial={{ y: 0, rotate: 0 }}
      animate={{ 
        y: [0, yOffset, 0],
        rotate: rotate !== 0 ? [0, rotate, 0] : 0
      }}
      transition={{ 
        duration, 
        repeat: Infinity, 
        ease: "easeInOut",
        delay 
      }}
      referrerPolicy="no-referrer"
    />
  );

  const handleSelectPackage = (pkgName: string, price: any) => {
    const summary = `สนใจบริการ:\n• Package: ${pkgName}\n• ราคาประมาณ: ฿${typeof price === 'number' ? price.toLocaleString() : price}/เดือน\n--------------------------`;
    setMessage(summary);
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSelectBranding = (brName: string, price: any) => {
    const summary = `สนใจบริการ Branding:\n• Package: ${brName}\n• ราคาประมาณ: ฿${typeof price === 'number' ? price.toLocaleString() : price}\n--------------------------`;
    setMessage(summary);
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    if (initialMessage) {
      setMessage(initialMessage);
      const contactSection = document.getElementById('contact');
      if (contactSection) {
        contactSection.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [initialMessage]);

  return (
    <div className="bg-bg min-h-screen">
      {/* HERO SECTION */}
      <section id="hero" className="relative min-h-[100svh] md:h-screen flex items-center pt-32 md:pt-40 pb-20 md:pb-0 overflow-hidden">
        <FloatingDeco src="/Element1.png" className="top-24 left-10 w-32 md:w-48 opacity-40 md:opacity-100" duration={6} yOffset={30} rotate={5} tint={true} />
        <FloatingDeco src="/Element2.png" className="bottom-32 right-10 w-40 md:w-64 opacity-30 md:opacity-80" duration={8} delay={1} yOffset={-40} rotate={-10} tint={true} />
        <div className="absolute inset-0 z-0 opacity-10">
           <div className="absolute top-1/4 -left-20 w-[400px] h-[400px] bg-maha-yellow/5 blur-[80px] rounded-full" />
           <div className="absolute bottom-1/4 -right-20 w-[400px] h-[400px] bg-maha-pink/5 blur-[80px] rounded-full" />
           <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&q=40&w=1200')] bg-cover bg-center grayscale opacity-5" referrerPolicy="no-referrer" />
        </div>

        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 relative z-10 w-full">
           <motion.div 
             initial={{ opacity: 0, x: -50 }}
             animate={{ opacity: 1, x: 0 }}
             transition={{ duration: 0.8 }}
             className="flex flex-col justify-center"
           >
              <div className="leading-[0.8] font-black italic uppercase tracking-tighter mb-8 md:mb-6 pt-16 md:pt-0">
                <div className="text-[14vw] md:text-[8.5rem] text-text">{content.hero.headline[0]}</div>
                <div className="text-[12vw] md:text-[6.5rem] text-accent pl-2">{content.hero.headline[1]}</div>
                <div className="text-[14vw] md:text-[8.5rem] text-transparent" style={{ WebkitTextStroke: '1px var(--color-accent)' }}>{content.hero.headline[2]}</div>
              </div>
              <p className="text-text/70 max-w-sm md:max-w-md font-thai text-sm md:text-lg mb-10 leading-relaxed">
                {content.hero.subtext}
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                 <a href="#services" className="bg-maha-pink text-white px-8 md:px-10 py-4 rounded-full flex items-center justify-center gap-2 hover:bg-maha-yellow hover:text-maha-black group shadow-xl shadow-maha-pink/20 transition-all">
                   {content.hero.ctaService} <ArrowUpRight className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                 </a>
                 <a href="#portfolio" className="bg-surface text-text px-8 md:px-10 py-4 rounded-full flex items-center justify-center hover:bg-maha-yellow hover:text-maha-black transition-all">
                   {content.hero.ctaWork}
                 </a>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 mt-12 md:mt-16 pt-6 md:pt-10 mb-24 md:mb-0">
                 {content.hero.kpis.map((kpi, idx) => (
                   <div key={idx}>
                     <div className="text-xl md:text-2xl font-display text-accent">{kpi.value}</div>
                     <div className="text-[8px] md:text-[10px] uppercase tracking-widest text-text/40">{kpi.label}</div>
                   </div>
                 ))}
              </div>
           </motion.div>

           <div className="hidden md:flex flex-col gap-6 items-end justify-center relative">
              <div className="absolute w-64 h-64 bg-maha-pink/20 blur-[100px] rounded-full -top-10 -right-10" />
              {content.hero.decoCards.map((card, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: 50, rotate: -2 }}
                  animate={{ opacity: 1, x: 0, rotate: idx === 1 ? 0 : -2 }}
                  transition={{ delay: 0.2 + idx * 0.1 }}
                  className={`w-72 p-6 transition-all cursor-default group shadow-2xl relative z-10 ${idx === 1 ? 'bg-accent text-maha-black rounded-2xl transform translate-x-12' : 'bg-surface backdrop-blur-xl rounded-2xl shadow-2xl'}`}
                >
                  <div className="flex justify-between items-start mb-4">
                    <span className={`text-[9px] uppercase tracking-widest font-black ${idx === 1 ? 'text-black/50' : 'text-text/40'}`}>{card.title}</span>
                    <span className={`text-xs font-black ${idx === 1 ? 'text-black' : 'text-green-400'}`}>{card.trend}</span>
                  </div>
                  <div className="text-3xl font-black">{card.value}</div>
                  <div className={`text-[10px] uppercase tracking-widest mt-1 ${idx === 1 ? 'text-black/40' : 'text-text/30'}`}>
                     {card.label}
                  </div>
                </motion.div>
              ))}
           </div>
        </div>

         <div className="absolute bottom-0 left-0 w-full bg-maha-yellow text-maha-black h-12 flex items-center overflow-hidden z-20 pointer-events-none md:pointer-events-auto">
            <div className="animate-marquee flex gap-12 items-center italic font-black uppercase text-lg shrink-0">
               {[1, 2, 3, 4].map(i => (
                 <span key={i} className="flex gap-12 items-center shrink-0">
                   {content.hero.marquee.map((text, idx) => (
                     <span key={idx} className="flex items-center gap-4 px-4 text-maha-black whitespace-nowrap">
                       {text} <span className="text-2xl text-maha-pink italic tracking-widest">✦</span>
                     </span>
                   ))}
                 </span>
               ))}
            </div>
         </div>
      </section>

      {/* ABOUT SECTION */}
      <section id="about" className="py-32 px-6 relative overflow-hidden">
         <FloatingDeco src="/Element3.png" className="top-1/4 -right-12 w-64 md:w-96 opacity-20" duration={10} yOffset={50} rotate={15} tint={false} />
         <div className="max-w-7xl mx-auto relative z-10">
            <div className="flex flex-col items-center mb-24 text-center">
               <span className="text-maha-pink uppercase tracking-widest text-[10px] mb-4 font-bold">Who we are</span>
               <h2 className="text-7xl md:text-9xl font-display leading-[0.8]">
                 <div className="text-text">{content.about.heading[0]}</div>
                 <div className="text-accent">{content.about.heading[1]}</div>
               </h2>
            </div>

            <div className="grid md:grid-cols-4 gap-8">
               {content.about.pillars.map((pillar, idx) => (
                 <motion.div 
                   whileInView={{ opacity: 1, y: 0 }}
                   initial={{ opacity: 0, y: 30 }}
                   viewport={{ once: true }}
                   transition={{ delay: idx * 0.1 }}
                   key={idx} 
                   className="p-8 rounded-[2rem] bg-surface hover:bg-surface/80 transition-all group"
                 >
                   <div className="w-12 h-12 bg-accent text-maha-black rounded-2xl flex items-center justify-center mb-6 font-display text-2xl group-hover:scale-110 transition-transform">
                     {idx === 0 && <Target className="w-6 h-6" />}
                     {idx === 1 && <BarChart3 className="w-6 h-6" />}
                     {idx === 2 && <Palette className="w-6 h-6" />}
                     {idx === 3 && <Trophy className="w-6 h-6" />}
                   </div>
                   <h3 className="text-2xl mb-2 text-accent">{pillar.title}</h3>
                   <p className="text-text/50 text-sm font-thai">{pillar.desc}</p>
                 </motion.div>
               ))}
            </div>
         </div>
      </section>

      {/* SERVICES SECTION */}
      <section id="services" className="py-32 px-6 bg-surface/30 relative overflow-hidden">
         <FloatingDeco src="/Element4.png" className="top-40 -left-20 w-80 opacity-10" duration={12} delay={2} yOffset={60} tint={false} />
         <div className="max-w-7xl mx-auto relative z-10">
            <div className="flex justify-between items-end mb-20">
               <div>
                 <span className="text-maha-pink uppercase tracking-widest text-[10px] mb-4 font-bold">Solutions</span>
                 <h2 className="text-6xl font-display">OUR <span className="text-accent">SERVICES</span></h2>
               </div>
               <div className="hidden md:block text-right max-w-sm text-sm text-text/40 font-thai">
                 เรามอบบริการที่ครอบคลุมทุกมิติของการทำตลาดออนไลน์ ตั้งแต่การวางกลยุทธ์ไปจนถึงเอกสารสรุปผลเชิงลึก
               </div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
               {content.services.map((service, idx) => (
                 <motion.div 
                   key={idx} 
                   whileHover={{ y: -10 }}
                   initial={{ opacity: 0, y: 20 }}
                   whileInView={{ opacity: 1, y: 0 }}
                   viewport={{ once: true }}
                   transition={{ delay: idx * 0.1 }}
                   className={`group relative p-8 md:p-10 h-[360px] md:h-[440px] rounded-[2.5rem] md:rounded-[3.5rem] ${service.color || 'bg-surface'} overflow-hidden shadow-xl flex flex-col`}
                 >
                    {/* Background Index Number */}
                    <div className="absolute top-6 right-8 md:top-10 md:right-10 text-5xl md:text-7xl font-display opacity-10 uppercase italic font-black transition-all group-hover:scale-110 pointer-events-none">
                      {String(idx + 1).padStart(2, '0')}
                    </div>

                    <div className="relative z-10 space-y-4 md:space-y-6">
                       <h3 className="text-3xl md:text-4xl font-display uppercase italic font-black leading-[0.9] tracking-tighter">
                          {service.title.split(' ').map((word, wi) => (
                            <span key={wi} className="block">{word}</span>
                          ))}
                       </h3>
                       <p className="font-thai text-[10px] md:text-xs opacity-60 leading-relaxed max-w-[160px] md:max-w-[200px]">
                          {service.desc}
                       </p>
                    </div>

                    <div className="relative z-10 flex flex-wrap gap-1.5 md:gap-2 mt-auto pr-24 md:pr-0">
                       {service.tags.map((tag, tIdx) => (
                         <span key={tIdx} className={`text-[8px] md:text-[9px] uppercase tracking-widest font-black px-3 py-1.5 md:px-4 md:py-2 rounded-full backdrop-blur-md ${service.color?.includes('bg-maha-yellow') ? 'bg-black/10 text-maha-black/80' : 'bg-black/5 dark:bg-white/10'}`}>
                           {tag}
                         </span>
                       ))}
                    </div>

                    {/* Pop-out Image Component */}
                    {service.popImage && (
                      <div className="absolute -bottom-10 -right-10 md:-bottom-16 md:-right-16 w-60 h-60 md:w-80 md:h-80 pointer-events-none">
                         <motion.img 
                           src={service.popImage} 
                           alt={service.title}
                           initial={{ rotate: -10, y: 30 }}
                           whileInView={{ rotate: 5, y: 0 }}
                           whileHover={{ scale: 1.1, rotate: 10 }}
                           transition={{ duration: 0.8, ease: "easeOut" }}
                           referrerPolicy="no-referrer"
                           className="w-full h-full object-contain drop-shadow-[10px_10px_20px_rgba(0,0,0,0.3)] md:drop-shadow-[20px_20px_40px_rgba(0,0,0,0.4)]"
                         />
                      </div>
                    )}

                    {/* Aesthetic Decoration */}
                    <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-white/5 blur-[80px] rounded-full pointer-events-none" />
                 </motion.div>
               ))}
            </div>
         </div>
      </section>

      {/* PRICING TABLE */}
      <section id="pricing" className="py-32 px-6 relative overflow-hidden">
        <div className="max-w-4xl mx-auto text-center mb-12 relative z-10 w-full px-6">
            <h2 className="text-5xl md:text-8xl font-display mb-8">WORK <span className="text-accent">WITH US</span></h2>
            <div className="bg-surface p-2 rounded-[2rem] flex overflow-x-auto no-scrollbar gap-2 max-w-full touch-pan-x border border-white/5 shadow-2xl relative">
                <div className="md:hidden absolute right-2 top-1/2 -translate-y-1/2 text-accent animate-pulse pointer-events-none">
                   <ArrowUpRight size={14} className="rotate-90" />
                </div>
                {["Packages", "Artwork Rate", "Branding", "Add-ons"].map((tab, i) => (
                   <button 
                     key={i} 
                     onClick={() => setActiveTab(i)}
                     className={`px-8 md:px-10 py-4 rounded-xl text-[11px] md:text-sm font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === i ? 'bg-accent text-maha-black shadow-lg shadow-accent/20' : 'text-text/40 hover:text-accent'}`}
                   >
                     {tab}
                   </button>
                ))}
            </div>
        </div>
        
        <div className="max-w-7xl mx-auto">
           {activeTab === 0 && (
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
               {content.packages.map((pkg, i) => (
                 <div key={i} className={`p-10 rounded-[2.5rem] relative h-full flex flex-col ${pkg.featured ? 'bg-surface shadow-[0_20px_40px_-10px_rgba(var(--color-accent),0.2)]' : 'bg-surface/50'}`}>
                   {pkg.featured && (
                     <div className="absolute top-6 right-6 bg-accent text-maha-black text-[10px] font-black px-4 py-1.5 rounded-full uppercase">Recommended</div>
                   )}
                   {pkg.isNew && (
                     <div className="absolute top-6 right-6 bg-maha-pink text-white text-[10px] font-black px-4 py-1.5 rounded-full uppercase">New</div>
                   )}
                   
                   <div className="mb-6">
                     <h3 className={`text-2xl font-display font-black leading-tight mb-2 ${pkg.isNew ? 'text-maha-pink' : 'text-text'}`}>{pkg.name}</h3>
                     <p className="text-[10px] font-thai text-text/40 mb-6 leading-relaxed h-14">{pkg.desc}</p>
                     <div className="text-5xl font-display font-black flex items-baseline gap-1">
                        <span className="text-2xl text-text">฿</span>
                        <span className={pkg.isNew ? 'text-maha-pink' : 'text-accent'}>{typeof pkg.price === 'number' ? pkg.price.toLocaleString() : pkg.price}</span>
                        <span className="text-xs font-thai text-text/30 ml-2">/เดือน</span>
                     </div>
                   </div>

                   <ul className="space-y-3 mb-10 flex-grow font-thai text-[11px]">
                     {pkg.items.map((item, ii) => (
                       <li key={ii} className="flex items-start gap-2 text-text/80">
                         <Check className={`w-3 h-3 shrink-0 mt-0.5 ${pkg.isNew ? 'text-maha-pink' : 'text-accent'}`} />
                         <span>{item}</span>
                       </li>
                     ))}
                   </ul>

                   <button 
                     onClick={() => handleSelectPackage(pkg.name, pkg.price)}
                     className={`w-full py-5 rounded-2xl font-black uppercase text-sm tracking-widest transition-all ${pkg.featured ? 'bg-accent text-maha-black hover:bg-white' : pkg.isNew ? 'bg-maha-pink/10 text-maha-pink hover:bg-maha-pink hover:text-white' : 'bg-bg text-text hover:bg-accent hover:text-maha-black'}`}
                   >
                      {pkg.ctaText}
                   </button>
                 </div>
               ))}
             </div>
           )}

           {activeTab === 1 && (
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
               {content.artworkRateCard.map((item, i) => (
                 <div key={i} className="p-12 rounded-[2.5rem] relative bg-surface flex flex-col h-full shadow-sm hover:bg-surface/80 transition-all">
                   <h3 className="text-xs font-bold uppercase tracking-widest text-text/40 mb-8 border-b border-text/5 pb-4">{item.name}</h3>
                   
                   <div className="space-y-8 mb-12">
                     <div>
                        <div className="text-[10px] text-text/30 uppercase mb-1">เกรด B</div>
                        <div className={`text-4xl font-display font-black ${i === 1 ? 'text-accent' : 'text-maha-pink'}`}>{item.grades.B}</div>
                     </div>
                     <div>
                        <div className="text-[10px] text-text/30 uppercase mb-1">เกรด A</div>
                        <div className={`text-4xl font-display font-black ${i === 1 ? 'text-accent' : 'text-maha-pink'}`}>{item.grades.A}</div>
                     </div>
                   </div>

                   <div className={`mt-auto p-4 rounded-xl text-center text-xs font-bold font-thai tracking-tight uppercase ${i === 1 ? 'bg-maha-yellow/10 text-maha-yellow' : 'bg-maha-pink/10 text-maha-pink'}`}>
                      {item.note}
                   </div>
                 </div>
               ))}
               <div className="col-span-full mt-10 text-[11px] font-thai text-text/40 bg-surface/50 p-6 rounded-2xl">
                 * ราคาขึ้นอยู่กับความยากง่ายและรายละเอียดของชิ้นงาน · ระยะเวลาทำงาน 2–5 วัน · กรณีไม่มี CI Guideline +฿300 ชิ้นแรก
               </div>
             </div>
           )}

           {activeTab === 2 && (
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
               {content.brandBuilding.map((pkg, i) => (
                 <div key={i} className={`p-12 rounded-[2.5rem] relative flex flex-col h-full ${pkg.featured ? 'bg-bg shadow-2xl' : 'bg-surface/50'}`}>
                   {pkg.featured && (
                     <div className="absolute top-6 right-6 bg-accent text-maha-black text-[10px] font-black px-4 py-1.5 rounded-full uppercase">Popular</div>
                   )}
                   <h3 className="text-3xl font-display font-black mb-2 uppercase text-text">{pkg.name}</h3>
                   <p className="text-[10px] font-thai text-text/40 mb-8 h-10">{pkg.desc}</p>
                   
                   <div className="text-6xl font-display font-black text-accent mb-10 leading-none">
                      <span className="text-2xl mr-1">฿</span>
                      {typeof pkg.price === 'number' ? pkg.price.toLocaleString() : pkg.price}
                   </div>

                   <ul className="space-y-4 mb-12 font-thai text-[11px] flex-grow">
                     {pkg.features.map((feature, idx) => (
                       <li key={idx} className="flex items-start gap-2 text-text/80">
                         <Check className="w-3 h-3 text-accent shrink-0 mt-0.5" />
                         <span>{feature}</span>
                       </li>
                     ))}
                   </ul>

                   <button 
                     onClick={() => handleSelectBranding(pkg.name, pkg.price)}
                     className={`w-full py-5 rounded-2xl font-black uppercase text-xs tracking-widest transition-all ${pkg.featured ? 'bg-accent text-maha-black hover:bg-white' : 'bg-bg text-text hover:bg-accent hover:text-maha-black'}`}
                   >
                     {pkg.ctaText}
                   </button>
                 </div>
               ))}
             </div>
           )}

           {activeTab === 3 && (
             <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {content.addons.map((addon, i) => (
                    <div key={i} className="p-10 rounded-[2rem] bg-surface relative overflow-hidden group hover:bg-surface/80 transition-all shadow-sm">
                       <div className={`absolute left-0 top-0 bottom-0 w-2 ${addon.borderTop === 'maha-pink' ? 'bg-maha-pink' : 'bg-accent'}`} />
                       <div className="mb-4">
                          <div className={`text-[10px] font-black uppercase tracking-widest mb-1 ${addon.borderTop === 'maha-pink' ? 'text-maha-pink' : 'text-accent'}`}>{addon.name}</div>
                          <div className={`text-4xl font-display font-black ${addon.borderTop === 'maha-pink' ? 'text-maha-pink' : 'text-accent'}`}>
                             ฿{addon.price}
                             <span className="text-[11px] font-thai opacity-40 ml-1 font-normal tracking-normal">{addon.subText}</span>
                          </div>
                       </div>
                       <p className="text-[11px] font-thai text-text/40 leading-relaxed font-medium">{addon.desc}</p>
                    </div>
                  ))}
                </div>
                <div className="p-8 bg-surface/50 rounded-[2rem] flex items-center gap-6">
                   <div className="text-3xl">💡</div>
                   <p className="font-thai text-sm text-text/60">
                      บริการเสริมสามารถเพิ่มเดิมได้กับทุก Package · ไม่มีขั้นต่ำ · สอบถามเพิ่มเติมได้ที่ <a href="#contact" className="text-accent font-bold underline px-1 hover:text-maha-pink transition-colors">ฟอร์มด้านล่าง</a>
                   </p>
                </div>
             </div>
           )}
        </div>
      </section>

      {/* CALCULATOR CTA */}
      <section id="calculator-cta" className="py-20 bg-maha-yellow text-maha-black text-center">
         <div className="max-w-4xl mx-auto px-6">
            <h2 className="text-5xl md:text-7xl font-display mb-8">ต้องการใบเสนอราคา?</h2>
            <button 
              onClick={onOpenCalc}
              className="bg-bg text-text px-12 py-6 rounded-full font-bold flex items-center gap-4 mx-auto hover:bg-maha-pink hover:text-white transition-all group scale-110 shadow-2xl"
            >
              <Calculator className="group-hover:rotate-12 transition-transform" /> 
              คลิกเพื่อคำนวณราคาอัตโนมัติ
            </button>
         </div>
      </section>

      {/* SHOWCASE SECTION */}
      <section id="portfolio" className="py-32 px-6 bg-surface/10 relative overflow-hidden">
         <FloatingDeco src="/Element6.png" className="top-20 -right-20 w-80 opacity-15" duration={9} delay={0.5} yOffset={40} rotate={-5} tint={false} />
         <div className="max-w-7xl mx-auto relative z-10">
            <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
               <h2 className="text-7xl font-display leading-tight italic text-text">SELECTED <span className="text-accent">WORK</span></h2>
               <p className="max-w-md text-sm text-text/40 font-thai leading-relaxed">
                 เราภูมิใจที่ได้ร่วมเป็นส่วนหนึ่งของความสำเร็จของแบรนด์ชั้นนำในไทย ผ่านการทำแคมเปญที่เป็นเอกลักษณ์และยั่งยืน
               </p>
            </div>

            <div className="relative -mx-6 overflow-hidden py-10 cursor-grab active:cursor-grabbing">
               <motion.div 
                 className="flex gap-8 px-6"
                 drag="x"
                 dragConstraints={{ left: -3200, right: 0 }}
                 dragElastic={0.1}
                 animate={{ 
                   x: [0, -1600],
                 }}
                 transition={{ 
                   duration: 25,
                   repeat: Infinity,
                   ease: "linear",
                 }}
                 whileHover={{ animationPlayState: "paused" }}
                 style={{ width: "fit-content" }}
               >
                  {[...content.portfolio, ...content.portfolio, ...content.portfolio, ...content.portfolio].map((item, idx) => (
                    <motion.div 
                      key={idx}
                      whileHover={{ y: -10, scale: 1.02 }}
                      className="group relative h-[450px] w-[320px] md:w-[500px] rounded-[3rem] overflow-hidden shadow-2xl shrink-0 select-none"
                    >
                       <img src={item.image} alt={item.name} referrerPolicy="no-referrer" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 grayscale group-hover:grayscale-0" />
                       <div className="absolute inset-x-0 bottom-0 p-10 bg-gradient-to-t from-bg via-bg/95 to-transparent pt-40 md:pt-60 translate-y-8 md:translate-y-12 group-hover:translate-y-0 transition-transform duration-500">
                          <span className="text-[10px] md:text-[11px] uppercase tracking-[0.3em] font-black text-accent mb-3 block">{item.category}</span>
                          <h3 className="text-3xl md:text-4xl font-display group-hover:text-text transition-colors text-text italic mb-2">{item.name}</h3>
                          {item.desc && (
                            <p className="text-[11px] md:text-xs font-thai text-text/40 leading-relaxed font-medium opacity-0 group-hover:opacity-100 transition-opacity delay-100 duration-500 line-clamp-2 md:line-clamp-none">
                              {item.desc}
                            </p>
                          )}
                       </div>
                       
                       <div className="absolute top-8 right-8 opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center text-maha-black">
                             <ArrowUpRight className="w-6 h-6" />
                          </div>
                       </div>
                    </motion.div>
                  ))}
               </motion.div>

               {/* Gradient Masks */}
               <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-bg to-transparent z-20 pointer-events-none" />
               <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-bg to-transparent z-20 pointer-events-none" />
            </div>
         </div>
      </section>

      {/* TEAM SECTION */}
      <section id="team" className="py-32 px-6 relative overflow-hidden">
         <FloatingDeco src="/Element7.png" className="bottom-1/4 -left-32 w-[600px] opacity-10" duration={20} yOffset={100} rotate={10} tint={false} />
         <div className="max-w-7xl mx-auto relative z-10">
            <div className="mb-20">
               <span className="text-maha-pink uppercase tracking-widest text-[10px] mb-4 font-bold block">Our Core Team</span>
               <h2 className="text-7xl md:text-8xl font-display leading-[0.8] tracking-tighter uppercase italic text-text">
                  THE <span className="text-accent underline decoration-maha-pink/30 decoration-8 underline-offset-8">FOUNDERS</span>
               </h2>
            </div>
            
            <div className="grid md:grid-cols-3 gap-16 md:gap-8 max-w-6xl mx-auto">
               {content.team.map((member, idx) => (
                 <motion.div 
                   key={idx} 
                   initial={{ opacity: 0, y: 30 }}
                   whileInView={{ opacity: 1, y: 0 }}
                   viewport={{ once: true }}
                   transition={{ delay: idx * 0.2, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                   className="group relative pt-24"
                 >
                    {/* Background Card */}
                    <div className={`relative rounded-[4rem] p-10 pb-14 overflow-hidden h-[340px] flex flex-col justify-end transition-all duration-500 group-hover:rounded-[3rem] ${idx === 1 ? 'bg-maha-yellow' : idx === 2 ? 'bg-maha-pink' : 'bg-surface'}`}>
                       {/* Background Pattern */}
                       <div className="absolute top-0 right-0 w-full h-full opacity-10 pointer-events-none group-hover:scale-110 transition-transform duration-1000">
                          <svg viewBox="0 0 200 200" className="w-[150%] h-[150%] absolute -top-1/4 -right-1/4">
                             <path fill={idx === 1 ? "#000" : "#FFF"} d="M44.7,-76.4C58,-71,69.1,-59.8,76.5,-46.5C83.8,-33.1,87.4,-17.6,88.1,-1.8C88.8,14,86.6,30,79.5,43.4C72.5,56.8,60.6,67.6,46.8,75C33,82.4,17.4,86.3,1,85.2C-15.4,84.1,-31.8,77.9,-46.4,70.1C-60.9,62.3,-73.6,52.8,-81,39.8C-88.4,26.8,-90.4,10.4,-89.2,-5.7C-88,-21.8,-83.5,-37.6,-74.6,-50.2C-65.7,-62.8,-52.3,-72.1,-38.5,-77.3C-24.7,-82.5,-10.4,-83.6,2.8,-88.4C16,-93.2,31.4,-81.8,44.7,-76.4Z" transform="translate(100 100)" />
                          </svg>
                       </div>
                       
                       {/* Pop-out Image */}
                       <div className="absolute -top-32 inset-x-0 h-[480px] pointer-events-none flex items-end justify-center perspective-1000">
                          <motion.img 
                            src={member.avatar} 
                            referrerPolicy="no-referrer"
                            alt={member.name} 
                            className="w-full h-full object-contain object-bottom drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)] transition-transform duration-500 group-hover:scale-110"
                          />
                       </div>
                    </div>

                    {/* Info Below */}
                    <div className="mt-8 text-center md:text-left">
                       <h3 className="text-4xl font-display font-black uppercase mb-1 leading-none text-text">
                          {member.name}
                       </h3>
                       <div className="text-[10px] uppercase tracking-[0.3em] font-black text-accent mb-4 pl-1">
                          {member.role}
                       </div>
                       <p className="font-thai text-xs text-text/40 leading-relaxed max-w-[220px] mx-auto md:mx-0">
                          {member.bio}
                       </p>
                    </div>
                 </motion.div>
               ))}
            </div>
         </div>
      </section>

      {/* PROCESS SECTION */}
      <section className="py-32 px-6 bg-surface/20 relative overflow-hidden">
         <FloatingDeco src="/Element8.png" className="top-1/2 -right-40 w-[500px] opacity-10" duration={14} delay={3} yOffset={-70} tint={false} />
         <div className="max-w-7xl mx-auto relative z-10">
            <h2 className="text-6xl font-display mb-20 text-center italic text-text">HOW WE <span className="text-accent">WORK</span></h2>
            
     <div className="relative flex flex-col md:flex-row justify-between mb-32 before:hidden md:before:block before:absolute before:top-1/2 before:left-0 before:w-full before:h-px before:bg-text/5 before:-translate-y-1/2">
         {content.process.map((step, idx) => {
           const IconComponent = { MessageSquare, Compass, Rocket, FileText, TrendingUp }[step.icon] || Rocket;
           return (
             <div key={idx} className="relative z-10 bg-bg md:bg-transparent p-6 md:p-0 flex flex-col items-center text-center group">
                <div className="w-20 h-20 bg-surface rounded-full flex items-center justify-center mb-6 transition-all group-hover:bg-accent group-hover:text-maha-black text-text/20 group-hover:scale-110 shadow-lg">
                  <IconComponent className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-display mb-2 text-accent group-hover:text-text transition-colors">{step.title}</h3>
                <p className="text-[13px] font-thai text-text/40 max-w-[120px]">{step.desc}</p>
             </div>
           );
         })}
     </div>
         </div>
      </section>

      {/* RESULTS & LOYALTY */}
      <section id="results" className="py-32 px-6">
         <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-20 items-center">
            <div>
               <h2 className="text-4xl md:text-7xl font-display mb-12 italic leading-tight uppercase">
                 {content.results.heading[0]} <span className="text-accent">{content.results.heading[1]}</span><br/>{content.results.heading[2]}
               </h2>
               <div className="space-y-6 uppercase text-text">
                  {content.results.goals.map((goal, i) => (
                    <div key={i} className="flex items-center gap-4 text-xl font-display group">
                       <div className="w-12 h-12 bg-surface rounded-xl flex items-center justify-center font-black group-hover:bg-accent transition-all text-accent group-hover:text-maha-black shadow-sm">
                          {goal[0]}
                       </div>
                       {goal}
                    </div>
                  ))}
               </div>
            </div>
            
            <div className="bg-maha-yellow p-16 rounded-[4rem] relative overflow-hidden text-maha-black shadow-2xl">
               <div className="absolute top-0 right-0 p-8 text-[12rem] font-display text-black/5 pointer-events-none line-height-1">10%</div>
               <h3 className="text-6xl font-display mb-6 tracking-tight italic">{content.loyalty.title}</h3>
               <p className="font-thai text-xl mb-12 opacity-80 max-w-sm text-maha-black font-bold">
                 {content.loyalty.desc}<br/>
                 <span className="text-5xl font-display text-maha-black">{content.loyalty.discount}</span> ทุกแพ็กเกจ
               </p>
               <div className="inline-block bg-bg text-text px-10 py-5 rounded-full font-black group hover:bg-accent hover:text-maha-black transition-all text-xs uppercase tracking-widest shadow-xl">
                  {content.loyalty.cta}
               </div>
            </div>
         </div>
      </section>

      {/* CONTACT SECTION */}
      <section id="contact" className="py-32 px-6 bg-surface relative overflow-hidden">
         <FloatingDeco src="/Element9.png" className="top-1/2 -translate-y-1/2 -right-32 w-80 md:w-[600px] opacity-10 md:opacity-20" duration={15} yOffset={30} rotate={5} tint={false} />
         <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-20 relative z-10">
            <div className="flex-1">
               <span className="text-maha-pink uppercase tracking-widest text-[10px] mb-4 font-bold">Contact Us</span>
               <h2 className="text-7xl font-display mb-12 italic text-text">LET'S GROW <br/><span className="text-accent">YOUR BRAND</span></h2>
               <div className="space-y-8">
                  <div>
                    <div className="text-[10px] uppercase tracking-widest text-text/30 mb-2">Email</div>
                    <div className="text-2xl font-display hover:text-accent transition-colors text-text">{content.contact.email}</div>
                  </div>
                  <div>
                    <div className="text-[10px] uppercase tracking-widest text-text/30 mb-2">Line</div>
                    <div className="text-2xl font-display hover:text-accent transition-colors text-text">{content.contact.line}</div>
                  </div>
                  <div>
                    <div className="text-[10px] uppercase tracking-widest text-text/30 mb-2">Expected Response</div>
                    <div className="text-2xl font-display italic text-text">{content.contact.responseTime}</div>
                  </div>
               </div>
            </div>

            <div className="flex-1">
                <form 
                  onSubmit={async (e) => {
                    e.preventDefault();
                    const form = e.currentTarget;
                    const formData = new FormData(form);
                    const data = Object.fromEntries(formData.entries());
                    
                    const services = Array.from(form.querySelectorAll('input[name="services"]:checked'))
                      .map((el: any) => el.value);
                    data.services = services.join(', ');

                    const submitButton = form.querySelector('button[type="submit"]') as HTMLButtonElement;
                    const originalText = submitButton.innerHTML;
                    
                    try {
                      submitButton.disabled = true;
                      submitButton.innerHTML = 'กำลังส่งข้อมูล...';

                      const payload = {
                        name: data.name as string,
                        email: data.email as string,
                        phone: data.phone as string,
                        company: data.company as string,
                        lineId: data.lineId as string,
                        message: data.message as string,
                        services: services
                      };

                      // 1. Save to Firestore
                      await leadService.submitLead({
                        name: payload.name,
                        email: payload.email,
                        phone: payload.phone,
                        message: payload.message,
                        source: 'contact_form',
                        details: {
                          company: payload.company,
                          lineId: payload.lineId,
                          services: payload.services
                        }
                      });

                      // 2. Optional: Sync to Google Sheets if URL provided
                      const scriptUrl = (import.meta.env && import.meta.env.VITE_GOOGLE_SCRIPT_URL) || '';
                      if (scriptUrl) {
                        await fetch(scriptUrl, {
                          method: 'POST',
                          mode: 'no-cors',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify(data),
                        });
                      }

                      alert('ขอบคุณที่สนใจ! เราได้รับข้อมูลของคุณแล้ว และจะติดต่อกลับภายใน 24 ชม.');
                      form.reset();
                      setMessage('');
                    } catch (error) {
                      console.error('Submission error:', error);
                      alert('ขออภัย เกิดข้อผิดพลาดในการส่งข้อมูล');
                    } finally {
                      submitButton.disabled = false;
                      submitButton.innerHTML = originalText;
                    }
                  }}
                  className="bg-bg p-12 rounded-[4rem] shadow-2xl space-y-6 font-thai"
                >
                   <div className="grid md:grid-cols-2 gap-6">
                    <input name="name" type="text" placeholder="ชื่อ*" required className="bg-surface rounded-2xl px-6 py-5 w-full focus:ring-2 focus:ring-accent transition-all outline-none text-text" />
                    <input name="company" type="text" placeholder="บริษัท/ประเภทธุรกิจ*" required className="bg-surface rounded-2xl px-6 py-5 w-full focus:ring-2 focus:ring-maha-pink transition-all outline-none text-text" />
                  </div>
                  <div className="grid md:grid-cols-2 gap-6">
                    <input name="phone" type="tel" placeholder="เบอร์โทรศัพท์*" required className="bg-surface rounded-2xl px-6 py-5 w-full focus:ring-2 focus:ring-accent transition-all outline-none text-text" />
                    <input name="lineId" type="text" placeholder="Line ID*" required className="bg-surface rounded-2xl px-6 py-5 w-full focus:ring-2 focus:ring-accent transition-all outline-none text-text" />
                  </div>
                  <input name="email" type="email" placeholder="อีเมล*" required className="bg-surface rounded-2xl px-6 py-5 w-full focus:ring-2 focus:ring-maha-pink transition-all outline-none text-text" />
                  
                  <div>
                    <div className="text-xs text-text/30 mb-4 uppercase tracking-widest px-2">บริการที่สนใจ</div>
                    <div className="grid grid-cols-2 gap-4">
                       {content.services.map((s, i) => (
                         <label key={i} className="flex items-center gap-3 bg-surface px-6 py-4 rounded-2xl cursor-pointer hover:bg-accent/10 transition-all text-xs text-text">
                           <input name="services" value={s.title} type="checkbox" className="accent-accent h-5 w-5 rounded-md" />
                           {s.title}
                         </label>
                       ))}
                    </div>
                  </div>

                  <textarea 
                    name="message" 
                    placeholder="ข้อความเพิ่มเติม" 
                    rows={4} 
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="bg-surface rounded-2xl px-6 py-5 w-full focus:ring-2 focus:ring-accent transition-all outline-none resize-none text-text"
                  ></textarea>
                  
                  <button type="submit" className="w-full bg-accent text-maha-black py-7 rounded-3xl font-black text-lg uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-white transition-all group shadow-xl shadow-accent/20 mt-8 disabled:opacity-50">
                     เริ่มต้นเติบโตทันที <ArrowUpRight className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" strokeWidth={3} />
                  </button>
                </form>
            </div>
         </div>
      </section>

      </div>
  );
}
