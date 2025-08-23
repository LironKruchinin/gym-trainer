export function sanitizeInput(value: string): string {
  return value
    .replace(/<script.*?>.*?<\/script>/gis, '')
    .replace(/<[^>]*>?/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}
