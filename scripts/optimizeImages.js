const fs = require('fs/promises');
const path = require('path');
const sharp = require('sharp');

const TARGET_DIRS = [
    path.resolve('public', 'images'),
    path.resolve('public', 'icons'),
    path.resolve('writeups')
];

async function optimizeDirectory(dir) {
    try {
        const entries = await fs.readdir(dir, { withFileTypes: true });
        for (const entry of entries) {
            const fullPath = path.join(dir, entry.name);
            if (entry.isDirectory()) {
                await optimizeDirectory(fullPath);
            } else if (/\.(png|jpe?g)$/i.test(entry.name)) {
                const webpPath = fullPath.replace(/\.(png|jpe?g)$/i, '.webp');
                try {
                    // Check if webp already exists
                    await fs.access(webpPath);
                    console.log(`Skipping (already exists): ${path.basename(webpPath)}`);
                } catch {
                    console.log(`Converting: ${path.basename(fullPath)} -> ${path.basename(webpPath)}`);
                    await sharp(fullPath)
                        .webp({ quality: 80 })
                        .toFile(webpPath);
                }
            }
        }
    } catch (err) {
        if (err.code !== 'ENOENT') {
            console.error(`Error processing directory ${dir}:`, err);
        }
    }
}

async function updateMarkdownReferences(dir) {
    try {
        const entries = await fs.readdir(dir, { withFileTypes: true });
        for (const entry of entries) {
            const fullPath = path.join(dir, entry.name);
            if (entry.isDirectory()) {
                await updateMarkdownReferences(fullPath);
            } else if (entry.name.endsWith('.md')) {
                const content = await fs.readFile(fullPath, 'utf8');

                // Match markdown images: ![alt text](path/to/image.png)
                const regexMarkdown = /(!\[.*?\]\([^\)]+?)(\.png|\.jpe?g)(?=\))/gi;

                // Match HTML images: <img src="path/to/image.png"
                const regexHtml = /(<img[^>]+src=["'][^"']+?)(\.png|\.jpe?g)(?=["'])/gi;

                let newContent = content.replace(regexMarkdown, '$1.webp');
                newContent = newContent.replace(regexHtml, '$1.webp');

                if (newContent !== content) {
                    await fs.writeFile(fullPath, newContent, 'utf8');
                    console.log(`Updated references in: ${path.relative(path.resolve('writeups'), fullPath)}`);
                }
            }
        }
    } catch (err) {
        if (err.code !== 'ENOENT') {
            console.error(`Error processing directory ${dir}:`, err);
        }
    }
}

async function main() {
    console.log('--- Starting image optimization ---');
    for (const dir of TARGET_DIRS) {
        await optimizeDirectory(dir);
    }
    console.log('\n--- Updating markdown references ---');
    await updateMarkdownReferences(path.resolve('writeups'));
    console.log('\n--- Done --');
}

main().catch(console.error);
