import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth';

export async function GET() {
  const gallery = db.prepare('SELECT * FROM gallery ORDER BY display_order, created_at DESC').all();
  return NextResponse.json(gallery);
}

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('admin_token')?.value;

    if (!token || !verifyToken(token)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { image_url, alt } = await request.json();

    if (!image_url) {
      return NextResponse.json({ error: 'Image URL required' }, { status: 400 });
    }

    const result = db.prepare(`
      INSERT INTO gallery (image_url, alt, display_order)
      VALUES (?, ?, (SELECT COALESCE(MAX(display_order), -1) + 1 FROM gallery))
    `).run(image_url, alt || '');

    return NextResponse.json({ id: result.lastInsertRowid, success: true });
  } catch (error) {
    console.error('Error adding gallery image:', error);
    return NextResponse.json({ error: 'Failed to add gallery image' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('admin_token')?.value;

    if (!token || !verifyToken(token)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID required' }, { status: 400 });
    }

    db.prepare('DELETE FROM gallery WHERE id = ?').run(id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting gallery image:', error);
    return NextResponse.json({ error: 'Failed to delete gallery image' }, { status: 500 });
  }
}
