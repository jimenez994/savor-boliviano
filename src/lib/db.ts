import Database from 'better-sqlite3';
import path from 'path';
import { mkdirSync, existsSync } from 'fs';

const dbPath = path.join(process.cwd(), 'data', 'site.db');

// Ensure data directory exists
const dataDir = path.dirname(dbPath);
if (!existsSync(dataDir)) {
  mkdirSync(dataDir, { recursive: true });
}

const db = new Database(dbPath);

// Initialize database schema
db.exec(`
  CREATE TABLE IF NOT EXISTS content (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS menu_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    price TEXT NOT NULL,
    image_url TEXT NOT NULL,
    category TEXT NOT NULL,
    display_order INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS gallery (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    image_url TEXT NOT NULL,
    alt TEXT,
    display_order INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS social_links (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    platform TEXT NOT NULL,
    url TEXT NOT NULL,
    display_order INTEGER DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS schedule (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    day TEXT NOT NULL,
    location TEXT NOT NULL,
    hours TEXT,
    display_order INTEGER DEFAULT 0
  );
`);

// One row per platform: remove duplicates from older seeds (INSERT OR IGNORE did not apply without UNIQUE)
db.exec(`
  DELETE FROM social_links
  WHERE id NOT IN (
    SELECT MIN(id)
    FROM social_links
    GROUP BY LOWER(TRIM(platform))
  );
`);

db.exec(`
  CREATE UNIQUE INDEX IF NOT EXISTS social_links_platform_ci_unique ON social_links(LOWER(TRIM(platform)));
`);

// One row per weekday: remove duplicates from older seeds (INSERT OR IGNORE did not apply without UNIQUE)
db.exec(`
  DELETE FROM schedule
  WHERE id NOT IN (
    SELECT MIN(id)
    FROM schedule
    GROUP BY LOWER(TRIM(day))
  );
`);

db.exec(`
  CREATE UNIQUE INDEX IF NOT EXISTS schedule_day_unique ON schedule(day);
`);

// Initialize default content if not exists
const defaultContent = [
  { key: 'hero_tagline', value: 'Authentic Bolivian Cuisine in the USA' },
  { key: 'hero_description', value: "We're bringing the vibrant flavors of Cochabamba, Bolivia to the United States. Family recipes passed down through generations, now serving you from our food truck." },
  { key: 'about_title', value: 'Our Story' },
  { key: 'about_subtitle', value: 'From Cochabamba to your neighborhood' },
  { key: 'footer_address', value: 'Food Truck Location Varies - Check Schedule' },
  { key: 'footer_phone', value: '(555) 123-4567' },
  { key: 'footer_email', value: 'hola@bolivianfoodtruck.com' },
];

for (const item of defaultContent) {
  db.prepare(`INSERT OR IGNORE INTO content (key, value) VALUES (?, ?)`).run(item.key, item.value);
}

// Initialize default social links
const defaultSocial = [
  { platform: 'Instagram', url: '#' },
  { platform: 'Facebook', url: '#' },
  { platform: 'Twitter', url: '#' },
];

const socialRowCount = (db.prepare('SELECT COUNT(*) as c FROM social_links').get() as { c: number }).c;
if (socialRowCount === 0) {
  const insertSocial = db.prepare(
    `INSERT INTO social_links (platform, url, display_order) VALUES (?, ?, ?)`
  );
  for (const item of defaultSocial) {
    insertSocial.run(item.platform, item.url, defaultSocial.indexOf(item));
  }
}

// Initialize default schedule
const defaultSchedule = [
  { day: 'Monday', location: 'Downtown Plaza - Main St & 5th Ave', hours: '11:00 AM - 3:00 PM' },
  { day: 'Tuesday', location: 'University District - Campus Green', hours: '11:00 AM - 3:00 PM' },
  { day: 'Wednesday', location: 'Downtown Plaza - Main St & 5th Ave', hours: '11:00 AM - 3:00 PM' },
  { day: 'Thursday', location: 'University District - Campus Green', hours: '5:00 PM - 9:00 PM' },
  { day: 'Friday', location: 'Food Truck Festival - City Center', hours: '10:00 AM - 8:00 PM' },
  { day: 'Saturday', location: 'Weekend Market - Riverfront Park', hours: '10:00 AM - 8:00 PM' },
  { day: 'Sunday', location: 'Closed', hours: '' },
];

const scheduleRowCount = (db.prepare('SELECT COUNT(*) as c FROM schedule').get() as { c: number }).c;
if (scheduleRowCount === 0) {
  const insertSchedule = db.prepare(
    `INSERT INTO schedule (day, location, hours, display_order) VALUES (?, ?, ?, ?)`
  );
  for (const item of defaultSchedule) {
    insertSchedule.run(item.day, item.location, item.hours, defaultSchedule.indexOf(item));
  }
}

export default db;
