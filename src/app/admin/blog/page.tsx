'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Search, RefreshCw, Loader2, X, Clock, User, Trash2, Pencil } from 'lucide-react';

interface Blog {
  id: string; title: string; slug: string; content: string;
  category: string; author: string; tags: string; status: string; imageUrl?: string; createdAt: string;
}

const TAG_COLORS = ['bg-emerald-500/20 text-emerald-400 border-emerald-500/30', 'bg-blue-500/20 text-blue-400 border-blue-500/30', 'bg-purple-500/20 text-purple-400 border-purple-500/30', 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'];

function readTime(content: string) { return Math.ceil(content.split(' ').length / 200); }

export default function AdminBlogPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<Blog | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [adding, setAdding] = useState(false);
  const [addError, setAddError] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);
  const [editingBlog, setEditingBlog] = useState<Blog | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingError, setEditingError] = useState('');

  const BLANK_BLOG = { title: '', slug: '', content: '', category: 'News', author: 'Admin', tags: '', status: 'PUBLISHED', imageUrl: '' };
  const [addForm, setAddForm] = useState(BLANK_BLOG);
  const [editForm, setEditForm] = useState(BLANK_BLOG);

  const fetchBlogs = useCallback(async () => { setLoading(true); try { const res = await fetch('/api/blog?limit=100'); const data = await res.json(); if (data.success) setBlogs(data.data); } finally { setLoading(false); } }, []);
  useEffect(() => { fetchBlogs(); }, [fetchBlogs]);

  const filtered = blogs.filter(b => !search || b.title.toLowerCase().includes(search.toLowerCase()) || b.author.toLowerCase().includes(search.toLowerCase()) || b.category.toLowerCase().includes(search.toLowerCase()));

  const handleAdd = async () => {
    setAddError('');
    const title = addForm.title.trim();
    const content = addForm.content.trim();
    const author = addForm.author.trim();
    const category = addForm.category.trim();
    const tags = addForm.tags.trim();
    const status = addForm.status.trim();
    const imageUrl = addForm.imageUrl?.trim() || '';

    if (!title || !content) {
      setAddError('Title and content are required.');
      return;
    }

    const submission = {
      title,
      slug: addForm.slug?.trim() || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''),
      content,
      category: category || 'News',
      author: author || 'Admin',
      tags: tags || '',
      status: status || 'PUBLISHED',
      imageUrl: imageUrl || undefined,
    };

    setAdding(true);
    try {
      const res = await fetch('/api/blog', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submission),
      });
      const data = await res.json();
      if (data.success) {
        if (data.warning) {
          setAddError(`${data.warning} Please add the column: ALTER TABLE "BlogPost" ADD COLUMN IF NOT EXISTS image_url TEXT;`);
          fetchBlogs();
        } else {
          setAddForm(BLANK_BLOG);
          setShowAdd(false);
          fetchBlogs();
        }
      } else {
        setAddError(data.error || res.statusText || 'Failed to add article.');
      }
    } finally { setAdding(false); }
  };

  const [publishingId, setPublishingId] = useState<string | null>(null);

  const openEdit = (blog: Blog) => {
    setEditingBlog(blog);
    setEditForm({
      title: blog.title,
      slug: blog.slug,
      content: blog.content,
      category: blog.category,
      author: blog.author,
      tags: blog.tags,
      status: blog.status,
      imageUrl: blog.imageUrl || '',
    });
    setEditing(true);
  };

  const handleEdit = async () => {
    if (!editingBlog) return;

    setEditingError('');
    const title = editForm.title.trim();
    const content = editForm.content.trim();
    const author = editForm.author.trim();
    const category = editForm.category.trim();
    const tags = editForm.tags.trim();
    const status = editForm.status.trim();
    const imageUrl = editForm.imageUrl?.trim() || '';
    const slug = editForm.slug?.trim() || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

    if (!title || !content) {
      setEditingError('Title and content are required.');
      return;
    }

    setEditingId(editingBlog.id);
    try {
      const res = await fetch(`/api/blog/${editingBlog.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, slug, content, category: category || 'News', author: author || 'Admin', tags: tags || '', status: status || 'PUBLISHED', imageUrl: imageUrl || undefined }),
      });
      const data = await res.json();
      if (data.success) {
        if (data.warning) {
          setEditingError(`${data.warning} Please add the column: ALTER TABLE "BlogPost" ADD COLUMN IF NOT EXISTS image_url TEXT;`);
        } else {
          setEditing(false);
          setEditingBlog(null);
          setEditingId(null);
        }
        fetchBlogs();
        try { new BroadcastChannel('blog-updates').postMessage({ type: 'updated', id: editingBlog.id }); } catch (e) { /* ignore */ }
      } else {
        setEditingError(data.error || res.statusText || 'Failed to save changes.');
      }
    } catch (e) {
      console.error('Edit request failed', e);
      setEditingError('Failed to save changes.');
    } finally {
      setEditingId(null);
    }
  };

  const togglePublish = async (id: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'PUBLISHED' ? 'DRAFT' : 'PUBLISHED';
    setPublishingId(id);
    try {
      const res = await fetch(`/api/blog/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextStatus }),
      });
      const data = await res.json();
      if (data.success) {
        // refresh full list to ensure ordering/filters match server state
        fetchBlogs();
        try { new BroadcastChannel('blog-updates').postMessage({ type: 'updated', id }); } catch (e) { /* ignore */ }
      } else {
        console.error('Failed to update status', data.error);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setPublishingId(null);
    }
  };

  const deleteBlog = async (id: string) => {
    const confirmed = window.confirm('Are you sure you want to delete this article? This action cannot be undone.');
    if (!confirmed) return;

    setDeletingId(id);
    try {
      const res = await fetch(`/api/blog/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        fetchBlogs();
        try { new BroadcastChannel('blog-updates').postMessage({ type: 'deleted', id }); } catch (e) { /* ignore */ }
      } else {
        console.error('Failed to delete article', data.error);
      }
    } catch (e) {
      console.error('Delete request failed', e);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div><h1 className="text-2xl font-bold text-white">Blog & Content</h1><p className="text-gray-400 text-sm mt-1">{blogs.length} published articles</p></div>
        <div className="flex gap-2">
          <button onClick={fetchBlogs} className="flex items-center gap-2 bg-white/10 border border-white/20 text-white px-4 py-2 rounded-xl text-sm transition-colors"><RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /> Refresh</button>
          <button onClick={() => setShowAdd(true)} className="flex items-center gap-2 bg-emerald-500 text-black font-bold px-4 py-2 rounded-xl text-sm transition-colors">Add Article</button>
        </div>
      </div>

      <div className="relative max-w-sm"><Search className="absolute left-4 top-3.5 w-4 h-4 text-gray-500" /><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search articles..." className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-emerald-500 text-sm transition-colors" /></div>

      {loading ? <div className="flex items-center justify-center py-16"><Loader2 className="w-6 h-6 animate-spin text-emerald-400" /></div> : filtered.length === 0 ? <div className="text-center py-16 text-gray-500">No articles found</div> : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filtered.map((blog, i) => (
            <motion.div key={blog.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="glass-card rounded-2xl overflow-hidden border border-emerald-500/30 transition-all flex flex-col">
              <div className="h-36 bg-gradient-to-br from-emerald-900/30 to-slate-900/50 flex items-center justify-center border-b border-white/5 relative overflow-hidden">
                {blog.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={blog.imageUrl} alt={blog.title} className="w-full h-full object-cover opacity-100 mix-blend-normal" />
                ) : (
                  <span className="text-7xl opacity-20">🐍</span>
                )}
              </div>
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
                <div className="mt-3 flex gap-2 flex-wrap">
                  <button onClick={() => setSelected(blog)} className="flex-1 py-2 bg-white/20 border border-white/30 text-white rounded-xl text-xs font-semibold transition-colors">Read Full Article</button>
                  <button onClick={() => openEdit(blog)} className="px-3 py-2 bg-slate-600 text-white font-bold rounded-xl text-xs transition-colors whitespace-nowrap flex items-center justify-center gap-2">
                    <Pencil className="w-3 h-3" /> Edit
                  </button>
                  <button disabled={publishingId === blog.id} onClick={() => togglePublish(blog.id, blog.status)} className="px-3 py-2 bg-emerald-500 text-black font-bold rounded-xl text-xs transition-colors whitespace-nowrap">
                    {publishingId === blog.id ? 'Saving...' : (blog.status === 'PUBLISHED' ? 'Unpublish' : 'Publish')}
                  </button>
                  <button disabled={deletingId === blog.id} onClick={() => deleteBlog(blog.id)} className="px-3 py-2 bg-red-500 text-black font-bold rounded-xl text-xs transition-colors whitespace-nowrap flex items-center justify-center gap-2">
                    {deletingId === blog.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Trash2 className="w-3 h-3" /> Delete</>}
                  </button>
                </div>
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

      {/* Add Blog Modal */}
      <AnimatePresence>
        {showAdd && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={e => e.target === e.currentTarget && setShowAdd(false)}>
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9 }} className="bg-[#0f1a1c] border border-white/10 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between p-6 border-b border-white/5">
                <h3 className="text-white font-bold text-lg">Add New Article</h3>
                <button onClick={() => setShowAdd(false)} className="text-gray-500 hover:text-white"><X className="w-5 h-5" /></button>
              </div>
              <div className="p-6 space-y-4">
                <div><label className="text-xs text-emerald-400 mb-1.5 block font-medium">Title *</label><input value={addForm.title} onChange={e => setAddForm(p => ({ ...p, title: e.target.value }))} className="w-full bg-emerald-500/10 border border-emerald-500/30 rounded-xl px-4 py-2.5 text-white" /></div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div><label className="text-xs text-emerald-400 mb-1.5 block font-medium">Author</label><input value={addForm.author} onChange={e => setAddForm(p => ({ ...p, author: e.target.value }))} className="w-full bg-emerald-500/10 border border-emerald-500/30 rounded-xl px-4 py-2.5 text-white" /></div>
                  <div><label className="text-xs text-emerald-400 mb-1.5 block font-medium">Category</label>
                    <select value={addForm.category} onChange={e => setAddForm(p => ({ ...p, category: e.target.value }))} className="w-full bg-emerald-500/10 border border-emerald-500/30 rounded-xl px-4 py-2.5 text-white appearance-none">
                      {['News', 'Rescue Story', 'Education', 'Announcement'].map(c => <option key={c} value={c} className="bg-[#0f1a1c]">{c}</option>)}
                    </select>
                  </div>
                  <div><label className="text-xs text-emerald-400 mb-1.5 block font-medium">Tags (comma separated)</label><input value={addForm.tags} onChange={e => setAddForm(p => ({ ...p, tags: e.target.value }))} placeholder="e.g. python, rescue, tips" className="w-full bg-emerald-500/10 border border-emerald-500/30 rounded-xl px-4 py-2.5 text-white" /></div>
                  <div><label className="text-xs text-emerald-400 mb-1.5 block font-medium">Status</label>
                    <select value={addForm.status} onChange={e => setAddForm(p => ({ ...p, status: e.target.value }))} className="w-full bg-emerald-500/10 border border-emerald-500/30 rounded-xl px-4 py-2.5 text-white appearance-none">
                      <option value="DRAFT" className="bg-[#0f1a1c]">Draft</option>
                      <option value="PUBLISHED" className="bg-[#0f1a1c]">Published</option>
                    </select>
                  </div>
                </div>
                
                <div><label className="text-xs text-emerald-400 mb-1.5 block font-medium">Featured Image URL (Optional)</label><input value={addForm.imageUrl || ''} onChange={e => setAddForm(p => ({ ...p, imageUrl: e.target.value }))} placeholder="https://example.com/image.jpg" className="w-full bg-emerald-500/10 border border-emerald-500/30 rounded-xl px-4 py-2.5 text-white" /></div>

                <div><label className="text-xs text-emerald-400 mb-1.5 block font-medium">Content * (Supports Markdown)</label><textarea value={addForm.content} onChange={e => setAddForm(p => ({ ...p, content: e.target.value }))} rows={8} className="w-full bg-emerald-500/10 border border-emerald-500/30 rounded-xl px-4 py-2.5 text-white resize-y font-mono text-sm" /></div>

                {addError && <p className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-2">{addError}</p>}
                <button onClick={handleAdd} disabled={adding} className="w-full bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-black font-bold py-3 rounded-xl flex items-center justify-center gap-2">
                  {adding ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Publish Article'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {editing && editingBlog && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={e => e.target === e.currentTarget && setEditing(false)}>
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9 }} className="bg-[#0f1a1c] border border-white/10 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between p-6 border-b border-white/5">
                <h3 className="text-white font-bold text-lg">Edit Article</h3>
                <button onClick={() => setEditing(false)} className="text-gray-500 hover:text-white"><X className="w-5 h-5" /></button>
              </div>
              <div className="p-6 space-y-4">
                <div><label className="text-xs text-emerald-400 mb-1.5 block font-medium">Title *</label><input value={editForm.title} onChange={e => setEditForm(p => ({ ...p, title: e.target.value }))} className="w-full bg-emerald-500/10 border border-emerald-500/30 rounded-xl px-4 py-2.5 text-white" /></div>
                <div><label className="text-xs text-emerald-400 mb-1.5 block font-medium">Slug</label><input value={editForm.slug} onChange={e => setEditForm(p => ({ ...p, slug: e.target.value }))} placeholder="article-slug" className="w-full bg-emerald-500/10 border border-emerald-500/30 rounded-xl px-4 py-2.5 text-white" /></div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div><label className="text-xs text-emerald-400 mb-1.5 block font-medium">Author</label><input value={editForm.author} onChange={e => setEditForm(p => ({ ...p, author: e.target.value }))} className="w-full bg-emerald-500/10 border border-emerald-500/30 rounded-xl px-4 py-2.5 text-white" /></div>
                  <div><label className="text-xs text-emerald-400 mb-1.5 block font-medium">Category</label>
                    <select value={editForm.category} onChange={e => setEditForm(p => ({ ...p, category: e.target.value }))} className="w-full bg-emerald-500/10 border border-emerald-500/30 rounded-xl px-4 py-2.5 text-white appearance-none">
                      {['News', 'Rescue Story', 'Education', 'Announcement'].map(c => <option key={c} value={c} className="bg-[#0f1a1c]">{c}</option>)}
                    </select>
                  </div>
                  <div><label className="text-xs text-emerald-400 mb-1.5 block font-medium">Tags (comma separated)</label><input value={editForm.tags} onChange={e => setEditForm(p => ({ ...p, tags: e.target.value }))} placeholder="e.g. python, rescue, tips" className="w-full bg-emerald-500/10 border border-emerald-500/30 rounded-xl px-4 py-2.5 text-white" /></div>
                  <div><label className="text-xs text-emerald-400 mb-1.5 block font-medium">Status</label>
                    <select value={editForm.status} onChange={e => setEditForm(p => ({ ...p, status: e.target.value }))} className="w-full bg-emerald-500/10 border border-emerald-500/30 rounded-xl px-4 py-2.5 text-white appearance-none">
                      <option value="DRAFT" className="bg-[#0f1a1c]">Draft</option>
                      <option value="PUBLISHED" className="bg-[#0f1a1c]">Published</option>
                    </select>
                  </div>
                </div>
                
                <div><label className="text-xs text-emerald-400 mb-1.5 block font-medium">Featured Image URL (Optional)</label><input value={editForm.imageUrl || ''} onChange={e => setEditForm(p => ({ ...p, imageUrl: e.target.value }))} placeholder="https://example.com/image.jpg" className="w-full bg-emerald-500/10 border border-emerald-500/30 rounded-xl px-4 py-2.5 text-white" /></div>

                <div><label className="text-xs text-emerald-400 mb-1.5 block font-medium">Content * (Supports Markdown)</label><textarea value={editForm.content} onChange={e => setEditForm(p => ({ ...p, content: e.target.value }))} rows={8} className="w-full bg-emerald-500/10 border border-emerald-500/30 rounded-xl px-4 py-2.5 text-white resize-y font-mono text-sm" /></div>

                {editingError && <p className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-2">{editingError}</p>}
                <button onClick={handleEdit} disabled={!!editingId} className="w-full bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-black font-bold py-3 rounded-xl flex items-center justify-center gap-2">
                  {editingId ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save Changes'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
