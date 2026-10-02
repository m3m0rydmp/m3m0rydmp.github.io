const { sortWriteups } = require('./sortWriteups');

const items = [
  { title: 'Zulu', slug: 'z', difficulty: 'Easy', publishedAt: '2024-01-01', addedAt: '2026-10-01' },
  { title: 'Alpha', slug: 'a', difficulty: 'Hard', publishedAt: '2025-01-01', addedAt: '2025-01-01' },
  { title: 'Missing', slug: 'm', difficulty: 'Unknown', publishedAt: 'invalid' }
];
const titles = (list) => list.map(item => item.title);

test('bounty severity sorts from informational to critical, with unrated last', () => {
  const reports = ['P2', 'Low', 'P1', 'Informational', 'Medium', 'Unrated'].map(severity => ({ title: severity, severity }));
  expect(titles(sortWriteups(reports, 'difficulty', 'asc'))).toEqual(['Informational', 'Low', 'Medium', 'P2', 'P1', 'Unrated']);
  expect(titles(sortWriteups(reports, 'difficulty', 'desc'))).toEqual(['P1', 'P2', 'Medium', 'Low', 'Informational', 'Unrated']);
});

test('explicit bottom placement only overrides the default recently-added order', () => {
  const archived = { title: 'Titanic', slug: 'titanic', addedAt: '2026-10-01', publishedAt: '2025-03-26', difficulty: 'Easy', defaultPosition: 'bottom' };
  const input = [...items, archived];
  expect(sortWriteups(input).at(-1)).toBe(archived);
  for (const field of ['name', 'difficulty', 'date']) {
    for (const direction of ['asc', 'desc']) {
      expect(sortWriteups(input, field, direction)).toEqual(sortWriteups(input.map(item => ({ ...item, defaultPosition: undefined })), field, direction).map(item => input.find(original => original.slug === item.slug)));
    }
  }
  expect(sortWriteups(input, 'added', 'asc').at(-1).title).toBe('Missing');
});

test('new additions precede older imports independently of writeup date', () => {
  expect(titles(sortWriteups(items))).toEqual(['Zulu', 'Alpha', 'Missing']);
  expect(titles(sortWriteups(items, 'date', 'desc'))).toEqual(['Alpha', 'Zulu', 'Missing']);
});

test('name, difficulty and date support both directions with unknown values last', () => {
  expect(titles(sortWriteups(items, 'name', 'asc'))).toEqual(['Alpha', 'Missing', 'Zulu']);
  expect(titles(sortWriteups(items, 'name', 'desc'))).toEqual(['Zulu', 'Missing', 'Alpha']);
  for (const field of ['difficulty', 'date']) {
    expect(titles(sortWriteups(items, field, 'asc'))).toEqual(['Zulu', 'Alpha', 'Missing']);
    expect(titles(sortWriteups(items, field, 'desc'))).toEqual(['Alpha', 'Zulu', 'Missing']);
  }
});

test('empty, singleton, pair and equal-key lists preserve inputs', () => {
  expect(sortWriteups([])).toEqual([]);
  expect(sortWriteups([items[0]])).toEqual([items[0]]);
  expect(sortWriteups([items[1], items[0]])).toEqual([items[0], items[1]]);
  const first = { title: 'Same', slug: 'same' };
  const second = { ...first };
  expect(sortWriteups([first, second])[0]).toBe(first);
  const original = [...items];
  expect(sortWriteups(items)).not.toBe(items);
  expect(items).toEqual(original);
});

test('100 deterministic generated lists retain records and correctly order dates', () => {
  let seed = 12345;
  const random = () => { seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0; return seed; };
  for (let trial = 0; trial < 100; trial++) {
    const input = Array.from({ length: random() % 80 }, (_, i) => ({
      slug: String(i), title: `Entry ${i}`, publishedAt: new Date(random() * 1000).toISOString()
    }));
    const original = [...input];
    for (const direction of ['asc', 'desc']) {
      const output = sortWriteups(input, 'date', direction);
      expect(new Set(output)).toEqual(new Set(input));
      for (let i = 1; i < output.length; i++) {
        const delta = Date.parse(output[i].publishedAt) - Date.parse(output[i - 1].publishedAt);
        expect(direction === 'asc' ? delta >= 0 : delta <= 0).toBe(true);
      }
    }
    expect(input).toEqual(original);
  }
});
