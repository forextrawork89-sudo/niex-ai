import { describe, it, expect } from 'vitest';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { UIStateContainer } from '../common/UIStateContainer';
import { ParentDashboard } from '../parent/ParentDashboard';
import { ChildApp } from '../child/ChildApp';
import { PublicTrustView } from '../trust/PublicTrustView';
import { OnboardingView } from '../onboarding/OnboardingView';

describe('UI Views & State Containers', () => {
  it('renders all 7 UI states in UIStateContainer correctly', () => {
    // 1. Loading
    const loadingHtml = renderToString(
      <UIStateContainer state="loading"><div>Content</div></UIStateContainer>
    );
    expect(loadingHtml).toContain('Yuklanmoqda');

    // 2. Empty
    const emptyHtml = renderToString(
      <UIStateContainer state="empty" emptyTitle="Hozircha bo‘sh"><div>Content</div></UIStateContainer>
    );
    expect(emptyHtml).toContain('Hozircha bo‘sh');

    // 3. Permission Denied
    const permHtml = renderToString(
      <UIStateContainer state="permission_denied" permissionTitle="Ruxsat kerak"><div>Content</div></UIStateContainer>
    );
    expect(permHtml).toContain('Ruxsat kerak');

    // 4. Unsupported
    const unsuppHtml = renderToString(
      <UIStateContainer state="unsupported"><div>Content</div></UIStateContainer>
    );
    expect(unsuppHtml).toContain('Qo‘llab-quvvatlanmaydigan rejim');

    // 5. Offline
    const offlineHtml = renderToString(
      <UIStateContainer state="offline"><div>Online Content</div></UIStateContainer>
    );
    expect(offlineHtml).toContain('Internet aloqasi yo‘q');
    expect(offlineHtml).toContain('Online Content');

    // 6. Stale
    const staleHtml = renderToString(
      <UIStateContainer state="stale"><div>Stale Content</div></UIStateContainer>
    );
    expect(staleHtml).toContain('Ma’lumotlar eskirgan bo‘lishi mumkin');
    expect(staleHtml).toContain('Stale Content');

    // 7. Error
    const errorHtml = renderToString(
      <UIStateContainer state="error" errorMessage="Kutilmagan server xatosi"><div>Content</div></UIStateContainer>
    );
    expect(errorHtml).toContain('Kutilmagan server xatosi');
  });

  it('renders ParentDashboard with all 10 navigation sections', () => {
    const html = renderToString(<ParentDashboard />);
    expect(html).toContain('Bosh sahifa');
    expect(html).toContain('Bola profili');
    expect(html).toContain('Xarita &amp; Zonalar');
    expect(html).toContain('Qoidalar');
    expect(html).toContain('Xavfsizlik &amp; Karantin');
    expect(html).toContain('Hisobotlar');
    expect(html).toContain('Oila Suhbatlari');
    expect(html).toContain('Maxfiylik &amp; Huquq');
    expect(html).toContain('Vasiylar &amp; Telegram');
    expect(html).toContain('Yordam &amp; Dispute');
  });

  it('renders ChildApp with emergency SOS and transparency cards', () => {
    const html = renderToString(<ChildApp />);
    expect(html).toContain('NIEX Himoya');
    expect(html).toContain('SOS');
    expect(html).toContain('Kim boshqaradi?');
    expect(html).toContain('Nimalar ko‘rinadi?');
    expect(html).toContain('Havolani tekshirish');
  });

  it('renders PublicTrustView with multi-language headings', () => {
    const html = renderToString(<PublicTrustView />);
    expect(html).toContain('NIEX AI Shaffoflik va Ishonch Manifesti');
    expect(html).toContain('Biz nimalarni yig‘amiz');
    expect(html).toContain('HECH QACHON');
  });

  it('renders OnboardingView with 5-step health check wizard', () => {
    const html = renderToString(<OnboardingView />);
    expect(html).toContain('5 Bosqichli Onboarding va Tizim Tayyorgarligi Tekshiruvi (FR-39)');
    expect(html).toContain('Accessibility');
    expect(html).toContain('GPS');
  });
});
