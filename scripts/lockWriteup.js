#!/usr/bin/env node
/**
 * Encrypts a writeup for the gated reader (PBKDF2-SHA256 + AES-256-GCM),
 * writing a content.enc compatible with window.crypto.subtle.decrypt.
 *
 * Usage: node scripts/lockWriteup.js <input.md> <output-dir> <passphrase>
 */

const { promises: fs } = require('fs');
const path = require('path');
const crypto = require('crypto');

const ITERATIONS = 210000;
const SALT_BYTES = 16;
const IV_BYTES = 12; // 96-bit IV, standard/recommended for AES-GCM
const KEY_BYTES = 32; // AES-256

async function main() {
  const [, , inputPath, outputDir, passphrase] = process.argv;

  if (!inputPath || !outputDir || !passphrase) {
    console.error('Usage: node scripts/lockWriteup.js <input.md> <output-dir> <passphrase>');
    process.exit(1);
  }

  const plaintext = await fs.readFile(inputPath, 'utf-8');

  const salt = crypto.randomBytes(SALT_BYTES);
  const iv = crypto.randomBytes(IV_BYTES);

  const key = crypto.pbkdf2Sync(passphrase, salt, ITERATIONS, KEY_BYTES, 'sha256');

  const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
  const encrypted = Buffer.concat([cipher.update(plaintext, 'utf-8'), cipher.final()]);
  const authTag = cipher.getAuthTag();

  // Web Crypto's AES-GCM expects the auth tag appended after the ciphertext.
  const dataWithTag = Buffer.concat([encrypted, authTag]);

  const payload = {
    v: 1,
    kdf: 'PBKDF2-SHA256',
    iter: ITERATIONS,
    salt: salt.toString('base64'),
    iv: iv.toString('base64'),
    data: dataWithTag.toString('base64')
  };

  await fs.mkdir(outputDir, { recursive: true });
  const outPath = path.join(outputDir, 'content.enc');
  await fs.writeFile(outPath, JSON.stringify(payload, null, 2), 'utf-8');

  console.log(`Encrypted writeup written to ${outPath}`);
}

main().catch((error) => {
  console.error('Failed to encrypt writeup:', error);
  process.exit(1);
});
