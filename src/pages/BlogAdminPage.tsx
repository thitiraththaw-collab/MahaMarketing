import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { blogService, BlogPost } from '../services/blogService';
import { motion } from 'motion/react';
import { fileToBase64 } from '../lib/utils';
import { 
  Plus, Search, Save, Globe, Eye, FileText, Image, User, Tag, 
  ChevronLeft, Bold, Italic, List, Link as LinkIcon, Heading1, Heading2, 
  Trash2, Copy, CheckCircle2, Circle, ArrowLeft, LogOut, Upload,
  Quote, HelpCircle, Grid, Hash, Key
} from 'lucide-react';

export default function BlogAdminPage() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
  const [search, setSearch] = useState('');
  const [isDirty, setIsDirty] = useState(false);
  const editorRef = useRef<HTMLDivElement>(null);
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      const list = await blogService.getPosts(true);
      setPosts(list);
      if (list.length > 0 && !selectedPost) {
        setSelectedPost(list[0]);
      }
    };
    fetchPosts();
  }, []);

  const handleNewPost = () => {
    const newPost: BlogPost = {
      id: `post-${Date.now()}`,
      title: 'New Article',
      excerpt: 'Brief summary of the article...',
      content: '<p>Start writing here...</p>',
      category: 'Uncategorized',
      tags: [],
      author: 'MAHA TEAM',
      authorImageUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e',
      coverUrl: 'https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a',
      slug: `new-article-${Date.now()}`,
      status: 'draft',
      createdAt: new Date().toISOString()
    };
    setSelectedPost(newPost);
    setPosts(prev => [newPost, ...prev]);
    setIsDirty(true);
  };

  const handleSave = async () => {
    if (!selectedPost) return;
    setSaveStatus('saving');
    
    try {
      const updatedPost = { ...selectedPost };
      if (editorRef.current) {
         updatedPost.content = editorRef.current.innerHTML;
      }
      
      // Update local state immediately for better responsiveness
      setPosts(prev => prev.map(p => p.id === updatedPost.id ? updatedPost : p));
      
      await blogService.savePost(updatedPost);
      setSaveStatus('saved');
      setIsDirty(false);
    } catch (error) {
      console.error('Save failed:', error);
      setSaveStatus('idle');
      alert('บันทึกไม่สำเร็จ: ' + (error instanceof Error ? error.message : 'Unknown error'));
      // Already handled in handleFirestoreError which rethrows
    }
    setTimeout(() => setSaveStatus('idle'), 3000);
  };

  const handleDelete = async () => {
    if (!selectedPost || !window.confirm('ยืนยันการลบบทความนี้?')) return;
    try {
      await blogService.deletePost(selectedPost.id);
      const list = await blogService.getPosts(true);
      setPosts(list);
      setSelectedPost(list.length > 0 ? list[0] : null);
    } catch (error) {
       // Already handled in service
    }
  };

  const execCommand = (command: string, value: string = '') => {
    if (editorRef.current) {
      editorRef.current.focus();
    }
    document.execCommand(command, false, value);
    handleContentChange();
  };

  const savedRange = useRef<Range | null>(null);

  const saveSelection = () => {
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      savedRange.current = selection.getRangeAt(0);
    }
  };

  const restoreSelection = () => {
    if (savedRange.current) {
      const selection = window.getSelection();
      if (selection) {
        selection.removeAllRanges();
        selection.addRange(savedRange.current);
      }
    }
  };

  const insertHTML = (html: string) => {
    if (editorRef.current) {
      editorRef.current.focus();
    }
    
    restoreSelection();
    
    // Try to insert using execCommand
    const success = document.execCommand('insertHTML', false, html);
    
    // Fallback if execCommand fails
    if (!success) {
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        range.deleteContents();
        const div = document.createElement('div');
        div.innerHTML = html;
        const frag = document.createDocumentFragment();
        while (div.firstChild) frag.appendChild(div.firstChild);
        range.insertNode(frag);
        
        // Move cursor after inserted element
        range.collapse(false);
      }
    }
    handleContentChange();
  };

  const handleContentChange = () => {
    if (!editorRef.current || !selectedPost) return;
    
    setIsDirty(true);
    
    // Debounce state update for performance
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      if (editorRef.current && selectedPost) {
        const newContent = editorRef.current.innerHTML;
        setSelectedPost(prev => prev ? { ...prev, content: newContent } : null);
      }
    }, 500);
  };

  const wordCount = selectedPost?.content ? selectedPost.content.replace(/<[^>]*>/g, '').split(/\s+/).length : 0;

  const insertQuote = () => {
    saveSelection();
    const quote = prompt('Enter quote text:');
    if (quote) {
      insertHTML(`<blockquote class="maha-quote">"${quote}"</blockquote><p><br></p>`);
    }
  };

  const insertQA = () => {
    saveSelection();
    const q = prompt('Enter Question:');
    const a = prompt('Enter Answer:');
    if (q && a) {
      insertHTML(`
        <details class="maha-details">
          <summary>
             <span>${q}</span>
             <span class="icon">+</span>
          </summary>
          <div class="content">${a}</div>
        </details>
        <p><br></p>
      `);
    }
  };

  const insertTable = () => {
    saveSelection();
    const rowsStr = prompt('Enter number of rows:', '3');
    const colsStr = prompt('Enter number of columns:', '4');
    if (rowsStr && colsStr) {
      const rCount = parseInt(rowsStr) || 3;
      const cCount = parseInt(colsStr) || 4;
      let html = '<div class="table-container my-8 overflow-x-auto"><table class="maha-table w-full border-collapse text-sm">';
      html += '<thead><tr class="bg-maha-yellow/10">';
      for (let c = 0; c < cCount; c++) html += `<th class="border border-white/10 p-4 text-left font-bold text-maha-yellow">HEADER ${c + 1}</th>`;
      html += '</tr></thead><tbody>';
      for (let r = 0; r < rCount; r++) {
        html += '<tr class="border-b border-white/5">';
        for (let c = 0; c < cCount; c++) html += '<td class="border border-white/10 p-4 opacity-70">Data Cell</td>';
        html += '</tr>';
      }
      html += '</tbody></table></div><p><br></p>';
      insertHTML(html);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('maha_admin_auth');
    navigate('/login');
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'author' | 'cover' | 'editor') => {
    const file = e.target.files?.[0];
    if (!file || !selectedPost) return;

    // Optional: Add size check
    if (file.size > 2 * 1024 * 1024) {
      alert('File is too large (max 2MB)');
      return;
    }

    try {
      setSaveStatus('saving');
      const base64 = await fileToBase64(file);
      let updatedPost = { ...selectedPost };

      if (type === 'author') {
        updatedPost = { ...updatedPost, authorImageUrl: base64 };
      } else if (type === 'cover') {
        updatedPost = { ...updatedPost, coverUrl: base64 };
      } else if (type === 'editor') {
        execCommand('insertImage', base64);
        // updatedPost.content will be updated by handleContentChange
      }
      
      setSelectedPost(updatedPost);
      setPosts(prev => prev.map(p => p.id === updatedPost.id ? updatedPost : p));
      setSaveStatus('idle');
    } catch (error) {
      console.error('Upload failed:', error);
      setSaveStatus('idle');
    }
    // Reset input
    e.target.value = '';
  };

   useEffect(() => {
    if (editorRef.current && selectedPost) {
      if (editorRef.current.getAttribute('data-post-id') !== selectedPost.id) {
        editorRef.current.innerHTML = selectedPost.content || '';
        editorRef.current.setAttribute('data-post-id', selectedPost.id);
      }
    }
  }, [selectedPost?.id]);

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white pt-14 font-thai flex h-screen overflow-hidden">
      
      {/* SIDEBAR - LIST */}
      <aside className="w-[350px] border-r border-white/5 flex flex-col pt-4">
         <div className="px-6 mb-6">
            <div className="flex justify-between items-center mb-6">
               <button 
                 onClick={() => navigate('/admin')}
                 className="flex items-center gap-2 text-[10px] text-white/30 hover:text-maha-yellow transition-colors uppercase tracking-widest font-bold group"
               >
                 <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Dashboard
               </button>
               <button 
                 onClick={handleLogout}
                 className="flex items-center gap-2 text-[10px] text-white/30 hover:text-maha-pink transition-colors uppercase tracking-widest font-bold group"
               >
                 Logout <LogOut size={14} className="group-hover:translate-x-1 transition-transform" />
               </button>
            </div>
            <div className="flex justify-between items-center">
               <h2 className="text-xl font-display tracking-widest italic">BLOG CMS</h2>
               <button 
                 onClick={handleNewPost}
                 className="bg-maha-yellow text-maha-black p-2 rounded-xl hover:rotate-90 transition-transform shadow-lg shadow-maha-yellow/10"
               >
                 <Plus size={20} />
               </button>
            </div>
         </div>

         <div className="px-6 mb-6">
            <div className="relative">
               <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20" size={14} />
               <input 
                 type="text" 
                 placeholder="ค้นหา..." 
                 value={search}
                 onChange={e => setSearch(e.target.value)}
                 className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-xs focus:border-maha-yellow transition-all outline-none"
               />
            </div>
         </div>

         <div className="flex-1 overflow-y-auto px-4 space-y-1 pb-10">
            {posts.filter(p => p.title.toLowerCase().includes(search.toLowerCase())).map(post => (
               <button 
                 key={post.id}
                 onClick={() => setSelectedPost(post)}
                 className={`w-full text-left p-4 rounded-3xl transition-all group ${selectedPost?.id === post.id ? 'bg-white/10' : 'hover:bg-white/5'}`}
               >
                  <div className="flex justify-between items-start mb-2">
                     <span className={`text-[8px] uppercase tracking-widest flex items-center gap-1 font-bold ${post.status === 'published' ? 'text-green-400' : 'text-white/30'}`}>
                        {post.status === 'published' ? <CheckCircle2 size={10} /> : <Circle size={10} />}
                        {post.status}
                     </span>
                     <span className="text-[9px] text-white/20 font-mono">{new Date(post.createdAt).toLocaleDateString()}</span>
                  </div>
                  <h3 className={`text-sm font-bold mb-2 line-clamp-1 ${selectedPost?.id === post.id ? 'text-maha-yellow' : 'text-white'}`}>{post.title}</h3>
                  <p className="text-[10px] text-white/30 line-clamp-2">{post.excerpt}</p>
               </button>
            ))}
         </div>
      </aside>

      {/* EDITOR AREA */}
      <main className="flex-1 overflow-y-auto bg-[#0F0F0F] relative">
         {selectedPost ? (
            <div className="max-w-4xl mx-auto px-12 py-20 space-y-12">
               {/* TOOLBAR */}
               <div className="flex items-center gap-2 bg-white/5 p-2 rounded-2xl border border-white/5 sticky top-0 z-50 backdrop-blur-md">
                 <button onClick={() => execCommand('bold')} className="p-3 hover:bg-white/10 rounded-xl transition-colors"><Bold size={16} /></button>
                 <button onClick={() => execCommand('italic')} className="p-3 hover:bg-white/10 rounded-xl transition-colors"><Italic size={16} /></button>
                 <div className="w-px h-6 bg-white/10 mx-2" />
                 <button onClick={() => execCommand('formatBlock', '<h2>')} className="p-3 hover:bg-white/10 rounded-xl transition-colors font-bold">H2</button>
                 <button onClick={() => execCommand('formatBlock', '<h3>')} className="p-3 hover:bg-white/10 rounded-xl transition-colors font-bold">H3</button>
                 <button onClick={() => execCommand('insertUnorderedList')} className="p-3 hover:bg-white/10 rounded-xl transition-colors"><List size={16} /></button>
                 <label className="p-3 hover:bg-white/10 rounded-xl transition-colors cursor-pointer">
                   <input 
                     type="file" 
                     className="hidden" 
                     accept="image/*"
                     onChange={e => handleFileUpload(e, 'editor')} 
                   />
                   <Image size={16} />
                 </label>
                 <button onClick={() => {
                   const url = prompt('Enter URL:');
                   if (url) execCommand('createLink', url);
                 }} className="p-3 hover:bg-white/10 rounded-xl transition-colors"><LinkIcon size={16} /></button>
                 
                 <div className="w-px h-6 bg-white/10 mx-2" />
                 <button onClick={insertQuote} className="p-3 hover:bg-white/10 rounded-xl transition-colors" title="Quote"><Quote size={16} /></button>
                 <button onClick={insertQA} className="p-3 hover:bg-white/10 rounded-xl transition-colors" title="Accordion Q&A"><HelpCircle size={16} /></button>
                 <button onClick={insertTable} className="p-3 hover:bg-white/10 rounded-xl transition-colors" title="Table"><Grid size={16} /></button>
                 
                 <div className="ml-auto flex items-center gap-3 pr-2">
                    <span className="text-[10px] text-white/20 uppercase tracking-widest">{wordCount} Words</span>
                    <button 
                      onClick={handleSave} 
                      className="bg-maha-yellow text-maha-black px-6 py-2 rounded-xl font-bold text-xs flex items-center gap-2 hover:bg-white transition-all"
                    >
                      {saveStatus === 'saving' ? 'Saving...' : saveStatus === 'saved' ? 'Saved' : <><Save size={14} /> บันทึก</>}
                    </button>
                 </div>
               </div>

               <div className="space-y-4">
                  <input 
                    type="text" 
                    value={selectedPost.title}
                    onChange={e => setSelectedPost({...selectedPost, title: e.target.value})}
                    placeholder="Article Title..."
                    className="w-full bg-transparent text-5xl font-display text-white italic outline-none border-b border-transparent focus:border-maha-yellow/20 py-4 transition-all"
                  />
                  <textarea 
                    value={selectedPost.excerpt}
                    onChange={e => setSelectedPost({...selectedPost, excerpt: e.target.value})}
                    placeholder="Brief excerpt..."
                    className="w-full bg-transparent text-lg font-thai text-white/40 outline-none h-20 resize-none italic"
                  />
               </div>

               <div 
                 ref={editorRef}
                 contentEditable
                 onInput={handleContentChange}
                 onBlur={handleContentChange}
                 onMouseUp={saveSelection}
                 onKeyUp={saveSelection}
                 className="prose prose-invert prose-maha font-thai text-xl min-h-[60vh] outline-none text-white/80 focus:prose-p:text-white transition-all"
               />
            </div>
         ) : (
            <div className="h-full flex flex-col items-center justify-center text-white/10 italic">
               <FileText size={64} className="mb-4" />
               Select a post or create a new one
            </div>
         )}
      </main>

      {/* META PANEL */}
      <aside className="w-[350px] border-l border-white/5 bg-[#0A0A0A] p-8 overflow-y-auto space-y-10">
         {selectedPost && (
            <>
              <div className="space-y-6">
                 <h4 className="text-[10px] uppercase tracking-widest text-white/30 font-bold">Visibility</h4>
                 <div className="flex bg-white/5 p-1 rounded-2xl">
                    <button 
                      onClick={() => setSelectedPost({...selectedPost, status: 'draft'})}
                      className={`flex-1 py-3 rounded-xl text-xs font-bold transition-all ${selectedPost.status === 'draft' ? 'bg-maha-black shadow-lg text-white' : 'text-white/20'}`}
                    >
                      Draft
                    </button>
                    <button 
                      onClick={() => setSelectedPost({...selectedPost, status: 'published'})}
                      className={`flex-1 py-3 rounded-xl text-xs font-bold transition-all ${selectedPost.status === 'published' ? 'bg-maha-pink shadow-lg text-white' : 'text-white/20'}`}
                    >
                      Published
                    </button>
                 </div>
              </div>

              <div className="space-y-4">
                 <h4 className="text-[10px] uppercase tracking-widest text-white/30 font-bold">Meta Details</h4>
                 <div className="space-y-4">
                    <div className="space-y-2">
                       <label className="text-[10px] text-white/20 pl-4">Category</label>
                       <input 
                         type="text" 
                         value={selectedPost.category} 
                         onChange={e => setSelectedPost({...selectedPost, category: e.target.value})}
                         className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3 text-xs focus:border-maha-yellow outline-none"
                       />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] text-white/20 pl-4">Author</label>
                       <input 
                         type="text" 
                         value={selectedPost.author} 
                         onChange={e => setSelectedPost({...selectedPost, author: e.target.value})}
                         className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3 text-xs focus:border-maha-yellow outline-none"
                       />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] text-white/20 pl-4">Author Image</label>
                       <div className="flex gap-3 items-center">
                          <div className="w-10 h-10 rounded-full border border-white/10 overflow-hidden shrink-0 bg-white/5 relative group">
                             {selectedPost.authorImageUrl && <img src={selectedPost.authorImageUrl} className="w-full h-full object-cover" />}
                             <label className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                               <input 
                                 type="file" 
                                 className="hidden" 
                                 accept="image/*" 
                                 onChange={e => handleFileUpload(e, 'author')}
                               />
                               <Upload size={12} />
                             </label>
                          </div>
                          <input 
                            type="text" 
                            value={selectedPost.authorImageUrl || ''} 
                            onChange={e => setSelectedPost({...selectedPost, authorImageUrl: e.target.value})}
                            placeholder="หรือวาง URL ที่นี่..."
                            className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-[10px] font-mono focus:border-maha-yellow outline-none"
                          />
                       </div>
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] text-white/20 pl-4">Slug</label>
                       <input 
                         type="text" 
                         value={selectedPost.slug} 
                         onChange={e => setSelectedPost({...selectedPost, slug: e.target.value})}
                         className="w-full bg-white/5 border border-white/10 font-mono rounded-2xl px-5 py-3 text-[10px] focus:border-maha-yellow outline-none"
                       />
                    </div>
                 </div>
              </div>

              <div className="space-y-4">
                 <h4 className="text-[10px] uppercase tracking-widest text-white/30 font-bold">SEO & Keywords</h4>
                 <div className="space-y-4">
                    <div className="space-y-2">
                       <label className="text-[10px] text-white/20 pl-4">SEO Title</label>
                       <input 
                         type="text" 
                         value={selectedPost.seoTitle || ''} 
                         onChange={e => setSelectedPost({...selectedPost, seoTitle: e.target.value})}
                         placeholder="Custom SEO Title..."
                         className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3 text-xs focus:border-maha-yellow outline-none"
                       />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] text-white/20 pl-4">Meta Description</label>
                       <textarea 
                         value={selectedPost.metaDescription || ''} 
                         onChange={e => setSelectedPost({...selectedPost, metaDescription: e.target.value})}
                         placeholder="Meta snippet for Google..."
                         className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3 text-xs focus:border-maha-yellow outline-none h-24 resize-none"
                       />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] text-white/20 pl-4 flex items-center gap-2"><Key size={10} /> Primary Keyword</label>
                       <input 
                         type="text" 
                         value={selectedPost.primaryKeyword || ''} 
                         onChange={e => setSelectedPost({...selectedPost, primaryKeyword: e.target.value})}
                         className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3 text-xs focus:border-maha-yellow outline-none font-bold"
                       />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] text-white/20 pl-4 flex items-center gap-2"><Tag size={10} /> Secondary Keywords</label>
                       <input 
                         type="text" 
                         value={selectedPost.secondaryKeywords || ''} 
                         onChange={e => setSelectedPost({...selectedPost, secondaryKeywords: e.target.value})}
                         placeholder="keyword, keyword, keyword..."
                         className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3 text-xs focus:border-maha-yellow outline-none"
                       />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] text-white/20 pl-4 flex items-center gap-2"><Hash size={10} /> Hashtags</label>
                       <input 
                         type="text" 
                         value={selectedPost.hashtags || ''} 
                         onChange={e => setSelectedPost({...selectedPost, hashtags: e.target.value})}
                         placeholder="#hashtag1 #hashtag2..."
                         className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3 text-xs focus:border-maha-yellow outline-none text-maha-pink font-bold"
                       />
                    </div>
                 </div>
              </div>

              <div className="space-y-4">
                 <h4 className="text-[10px] uppercase tracking-widest text-white/30 font-bold">Featured Image</h4>
                 <div className="aspect-video w-full bg-white/5 rounded-3xl overflow-hidden mb-4 border border-white/10 relative group">
                    <img src={selectedPost.coverUrl} className="w-full h-full object-cover grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100 transition-all" />
                    <label className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer bg-black/40">
                       <input 
                         type="file" 
                         className="hidden" 
                         accept="image/*"
                         onChange={e => handleFileUpload(e, 'cover')}
                       />
                       <div className="bg-white text-maha-black p-3 rounded-full flex items-center gap-2 font-bold text-xs shadow-xl">
                          <Upload size={18} /> อัปโหลดจากเครื่อง
                       </div>
                    </label>
                 </div>
                 <input 
                    type="text" 
                    value={selectedPost.coverUrl} 
                    onChange={e => setSelectedPost({...selectedPost, coverUrl: e.target.value})}
                    placeholder="หรือวาง URL รูปภาพที่นี่..."
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3 text-[10px] font-mono focus:border-maha-yellow outline-none"
                 />
              </div>

              <button 
                onClick={() => handleDelete(selectedPost.id)}
                className="w-full bg-maha-black border border-red-500/20 text-red-500 py-4 rounded-2xl text-xs font-bold hover:bg-red-500 hover:text-white transition-all flex items-center justify-center gap-2 mt-20 opacity-50 hover:opacity-100"
              >
                 <Trash2 size={14} /> Delete Post
              </button>
            </>
         )}
      </aside>

    </div>
  );
}
