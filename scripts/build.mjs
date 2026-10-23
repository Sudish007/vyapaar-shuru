#!/usr/bin/env node
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildSite } from '../src/build/site.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const outDir = process.env.VYAPAAR_OUT ? path.resolve(process.env.VYAPAAR_OUT) : path.join(root, 'dist');
const basePath = process.env.VYAPAAR_BASE || '/vyapaar-shuru/';
const t0 = Date.now();
const result = await buildSite({ root, outDir, basePath });
console.log(`built ${result.pages} pages (${result.guides} guides, ${result.paths} paths, ${result.steps} steps, ${result.items} feed items) → ${outDir} in ${Date.now() - t0} ms`);
