import { useState, useMemo, useRef } from 'react';
import { motion } from 'motion/react';
import { X, Plus, Minus, Check, Download } from 'lucide-react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

import { SiteContent } from '../constants';

interface PriceCalculatorProps {
  content: SiteContent;
  onClose: () => void;
  onContact?: (summary: string) => void;
}

type Grade = 'A' | 'B';

export default function PriceCalculator({ content, onClose, onContact }: PriceCalculatorProps) {
  const [packageId, setPackageId] = useState<string | null>(null);
  const [contractId, setContractId] = useState<string>('monthly');
  const [grade, setGrade] = useState<Grade>('A');
  const [artworkCounts, setArtworkCounts] = useState({
    single: 0,
    album: 0,
    infographic: 0,
  });
  const [addons, setAddons] = useState<string[]>([]);
  const quoteRef = useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  // Helper to parse price from string or number
  const parsePrice = (p: any): number => {
    if (typeof p === 'number') return p;
    if (typeof p === 'string') {
      const match = p.replace(/,/g, '').match(/\d+/);
      return match ? parseInt(match[0]) : 0;
    }
    return 0;
  };

  const packages = useMemo(() => {
    return content.packages.map((pkg, idx) => ({
      id: `pkg-${idx}`,
      name: pkg.name,
      price: parsePrice(pkg.price)
    }));
  }, [content.packages]);

  const artworkPrices = useMemo(() => {
    // Default fallback
    const prices = {
      A: { single: 900, album: 1200, infographic: 1200 },
      B: { single: 700, album: 1000, infographic: 900 },
    };

    content.artworkRateCard.forEach((card) => {
      const nameLower = card.name.toLowerCase();
      if (nameLower.includes('single')) {
        prices.A.single = parsePrice(card.grades.A);
        prices.B.single = parsePrice(card.grades.B);
      } else if (nameLower.includes('album')) {
        prices.A.album = parsePrice(card.grades.A);
        prices.B.album = parsePrice(card.grades.B);
      } else if (nameLower.includes('infographic')) {
        prices.A.infographic = parsePrice(card.grades.A);
        prices.B.infographic = parsePrice(card.grades.B);
      }
    });

    return prices;
  }, [content.artworkRateCard]);

  const addonList = useMemo(() => {
    return content.addons.map((addon, idx) => ({
      id: `addon-${idx}`,
      name: addon.name,
      price: parsePrice(addon.price),
      sub: addon.subText || (typeof addon.price === 'number' ? `+฿${addon.price.toLocaleString()}` : addon.price)
    }));
  }, [content.addons]);

  const totalPrice = useMemo(() => {
    let total = 0;
    
    // Package
    const selectedPkg = packages.find(p => p.id === packageId);
    if (selectedPkg) total += selectedPkg.price;

    // Artwork
    total += artworkCounts.single * artworkPrices[grade].single;
    total += artworkCounts.album * artworkPrices[grade].album;
    total += artworkCounts.infographic * artworkPrices[grade].infographic;

    // Addons
    addons.forEach(addonId => {
      const addon = addonList.find(a => a.id === addonId);
      if (addon) total += addon.price;
    });

    // Discount
    if (contractId === 'long') {
      total = total * 0.9;
    }

    return total;
  }, [packageId, contractId, grade, artworkCounts, addons, packages, artworkPrices, addonList]);

  const updateCount = (key: keyof typeof artworkCounts, delta: number) => {
    setArtworkCounts(prev => ({
      ...prev,
      [key]: Math.max(0, prev[key] + delta)
    }));
  };

  const toggleAddon = (id: string) => {
    setAddons(prev => prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id]);
  };

  const downloadPDF = async () => {
    if (!quoteRef.current) return;
    
    try {
      setIsGenerating(true);
      // Wait to ensure modal is fully rendered
      await new Promise(resolve => setTimeout(resolve, 500));

      const element = quoteRef.current;
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#0A0A0A',
        windowWidth: 1200, // Fixed width for consistent render
        onclone: (clonedDoc) => {
          // Remove elements that might cause issues in PDF
          const closeBtn = clonedDoc.querySelector('button[onClick*="onClose"]');
          if (closeBtn) (closeBtn as HTMLElement).style.display = 'none';
        }
      });
      
      const imgData = canvas.toDataURL('image/jpeg', 0.85);
      const pdf = new jsPDF({
        orientation: 'p',
        unit: 'px',
        format: [canvas.width / 2, canvas.height / 2],
        compress: true
      });
      
      pdf.setProperties({
        title: 'MAHA Marketings - Service Quote',
        subject: 'Service Quotation',
        author: 'MAHA Marketings'
      });

      pdf.addImage(imgData, 'JPEG', 0, 0, canvas.width / 2, canvas.height / 2, undefined, 'FAST');
      pdf.save(`MAHA-Quote-${new Date().toISOString().split('T')[0]}.pdf`);
    } catch (error) {
      console.error('PDF Generation failed:', error);
      alert('ไม่สามารถดาวน์โหลด PDF ได้ในขณะนี้ อาจเป็นเพราะข้อจำกัดของเบราว์เซอร์ กรุณาลองแคปหน้าจอเพื่อบันทึกข้อมูล');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="w-full max-w-4xl"
      onClick={e => e.stopPropagation()}
    >
      <div ref={quoteRef} className="bg-bg rounded-[2.5rem] overflow-hidden shadow-2xl w-full">
      {/* HEADER */}
      <div className="bg-accent p-8 flex justify-between items-start">
        <div className="flex flex-col gap-6">
           <div className="h-16">
             <img src="/logo-4.png" alt="MAHA" className="h-full w-auto object-contain" />
           </div>
           <div>
             <h2 className="text-4xl font-display font-black text-maha-black uppercase tracking-tighter">PRICE CALCULATOR</h2>
             <p className="font-thai text-maha-black/60 font-medium mt-1">คำนวณราคาบริการและออกแบบแพ็กเกจที่ใช่สำหรับคุณ</p>
           </div>
        </div>
        <button onClick={onClose} className="p-2 hover:bg-black/5 rounded-full transition-colors text-maha-black">
          <X className="w-8 h-8" />
        </button>
      </div>

      <div className="p-8 md:p-12 space-y-12">
        {/* STEP 1 */}
        <div>
          <h3 className="text-accent font-display text-sm tracking-widest mb-6">STEP 1 — เลือก PACKAGE หลัก</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
            {packages.map(pkg => (
              <button
                key={pkg.id}
                onClick={() => setPackageId(pkg.id)}
                className={`p-6 rounded-2xl flex justify-between items-center transition-all ${packageId === pkg.id ? 'bg-accent text-maha-black shadow-lg shadow-accent/20' : 'bg-surface hover:bg-surface/80 text-text'}`}
              >
                <span className="font-bold uppercase text-sm tracking-tight">{pkg.name}</span>
                <span className={`text-sm font-display ${packageId === pkg.id ? 'text-maha-black/60' : 'text-text/40'}`}>฿{pkg.price.toLocaleString()}/เดือน</span>
              </button>
            ))}
            <button
              onClick={() => setPackageId(null)}
              className={`p-6 rounded-2xl flex justify-between items-center transition-all col-span-1 md:col-span-2 ${packageId === null ? 'bg-accent text-maha-black shadow-lg shadow-accent/20' : 'bg-surface hover:bg-surface/80 text-text'}`}
            >
              <span className="font-bold text-sm">ไม่มี Package หลัก (เฉพาะ Add-ons)</span>
              <span className={`text-sm font-display ${packageId === null ? 'text-maha-black/60' : 'text-text/40'}`}>฿0</span>
            </button>
          </div>
        </div>

        {/* STEP 2 */}
        <div>
          <h3 className="text-accent font-display text-sm tracking-widest mb-6 uppercase">STEP 2 — ระยะเวลาสัญญา</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
            <button
              onClick={() => setContractId('monthly')}
              className={`p-6 rounded-2xl flex justify-between items-center transition-all ${contractId === 'monthly' ? 'bg-accent text-maha-black shadow-lg shadow-accent/20' : 'bg-surface hover:bg-surface/80 text-text'}`}
            >
              <span className="font-bold text-sm">รายเดือน</span>
              <span className={`text-sm font-thai ${contractId === 'monthly' ? 'text-maha-black/60' : 'text-text/40'}`}>ปกติ ไม่มีส่วนลด</span>
            </button>
            <button
              onClick={() => setContractId('long')}
              className={`p-6 rounded-2xl flex justify-between items-center transition-all ${contractId === 'long' ? 'bg-accent text-maha-black shadow-lg shadow-accent/20' : 'bg-surface hover:bg-surface/80 text-text'}`}
            >
              <span className="font-bold text-sm">6 เดือนขึ้นไป</span>
              <span className={`text-sm font-bold flex items-center gap-1 font-thai ${contractId === 'long' ? 'text-maha-black' : 'text-maha-pink'}`}>Discount 10% 🔥</span>
            </button>
          </div>
        </div>

        {/* STEP 3 */}
        <div>
          <h3 className="text-accent font-display text-sm tracking-widest mb-6 uppercase">STEP 3 — artwork (ถ้าไม่รวมใน package)</h3>
          <div className="flex bg-surface p-1.5 rounded-full w-fit mb-8">
            <button 
              onClick={() => setGrade('A')}
              className={`px-10 py-2.5 rounded-full font-bold text-xs transition-all ${grade === 'A' ? 'bg-accent text-maha-black shadow-md shadow-accent/10' : 'text-text/40 hover:text-text'}`}
            >เกรด A</button>
            <button 
              onClick={() => setGrade('B')}
              className={`px-10 py-2.5 rounded-full font-bold text-xs transition-all ${grade === 'B' ? 'bg-accent text-maha-black shadow-md shadow-accent/10' : 'text-text/40 hover:text-text'}`}
            >เกรด B</button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { id: 'single', label: 'Single Post', priceRange: grade === 'A' ? (content.artworkRateCard[0]?.grades.A || '฿900-1,200') : (content.artworkRateCard[0]?.grades.B || '฿700-1,000') },
              { id: 'album', label: 'Album', priceRange: grade === 'A' ? (content.artworkRateCard[1]?.grades.A || '฿1,200-1,500') : (content.artworkRateCard[1]?.grades.B || '฿1,000-1,200') },
              { id: 'infographic', label: 'Infographic', priceRange: grade === 'A' ? (content.artworkRateCard[2]?.grades.A || '฿1,200-1,600') : (content.artworkRateCard[2]?.grades.B || '฿900-1,500') },
            ].map(item => (
              <div key={item.id} className="p-8 rounded-3xl bg-surface hover:bg-surface/80 transition-colors flex flex-col items-center">
                <span className="text-text/60 text-[10px] uppercase tracking-widest mb-2">{item.label}</span>
                <span className="text-accent font-bold text-lg mb-6 font-display">{item.priceRange}</span>
                <div className="flex items-center gap-8">
                   <button 
                     onClick={() => updateCount(item.id as any, -1)}
                     className="w-10 h-10 rounded-full bg-bg flex items-center justify-center hover:bg-maha-pink hover:text-white transition-all"
                   >
                     <Minus className="w-4 h-4" />
                   </button>
                   <span className="text-5xl font-display font-black w-10 text-center text-text">{artworkCounts[item.id as keyof typeof artworkCounts]}</span>
                   <button 
                     onClick={() => updateCount(item.id as any, 1)}
                     className="w-10 h-10 rounded-full bg-bg flex items-center justify-center hover:bg-accent hover:text-maha-black transition-all"
                   >
                     <Plus className="w-4 h-4" />
                   </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* STEP 4 */}
        <div>
          <h3 className="text-accent font-display text-sm tracking-widest mb-6 uppercase">STEP 4 — บริการเสริม</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-sm flex justify-between items-center border border-border bg-surface opacity-50 col-span-full">
               <div className="flex items-center gap-3">
                  <Check className="w-4 h-4 text-accent" />
                  <span className="font-bold text-sm text-text">Brand Building</span>
               </div>
               <span className="text-accent text-[10px] font-bold font-thai">เลือก Package →</span>
            </div>
            {addonList.map(addon => (
              <label 
                key={addon.id} 
                className={`p-6 rounded-2xl flex justify-between items-center transition-all cursor-pointer ${addons.includes(addon.id) ? 'bg-accent text-maha-black shadow-lg shadow-accent/20' : 'bg-surface hover:bg-surface/80 text-text'}`}
              >
                <div className="flex items-center gap-4">
                   <div className={`w-5 h-5 rounded-md flex items-center justify-center border-2 transition-all ${addons.includes(addon.id) ? 'bg-maha-black border-maha-black' : 'border-text/20'}`}>
                      {addons.includes(addon.id) && <Check className="w-3 h-3 text-accent" />}
                   </div>
                   <input 
                     type="checkbox" 
                     className="hidden" 
                     checked={addons.includes(addon.id)} 
                     onChange={() => toggleAddon(addon.id)}
                   />
                   <span className="font-bold text-sm">{addon.name}</span>
                </div>
                <span className={`font-bold font-display ${addons.includes(addon.id) ? 'text-maha-black/60 text-xs' : 'text-maha-pink text-xs'}`}>
                  {addon.sub}
                </span>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <div className="p-8 md:p-12 bg-bg">
         <div className="p-10 rounded-[3rem] bg-surface relative overflow-hidden mb-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-8 relative z-10">
               <div className="text-center md:text-left">
                  <p className="font-thai text-text/40 text-lg mb-1">เลือก Package และ Add-ons เพื่อดูราคา</p>
               </div>
               <div className="text-center md:text-right">
                  <div className="text-xs uppercase tracking-widest text-text/30 mb-2">ยอดรวม/เดือน</div>
                  <div className="text-8xl font-display font-black text-accent leading-none">
                    ฿{totalPrice.toLocaleString()}
                  </div>
               </div>
            </div>
         </div>

         <div className="flex flex-col md:flex-row gap-4">
            <button 
              onClick={downloadPDF}
              disabled={isGenerating}
              className="flex-1 bg-text text-bg py-6 rounded-2xl font-black text-xl flex items-center justify-center gap-4 hover:bg-accent hover:text-maha-black transition-all disabled:opacity-50"
            >
               {isGenerating ? (
                 <div className="flex items-center gap-2">
                   <div className="w-5 h-5 border-2 border-maha-black/20 border-t-maha-black rounded-full animate-spin" />
                   กำลังสร้าง PDF...
                 </div>
               ) : (
                 <>ดาวน์โหลดใบเสนอราคา PDF <Download className="w-6 h-6" /></>
               )}
            </button>
            <button 
              onClick={() => {
                const selectedPkg = packages.find(p => p.id === packageId);
                let summary = `สนใจบริการจากใบเสนอราคา:\n`;
                summary += `--------------------------\n`;
                summary += `• Package: ${selectedPkg ? selectedPkg.name : 'ไม่มี (เฉพาะ Add-ons)'}\n`;
                summary += `• สัญญา: ${contractId === 'long' ? '6 เดือนขึ้นไป (Discount 10%)' : 'รายเดือน'}\n`;
                
                if (artworkCounts.single > 0 || artworkCounts.album > 0 || artworkCounts.infographic > 0) {
                  summary += `• Artwork (เกรด ${grade}):\n`;
                  if (artworkCounts.single > 0) summary += `  - Single Post: ${artworkCounts.single} ชิ้น\n`;
                  if (artworkCounts.album > 0) summary += `  - Album: ${artworkCounts.album} ชิ้น\n`;
                  if (artworkCounts.infographic > 0) summary += `  - Infographic: ${artworkCounts.infographic} ชิ้น\n`;
                }

                if (addons.length > 0) {
                  summary += `• บริการเสริม: ${addons.map(id => addonList.find(a => a.id === id)?.name).join(', ')}\n`;
                }

                summary += `--------------------------\n`;
                summary += `ยอดรวมประมาณการ: ฿${totalPrice.toLocaleString()}/เดือน`;

                onContact?.(summary);
                onClose();
              }}
              className="flex-1 bg-accent text-maha-black py-6 rounded-2xl font-black text-xl flex items-center justify-center gap-4 hover:bg-text hover:text-bg transition-all"
            >
               ติดต่อเราพร้อม QUOTE นี้ →
            </button>
            <button onClick={onClose} className="px-10 py-6 rounded-2xl border border-border font-bold hover:bg-surface transition-all text-text">
               ปิด
            </button>
         </div>
      </div>
    </div>
  </motion.div>
);
}
