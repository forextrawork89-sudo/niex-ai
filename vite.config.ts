import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import { readdirSync, readFileSync, statSync, existsSync } from 'fs';
import { join, resolve, relative } from 'path';

// Plugin: serve `knowledge_base/` folder via /kb/* routes
// Foydalanuvchining KB papkasi o'zgarmasdan AI ga ulanadi
const kbPlugin = (): Plugin => {
  const kbRoot = resolve(__dirname, 'knowledge_base');

  const listFiles = (dir: string, base = ''): string[] => {
    if (!existsSync(dir)) return [];
    const out: string[] = [];
    for (const entry of readdirSync(dir)) {
      const full = join(dir, entry);
      const rel = base ? `${base}/${entry}` : entry;
      try {
        const stat = statSync(full);
        if (stat.isDirectory()) {
          out.push(...listFiles(full, rel));
        } else if (entry.endsWith('.md')) {
          out.push(rel);
        }
      } catch {
        // skip
      }
    }
    return out;
  };

  return {
    name: 'kb-serve',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (!req.url) return next();

        // List all KB files
        if (req.url === '/kb/list' || req.url.startsWith('/kb/list?')) {
          try {
            const files = listFiles(kbRoot);
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ files, root: kbRoot }));
          } catch (e) {
            res.statusCode = 500;
            res.end(JSON.stringify({ error: String(e) }));
          }
          return;
        }

        // Serve individual file
        const match = req.url.match(/^\/kb\/file\?path=(.+)$/);
        if (match) {
          const safePath = decodeURIComponent(match[1]).replace(/\.\./g, '');
          const fullPath = resolve(kbRoot, safePath);
          // Security: ensure path is strictly inside kbRoot
          if (!fullPath.startsWith(kbRoot + '/') && fullPath !== kbRoot) {
            res.statusCode = 403;
            res.end('Forbidden');
            return;
          }
          try {
            const content = readFileSync(fullPath, 'utf-8');
            res.setHeader('Content-Type', 'text/markdown; charset=utf-8');
            res.end(content);
          } catch (e) {
            res.statusCode = 404;
            res.end(`Not found: ${safePath}`);
          }
          return;
        }

        next();
      });
    },
  };
};

const nodeBrowserStubsPlugin = (): Plugin => ({
  name: 'node-browser-stubs',
  enforce: 'pre',
  resolveId(id) {
    if (
      id === 'node:fs' || id === 'fs' ||
      id === 'node:fs/promises' || id === 'fs/promises' ||
      id === 'node:path' || id === 'path' ||
      id === 'node:url' || id === 'url'
    ) {
      return `\0virtual:${id}`;
    }
    return null;
  },
  load(id) {
    if (id.startsWith('\0virtual:')) {
      return `
        export const existsSync = () => false;
        export const mkdirSync = () => {};
        export const readFileSync = () => '';
        export const statSync = () => ({ isDirectory: () => false, isFile: () => false, size: 0 });
        export const writeFileSync = () => {};
        export const readdir = async () => [];
        export const stat = async () => ({ isDirectory: () => false, isFile: () => false, size: 0 });
        export const readFile = async () => '';
        export const readdirSync = () => [];
        export const dirname = (p) => (p ? p.split('/').slice(0, -1).join('/') : '');
        export const extname = (p) => (p ? '.' + p.split('.').pop() : '');
        export const resolve = (...p) => p.filter(Boolean).join('/');
        export const join = (...p) => p.filter(Boolean).join('/');
        export const relative = (from, to) => to;
        export const fileURLToPath = (u) => (typeof u === 'string' ? u : u?.pathname || '');
        export default {};
      `;
    }
    return null;
  },
});

export default defineConfig({
  plugins: [react(), kbPlugin()],
  resolve: {
    alias: process.env.VITEST
      ? []
      : [
          { find: /^node:fs\/promises$/, replacement: resolve(__dirname, 'src/node-stubs.ts') },
          { find: /^node:fs$/, replacement: resolve(__dirname, 'src/node-stubs.ts') },
          { find: /^fs\/promises$/, replacement: resolve(__dirname, 'src/node-stubs.ts') },
          { find: /^node:path$/, replacement: resolve(__dirname, 'src/node-stubs.ts') },
          { find: /^node:url$/, replacement: resolve(__dirname, 'src/node-stubs.ts') },
        ],
  },
  server: {
    port: 5173,
    open: true,
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
  worker: {
    format: 'es',
  },
  test: {
    environment: 'jsdom',
    globals: true,
  },
});
