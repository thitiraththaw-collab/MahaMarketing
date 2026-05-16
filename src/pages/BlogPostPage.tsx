import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { blogService, BlogPost } from '../services/blogService';
import { motion, useScroll, useSpring } from 'motion/react';
import { Share2, Facebook, Twitter, Link as LinkIcon, ArrowLeft } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { formatDate } from '../lib/utils';

export default function BlogPostPage() {
  const { id } = useParams();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const { theme } = useTheme();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);

  useEffect(() => {
    const fetchPost = async () => {
      if (id) {
        setLoading(true);
        try {
          const found = await blogService.getPostById(id);
          if (found) {
            setPost(found);
            // Fetch related posts after getting the current post
            const allPosts = await blogService.getPosts();
            setRelatedPosts(allPosts.filter(p => p.id !== id && p.status === 'published').slice(0, 3));
          }
        } catch (error) {
          console.error('Fetch post failed:', error);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchPost();
    window.scrollTo(0, 0);
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <div className="text-accent font-display animate-pulse text-2xl tracking-[0.5em] italic">ARTICLE LOADING</div>
      </div>
    );
  }

  if (!post) return <div className="min-h-screen pt-40 text-center bg-bg text-text font-thai">ไม่พบบทความที่คุณต้องการ</div>;

  const currentTags = post.tags || [];

  return (
    <div className="bg-bg text-text min-h-screen pb-32 transition-colors duration-500">
      {/* READING PROGRESS */}
      <motion.div 
        className="fixed top-0 left-0 right-0 h-1 bg-accent z-[60] origin-left" 
        style={{ scaleX }}
      />

      <article>
        <header className="relative h-[60vh] flex items-end pb-20 px-6 overflow-hidden">
           <div className="absolute inset-0 bg-black/60 z-10" />
           <img src={post.coverUrl} referrerPolicy="no-referrer" className="absolute inset-0 w-full h-full object-cover grayscale opacity-50 transition-all duration-700 hover:grayscale-0 hover:scale-105" />
           <div className="max-w-4xl mx-auto w-full relative z-20">
              <Link to="/blog" className="inline-flex items-center gap-2 text-white/50 text-xs uppercase tracking-widest mb-8 hover:text-accent transition-colors group">
                 <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Back to Blog
              </Link>
              <div className="bg-maha-pink text-white text-[10px] px-4 py-1.5 rounded-full font-black uppercase w-fit mb-6 tracking-widest">{post.category}</div>
              <h1 className="text-5xl md:text-7xl font-display leading-[0.9] text-white uppercase italic drop-shadow-2xl">{post.title || 'Untitled'}</h1>
           </div>
        </header>

        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-[1fr_350px] gap-20 py-20">
           <div className="space-y-12">
              <div className="flex items-center gap-6 border-b border-border pb-12">
                 <div className="w-16 h-16 rounded-full bg-surface flex items-center justify-center font-display text-2xl text-accent border border-border shadow-xl overflow-hidden">
                    {post.authorImageUrl ? (
                      <img src={post.authorImageUrl} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                    ) : (
                      <span className="uppercase">{post.author ? post.author[0] : 'M'}</span>
                    )}
                 </div>
                 <div>
                    <div className="uppercase tracking-widest text-[10px] text-text/30 mb-1 font-bold">Written by</div>
                    <div className="text-2xl font-display text-text">{post.author || 'MAHA Team'}</div>
                 </div>
                 <div className="ml-auto text-right">
                    <div className="uppercase tracking-widest text-[10px] text-text/30 mb-1 font-bold">Published</div>
                    <div className="text-sm font-thai text-text/60">{formatDate(post.createdAt)}</div>
                 </div>
              </div>

              {/* CONTENT AREA */}
              <div 
                className={`prose ${theme === 'dark' ? 'prose-invert' : ''} prose-maha font-thai max-w-none text-text/70 leading-relaxed text-lg transition-colors duration-500`}
                dangerouslySetInnerHTML={{ __html: post.content || '' }}
              />

              {/* TAGS */}
              <div className="flex flex-wrap gap-2 pt-12 border-t border-border">
                 {currentTags.map(tag => (
                   <span key={tag} className="px-5 py-2 bg-surface border border-border rounded-full text-[10px] uppercase font-black tracking-widest text-text/40 hover:text-accent hover:border-accent transition-all cursor-default">
                     #{tag}
                   </span>
                 ))}
              </div>
           </div>

           <aside className="space-y-12 h-fit md:sticky md:top-32">
              <div className="p-10 bg-surface rounded-[3rem] border border-border shadow-sm">
                 <h3 className="text-2xl font-display mb-8 text-text italic uppercase">Share Article</h3>
                 <div className="flex gap-4">
                    <button className="w-14 h-14 bg-bg border border-border hover:bg-maha-pink hover:text-white hover:border-maha-pink rounded-full flex items-center justify-center transition-all group shadow-md">
                       <Facebook size={20} className="group-hover:scale-110 transition-transform" />
                    </button>
                    <button className="w-14 h-14 bg-bg border border-border hover:bg-maha-pink hover:text-white hover:border-maha-pink rounded-full flex items-center justify-center transition-all group shadow-md">
                       <Twitter size={20} className="group-hover:scale-110 transition-transform" />
                    </button>
                    <button className="w-14 h-14 bg-bg border border-border hover:bg-maha-pink hover:text-white hover:border-maha-pink rounded-full flex items-center justify-center transition-all group shadow-md">
                       <LinkIcon size={20} className="group-hover:scale-110 transition-transform" />
                    </button>
                 </div>
              </div>

              <div className="p-10 bg-accent text-maha-black rounded-[3rem] relative overflow-hidden group shadow-2xl shadow-accent/10">
                 <div className="relative z-10">
                    <h3 className="text-4xl font-display mb-4 italic leading-none uppercase font-black">Ready to grow?</h3>
                    <p className="font-thai text-sm mb-10 opacity-70 font-medium">ปรึกษาเราเพื่อวางกลยุทธ์ Social Media ให้แบรนด์คุณไปได้ไกลกว่า</p>
                    <Link to="/#contact" className="inline-block bg-maha-black text-white px-10 py-4 rounded-full font-black text-xs uppercase tracking-widest hover:bg-white hover:text-maha-black transition-all shadow-xl">
                       Contact Us
                    </Link>
                 </div>
                 <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700" />
              </div>
           </aside>
        </div>
      </article>

      {/* RELATED POSTS (SIMULATED) */}
      <section className="bg-surface/30 py-32 px-6 border-t border-border">
         <div className="max-w-7xl mx-auto">
            <h2 className="text-5xl font-display mb-16 text-text italic uppercase tracking-tighter">Related <span className="text-accent">Articles</span></h2>
            <div className="grid md:grid-cols-3 gap-12">
               {relatedPosts.map(p => (
                 <Link key={p.id} to={`/blog/${p.id}`} className="group block space-y-6">
                    <div className="aspect-[16/10] rounded-[2rem] overflow-hidden grayscale group-hover:grayscale-0 transition-all duration-700 shadow-xl">
                       <img src={p.coverUrl} referrerPolicy="no-referrer" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    </div>
                    <div>
                       <div className="text-[10px] text-text/30 font-black uppercase tracking-widest mb-2">{p.category}</div>
                       <h3 className="text-2xl font-display leading-tight group-hover:text-accent transition-colors text-text line-clamp-2">{p.title}</h3>
                    </div>
                 </Link>
               ))}
            </div>
         </div>
      </section>
    </div>
  );
}
