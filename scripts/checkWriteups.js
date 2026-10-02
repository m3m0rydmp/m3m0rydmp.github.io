const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const source = path.join(root, 'writeups');
const pending = [source];
const errors = [];
let documents = 0;
let images = 0;

while (pending.length) {
  const directory = pending.pop();
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const file = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      pending.push(file);
      continue;
    }
    if (!entry.name.endsWith('.md') || entry.name.toLowerCase() === 'template.md') continue;

    documents += 1;
    const relative = path.relative(root, file);
    const content = fs.readFileSync(file, 'utf8');
    let fence = null;
    const fail = (line, message) => errors.push(`${relative}:${line}: ${message}`);

    content.split(/\r?\n/).forEach((line, index) => {
      const number = index + 1;
      if (/n1flh3im/i.test(line)) fail(number, 'Replace the old author alias with m3m0rydmp.');
      const marker = /^\s*(`{3,}|~{3,})/.exec(line);
      if (marker) {
        if (!fence) fence = marker[1];
        else if (marker[1][0] === fence[0] && marker[1].length >= fence.length) fence = null;
        return;
      }
      if (fence) return;
      if (/!\[\[/.test(line)) fail(number, 'Convert the Obsidian image embed to a Markdown image.');
      if (/^\s*Note to AI:/i.test(line)) fail(number, 'Remove the editing instruction.');

      for (const match of line.matchAll(/!\[[^\]]*\]\(([^)]+)\)/g)) {
        const reference = match[1];
        if (/^(?:https?:|data:)/i.test(reference)) continue;
        images += 1;
        let decoded;
        try {
          decoded = decodeURIComponent(reference.split('#')[0]);
        } catch {
          fail(number, `Invalid image URL: ${reference}`);
          continue;
        }
        const asset = decoded.startsWith('/writeups/')
          ? path.join(root, decoded.slice(1))
          : decoded.startsWith('/')
            ? path.join(root, 'public', decoded.slice(1))
            : path.resolve(directory, decoded);
        if (!fs.existsSync(asset) || !fs.statSync(asset).isFile()) {
          fail(number, `Missing local image: ${reference}`);
        } else {
          let parent = root;
          for (const segment of path.relative(root, asset).split(path.sep)) {
            if (!fs.readdirSync(parent).includes(segment)) {
              fail(number, `Image path casing does not match: ${reference}`);
              break;
            }
            parent = path.join(parent, segment);
          }
        }
      }

      // Preserve attributed quotations, literal code, URLs, and image labels.
      if (/^\s*>/.test(line)) return;
      const prose = line
        .replace(/!\[[^\]]*\]\([^)]+\)/g, '')
        .replace(/`+[^`]*`+/g, '')
        .replace(/https?:\/\/\S+/g, '')
        .replace(/\bContact Us\b/g, '');
      if (/\b(?:we|our|ours|ourselves|us|you|your|yours|yourself|yourselves)\b|\blet['’]s\b/i.test(prose)) {
        fail(number, 'Use first-person singular narration (I, me, my).');
      }
    });
    if (fence) fail(content.split('\n').length, 'Unclosed code fence.');
  }
}

if (errors.length) {
  console.error(errors.join('\n'));
  process.exitCode = 1;
} else {
  console.log(`Checked ${documents} plaintext writeups and ${images} local image references. Encrypted content is excluded.`);
}
