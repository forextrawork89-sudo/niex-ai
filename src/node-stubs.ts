// Browser stub for node built-ins during Vite client build
export const existsSync = () => false;
export const mkdirSync = () => {};
export const readFileSync = () => '';
export const statSync = () => ({ isDirectory: () => false, isFile: () => false, size: 0 });
export const writeFileSync = () => {};
export const readdir = async () => [];
export const stat = async () => ({ isDirectory: () => false, isFile: () => false, size: 0 });
export const readFile = async () => '';
export const readdirSync = () => [];
export const dirname = (p: string) => (p ? p.split('/').slice(0, -1).join('/') : '');
export const extname = (p: string) => (p ? '.' + p.split('.').pop() : '');
export const resolve = (...p: string[]) => p.filter(Boolean).join('/');
export const join = (...p: string[]) => p.filter(Boolean).join('/');
export const relative = (_from: string, to: string) => to;
export const fileURLToPath = (u: any) => (typeof u === 'string' ? u : u?.pathname || '');

export default {
  existsSync,
  mkdirSync,
  readFileSync,
  statSync,
  writeFileSync,
  readdir,
  stat,
  readFile,
  readdirSync,
  dirname,
  extname,
  resolve,
  join,
  relative,
  fileURLToPath,
};
