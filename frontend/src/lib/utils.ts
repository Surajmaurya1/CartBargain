import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { GroceryItem, ItemIconType } from '../types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number | null | undefined): string {
  if (amount === null || amount === undefined) {
    return '—';
  }
  return `₹${Math.round(amount).toLocaleString('en-IN')}`;
}

export function getItemIconType(name: string): ItemIconType {
  const lower = name.toLowerCase();
  if (lower.includes('atta') || lower.includes('flour') || lower.includes('wheat')) return 'wheat';
  if (lower.includes('rice') || lower.includes('basmati')) return 'rice';
  if (lower.includes('milk') || lower.includes('dairy') || lower.includes('curd')) return 'milk';
  if (lower.includes('egg')) return 'egg';
  if (lower.includes('bread') || lower.includes('loaf') || lower.includes('bun')) return 'bread';
  if (lower.includes('butter') || lower.includes('cheese')) return 'butter';
  if (lower.includes('oil') || lower.includes('ghee')) return 'oil';
  if (lower.includes('tea') || lower.includes('coffee')) return 'coffee';
  return 'package';
}

export function parseGroceryInput(rawText: string): GroceryItem[] {
  if (!rawText.trim()) return [];

  const parts = rawText
    .split(/[,;\n]+/)
    .map((s) => s.trim())
    .filter(Boolean);

  return parts.map((part, index) => {
    const unitRegex = /(\d+(?:\.\d+)?)\s*(kg|g|l|liters?|ltr|ml|pc|pcs|piece|pieces|pack|dozen|nos?|units?)?/i;
    const match = part.match(unitRegex);

    let name = part;
    let quantity = 1;
    let unit = '1 pc';

    if (match) {
      const num = parseFloat(match[1]);
      const matchedUnit = match[2]?.toLowerCase() || '';

      if (matchedUnit) {
        if (['l', 'ltr', 'liter', 'liters'].includes(matchedUnit)) unit = '1L';
        else if (['kg', 'kgs', 'kilo'].includes(matchedUnit)) unit = `${num}kg`;
        else if (['g', 'gms', 'gram'].includes(matchedUnit)) unit = `${num}g`;
        else if (['ml'].includes(matchedUnit)) unit = `${num}ml`;
        else if (['dozen'].includes(matchedUnit)) {
          quantity = num * 12;
          unit = '12 pcs';
        } else {
          unit = `${num} ${matchedUnit}`;
        }
        quantity = num;
      } else {
        quantity = num;
        unit = `${num}`;
      }

      name = part.replace(match[0], '').trim();
      if (!name) name = part;
    }

    const formattedName = name
      .replace(/\b\w/g, (char) => char.toUpperCase())
      .trim();

    return {
      id: `item-${Date.now()}-${index}-${Math.random().toString(36).substr(2, 4)}`,
      rawInput: part,
      name: formattedName || part,
      quantity,
      unit: unit || '1 pc',
      iconType: getItemIconType(formattedName || part),
    };
  });
}
