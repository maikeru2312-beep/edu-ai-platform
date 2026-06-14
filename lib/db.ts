import fs from 'fs';
import path from 'path';
import type { DBItem } from '@/types';

const DB_DIR = path.join(process.cwd(), 'content/db');

export function getAllDBItems(): DBItem[] {
  if (!fs.existsSync(DB_DIR)) return [];
  const files = fs.readdirSync(DB_DIR).filter((f) => f.endsWith('.json'));
  const items: DBItem[] = [];
  for (const file of files) {
    const raw = fs.readFileSync(path.join(DB_DIR, file), 'utf-8');
    items.push(...(JSON.parse(raw) as DBItem[]));
  }
  return items.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

export function getDBItemsByCategory(category: string): DBItem[] {
  return getAllDBItems().filter((i) => i.category === category);
}

export function getDBItemsByType(type: string): DBItem[] {
  return getAllDBItems().filter((i) => i.type === type);
}
