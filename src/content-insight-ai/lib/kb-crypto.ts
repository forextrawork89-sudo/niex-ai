// ============================================================
// KB CRYPTO — runtime deshifrlash (brauzer, Web Crypto API)
//
// public/kb.enc (shifrlangan blob) ni ochadi → fayl xaritasini qaytaradi.
// Foydalanuvchi DevTools'da faqat tushunarsiz baytlarni ko'radi.
//
// Kalit scripts/encrypt-kb.cjs bilan AYNAN bir xil bo'lishi SHART.
//
// ⚠️ OBFUSKATSIYA — haqiqiy xavfsizlik emas (kalit bundle ichida).
// ============================================================

// Kalit OBFUSKATSIYA — xom bayt ko'rinishida saqlanmaydi.
// 32-baytli kalit 4 qismga bo'lingan va XOR mask bilan o'ralgan.
// Runtime'da yig'iladi. Bu — oddiy DevTools "grep" ni qiyinlashtiradi.
// ⚠️ Professional reverse engineer baribir ochadi. Haqiqiy himoya = server.
const _p0 = new Uint8Array([3,8,200,255,63,214,9,244]);
const _p1 = new Uint8Array([253,127,165,39,18,194,98,239]);
const _p2 = new Uint8Array([254,52,243,43,96,138,178,90]);
const _p3 = new Uint8Array([111,182,198,78,178,11,146,113]);
const _mk = new Uint8Array([167,60,158,81,216,18,111,180]);

function assembleKey(): Uint8Array {
  const out = new Uint8Array(32);
  const parts = [_p0, _p1, _p2, _p3];
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 8; j++) out[i * 8 + j] = parts[i][j] ^ _mk[j];
  }
  return out;
}

export interface DecryptedKB {
  version: number;
  created: number;
  files: Record<string, string>;   // "folder/file.md" → markdown content
}

let _keyCache: CryptoKey | null = null;
async function getKey(): Promise<CryptoKey> {
  if (_keyCache) return _keyCache;
  const raw = assembleKey();
  _keyCache = await crypto.subtle.importKey('raw', raw.buffer as ArrayBuffer, { name: 'AES-GCM' }, false, ['decrypt']);
  // Xom kalitni xotiradan tezda o'chiramiz
  raw.fill(0);
  return _keyCache;
}

/**
 * Shifrlangan blobni ochadi.
 * Format: [magic(4)='CIAK'][version(1)][iv(12)][ciphertext]
 */
export async function decryptKBBlob(blob: ArrayBuffer): Promise<DecryptedKB> {
  const data = new Uint8Array(blob);

  // Magic tekshirish
  const magic = new TextDecoder().decode(data.slice(0, 4));
  if (magic !== 'CIAK') {
    throw new Error('Noto\'g\'ri KB fayl formati (magic mos kelmadi)');
  }
  // data[4] = version
  const iv = data.slice(5, 17);
  const ct = data.slice(17);

  const key = await getKey();
  let ptBuf: ArrayBuffer;
  try {
    ptBuf = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, ct);
  } catch (e) {
    // AES-GCM auth tag mos kelmasa → kb.enc buzilgan yoki kalit noto'g'ri
    throw new Error('KB integrity tekshiruvi muvaffaqiyatsiz — fayl buzilgan yoki kalit noto\'g\'ri (AES-GCM auth tag)');
  }
  const json = new TextDecoder().decode(ptBuf);
  try {
    return JSON.parse(json) as DecryptedKB;
  } catch {
    throw new Error('KB deshifrlandi, lekin JSON formati buzilgan');
  }
}

/**
 * Shifrlangan KB'ni URL'dan yuklab ochadi.
 * Cache: brauzer kb.enc'ni cache qiladi — yangi build qilsangiz, foydalanuvchi
 * Hard Reload (Ctrl+F5) bilan yangilashi kerak. Yoki version query qo'shing:
 * loadEncryptedKB('/kb.enc?v=2')
 * @param url default: /kb.enc
 */
export async function loadEncryptedKB(url = '/kb.enc'): Promise<DecryptedKB> {
  const r = await fetch(url, { cache: 'no-cache' });
  if (!r.ok) throw new Error(`KB yuklanmadi: HTTP ${r.status}`);
  const buf = await r.arrayBuffer();
  return decryptKBBlob(buf);
}

/**
 * Shifrlangan KB mavjudligini tekshiradi (yuklamasdan).
 */
export async function isEncryptedKBAvailable(url = '/kb.enc'): Promise<boolean> {
  try {
    const r = await fetch(url, { method: 'HEAD' });
    return r.ok;
  } catch {
    return false;
  }
}
