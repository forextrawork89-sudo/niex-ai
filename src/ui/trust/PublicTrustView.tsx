import React, { useState } from 'react';
import {
  PublicTrustManifestService,
  TrustLanguage,
} from '../../domain/privacy-trust/public-trust-manifest';

export const PublicTrustView: React.FC = () => {
  const [lang, setLang] = useState<TrustLanguage>('uz');
  const service = new PublicTrustManifestService();
  const manifest = service.getManifest(lang);

  return (
    <div style={{ maxWidth: '860px', margin: '0 auto', padding: '32px 20px', fontFamily: 'sans-serif', color: 'var(--text)' }}>
      {/* Top Header & Language Selector */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid var(--border)', paddingBottom: '20px', marginBottom: '28px' }}>
        <div>
          <h1 style={{ margin: '0 0 8px 0', fontSize: '26px', color: 'var(--accent)' }}>{manifest.headline}</h1>
          <p style={{ margin: 0, fontSize: '15px', color: 'var(--muted)' }}>{manifest.subheadline}</p>
        </div>

        {/* 3-Language Selector (FR-44) */}
        <div style={{ display: 'flex', gap: '6px', background: 'var(--panel)', padding: '4px', borderRadius: '8px', border: '1px solid var(--border)' }}>
          {(['uz', 'ru', 'en'] as TrustLanguage[]).map((code) => (
            <button
              key={code}
              onClick={() => setLang(code)}
              style={{
                padding: '6px 12px',
                background: lang === code ? 'var(--accent)' : 'transparent',
                color: lang === code ? '#fff' : 'var(--muted)',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: 600,
                fontSize: '12px',
                textTransform: 'uppercase',
              }}
            >
              {code}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Core Transparency Sections */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '24px' }}>
        {/* Section 1: What We Collect */}
        <div style={{ background: 'var(--panel)', padding: '20px', borderRadius: '12px', border: '1px solid var(--border)' }}>
          <h3 style={{ margin: '0 0 14px 0', fontSize: '16px', color: 'var(--safe)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>✅</span> {manifest.whatWeCollect.title}
          </h3>
          <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '13px', lineHeight: 1.7 }}>
            {manifest.whatWeCollect.items.map((item, i) => (
              <li key={i} style={{ marginBottom: '6px' }}>{item}</li>
            ))}
          </ul>
        </div>

        {/* Section 2: What We NEVER Collect */}
        <div style={{ background: 'var(--panel)', padding: '20px', borderRadius: '12px', border: '1px solid rgba(239, 68, 68, 0.3)' }}>
          <h3 style={{ margin: '0 0 14px 0', fontSize: '16px', color: 'var(--harmful)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>🚫</span> {manifest.whatWeNeverCollect.title}
          </h3>
          <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '13px', lineHeight: 1.7 }}>
            {manifest.whatWeNeverCollect.items.map((item, i) => (
              <li key={i} style={{ marginBottom: '6px' }}>{item}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* Row 2: Retention, Rights, Security */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
        <div style={{ background: 'var(--panel)', padding: '18px', borderRadius: '12px', border: '1px solid var(--border)' }}>
          <h4 style={{ margin: '0 0 10px 0', fontSize: '14px', color: 'var(--accent)' }}>
            🗄️ {manifest.retentionAndStorage.title}
          </h4>
          <ul style={{ margin: 0, paddingLeft: '16px', fontSize: '12px', lineHeight: 1.6, color: 'var(--muted)' }}>
            {manifest.retentionAndStorage.items.map((item, i) => (
              <li key={i} style={{ marginBottom: '6px' }}>{item}</li>
            ))}
          </ul>
        </div>

        <div style={{ background: 'var(--panel)', padding: '18px', borderRadius: '12px', border: '1px solid var(--border)' }}>
          <h4 style={{ margin: '0 0 10px 0', fontSize: '14px', color: 'var(--accent)' }}>
            ⚖️ {manifest.childRightsAndAutonomy.title}
          </h4>
          <ul style={{ margin: 0, paddingLeft: '16px', fontSize: '12px', lineHeight: 1.6, color: 'var(--muted)' }}>
            {manifest.childRightsAndAutonomy.items.map((item, i) => (
              <li key={i} style={{ marginBottom: '6px' }}>{item}</li>
            ))}
          </ul>
        </div>

        <div style={{ background: 'var(--panel)', padding: '18px', borderRadius: '12px', border: '1px solid var(--border)' }}>
          <h4 style={{ margin: '0 0 10px 0', fontSize: '14px', color: 'var(--accent)' }}>
            🛡️ {manifest.securityGuarantees.title}
          </h4>
          <ul style={{ margin: 0, paddingLeft: '16px', fontSize: '12px', lineHeight: 1.6, color: 'var(--muted)' }}>
            {manifest.securityGuarantees.items.map((item, i) => (
              <li key={i} style={{ marginBottom: '6px' }}>{item}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
