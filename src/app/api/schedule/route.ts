import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth';

export async function GET() {
  const schedule = db.prepare('SELECT * FROM schedule ORDER BY display_order').all();
  return NextResponse.json(schedule);
}

export async function PUT(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('admin_token')?.value;

    if (!token || !verifyToken(token)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { schedule } = await request.json();

    if (!Array.isArray(schedule)) {
      return NextResponse.json({ error: 'Schedule array required' }, { status: 400 });
    }

    const seenDays = new Set<string>();
    for (const item of schedule) {
      const dayKey = String(item.day ?? '')
        .trim()
        .toLowerCase();
      if (!dayKey) {
        return NextResponse.json({ error: 'Each row needs a day name' }, { status: 400 });
      }
      if (seenDays.has(dayKey)) {
        return NextResponse.json(
          { error: 'Duplicate day in schedule — each weekday can only appear once' },
          { status: 400 }
        );
      }
      seenDays.add(dayKey);
    }

    // Clear existing and insert new
    db.prepare('DELETE FROM schedule').run();

    const insert = db.prepare(`
      INSERT INTO schedule (day, location, hours, display_order) VALUES (?, ?, ?, ?)
    `);

    const insertMany = db.transaction((items: any[]) => {
      for (const item of items) {
        const day = String(item.day ?? '').trim();
        insert.run(day, item.location, item.hours, item.display_order || 0);
      }
    });

    insertMany(schedule);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating schedule:', error);
    return NextResponse.json({ error: 'Failed to update schedule' }, { status: 500 });
  }
}
