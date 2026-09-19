// ============================================================
// KB ENCRYPTION — build vaqtida ishlaydi
//
// Barcha knowledge_base/*.md fayllarni bitta SHIFRLANGAN blobga
// (public/kb.enc) jamlaydi. Foydalanuvchi DevTools ochsa → tushunarsiz
// baytlar. Folderlar ko'rinmaydi (bitta opaque fayl).
//
// Runtime'da (brauzerda) kb-crypto.ts Web Crypto bilan ochadi.
//
// Ishlatish: node scripts/encrypt-kb.cjs   (yoki npm run encrypt-kb)
//
// ⚠️ OGOHLANTIRISH: bu OBFUSKATSIYA, haqiqiy xavfsizlik emas.
//    Kalit JS bundle ichida → professional ochib oladi.
//    Haqiqiy himoya = server-side (kelajak reja).
// ============================================================

const fs = require('fs');
const path = require('path');
const { webcrypto } = require('crypto');
const subtle = webcrypto.subtle;

const KB_DIR = path.resolve(__dirname, '../knowledge_base');
const OUT_FILE = path.resolve(__dirname, '../public/kb.enc');

// 32-baytli kalit — runtime (kb-crypto.ts) bilan AYNAN bir xil bo'lishi SHART
const KEY_BYTES = new Uint8Array([164,52,86,174,231,196,102,64,90,67,59,118,202,208,13,91,89,8,109,122,184,152,221,238,200,138,88,31,106,25,253,197]);

function walk(dir, base = '') {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    const rel = base ? `${base}/${entry.name}` : entry.name;
    if (entry.isDirectory()) out.push(...walk(full, rel));
    else if (entry.name.endsWith('.md')) out.push(rel);
  }
  return out;
}

async function main() {
  if (!fs.existsSync(KB_DIR)) {
    console.error(`❌ KB papka topilmadi: ${KB_DIR}`);
    process.exit(1);
  }

  // 1. Barcha .md fayllarni yig'amiz
  const relPaths = walk(KB_DIR);
  const files = {};
  let totalChars = 0;
  for (const rel of relPaths) {
    const content = fs.readFileSync(path.join(KB_DIR, rel), 'utf-8');
    files[rel] = content;
    totalChars += content.length;
  }

  // 2. Bitta JSON blobga jamlaymiz
  const plaintext = JSON.stringify({ version: 1, created: Date.now(), files });
  const ptBytes = new TextEncoder().encode(plaintext);

  // 3. AES-GCM bilan shifrlaymiz
  const key = await subtle.importKey('raw', KEY_BYTES, { name: 'AES-GCM' }, false, ['encrypt']);
  const iv = webcrypto.getRandomValues(new Uint8Array(12));
  const ctBuf = await subtle.encrypt({ name: 'AES-GCM', iv }, key, ptBytes);
  const ct = new Uint8Array(ctBuf);

  // 4. Format: [magic(4)][version(1)][iv(12)][ciphertext]
  const magic = new TextEncoder().encode('CIAK'); // Content Insight AI KB
  const out = new Uint8Array(4 + 1 + 12 + ct.length);
  out.set(magic, 0);
  out[4] = 1; // versiya
  out.set(iv, 5);
  out.set(ct, 17);

  // 5. public/ ga yozamiz (Vite static sifatida serve qiladi)
  fs.mkdirSync(path.dirname(OUT_FILE), { recursive: true });
  fs.writeFileSync(OUT_FILE, Buffer.from(out));

  console.log(`✅ Shifrlandi:`);
  console.log(`   Fayllar: ${relPaths.length}`);
  console.log(`   Asl hajm: ${(totalChars / 1024).toFixed(0)} KB`);
  console.log(`   Shifrlangan: ${(out.length / 1024).toFixed(0)} KB`);
  console.log(`   Chiqish: ${OUT_FILE}`);
  console.log(`   Folderlar yashirin (bitta opaque fayl) ✅`);
}

main().catch((e) => { console.error('❌ Xato:', e); process.exit(1); });
