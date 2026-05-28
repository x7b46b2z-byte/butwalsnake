import { notFound } from 'next/navigation';
import { BookOpen, Clock, User } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import FloatingWidgets from '@/components/FloatingWidgets';
import { db } from '@/lib/db';

interface Blog {
  id: string;
  title: string;
  slug: string;
  content: string;
  category: string;
  author: string;
  tags: string;
  status: string;
  imageUrl?: string | null;
  createdAt: string | null;
}

function normalizeBlogRow(row: any): Blog {
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    content: row.content,
    category: row.category,
    author: row.author,
    tags: row.tags,
    status: row.status,
    imageUrl: row.image_url ?? row.imageUrl ?? null,
    createdAt: row.created_at ?? row.createdAt ?? null,
  };
}

function formatDate(dateStr: string | null) {
  if (!dateStr) return 'Unknown date';
  return new Date(dateStr).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

function readTime(content: string) {
  const words = content.split(' ').length;
  return Math.ceil(words / 200);
}

async function getBlogBySlug(slug: string) {
  const { data, error } = await db.from('BlogPost').select('*').eq('slug', slug).limit(1);
  if (error) {
    console.error('Blog detail lookup failed for slug:', slug, error);
    return null;
  }
  if (!data || data.length === 0) return null;
  return normalizeBlogRow(data[0]);
}

export default async function BlogDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const blog = await getBlogBySlug(slug);

  if (!blog || blog.status?.toString().toUpperCase() !== 'PUBLISHED') {
    notFound();
  }

  return (
    <div className="min-h-screen bg-[#0f1a1c]">
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 py-16">
        <article className="space-y-8">
          <div className="flex flex-col gap-3 mb-8 text-center">
            <span className="inline-flex items-center gap-2 bg-emerald-500/20 border border-emerald-500/40 rounded-full px-4 py-2 text-sm text-emerald-300 font-semibold">
              <BookOpen className="w-4 h-4" /> Wildlife Blog
            </span>
            <h1 className="text-5xl font-bold text-white leading-tight">{blog.title}</h1>
            <div className="flex flex-col sm:flex-row sm:justify-center sm:items-center gap-3 text-gray-400 text-sm">
              <span className="flex items-center gap-2"><User className="w-4 h-4" />{blog.author}</span>
              <span className="flex items-center gap-2"><Clock className="w-4 h-4" />{formatDate(blog.createdAt)}</span>
              <span className="text-emerald-300 uppercase tracking-[0.2em] text-xs font-semibold">{blog.category}</span>
            </div>
          </div>

          <div className="rounded-3xl overflow-hidden border border-white/10 bg-gradient-to-br from-emerald-900/30 to-slate-950/70 shadow-xl">
            {blog.imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={blog.imageUrl} alt={blog.title} className="w-full h-96 object-cover" />
            ) : (
              <div className="h-96 flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-950 text-8xl text-white/10">🐍</div>
            )}
          </div>

          <div className="prose prose-invert max-w-none text-gray-300 leading-relaxed space-y-6">
            {blog.tags.split(',').filter(Boolean).length > 0 && (
              <div className="flex flex-wrap gap-2">
                {blog.tags.split(',').filter(Boolean).map((tag) => (
                  <span key={tag} className="text-xs font-semibold uppercase tracking-[0.16em] bg-white/5 border border-white/10 rounded-full px-3 py-1 text-emerald-300">
                    {tag.trim()}
                  </span>
                ))}
              </div>
            )}
            {blog.content.split('\n').map((paragraph, index) => (
              paragraph.trim() ? <p key={index}>{paragraph}</p> : <br key={`br-${index}`} />
            ))}
          </div>
        </article>
      </div>
      <Footer />
      <FloatingWidgets />
    </div>
  );
}
