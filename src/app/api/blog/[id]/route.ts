import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { title, slug, content, category, author, tags, status, imageUrl } = body;

    const updateBase: Record<string, unknown> = {};
    if (title !== undefined) updateBase.title = title;
    if (slug !== undefined) updateBase.slug = slug;
    if (content !== undefined) updateBase.content = content;
    if (category !== undefined) updateBase.category = category;
    if (author !== undefined) updateBase.author = author;
    if (tags !== undefined) updateBase.tags = tags;
    if (status !== undefined) updateBase.status = status;

    if (Object.keys(updateBase).length === 0 && imageUrl === undefined) {
      return NextResponse.json({ success: false, error: 'No update fields provided' }, { status: 400 });
    }

    const updateCandidates: Record<string, unknown>[] = [];
    let imageWarning = '';
    const isMissingColumn = (err: any) => /could not find the .* column|column .* does not exist/i.test(err?.message || '');

    if (imageUrl !== undefined) {
      updateCandidates.push({ ...updateBase, image_url: imageUrl });
      updateCandidates.push({ ...updateBase, imageUrl });
      updateCandidates.push({ ...updateBase });
    } else {
      updateCandidates.push(updateBase);
    }

    const tryUpdate = async (updatePayload: Record<string, unknown>) => {
      const { data, error } = await db.from('BlogPost').update(updatePayload).eq('id', id).select().single();
      return { data, error };
    };

    let result: { data: any; error: any } | null = null;
    for (const candidate of updateCandidates) {
      result = await tryUpdate(candidate);
      if (!result.error && result.data) {
        break;
      }
      if (result.error && isMissingColumn(result.error)) {
        imageWarning = 'Featured image could not be saved because the BlogPost table has no image column.';
        continue;
      }
      if (result.error) {
        break;
      }
    }

    if (!result || result.error || !result.data) {
      const error = result?.error;
      console.error('PATCH /api/blog/[id] error:', error);
      return NextResponse.json({ success: false, error: error?.message || 'Failed to update blog' }, { status: 500 });
    }

    const row = result.data;
    const normalized = {
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

    return NextResponse.json({ success: true, data: normalized, warning: imageWarning || undefined });
  } catch (error) {
    console.error('PATCH /api/blog/[id] error:', error);
    return NextResponse.json({ success: false, error: 'Failed to update blog' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { data, error } = await db.from('BlogPost').delete().eq('id', id).select().single();

    if (error) {
      console.error('DELETE /api/blog/[id] error:', error);
      return NextResponse.json({ success: false, error: error?.message || 'Failed to delete blog' }, { status: 500 });
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('DELETE /api/blog/[id] error:', error);
    return NextResponse.json({ success: false, error: 'Failed to delete blog' }, { status: 500 });
  }
}
