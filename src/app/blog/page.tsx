'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { BookOpen, Clock, User, ArrowRight, Search } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import FloatingWidgets from '@/components/FloatingWidgets';

interface Blog {
  id: string;
  title: string;
  slug: string;
  content: string;
  category: string;
  author: string;
  tags: string;
  status: string;
  imageUrl?: string;
  createdAt: string;
}

const TAG_COLORS = [
  'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  'bg-blue-500/20 text-blue-400 border-blue-500/30',
  'bg-purple-500/20 text-purple-400 border-purple-500/30',
  'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  'bg-orange-500/20 text-orange-400 border-orange-500/30',
];

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

function readTime(content: string) {
  const words = content.split(' ').length;
  return Math.ceil(words / 200);
}

export default function BlogPage() {
  const router = useRouter();
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    let mounted = true;
    const loadBlogs = async () => {
      setLoading(true);
      try {
        const r = await fetch('/api/blog?status=PUBLISHED');
        const data = await r.json();
        if (mounted && data.success) setBlogs(data.data);
      } catch (e) {
        // ignore
      } finally {
        if (mounted) setLoading(false);
      }
    };

    loadBlogs();

    // listen for cross-tab updates
    let channel: BroadcastChannel | null = null;
    try {
      channel = new BroadcastChannel('blog-updates');
      channel.onmessage = (ev) => {
        if (ev.data && ev.data.type === 'updated') loadBlogs();
      };
    } catch (e) {
      // BroadcastChannel not supported
    }

    return () => { mounted = false; if (channel) channel.close(); };
  }, []);

  const filtered = blogs.filter(b =>
    !search ||
    b.title.toLowerCase().includes(search.toLowerCase()) ||
    b.content.toLowerCase().includes(search.toLowerCase()) ||
    b.author.toLowerCase().includes(search.toLowerCase()) ||
    b.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#0f1a1c]">
      <Navbar />

      <div className="py-20 px-4 text-center border-b border-white/5 bg-gradient-to-b from-emerald-900/10 to-transparent">
        <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
          <div className="inline-flex items-center gap-2 bg-emerald-500/20 border border-emerald-500/40 rounded-full px-4 py-1.5 mb-4">
            <BookOpen className="w-4 h-4 text-emerald-400" />
            <span className="text-emerald-400 text-sm font-semibold">WILDLIFE BLOG</span>
          </div>
          <h1 className="text-5xl font-bold text-white mb-4">Education & Awareness</h1>
          <p className="text-gray-400 max-w-lg mx-auto">
            Stories, guides, and wildlife knowledge from the Butwal Snake Rescuers team.
          </p>
        </motion.div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="relative max-w-md mb-10">
          <Search className="absolute left-4 top-3.5 w-5 h-5 text-gray-500" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search articles..."
            className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 transition-colors"
          />
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="glass-card rounded-2xl overflow-hidden animate-pulse border border-white/10">
                <div className="h-44 bg-white/10" />
                <div className="p-5 space-y-3">
                  <div className="h-5 bg-white/10 rounded w-3/4" />
                  <div className="h-4 bg-white/10 rounded w-full" />
                  <div className="h-4 bg-white/10 rounded w-2/3" />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            <p className="text-5xl mb-4">📖</p>
            <p className="text-xl text-white/40 font-semibold">No articles found</p>
          </div>
        ) : (
          <>
            {filtered.length > 0 && !search && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                onClick={() => router.push(`/blog/${filtered[0].slug}`)}
                className="glass-card rounded-2xl overflow-hidden border border-emerald-500/20 mb-8 cursor-pointer hover:border-emerald-500/50 transition-all group"
              >
                <div className="flex flex-col md:flex-row">
                  <div className="md:w-2/5 h-56 md:h-auto bg-gradient-to-br from-emerald-900/60 to-slate-900/60 flex items-center justify-center border-b md:border-b-0 md:border-r border-white/10 relative overflow-hidden">
                    {filtered[0].imageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={filtered[0].imageUrl} alt={filtered[0].title} className="w-full h-full object-cover transition-all" />
                    ) : (
                      <span className="text-9xl opacity-30">🐍</span>
                    )}
                  </div>
                  <div className="p-8 flex flex-col justify-center">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-xs bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 px-3 py-1 rounded-full font-semibold">Featured</span>
                      <span className="text-xs bg-blue-500/20 border border-blue-500/40 text-blue-400 px-3 py-1 rounded-full font-semibold">{filtered[0].category}</span>
                    </div>
                    <h2 className="text-2xl font-bold text-emerald-200 mb-3 group-hover:text-emerald-400 transition-colors leading-tight">{filtered[0].title}</h2>
                    <p className="text-gray-300 text-sm mb-4 line-clamp-2">{filtered[0].content.slice(0, 150)}...</p>
                    <div className="flex items-center gap-4 text-gray-500 text-xs">
                      <span className="flex items-center gap-1"><User className="w-3 h-3" />{filtered[0].author}</span>
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{formatDate(filtered[0].createdAt)}</span>
                      <span className="flex items-center gap-1"><BookOpen className="w-3 h-3" />{readTime(filtered[0].content)} min</span>
                    </div>
                    <div className="mt-4 flex items-center gap-2 text-emerald-400 font-semibold text-sm">
                      Read Article <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {filtered.slice(search ? 0 : 1).map((blog, i) => (
                <motion.div
                  key={blog.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.07 }}
                  onClick={() => router.push(`/blog/${blog.slug}`)}
                  className="glass-card rounded-2xl overflow-hidden border border-emerald-500/20 hover:border-emerald-500/40 bg-emerald-500/5 cursor-pointer group transition-all hover:scale-[1.02]"
                >
                  <div className="h-44 bg-gradient-to-br from-emerald-900/30 to-slate-900/50 flex items-center justify-center border-b border-white/5 relative overflow-hidden">
                    {blog.imageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={blog.imageUrl} alt={blog.title} className="w-full h-full object-cover opacity-90 transition-all" />
                    ) : (
                      <span className="text-7xl opacity-20 group-hover:opacity-40 transition-opacity">🐍</span>
                    )}
                  </div>
                  <div className="p-5">
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      <span className="text-xs bg-blue-500/20 border border-blue-500/40 text-blue-400 px-2.5 py-0.5 rounded-full font-semibold">{blog.category}</span>
                      {(blog.tags || '').split(',').slice(0, 1).filter(Boolean).map((tag, j) => (
                        <span key={tag} className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${TAG_COLORS[j % TAG_COLORS.length]}`}>{tag.trim()}</span>
                      ))}
                    </div>
                    <h3 className="text-emerald-200 font-bold text-base mb-2 group-hover:text-emerald-400 transition-colors leading-snug line-clamp-2">{blog.title}</h3>
                    <p className="text-gray-300 text-xs mb-4 line-clamp-2">{blog.content.slice(0, 100)}...</p>
                    <div className="flex items-center justify-between text-gray-400 text-xs border-t border-white/5 pt-3">
                      <span className="flex items-center gap-1"><User className="w-3 h-3" />{blog.author}</span>
                      <span className="flex items-center gap-1"><BookOpen className="w-3 h-3" />{readTime(blog.content)} min read</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </>
        )}
      </div>
      <Footer />
      <FloatingWidgets />
    </div>
  );
}
