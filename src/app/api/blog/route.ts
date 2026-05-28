import { NextRequest, NextResponse } from 'next/server';
import { randomUUID } from 'crypto';
import { db } from '@/lib/db';

function normalizeBlogRow(row: any) {
  if (!row) return row;
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

function normalizeSlug(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/(^-|-$)+/g, '');
}

function formatError(error: any) {
  if (!error) return 'Unknown error';
  if (typeof error === 'string') return error;
  if (error instanceof Error) return `${error.name}: ${error.message}\n${error.stack}`;
  try {
    return `TYPE=${Object.prototype.toString.call(error)} KEYS=${JSON.stringify(Object.keys(error))} NAMES=${JSON.stringify(Object.getOwnPropertyNames(error))} CONTENT=${JSON.stringify(error, Object.getOwnPropertyNames(error), 2)}`;
  } catch {
    return String(error);
  }
}

async function ensureUniqueSlug(baseSlug: string) {
  let slug = baseSlug;
  let suffix = 1;

  while (true) {
    const { data, error } = await db.from('BlogPost').select('id').eq('slug', slug);
    if (error) {
      console.error('Slug uniqueness check failed:', error);
      return slug;
    }
    if (!data || data.length === 0) {
      return slug;
    }
    slug = `${baseSlug}-${suffix++}`;
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = parseInt(searchParams.get('offset') || '0');
    const status = searchParams.get('status');
    const slug = searchParams.get('slug');

    const start = offset;
    const end = offset + limit - 1;

    const tryOrderAndRange = async (buildQuery: () => any) => {
      const attemptOrder = async (column: string) => {
        const q = buildQuery();
        return q.order(column, { ascending: false }).range(start, end);
      };

      // Try camelCase first, then snake_case, then id.
      let res = await attemptOrder('createdAt');
      if (res.error) {
        res = await attemptOrder('created_at');
      }
      if (res.error) {
        res = await attemptOrder('id');
      }
      return res;
    };

    if (slug) {
      const fetchBySlug = async (statusValue?: string) => {
        let q = db.from('BlogPost').select('*', { count: 'exact' }).eq('slug', slug).limit(1);
        if (statusValue) q = q.eq('status', statusValue);
        return q;
      };

      if (status) {
        const candidates = [status, status.toUpperCase(), status.toLowerCase()];
        let lastResult: any = null;
        for (const s of candidates) {
          const r = await fetchBySlug(s);
          lastResult = r;
          if (!r.error && r.data && r.data.length > 0) {
            return NextResponse.json({ success: true, data: normalizeBlogRow(r.data[0]), total: r.count ?? 0 });
          }
        }
        if (lastResult && lastResult.error) {
          const errorText = formatError(lastResult.error);
          console.error('GET /api/blog error:', errorText);
          return NextResponse.json({ success: false, error: 'Failed to fetch blog', details: errorText }, { status: 500 });
        }
        return NextResponse.json({ success: false, error: 'Blog not found' }, { status: 404 });
      }

      const result = await fetchBySlug();
      if (result.error) {
        console.error('GET /api/blog error:', result.error);
        return NextResponse.json({ success: false, error: 'Failed to fetch blog' }, { status: 500 });
      }
      if (!result.data || result.data.length === 0) {
        return NextResponse.json({ success: false, error: 'Blog not found' }, { status: 404 });
      }
      return NextResponse.json({ success: true, data: normalizeBlogRow(result.data[0]), total: result.count ?? 0 });
    }

    if (status) {
      const candidates = [status, status.toUpperCase(), status.toLowerCase()];
      let lastResult: any = null;
      for (const s of candidates) {
        const r = await tryOrderAndRange(() => db.from('BlogPost').select('*', { count: 'exact' }).eq('status', s));
        lastResult = r;
        if (!r.error) {
          const { data: blogs, count } = r;
          return NextResponse.json({ success: true, data: (blogs ?? []).map(normalizeBlogRow), total: count ?? 0 });
        }
      }
      if (lastResult) {
        if (lastResult.error) {
          const errorText = formatError(lastResult.error);
          console.error('GET /api/blog error:', errorText);
          return NextResponse.json({ success: false, error: 'Failed to fetch blogs', details: errorText }, { status: 500 });
        }
        const { data: blogs, count } = lastResult;
        return NextResponse.json({ success: true, data: (blogs ?? []).map(normalizeBlogRow), total: count ?? 0 });
      }
      return NextResponse.json({ success: true, data: [], total: 0 });
    }

    const finalRes = await tryOrderAndRange(() => db.from('BlogPost').select('*', { count: 'exact' }));
    if (finalRes.error) {
      const errorText = formatError(finalRes.error);
      console.error('GET /api/blog error:', errorText);
      return NextResponse.json({ success: false, error: 'Failed to fetch blogs', details: errorText }, { status: 500 });
    }
    const { data: blogs, count } = finalRes;
    return NextResponse.json({ success: true, data: (blogs ?? []).map(normalizeBlogRow), total: count ?? 0 });
  } catch (error) {
    const errorText = formatError(error);
    console.error('GET /api/blog error:', errorText);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch blogs',
      details: errorText,
    }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, slug, content, category, author, tags, status, imageUrl } = body;

    if (!title || !content) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
    }

    const normalizedSlug = normalizeSlug((slug || title || '').toString()) || `${Date.now()}`;
    const uniqueSlug = await ensureUniqueSlug(normalizedSlug);

    // Try multiple payload shapes to handle differing DB column naming (snake_case vs camelCase)
    const basePayload: Record<string, unknown> = {
      id: randomUUID(),
      title,
      slug: uniqueSlug,
      content,
      category: category || 'News',
      author: author || 'Admin',
      tags: tags || '',
      status: status || 'PUBLISHED',
    };

    const now = new Date().toISOString();
    const attempts: Record<string, unknown>[] = [];
    let imageWarning = '';

    if (imageUrl) {
      // Try standard column names first
      attempts.push({ ...basePayload, image_url: imageUrl });
      attempts.push({ ...basePayload, imageUrl });
    }

    attempts.push({ ...basePayload });

    let blog: any = null;
    let lastError: any = null;

    for (const payload of attempts) {
      try {
        const { data, error } = await db.from('BlogPost').insert(payload).select().single();
        if (!error && data) {
          blog = data;
          break;
        }
        lastError = error;

        // If error mentions missing column, try next payload and warn the admin.
        const msg = (error && (error.message || error.code)) || '';
        if (/column .* does not exist/i.test(msg) || /could not find the .* column/i.test(msg)) {
          imageWarning = 'Featured image could not be saved because the BlogPost table has no image column.';
          continue;
        }

        console.error('POST /api/blog error (fatal):', error);
        return NextResponse.json({ success: false, error: error?.message || 'Failed to create blog post' }, { status: 500 });
      } catch (e) {
        lastError = e;
        console.error('POST /api/blog exception during insert attempt:', e);
      }
    }

    if (!blog) {
      console.error('POST /api/blog error: all insert attempts failed', lastError);
      return NextResponse.json({ success: false, error: lastError?.message || 'Failed to create blog post' }, { status: 500 });
    }

    return NextResponse.json({ success: true, data: normalizeBlogRow(blog), warning: imageWarning || undefined }, { status: 201 });
  } catch (error) {
    console.error('POST /api/blog error:', error);
    return NextResponse.json({ success: false, error: 'Failed to create blog post' }, { status: 500 });
  }
}
