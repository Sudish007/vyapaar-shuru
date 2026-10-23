#!/usr/bin/env node
// Static dev server: serves dist/ at / and at /vyapaar-shuru/ so the sub-path deployment can be tested.
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = process.env.VYAPAAR_OUT ? path.resolve(process.env.VYAPAAR_OUT) : path.join(root, 'dist');
const port = Number(process.env.PORT || 8790);
const TYPES = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.json': 'application/json; charset=utf-8', '.svg': 'image/svg+xml', '.woff2': 'font/woff2', '.xml': 'application/xml', '.txt': 'text/plain; charset=utf-8', '.png': 'image/png' };

createServer(async (req, res) => {
  try {
    let p = decodeURIComponent(new URL(req.url, 'http://x').pathname);
    if (p.startsWith('/vyapaar-shuru/')) p = p.slice('/vyapaar-shuru'.length);
    if (p.endsWith('/')) p += 'index.html';
    let file = path.join(dist, p);
    if (!file.startsWith(dist)) { res.writeHead(403); return res.end(); }
    try {
      const s = await stat(file);
      if (s.isDirectory()) { res.writeHead(301, { Location: req.url + '/' }); return res.end(); }
    } catch {
      file = path.join(dist, '404.html');
      res.statusCode = 404;
    }
    const body = await readFile(file);
    res.setHeader('Content-Type', TYPES[path.extname(file)] || 'application/octet-stream');
    res.setHeader('Cache-Control', 'no-store');
    res.end(body);
  } catch (err) {
    res.writeHead(500); res.end(String(err));
  }
}).listen(port, '127.0.0.1', () => console.log(`serving ${dist} at http://127.0.0.1:${port}/ and http://127.0.0.1:${port}/vyapaar-shuru/`));
