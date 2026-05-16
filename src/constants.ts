export interface PortfolioItem {
  id?: string;
  name: string;
  category: string;
  image: string;
  desc?: string;
}

export interface SiteContent {
  hero: {
    headline: string[];
    subtext: string;
    ctaWork: string;
    ctaService: string;
    kpis: { label: string; value: string }[];
    decoCards: { title: string; value: string; trend: string; label: string }[];
    marquee: string[];
  };
  about: {
    heading: string[];
    pillars: { title: string; desc: string; icon: string }[];
  };
  services: { title: string; desc: string; tags: string[]; popImage?: string; color?: string; }[];
  packages: {
    name: string;
    price: number | string;
    desc: string;
    items: string[];
    featured?: boolean;
    isNew?: boolean;
    ctaText?: string;
  }[];
  artworkRateCard: {
    name: string;
    grades: { A: string; B: string };
    note: string;
    desc?: string;
  }[];
  brandBuilding: { 
    name: string; 
    price: number | string; 
    desc?: string;
    features: string[]; 
    featured?: boolean;
    ctaText?: string;
  }[];
  addons: { 
    name: string; 
    price: number | string; 
    desc?: string;
    subText?: string;
    borderTop?: string;
  }[];
  portfolio: PortfolioItem[];
  team: { name: string; role: string; bio: string; avatar?: string }[];
  process: { title: string; desc: string; icon: string }[];
  results: {
    heading: string[];
    goals: string[];
  };
  loyalty: {
    title: string;
    desc: string;
    discount: string;
    cta: string;
  };
  contact: {
    email: string;
    line: string;
    responseTime: string;
  };
}

export const DEFAULT_CONTENT: SiteContent = {
  hero: {
    headline: ["MAHA", "MARKETING", "AGENCY"],
    subtext: "Full-Service Marketing & Social Media Agency ที่ช่วยปั้นแบรนด์ของคุณให้เติบโตอย่างยั่งยืน ด้วยกลยุทธ์ Data-Driven และ Personal Branding ที่ทรงพลัง",
    ctaWork: "Portfolio ผลงาน",
    ctaService: "เลือกบริการการตลาด",
    kpis: [
      { label: "5M+ Reach Growth", value: "5,000,000+" },
      { label: "30+ Global Brands", value: "30+" },
      { label: "Viral Engagement", value: "High ROI" },
      { label: "Lead Conversion", value: "+203%" }
    ],
    decoCards: [
      { title: "Social Reach", value: "4.8M+ Reach", trend: "+121%", label: "Total Impressions Reach" },
      { title: "Marketing Leads", value: "6,100 Leads", trend: "+203%", label: "Monthly Qualified Leads" },
      { title: "Personal Brand", value: "10K+ Followers", trend: "Fast Growth", label: "Brand Growth Speed" }
    ],
    marquee: [
      "SOCIAL MEDIA MARKETING",
      "PERSONAL BRANDING",
      "PERFORMANCE MARKETING",
      "ADS OPTIMIZATION",
      "BRAND IDENTITY",
      "SEO CONTENT",
      "ROI DRIVEN STRATEGY"
    ]
  },
  about: {
    heading: ["CRAFTING", "MARKETING SUCCESS"],
    pillars: [
      { title: "Strategy", desc: "วางโครงสร้างการตลาดออนไลน์ให้มั่นคงและวัดผลได้จริง", icon: "Target" },
      { title: "Engagement", desc: "สร้าง Social Media Presence ที่แข็งแกร่งและน่าจดจำ", icon: "BarChart" },
      { title: "Creative", desc: "คอนเทนต์คุณภาพสูงที่เปลี่ยน User ให้เป็นลูกค้าตัวจริง", icon: "Lightbulb" },
      { title: "Branding", desc: "ปั้น Personal Branding ให้โดดเด่นและน่าเชื่อถือในอุตสาหกรรม", icon: "Zap" }
    ]
  },
  services: [
    { 
      title: "Marketing Consulting", 
      desc: "ปรึกษาด้านการตลาดออนไลน์เจาะลึกคู่แข่งและพฤติกรรมผู้บริโภค", 
      tags: ["Business Strategy", "KOL", "Market Analysis"],
      popImage: "/services/01_OurService.png", 
      color: "bg-maha-yellow text-maha-black" 
    },
    { 
      title: "Brand Strategy", 
      desc: "วางแผน Personal Branding และ Corporate Identity ให้ยั่งยืน", 
      tags: ["Goal Setting", "Media Planning"],
      popImage: "/services/02_OurService.png",
      color: "bg-maha-pink text-white"
    },
    { 
      title: "Social Content", 
      desc: "ผลิตคอนเทนต์คุณภาพสูงเพื่อ Social Media Engagement ที่ดีที่สุด", 
      tags: ["Creative", "Visual Storytelling"],
      popImage: "/services/03_OurService.png",
      color: "bg-[#0F0F0F] text-white border border-white/10"
    },
    { 
      title: "Social Management", 
      desc: "ดูแลและบริหารจัดการ Social Media แบบครบวงจร 24/7", 
      tags: ["Daily Post", "Community Care"],
      popImage: "/services/04_OurService.png",
      color: "bg-surface border border-border"
    },
    { 
      title: "Ads Performance", 
      desc: "ยิงโฆษณา Facebook, TikTok และ Google ให้ได้ ROI สูงสุด", 
      tags: ["Performance Marketing", "ROI Focused"],
      popImage: "/services/05_OurService.png",
      color: "bg-maha-yellow text-maha-black"
    },
    { 
      title: "Data Insights", 
      desc: "วิเคราะห์ข้อมูลหลังบ้านเพื่อปรับปรุงกลยุทธ์การตลาดให้แม่นยำยิ่งขึ้น", 
      tags: ["Report", "Actionable Insight"],
      popImage: "/services/06_OurService.png",
      color: "bg-maha-pink text-white"
    }
  ],
  packages: [
    {
      name: "FULL-STACK MARKETING",
      price: 29000,
      desc: "ดูแลการตลาดครบวงจร — Strategy + Creative Content + Performance Ads",
      items: [
        "Setting Online Marketing Strategy",
        "Competitor Research & Analysis",
        "Monthly Success Report",
        "Facebook: 10 High-Quality Posts/Month",
        "Creative Content Plan & Pillar",
        "Facebook & TikTok Ads Optimization",
        "Google Ads Implementation"
      ],
      ctaText: "ปรึกษาแพ็กเกจนี้"
    },
    {
      name: "MARKETING STRATEGY",
      price: 19000,
      desc: "วางโครงสร้างการตลาดออนไลน์ให้ธุรกิจก้าวหน้าอย่างเป็นระบบ",
      items: [
        "Online Marketing Strategy Design",
        "Competitor Research (max 3 pages)",
        "Media Brief & Production Guide",
        "Monthly Strategic Meeting"
      ],
      featured: true,
      ctaText: "เริ่มต้นวางกลยุทธ์"
    },
    {
      name: "PERSONAL BRANDING",
      price: 16999,
      desc: "ยกระดับภาพลักษณ์ CEO และ Founder ให้เป็นที่จดจำบนโลกโซเชียล",
      items: [
        "Professional On-location Filming",
        "10 Short-form Videos (Editing included)",
        "Personal Branding Strategy",
        "Speaker & Founder Content Guide",
        "Boost Credibility & Authority"
      ],
      isNew: true,
      ctaText: "สร้าง Personal Brand"
    },
    {
      name: "PERFORMANCE ADS",
      price: 7000,
      desc: "เน้นยิง Ads ขับเคลื่อน Sales และ Leads ตาม KPI ที่แบรนด์ต้องการ",
      items: [
        "Targeted Ads Management",
        "Facebook / TikTok Ads Setup",
        "A/B Testing & Optimization",
        "ROI & Conversion Tracking"
      ],
      ctaText: "ยิง Ads เพิ่มยอด"
    }
  ],
  artworkRateCard: [
    {
      name: "SINGLE POST · ภาพเดี่ยว",
      desc: "เกรด B",
      grades: { A: "฿900-1,200", B: "฿700-1,000" },
      note: "Pack 10 · Discount 5%"
    },
    {
      name: "ALBUM · ภาพปก + 3-5 ภาพ",
      desc: "เกรด B",
      grades: { A: "฿1,200-1,500", B: "฿1,000-1,200" },
      note: "Pack 10 · Discount 5%"
    },
    {
      name: "INFOGRAPHIC",
      desc: "เกรด B",
      grades: { A: "฿1,200-1,600", B: "฿900-1,500" },
      note: "Pack 10 · Discount 5%"
    }
  ],
  brandBuilding: [
    { 
      name: "SILVER", 
      price: 7000, 
      desc: "Logo with concept design direction",
      features: ["Logo Design", "3 Options", "2 Edit rounds"],
      ctaText: "สนใจ Package นี้"
    },
    { 
      name: "GOLD", 
      price: 15000, 
      desc: "Logo with brand guideline",
      features: ["Logo Design", "Concept Design Direction", "3 Options", "2 Edit rounds"],
      featured: true,
      ctaText: "สนใจ Package นี้"
    },
    { 
      name: "DIAMOND", 
      price: 23000, 
      desc: "Logo with brand guideline + stationery design",
      features: ["Logo Design", "Concept Design Direction", "KV Brand Guideline (Color, Fonts, Mockup)", "Brandbook", "3 Options · 2 Edit rounds"],
      ctaText: "สนใจ Package นี้"
    }
  ],
  addons: [
    { name: "KV DESIGN", price: 8000, desc: "Key Visual ออกแบบภาพหลัก 1 ชิ้น · 3 Options · 2 Edit rounds", subText: "1 Piece · 3 Options", borderTop: "white/5" },
    { name: "GOOGLE ADS", price: 3000, desc: "Manage Google Ads Account · Keyword Planning & Optimization", subText: "/เดือน", borderTop: "white/5" },
    { name: "SEO ARTICLE / SEEDING", price: 1200, desc: "เขียน SEO Article หรือ Seeding Content เพื่อ Organic Reach", subText: "/บทความ", borderTop: "maha-pink" },
    { name: "LINE OFFICIAL STRATEGY", price: 1000, desc: "Setup · Broadcast · MSG Strategy สำหรับ Line OA", subText: "/เดือน", borderTop: "maha-pink" },
    { name: "DIRECT SALE POST", price: 1500, desc: "กระจาย Post ใน Facebook Group · Line Group รวม 20 กลุ่ม/เดือน", subText: "/เดือน", borderTop: "maha-pink" },
    { name: "KOL CONTACT", price: "5% OF KOL FEE", desc: "Management fee จากราคา KOL จริง · ติดต่อ · ประสานงาน · ดูแลแคมเปญ", subText: "Management fee จากราคา KOL จริง", borderTop: "white/5" }
  ],
  portfolio: [
    { name: "BIM Object TH", category: "Social Management", image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80" },
    { name: "Krungsri Finnovate", category: "Community Management", image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80" },
    { name: "RS Group", category: "Business Inspiration", image: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&q=80" },
    { name: "G-Able", category: "Cyber Security Marketing", image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80" },
    { name: "Kylin Market", category: "Social Management & Artwork", image: "https://images.unsplash.com/photo-1506485338023-6ce5f36692df?auto=format&fit=crop&q=80" },
    { name: "Khun AI", category: "Creative AI Content", image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80" },
    { name: "Thailand eComExpo", category: "Event Marketing", image: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&q=80" },
    { name: "Neo Influencer", category: "Influencer Management", image: "https://images.unsplash.com/photo-1557838923-2985c318be48?auto=format&fit=crop&q=80" },
    { name: "Emma Clinic", category: "Beauty & Clinic Marketing", image: "https://images.unsplash.com/photo-1522335789783-4fb045099369?auto=format&fit=crop&q=80" }
  ],
  team: [
    { name: "NATTHI", role: "Founder & Marketing Manager", bio: "Expert in Business & Marketing Strategy", avatar: "/team/Founder_Natthi.png" },
    { name: "SONG", role: "Founder & Account Executive", bio: "Client Success Specialist", avatar: "/team/Founder_Song.png" },
    { name: "AMONRADA", role: "Founder & Ad Optimizer", bio: "Performance marketing and ROI specialist", avatar: "/team/Founder_Amonrada.png" }
  ],
  process: [
    { title: "1st Meeting", desc: "รับโจทย์และทำความเข้าใจธุรกิจ", icon: "MessageSquare" },
    { title: "Strategy Planning", desc: "วางแผนกลยุทธ์เฉพาะแบรนด์", icon: "Compass" },
    { title: "Kick-off", desc: "เริ่มดำเนินการตามแผน", icon: "Rocket" },
    { title: "Sign Contract", desc: "ตกลงเงื่อนไขการทำงานระยะยาว", icon: "FileText" },
    { title: "Work Together", desc: "เติบโตไปด้วยกัน", icon: "TrendingUp" }
  ],
  results: {
    heading: ["OUR", "PROVEN", "RESULTS"],
    goals: [
      "Specific Goal setting",
      "Measurable performance",
      "Achievable targets",
      "Realistic timelines",
      "Time-bound results"
    ]
  },
  loyalty: {
    title: "6-MONTH LOYALTY",
    desc: "สมัครบริการตั้งแต่ 6 เดือนขึ้นไป",
    discount: "DISCOUNT 10%",
    cta: "ประหยัดสูงสุด ฿17,400/ปี"
  },
  contact: {
    email: "maha.marketing.team@gmail.com",
    line: "@mahamarketings",
    responseTime: "ภายใน 24 ชม."
  }
};
