import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth';

export async function GET() {
  try {
    const content = db.prepare('SELECT * FROM content').all();
    const menuItems = db.prepare('SELECT * FROM menu_items ORDER BY display_order, category').all();
    const gallery = db.prepare('SELECT * FROM gallery ORDER BY display_order, created_at DESC').all();
    const socialLinks = db.prepare('SELECT * FROM social_links ORDER BY display_order').all();
    const schedule = db.prepare('SELECT * FROM schedule ORDER BY display_order').all();

    return NextResponse.json({
      content: Object.fromEntries(content.map((c: any) => [c.key, c.value])),
      menu: menuItems,
      gallery,
      social: socialLinks,
      schedule,
    });
  } catch (error) {
    console.error('Error fetching content:', error);
    return NextResponse.json({ error: 'Failed to fetch content' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    // Verify authentication
    const cookieStore = await cookies();
    const token = cookieStore.get('admin_token')?.value;

    if (!token || !verifyToken(token)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { key, value } = await request.json();

    if (!key || value === undefined) {
      return NextResponse.json({ error: 'Key and value required' }, { status: 400 });
    }

    db.prepare(`
      INSERT INTO content (key, value, updated_at)
      VALUES (?, ?, CURRENT_TIMESTAMP)
      ON CONFLICT(key) DO UPDATE SET value = ?, updated_at = CURRENT_TIMESTAMP
    `).run(key, value, value);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating content:', error);
    return NextResponse.json({ error: 'Failed to update content' }, { status: 500 });
  }
}
