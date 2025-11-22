#!/usr/bin/env node

const { promises: fs } = require('fs');
const path = require('path');

const SOURCE_DIR = path.resolve('writeups');
const PUBLIC_DIR = path.resolve('public', 'writeups');
const DATA_FILE = path.resolve('src', 'data', 'writeupsData.json');

const METADATA_KEYS = [
  { key: 'difficulty', pattern: /^difficulty\s*:/i },
  { key: 'category', pattern: /^category\s*:/i },
  { key: 'os', pattern: /^os\s*:/i },
  { key: 'tags', pattern: /^tags?\s*:/i },
  { key: 'publishedAt', pattern: /^date\s*:/i },
  { key: 'platform', pattern: /^platform\s*:/i }
];

const DEFAULT_META = {
  difficulty: 'unknown',
  category: 'General',
  os: 'N/A',
  tags: [],
  publishedAt: null,
  platform: 'Uncategorized'
};

const MAX_PARAGRAPH_SCAN = 12;

/**
 * @time O(n)
 * @space O(1)
 * Copies the writeups directory and builds metadata for each markdown file.
 */
async function main() {
  try {
    await fs.access(SOURCE_DIR);
  } catch (error) {
    if (error.code === 'ENOENT') {
      console.warn('[writeups] source directory not found, skipping sync.');
      return;
    }
    throw error;
  }

  await fs.rm(PUBLIC_DIR, { recursive: true, force: true });
  await copyDirectory(SOURCE_DIR, PUBLIC_DIR);

  const files = await collectMarkdownFiles(SOURCE_DIR);
  const records = [];

  for (const filePath of files) {
    const content = await fs.readFile(filePath, 'utf-8');
    const stats = await fs.stat(filePath);
    const relativePath = normalizeRelativePath(path.relative(SOURCE_DIR, filePath));
    const slug = createSlug(relativePath);
    const metadata = parseMetadata(content, stats, relativePath);

    records.push({
      id: slug,
      slug,
      title: metadata.title,
      category: metadata.category,
      difficulty: metadata.difficulty,
      os: metadata.os,
  tags: metadata.tags,
      readTime: metadata.readTime,
      publishedAt: metadata.publishedAt,
      displayDate: metadata.displayDate,
      excerpt: metadata.excerpt,
      coverImage: metadata.coverImage,
  platform: metadata.platform,
      sourcePath: `/${path.posix.join('writeups', relativePath)}`,
      wordCount: metadata.wordCount
    });
  }

  records.sort((a, b) => {
    const aTime = a.publishedAt ? new Date(a.publishedAt).getTime() : 0;
    const bTime = b.publishedAt ? new Date(b.publishedAt).getTime() : 0;
    return bTime - aTime;
  });

  await fs.mkdir(path.dirname(DATA_FILE), { recursive: true });
  await fs.writeFile(
    DATA_FILE,
    JSON.stringify({ generatedAt: new Date().toISOString(), items: records }, null, 2),
    'utf-8'
  );
}

/**
 * Recursively copies a directory while preserving structure.
 * Maximum depth equals the nested folder depth inside /writeups (typically < 6), preventing stack overflows.
 * @param {string} src
 * @param {string} dest
 */
async function copyDirectory(src, dest) {
  await fs.mkdir(dest, { recursive: true });
  const entries = await fs.readdir(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      await copyDirectory(srcPath, destPath);
    } else {
      if (entry.name.toLowerCase() === 'template.md') {
        continue;
      }
      await fs.copyFile(srcPath, destPath);
    }
  }
}

/**
 * Gathers markdown files from a directory tree.
 * Depth is bounded by the writeups folder structure (<< 1k directories), so recursion is safe.
 * @param {string} dir
 * @returns {Promise<string[]>}
 */
async function collectMarkdownFiles(dir) {
  const results = [];
  const entries = await fs.readdir(dir, { withFileTypes: true });

  for (const entry of entries) {
    const entryPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      results.push(...(await collectMarkdownFiles(entryPath)));
    } else if (entry.isFile() && entry.name.toLowerCase().endsWith('.md')) {
      if (entry.name.toLowerCase() === 'template.md') {
        continue;
      }
      results.push(entryPath);
    }
  }

  return results;
}

function normalizeRelativePath(relativePath) {
  return relativePath.split(path.sep).join('/');
}

function createSlug(relativePath) {
  const segments = relativePath.replace(/\.md$/i, '').split('/');
  
  if (segments.length >= 2) {
    const platform = segments[0]
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
    
    const machineName = segments[1]
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
    
    return `${platform}-${machineName}`;
  }
  
  return segments
    .map((segment) =>
      segment
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
    )
    .filter(Boolean)
    .join('-');
}

function parseMetadata(content, stats, relativePath) {
  const lines = content.split(/\r?\n/);
  const metadata = { ...DEFAULT_META };
  metadata.title = extractTitle(lines, relativePath);
  metadata.coverImage = extractHeroImage(lines, relativePath);

  for (const line of lines.slice(0, 20)) {
    for (const { key, pattern } of METADATA_KEYS) {
      if (pattern.test(line)) {
        const value = line.split(':').slice(1).join(':').trim();
        if (!value) continue;

        if (key === 'tags') {
          metadata.tags = value.split(',').map((tag) => tag.trim()).filter(Boolean);
        } else if (key === 'publishedAt') {
          metadata.publishedAt = value;
        } else {
          metadata[key] = value;
        }
      }
    }
  }

  if (!metadata.platform || metadata.platform === 'Uncategorized') {
    metadata.platform = derivePlatformFromPath(relativePath);
  } else {
    metadata.platform = formatPlatformName(metadata.platform);
  }

  if (!metadata.publishedAt) {
    metadata.publishedAt = stats.mtime.toISOString();
  }

  metadata.displayDate = new Date(metadata.publishedAt).toLocaleDateString('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric'
  });

  const excerpt = extractExcerpt(lines);
  metadata.excerpt = excerpt;
  const wordCount = content.split(/\s+/).filter(Boolean).length;
  metadata.wordCount = wordCount;
  const minutes = Math.max(1, Math.ceil(wordCount / 180));
  metadata.readTime = `${minutes} min read`;

  return metadata;
}

function derivePlatformFromPath(relativePath) {
  const segments = relativePath.split('/');
  if (!segments.length) return 'Uncategorized';
  return formatPlatformName(segments[0]);
}

function formatPlatformName(value) {
  if (!value) return 'Uncategorized';
  return value
    .replace(/[-_]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function extractTitle(lines, relativePath) {
  const heading = lines.find((line) => /^#\s+/.test(line.trim()));
  if (heading) {
    return heading.replace(/^#\s+/, '').trim();
  }
  const fallback = relativePath.split('/').pop() ?? 'Untitled';
  return fallback.replace(/\.md$/i, '');
}

function extractHeroImage(lines, relativePath) {
  const imageLine = lines.find((line) => /!\[[^\]]*\]\([^\)]+\)/.test(line));
  if (!imageLine) return null;
  const match = /!\[[^\]]*\]\(([^\)]+)\)/.exec(imageLine);
  if (!match) return null;
  const imagePath = match[1];
  if (imagePath.startsWith('http')) return imagePath;
  const dir = relativePath.substring(0, relativePath.lastIndexOf('/'));
  if (!dir) {
    return `/${path.posix.join('writeups', imagePath)}`;
  }
    return `/${path.posix.join('writeups', dir, imagePath)}`;
}

function extractExcerpt(lines) {
  const buffer = [];

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) {
      continue;
    }

    if (
      trimmed.startsWith('#') ||
      /^(difficulty|category|os|tags|date)\s*:/i.test(trimmed) ||
      trimmed.startsWith('![')
    ) {
      continue;
    }

    buffer.push(trimmed);
    if (buffer.length >= MAX_PARAGRAPH_SCAN) break;
  }

    return buffer.join(' ').slice(0, 320) || 'No summary available yet.';
}

  main().catch((error) => {
    console.error('Failed to build writeups metadata:', error);
    process.exit(1);
  });