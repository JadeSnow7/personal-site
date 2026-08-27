import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

const dist = path.resolve('dist');
const headerFile = path.join(dist, '_headers');
if (!fs.existsSync(headerFile)) throw new Error('dist/_headers is missing');
const headers = fs.readFileSync(headerFile, 'utf8');
const csp = headers.match(/Content-Security-Policy:\s*(.+)/)?.[1] ?? '';
if (!csp || csp.includes("'unsafe-eval'")) throw new Error('CSP is missing or allows unsafe-eval');
if (Buffer.byteLength(headers.split('\n').find((line) => line.includes('Content-Security-Policy')) ?? '') > 2000)
  throw new Error('CSP header exceeds Cloudflare Pages line limit');

const allowed = new Set([...csp.matchAll(/'sha256-([^']+)'/g)].map((match) => match[1]));
let pages = 0;
function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const file = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(file);
    else if (entry.isFile() && file.endsWith('.html')) {
      pages += 1;
      const html = fs.readFileSync(file, 'utf8');
      for (const match of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)) {
        if (/\bsrc\s*=/i.test(match[1]) || !match[2].trim()) continue;
        const digest = crypto.createHash('sha256').update(match[2]).digest('base64');
        if (!allowed.has(digest)) throw new Error(`inline script hash missing for ${file}`);
      }
    }
  }
}
walk(dist);
if (pages === 0) throw new Error('no HTML pages found');
console.log(`CSP verified for ${pages} HTML pages`);
