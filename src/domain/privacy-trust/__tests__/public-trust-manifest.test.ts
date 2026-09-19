import { describe, it, expect } from 'vitest';
import { PublicTrustManifestService } from '../public-trust-manifest';

describe('PublicTrustManifestService (FR-44)', () => {
  it('provides public trust manifest in Uzbek, Russian, and English', () => {
    const service = new PublicTrustManifestService();

    const manifestUz = service.getManifest('uz');
    expect(manifestUz.language).toBe('uz');
    expect(manifestUz.headline).toContain('NIEX AI');
    expect(manifestUz.whatWeNeverCollect.items.length).toBeGreaterThanOrEqual(4);
    expect(manifestUz.whatWeNeverCollect.items.some((i) => i.includes('yozishmalar'))).toBe(true);

    const manifestRu = service.getManifest('ru');
    expect(manifestRu.language).toBe('ru');
    expect(manifestRu.whatWeNeverCollect.items.some((i) => i.includes('переписки'))).toBe(true);

    const manifestEn = service.getManifest('en');
    expect(manifestEn.language).toBe('en');
    expect(manifestEn.whatWeNeverCollect.items.some((i) => i.includes('chat messages'))).toBe(true);
  });

  it('defaults to Uzbek if unsupported language requested', () => {
    const service = new PublicTrustManifestService();
    // @ts-expect-error testing fallback
    const manifest = service.getManifest('fr');
    expect(manifest.language).toBe('uz');
  });
});
