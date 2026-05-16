import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { blogService, BlogPost } from '../services/blogService';
import { motion } from 'motion/react';
import { Search, ChevronRight } from 'lucide-react';
import { formatDate } from '../lib/utils';

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchPosts = async () => {
      const allPosts = await blogService.getPosts();
      setPosts(allPosts.filter(p => p.status === 'published'));
    };
    fetchPosts();
  }, []);

  const categories = ['All', 'Strategy', 'Ads', 'Creative', 'Inside'];
  
  const filteredPosts = posts.filter(p => {
    const matchesCat = filter === 'All' || p.category === filter;
    const matchesSearch = p.title.toLowerCase().includes(search.toLowerCase()) || 
                          p.excerpt.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-bg pt-32 pb-20 px-6 transition-colors duration-500">
      <div className="max-w-7xl mx-auto">
        <header className="mb-20">
           <span className="text-maha-pink uppercase tracking-widest text-[10px] mb-4 font-bold">Our Blog</span>
           <h1 className="text-7xl md:text-8xl font-display leading-[0.8] mb-8 text-text uppercase italic">
             Marketing & <span className="text-accent underline decoration-maha-pink/30 decoration-8 underline-offset-8">Branding</span> Insights
           </h1>
           <p className="max-w-2xl text-text/50 font-thai text-lg mb-12 leading-relaxed">
             เจาะลึกกลยุทธ์การตลาดออนไลน์ (Social Media Marketing) การสร้างตัวตน (Personal Branding) และเทคนิคการเพิ่มยอดขาย (Ads Performance) จากประสบการณ์ทำงานจริง
           </p>
           
           <div className="flex flex-col md:flex-row gap-8 justify-between items-end border-b border-border pb-8">
              <div className="flex flex-wrap gap-2">
                 {categories.map(cat => (
                   <button 
                     key={cat}
                     onClick={() => setFilter(cat)}
                     className={`px-6 py-2 rounded-full text-xs font-bold transition-all ${filter === cat ? 'bg-accent text-maha-black shadow-lg shadow-accent/20' : 'bg-surface text-text/50 hover:bg-surface/80 hover:text-text'}`}
                   >
                     {cat}
                   </button>
                 ))}
              </div>
              <div className="relative w-full md:w-80">
                 <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text/20" size={18} />
                 <input 
                   type="text" 
                   placeholder="ค้นหาบทความ..."
                   value={search}
                   onChange={e => setSearch(e.target.value)}
                   className="w-full bg-surface text-text border border-border rounded-full pl-12 pr-6 py-3 text-sm focus:border-accent outline-none transition-all placeholder:text-text/20"
                 />
              </div>
           </div>
        </header>

        <div className="grid md:grid-cols-3 gap-12">
           {filteredPosts.map((post, idx) => (
             <motion.div 
               key={post.id}
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: idx * 0.1 }}
               className={`group flex flex-col ${idx === 0 && filter === 'All' && !search ? 'md:col-span-2 md:flex-row gap-12 bg-surface/50 p-8 rounded-[3rem] border border-border/50' : ''}`}
             >
                <Link to={`/blog/${post.id}`} className={`block overflow-hidden rounded-[2.5rem] relative mb-6 ${idx === 0 && filter === 'All' && !search ? 'md:w-1/2 md:mb-0 h-[300px] md:h-auto shadow-2xl' : 'aspect-video shadow-xl'}`}>
                   <img src={post.coverUrl} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 grayscale group-hover:grayscale-0" />
                   <div className="absolute top-6 left-6 bg-maha-pink text-white text-[10px] px-4 py-1.5 rounded-full font-black uppercase tracking-widest">{post.category}</div>
                </Link>
                <div className={`${idx === 0 && filter === 'All' && !search ? 'md:w-1/2 flex flex-col justify-center' : ''}`}>
                   <div className="text-text/30 text-[10px] uppercase tracking-widest mb-4 font-bold">{formatDate(post.createdAt)} • BY {post.author}</div>
                   <h2 className={`font-display mb-4 leading-tight group-hover:text-accent transition-colors line-clamp-2 text-text ${idx === 0 && filter === 'All' && !search ? 'text-5xl' : 'text-3xl'}`}>
                     <Link to={`/blog/${post.id}`}>{post.title}</Link>
                   </h2>
                   <p className="text-text/40 text-sm font-thai line-clamp-3 mb-6 leading-relaxed">{post.excerpt}</p>
                   <Link to={`/blog/${post.id}`} className="text-accent text-xs font-black flex items-center gap-2 group-hover:gap-4 transition-all uppercase tracking-widest">
                     Read More <ChevronRight size={14} strokeWidth={3} />
                   </Link>
                </div>
             </motion.div>
           ))}
        </div>
      </div>
    </div>
  );
}
