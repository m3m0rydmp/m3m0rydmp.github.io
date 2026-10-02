const DIFFICULTY_ORDER = new Map([
  ['very easy', 0], ['easy', 1], ['medium', 2], ['hard', 3], ['insane', 4]
]);
const titleOrder = new Intl.Collator('en', { numeric: true, sensitivity: 'base' });
const SEVERITY_ORDER = new Map([['p5', 0], ['informational', 0], ['info', 0], ['none', 0], ['p4', 1], ['low', 1], ['p3', 2], ['medium', 2], ['p2', 3], ['high', 3], ['p1', 4], ['critical', 4]]);

function sortValue(item, field) {
  if (field === 'name') return item.title || null;
  if (field === 'difficulty') {
    if (item.severity) return SEVERITY_ORDER.get(String(item.severity).toLowerCase().trim()) ?? null;
    const label = String(item.difficulty || '').toLowerCase().replace(/[-_]+/g, ' ').trim();
    return DIFFICULTY_ORDER.get(label) ?? null;
  }
  const date = field === 'date' ? item.publishedAt : (item.addedAt || item.publishedAt);
  const time = Date.parse(date);
  return Number.isFinite(time) ? time : null;
}

/**
 * Returns a new array. Missing values stay last in either direction.
 * Titles/slugs resolve ties; identical keys retain their input order.
 * @time O(n log n)
 * @space O(n)
 */
function sortWriteups(items, field = 'added', direction = 'desc') {
  if (items.length < 2) return [...items];
  const factor = direction === 'asc' ? 1 : -1;
  return [...items].sort((a, b) => {
    if (field === 'added' && direction === 'desc') {
      const placement = Number(a.defaultPosition === 'bottom') - Number(b.defaultPosition === 'bottom');
      if (placement) return placement;
    }
    const left = sortValue(a, field);
    const right = sortValue(b, field);
    if (left === null && right !== null) return 1;
    if (right === null && left !== null) return -1;
    const order = left === null ? 0 : field === 'name'
      ? titleOrder.compare(left, right)
      : left - right;
    return order * factor || titleOrder.compare(a.title || '', b.title || '') ||
      titleOrder.compare(a.slug || '', b.slug || '');
  });
}

module.exports = { sortWriteups };
