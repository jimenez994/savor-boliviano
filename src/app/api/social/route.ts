import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth';

export async function GET() {
  const socialLinks = db.prepare('SELECT * FROM social_links ORDER BY display_order').all();
  return NextResponse.json(socialLinks);
}

export async function PUT(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('admin_token')?.value;

    if (!token || !verifyToken(token)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { links } = await request.json();

    if (!Array.isArray(links)) {
      return NextResponse.json({ error: 'Links array required' }, { status: 400 });
    }

    const seenPlatforms = new Set<string>();
    for (const link of links) {
      const platformKey = String(link.platform ?? '')
        .trim()
        .toLowerCase();
      if (!platformKey) {
        return NextResponse.json({ error: 'Each link needs a platform name' }, { status: 400 });
      }
      if (seenPlatforms.has(platformKey)) {
        return NextResponse.json(
          { error: 'Duplicate platform — each social network can only appear once' },
          { status: 400 }
        );
      }
      seenPlatforms.add(platformKey);
    }

    // Clear existing and insert new
    db.prepare('DELETE FROM social_links').run();

    const insert = db.prepare(`
      INSERT INTO social_links (platform, url, display_order) VALUES (?, ?, ?)
    `);

    const insertMany = db.transaction((links: any[]) => {
      for (const link of links) {
        const platform = String(link.platform ?? '').trim();
        const url = String(link.url ?? '').trim();
        insert.run(platform, url, link.display_order || 0);
      }
    });

    insertMany(links);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating social links:', error);
    return NextResponse.json({ error: 'Failed to update social links' }, { status: 500 });
  }
}
