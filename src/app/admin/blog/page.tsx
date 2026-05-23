'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Search, RefreshCw, Loader2, X, Clock, User } from 'lucide-react';

interface Blog {
  id: string; title: string; slug: string; content: string;
  category: string; author: string; tags: string; status: string; createdAt: string;
}

const TAG_COLORS = ['bg-emerald-500/20 text-emerald-400 border-emerald-500/30', 'bg-blue-500/20 text-blue-400 border-blue-500/30', 'bg-purple-500/20 text-purple-400 border-purple-500/30', 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'];

function readTime(content: string) { return Math.ceil(content.split(' ').length / 200); }

export default function AdminBlogPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<Blog | null>(null);

  const fetchBlogs = useCallback(async () => { setLoading(true); try { const res = await fetch('/api/blog?limit=100'); const data = await res.json(); if (data.success) setBlogs(data.data); } finally { setLoading(false); } }, []);
  useEffect(() => { fetchBlogs(); }, [fetchBlogs]);

  const filtered = blogs.filter(b => !search || b.title.toLowerCase().includes(search.toLowerCase()) || b.author.toLowerCase().includes(search.toLowerCase()) || b.category.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6 max-w-7xl">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold text-white">Blog & Content</h1><p className="text-gray-400 text-sm mt-1">{blogs.length} published articles</p></div>
        <button onClick={fetchBlogs} className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 px-4 py-2 rounded-xl text-sm transition-colors"><RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /> Refresh</button>
      </div>

      <div className="relative max-w-sm"><Search className="absolute left-4 top-3.5 w-4 h-4 text-gray-500" /><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search articles..." className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-emerald-500 text-sm transition-colors" /></div>

      {loading ? <div className="flex items-center justify-center py-16"><Loader2 className="w-6 h-6 animate-spin text-emerald-400" /></div> : filtered.length === 0 ? <div className="text-center py-16 text-gray-500">No articles found</div> : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filtered.map((blog, i) => (
            <motion.div key={blog.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="glass-card rounded-2xl overflow-hidden border border-white/10 hover:border-white/20 transition-all flex flex-col">
              <div className="h-36 bg-gradient-to-br from-emerald-900/30 to-slate-900/50 flex items-center justify-center border-b border-white/5"><span className="text-7xl opacity-20">🐍</span></div>
              <div className="p-5 flex flex-col flex-1">
                <div className="flex flex-wrap gap-1.5 mb-3">
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full border bg-blue-500/20 text-blue-400 border-blue-500/30">{blog.category}</span>
                  {(blog.tags || '').split(',').slice(0, 1).filter(Boolean).map((tag, j) => <span key={tag} className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${TAG_COLORS[j % TAG_COLORS.length]}`}>{tag.trim()}</span>)}
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full border bg-emerald-500/20 text-emerald-400 border-emerald-500/30">{blog.status}</span>
                </div>
                <h3 className="text-white font-bold text-base leading-snug mb-2 line-clamp-2">{blog.title}</h3>
                <p className="text-gray-500 text-xs line-clamp-2 flex-1 mb-4">{blog.content.slice(0, 120)}...</p>
                <div className="flex items-center justify-between text-gray-600 text-xs border-t border-white/5 pt-3">
                  <span className="flex items-center gap-1"><User className="w-3 h-3" />{blog.author}</span>
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{readTime(blog.content)} min read</span>
                </div>
                <button onClick={() => setSelected(blog)} className="mt-3 w-full py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 hover:text-white rounded-xl text-xs font-semibold transition-colors">Read Full Article</button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <AnimatePresence>
        {selected && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={e => e.target === e.currentTarget && setSelected(null)}>
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }} className="bg-[#0f1a1c] border border-white/10 rounded-3xl max-w-xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between p-6 border-b border-white/5"><h3 className="text-white font-bold">Article Preview</h3><button onClick={() => setSelected(null)} className="text-gray-500 hover:text-white"><X className="w-5 h-5" /></button></div>
              <div className="p-6">
                <div className="flex flex-wrap gap-1.5 mb-4">
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full border bg-blue-500/20 text-blue-400 border-blue-500/30">{selected.category}</span>
                  {(selected.tags || '').split(',').filter(Boolean).map((tag, i) => <span key={tag} className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${TAG_COLORS[i % TAG_COLORS.length]}`}>{tag.trim()}</span>)}
                </div>
                <h2 className="text-white font-bold text-xl leading-tight mb-3">{selected.title}</h2>
                <div className="flex items-center gap-4 text-gray-500 text-xs mb-6 pb-4 border-b border-white/5">
                  <span className="flex items-center gap-1.5"><User className="w-3 h-3" />{selected.author}</span>
                  <span className="flex items-center gap-1.5"><Clock className="w-3 h-3" />{new Date(selected.createdAt).toLocaleDateString()}</span>
                  <span className="flex items-center gap-1.5"><BookOpen className="w-3 h-3" />{readTime(selected.content)} min</span>
                </div>
                <div className="text-gray-300 text-sm leading-relaxed space-y-3">{selected.content.split('\n').filter(Boolean).map((p, i) => <p key={i}>{p}</p>)}</div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
