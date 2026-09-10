export function cssVar(name: string, fallback: string): string {
  const value = getComputedStyle(document.documentElement)
    .getPropertyValue(name)
    .trim();
  return value || fallback;
}

export function chartPalette() {
  return {
    terracota: cssVar('--color-terracota', '#D4654A'),
    forest: cssVar('--color-forest', '#2D6A4F'),
    mustard: cssVar('--color-mustard', '#E8A838'),
    light: cssVar('--color-light', '#E0DDD8'),
  };
}