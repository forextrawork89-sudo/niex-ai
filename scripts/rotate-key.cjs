// ============================================================
// KALIT ROTATSIYASI — yangi 32-baytli kalit yaratadi va
// ikkala faylga (encrypt-kb.cjs + kb-crypto.ts) AYNAN bir xil
// yangi kalitni yozadi (obfuskatsiya bilan).
//
// Ishlatish:
//   node scripts/rotate-key.cjs
// Keyin:
//   npm run encrypt-kb   (yangi kalit bilan qayta shifrlash)
//   npm run build
// ============================================================

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// 1. Yangi kalit + mask
const newKey = crypto.randomBytes(32);
const mask = crypto.randomBytes(8);

// 2. 4 qismga bo'lib XOR mask bilan o'rash
const parts = [];
for (let i = 0; i < 4; i++) {
  const chunk = newKey.subarray(i * 8, (i + 1) * 8);
  const obf = Buffer.alloc(8);
  for (let j = 0; j < 8; j++) obf[j] = chunk[j] ^ mask[j];
  parts.push([...obf]);
}

const keyArrayStr = '[' + [...newKey].join(',') + ']';
const p0Str = '[' + parts[0].join(',') + ']';
const p1Str = '[' + parts[1].join(',') + ']';
const p2Str = '[' + parts[2].join(',') + ']';
const p3Str = '[' + parts[3].join(',') + ']';
const mkStr = '[' + [...mask].join(',') + ']';

// 3. encrypt-kb.cjs yangilash
const encPath = path.resolve(__dirname, 'encrypt-kb.cjs');
let encSrc = fs.readFileSync(encPath, 'utf-8');
encSrc = encSrc.replace(/const KEY_BYTES = new Uint8Array\(\[[^\]]+\]\);/, `const KEY_BYTES = new Uint8Array(${keyArrayStr});`);
fs.writeFileSync(encPath, encSrc);

// 4. kb-crypto.ts yangilash
const tsPath = path.resolve(__dirname, '../src/content-insight-ai/lib/kb-crypto.ts');
let tsSrc = fs.readFileSync(tsPath, 'utf-8');
tsSrc = tsSrc.replace(/const _p0 = new Uint8Array\(\[[^\]]+\]\);/, `const _p0 = new Uint8Array(${p0Str});`);
tsSrc = tsSrc.replace(/const _p1 = new Uint8Array\(\[[^\]]+\]\);/, `const _p1 = new Uint8Array(${p1Str});`);
tsSrc = tsSrc.replace(/const _p2 = new Uint8Array\(\[[^\]]+\]\);/, `const _p2 = new Uint8Array(${p2Str});`);
tsSrc = tsSrc.replace(/const _p3 = new Uint8Array\(\[[^\]]+\]\);/, `const _p3 = new Uint8Array(${p3Str});`);
tsSrc = tsSrc.replace(/const _mk = new Uint8Array\(\[[^\]]+\]\);/, `const _mk = new Uint8Array(${mkStr});`);
fs.writeFileSync(tsPath, tsSrc);

// 5. Test fayl ham yangilash (yangi kalit bilan test ishlashi uchun)
const testPath = path.resolve(__dirname, '../src/content-insight-ai/lib/kb-crypto.test.ts');
if (fs.existsSync(testPath)) {
  let testSrc = fs.readFileSync(testPath, 'utf-8');
  testSrc = testSrc.replace(/const KEY_BYTES = new Uint8Array\(\[[^\]]+\]\);/, `const KEY_BYTES = new Uint8Array(${keyArrayStr});`);
  fs.writeFileSync(testPath, testSrc);
}

console.log('✅ Yangi kalit yaratildi va 3 faylga yozildi:');
console.log('   - scripts/encrypt-kb.cjs');
console.log('   - src/content-insight-ai/lib/kb-crypto.ts');
console.log('   - src/content-insight-ai/lib/kb-crypto.test.ts');
console.log('');
console.log('⚠️ Endi ishlatish:');
console.log('   npm run encrypt-kb   # yangi kalit bilan qayta shifrlash');
console.log('   npm test             # testlar hali o\'tishini tasdiqlash');
console.log('   npm run build        # production build');
