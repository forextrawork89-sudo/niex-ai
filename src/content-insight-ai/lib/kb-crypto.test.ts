// ============================================================
// KB CRYPTO TESTLARI — shifrlash/deshifrlash to'g'riligi
//
// Round-trip + xato holatlarni tekshiradi.
// ============================================================

import { describe, it, expect } from 'vitest';
import { decryptKBBlob } from './kb-crypto';
import { webcrypto } from 'crypto';

// scripts/encrypt-kb.cjs dagi KEY_BYTES bilan AYNAN bir xil
const KEY_BYTES = new Uint8Array([164,52,86,174,231,196,102,64,90,67,59,118,202,208,13,91,89,8,109,122,184,152,221,238,200,138,88,31,106,25,253,197]);

// Test uchun shifrlangan blob yasash (encrypt-kb.cjs bilan bir xil format)
async function makeBlob(payload: unknown): Promise<ArrayBuffer> {
  const subtle = (webcrypto as any).subtle;
  const json = JSON.stringify(payload);
  const ptBytes = new TextEncoder().encode(json);
  const key = await subtle.importKey('raw', KEY_BYTES, { name: 'AES-GCM' }, false, ['encrypt']);
  const iv = webcrypto.getRandomValues(new Uint8Array(12));
  const ctBuf = await subtle.encrypt({ name: 'AES-GCM', iv }, key, ptBytes);
  const ct = new Uint8Array(ctBuf);
  const magic = new TextEncoder().encode('CIAK');
  const out = new Uint8Array(4 + 1 + 12 + ct.length);
  out.set(magic, 0);
  out[4] = 1;
  out.set(iv, 5);
  out.set(ct, 17);
  return out.buffer;
}

// Web Crypto API'ni globalThis.crypto sifatida o'rnatish (jsdom'da yo'q)
if (!(globalThis as any).crypto?.subtle) {
  (globalThis as any).crypto = webcrypto;
}

describe('KB crypto round-trip', () => {
  it('bitta fayl shifrla -> ochish', async () => {
    const payload = { version: 1, created: Date.now(), files: { 'test.md': '# Hello\n\nWorld' } };
    const blob = await makeBlob(payload);
    const result = await decryptKBBlob(blob);
    expect(result.version).toBe(1);
    expect(result.files['test.md']).toBe('# Hello\n\nWorld');
  });

  it('ko\'p fayl + ko\'p tilli kontent', async () => {
    const payload = {
      version: 1,
      created: 12345,
      files: {
        'safe/a.md': 'normal english text',
        'harmful/b.md': 'порно секс наркотик',
        'critical/c.md': '마약 판매 색情',
        'edge/d.md': 'special chars: éñü < > & " \' \\ \n\t',
      },
    };
    const blob = await makeBlob(payload);
    const result = await decryptKBBlob(blob);
    expect(Object.keys(result.files)).toHaveLength(4);
    expect(result.files['harmful/b.md']).toContain('порно');
    expect(result.files['critical/c.md']).toContain('마약');
    expect(result.files['edge/d.md']).toContain('éñü');
  });
});

describe('KB crypto xato holatlar', () => {
  it('noto\'g\'ri magic - xato qaytaradi', async () => {
    const bad = new Uint8Array(50);
    bad.set(new TextEncoder().encode('XXXX'), 0);  // noto'g'ri magic
    await expect(decryptKBBlob(bad.buffer)).rejects.toThrow(/magic/i);
  });

  it('buzilgan ciphertext - integrity xato', async () => {
    const payload = { version: 1, created: 0, files: { 'a.md': 'data' } };
    const blob = await makeBlob(payload);
    const data = new Uint8Array(blob);
    // Ciphertext ichidagi bir baytni o'zgartiramiz (AES-GCM auth tag buni aniqlaydi)
    data[25] ^= 0xff;
    await expect(decryptKBBlob(data.buffer)).rejects.toThrow(/integrity|auth tag|buzilgan/i);
  });

  it('bo\'sh fayl ham qaytariladi', async () => {
    const payload = { version: 1, created: 0, files: {} };
    const blob = await makeBlob(payload);
    const result = await decryptKBBlob(blob);
    expect(Object.keys(result.files)).toHaveLength(0);
  });
});
