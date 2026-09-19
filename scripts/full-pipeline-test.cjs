// ============================================================
// FULL PIPELINE TEST — to'liq shifrlash → deshifrlash → tasdiqlash
//
// Bu skript Node'da to'liq pipeline'ni simulyatsiya qiladi:
// 1. KB ni shifrlaydi (encrypt-kb.cjs ishlatib emas, alohida)
// 2. Aynan kb-crypto.ts dagi obfuskatsiya bilan deshifrlaydi
// 3. Har bir faylni asl bilan solishtiradi (bayt darajasida)
//
// Agar bironta xato bo'lsa, browser'da ham bo'ladi.
// ============================================================

const fs = require('fs');
const path = require('path');
const { webcrypto } = require('crypto');
const subtle = webcrypto.subtle;

const KB_DIR = path.resolve(__dirname, '../knowledge_base');
const ENC_FILE = path.resolve(__dirname, '../public/kb.enc');

// kb-crypto.ts dagi obfuskatsiyalangan kalit qismlari
const _p0 = [3,8,200,255,63,214,9,244];
const _p1 = [253,127,165,39,18,194,98,239];
const _p2 = [254,52,243,43,96,138,178,90];
const _p3 = [111,182,198,78,178,11,146,113];
const _mk = [167,60,158,81,216,18,111,180];

function assembleKey() {
  const out = new Uint8Array(32);
  const parts = [_p0, _p1, _p2, _p3];
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 8; j++) out[i * 8 + j] = parts[i][j] ^ _mk[j];
  }
  return out;
}

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
  console.log('=== STEP 1: kb.enc fayli mavjudligi ===');
  if (!fs.existsSync(ENC_FILE)) {
    console.error('❌ kb.enc YO\'Q! Avval: npm run encrypt-kb');
    process.exit(1);
  }
  const encBytes = fs.readFileSync(ENC_FILE);
  console.log(`✅ kb.enc: ${(encBytes.length / 1024 / 1024).toFixed(2)} MB`);

  console.log('\n=== STEP 2: Kalitni obfuskatsiyadan yig\'ish ===');
  const key = assembleKey();
  console.log(`✅ Kalit yig'ildi: ${key.length} bayt`);

  console.log('\n=== STEP 3: Magic bayt tekshiruvi ===');
  const magic = new TextDecoder().decode(encBytes.subarray(0, 4));
  if (magic !== 'CIAK') {
    console.error(`❌ Magic bayt mos kelmadi: "${magic}"`);
    process.exit(1);
  }
  console.log(`✅ Magic: ${magic}`);

  console.log('\n=== STEP 4: AES-GCM deshifrlash ===');
  const iv = encBytes.subarray(5, 17);
  const ct = encBytes.subarray(17);
  const cryptoKey = await subtle.importKey('raw', key.buffer, { name: 'AES-GCM' }, false, ['decrypt']);
  const t0 = Date.now();
  let ptBuf;
  try {
    ptBuf = await subtle.decrypt({ name: 'AES-GCM', iv }, cryptoKey, ct);
  } catch (e) {
    console.error('❌ Deshifrlash muvaffaqiyatsiz:', e.message);
    process.exit(1);
  }
  const decryptMs = Date.now() - t0;
  console.log(`✅ Deshifrlandi: ${(ptBuf.byteLength / 1024 / 1024).toFixed(2)} MB, ${decryptMs}ms`);

  console.log('\n=== STEP 5: JSON parse ===');
  const obj = JSON.parse(new TextDecoder().decode(ptBuf));
  const fileNames = Object.keys(obj.files);
  console.log(`✅ JSON OK. Fayl: ${fileNames.length}, versiya: ${obj.version}`);

  console.log('\n=== STEP 6: Asl fayllar bilan bayt-darajasida solishtirish ===');
  const originalFiles = walk(KB_DIR);
  let identical = 0, mismatch = 0, missing = 0;
  const issues = [];

  for (const rel of originalFiles) {
    const expected = fs.readFileSync(path.join(KB_DIR, rel), 'utf-8');
    const got = obj.files[rel];
    if (got === undefined) {
      missing++;
      issues.push(`MISSING: ${rel}`);
    } else if (got === expected) {
      identical++;
    } else {
      mismatch++;
      issues.push(`DIFF: ${rel} (asl ${expected.length} char, KB'da ${got.length} char)`);
    }
  }

  // KB'da bo'lib, originalda yo'q (ortiqcha) fayllar
  let extra = 0;
  for (const rel of fileNames) {
    if (!originalFiles.includes(rel)) {
      extra++;
      issues.push(`EXTRA: ${rel}`);
    }
  }

  console.log(`   ✅ Aynan mos: ${identical}/${originalFiles.length}`);
  if (mismatch > 0) console.log(`   ❌ Farqli: ${mismatch}`);
  if (missing > 0) console.log(`   ❌ Yo'q: ${missing}`);
  if (extra > 0) console.log(`   ⚠️ Ortiqcha: ${extra}`);

  if (issues.length > 0) {
    console.log('\n📋 Muammolar (ilk 10):');
    for (const i of issues.slice(0, 10)) console.log('   ' + i);
  }

  console.log('\n=== STEP 7: Tasodifiy fayl ko\'rinishi ===');
  const sample = fileNames.find((n) => n.includes('harmful_examples'));
  if (sample) {
    console.log(`   Fayl: ${sample}`);
    console.log(`   Boshi: ${JSON.stringify(obj.files[sample].slice(0, 80))}`);
  }

  console.log('\n=== STEP 8: Shifrlangan blob "DevTools" ko\'rinishi ===');
  const hex = [...encBytes.subarray(0, 40)].map((b) => b.toString(16).padStart(2, '0')).join(' ');
  console.log(`   ${hex}`);
  console.log('   (Foydalanuvchi DevTools\'da shuni ko\'radi — plaintext yo\'q)');

  console.log('\n=== XULOSA ===');
  if (mismatch === 0 && missing === 0) {
    console.log('✅✅✅ TO\'LIQ PIPELINE TASDIQLANDI');
    console.log(`   Asl fayllar: ${originalFiles.length}`);
    console.log(`   Aynan tiklandi: ${identical}`);
    console.log(`   Deshifrlash vaqti: ${decryptMs}ms`);
    console.log(`   AI ulardan o'qishi mumkin: HA`);
    process.exit(0);
  } else {
    console.log('❌ Pipeline muammosi — yuqoridagi xabarlarni o\'qing');
    process.exit(1);
  }
}

main().catch((e) => { console.error('❌ Xato:', e); process.exit(1); });
