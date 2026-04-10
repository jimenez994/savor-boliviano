import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth';

export async function GET() {
  const menuItems = db.prepare('SELECT * FROM menu_items ORDER BY display_order, category').all();
  return NextResponse.json(menuItems);
}

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('admin_token')?.value;

    if (!token || !verifyToken(token)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { name, description, price, image_url, category } = await request.json();

    if (!name || !description || !price || !image_url || !category) {
      return NextResponse.json({ error: 'All fields required' }, { status: 400 });
    }

    const result = db.prepare(`
      INSERT INTO menu_items (name, description, price, image_url, category, display_order)
      VALUES (?, ?, ?, ?, ?, (SELECT COALESCE(MAX(display_order), -1) + 1 FROM menu_items))
    `).run(name, description, price, image_url, category);

    return NextResponse.json({ id: result.lastInsertRowid, success: true });
  } catch (error) {
    console.error('Error creating menu item:', error);
    return NextResponse.json({ error: 'Failed to create menu item' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('admin_token')?.value;

    if (!token || !verifyToken(token)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id, name, description, price, image_url, category } = await request.json();

    if (!id) {
      return NextResponse.json({ error: 'ID required' }, { status: 400 });
    }

    db.prepare(`
      UPDATE menu_items
      SET name = ?, description = ?, price = ?, image_url = ?, category = ?
      WHERE id = ?
    `).run(name, description, price, image_url, category, id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating menu item:', error);
    return NextResponse.json({ error: 'Failed to update menu item' }, { status: 500 });
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

    db.prepare('DELETE FROM menu_items WHERE id = ?').run(id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting menu item:', error);
    return NextResponse.json({ error: 'Failed to delete menu item' }, { status: 500 });
  }
}
