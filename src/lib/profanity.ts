import { Filter } from 'bad-words';

const filter = new Filter();

/** Returns true if the text contains profane language. */
export function isProfane(text: string): boolean {
  if (!text || text.trim().length === 0) return false;
  return filter.isProfane(text);
}

/** Returns the text with profane words replaced by asterisks. */
export function cleanText(text: string): string {
  if (!text || text.trim().length === 0) return '';
  return filter.clean(text);
}
