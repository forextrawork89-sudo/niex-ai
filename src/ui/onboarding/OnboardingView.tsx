import React, { useState } from 'react';
import {
  OnboardingHealthCheckService,
  OnboardingHealthCheckReport,
} from '../../domain/privacy-trust/onboarding-health-check';

export const OnboardingView: React.FC = () => {
  const [accessibilityPerm, setAccessibilityPerm] = useState(true);
  const [usagePerm, setUsagePerm] = useState(true);
  const [locationPerm, setLocationPerm] = useState(true);
  const [notificationPerm, setNotificationPerm] = useState(true);
  const [testBlockDone, setTestBlockDone] = useState(true);
  const [gpsAccuracy, setGpsAccuracy] = useState(20); // 20m
  const [notificationAck, setNotificationAck] = useState(true);

  const [report, setReport] = useState<OnboardingHealthCheckReport | null>(null);

  const service = new OnboardingHealthCheckService();

  const handleRunCheck = () => {
    const res = service.run5StepHealthCheck({
      childId: 'child-jasur',
      deviceId: 'samsung-galaxy-a54',
      permissions: {
        accessibility: accessibilityPerm,
        usageStats: usagePerm,
        location: locationPerm,
        notifications: notificationPerm,
      },
      testBlockExecuted: testBlockDone,
      testLocationAccuracyMeters: gpsAccuracy,
      testNotificationAcknowledged: notificationAck,
    });
    setReport(res);
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '24px 20px', color: 'var(--text)', fontFamily: 'sans-serif' }}>
      <h2 style={{ margin: '0 0 8px 0', fontSize: '22px', color: 'var(--accent)' }}>
        5 Bosqichli Onboarding va Tizim Tayyorgarligi Tekshiruvi (FR-39)
      </h2>
      <p style={{ margin: '0 0 20px 0', fontSize: '14px', color: 'var(--muted)' }}>
        Farzand qurilmasini o‘rnatishda barcha xavfsizlik va ruxsatlar to‘liq ishlashini sinovdan o‘tkazing.
      </p>

      {/* Interactive Switchers for Testing Scenarios */}
      <div style={{ background: 'var(--panel)', padding: '18px', borderRadius: '12px', border: '1px solid var(--border)', marginBottom: '20px' }}>
        <h4 style={{ margin: '0 0 12px 0', fontSize: '14px' }}>Qurilma holati parametrlari (Sinov uchun):</h4>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', fontSize: '13px' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={accessibilityPerm}
              onChange={(e) => setAccessibilityPerm(e.target.checked)}
            />
            <span>Maxsus imkoniyatlar (Accessibility) ruxsati</span>
          </label>

          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={usagePerm}
              onChange={(e) => setUsagePerm(e.target.checked)}
            />
            <span>Ilovalar faolligi (Usage Stats) ruxsati</span>
          </label>

          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={locationPerm}
              onChange={(e) => setLocationPerm(e.target.checked)}
            />
            <span>Geolokatsiya (GPS) ruxsati</span>
          </label>

          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={notificationPerm}
              onChange={(e) => setNotificationPerm(e.target.checked)}
            />
            <span>Xabarnomalar (Notifications) ruxsati</span>
          </label>

          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={testBlockDone}
              onChange={(e) => setTestBlockDone(e.target.checked)}
            />
            <span>Sinov bloklash testi muvaffaqiyatli</span>
          </label>

          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={notificationAck}
              onChange={(e) => setNotificationAck(e.target.checked)}
            />
            <span>Sinov xabarnomasi qabul qilindi</span>
          </label>
        </div>

        <div style={{ marginTop: '14px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '12px', color: 'var(--muted)' }}>GPS aniqligi:</span>
          <input
            type="range"
            min={5}
            max={200}
            value={gpsAccuracy}
            onChange={(e) => setGpsAccuracy(parseInt(e.target.value, 10))}
          />
          <span style={{ fontSize: '12px', fontWeight: 'bold' }}>{gpsAccuracy} metr</span>
          <span style={{ fontSize: '11px', color: gpsAccuracy > 100 ? 'var(--harmful)' : 'var(--safe)' }}>
            ({gpsAccuracy > 100 ? 'Noaniq (>100m)' : 'Aniq'})
          </span>
        </div>

        <button
          onClick={handleRunCheck}
          style={{
            marginTop: '16px',
            padding: '10px 20px',
            background: 'var(--accent)',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '13px',
            fontWeight: 'bold',
          }}
        >
          🚀 5 Bosqichli Tekshiruvni Boshlash
        </button>
      </div>

      {/* Check Report Display */}
      {report && (
        <div style={{ background: 'var(--panel)', padding: '20px', borderRadius: '12px', border: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid var(--border)', paddingBottom: '12px' }}>
            <div>
              <h3 style={{ margin: '0 0 4px 0', fontSize: '18px' }}>Tekshiruv Natijasi</h3>
              <div style={{ fontSize: '12px', color: 'var(--muted)' }}>
                Qurilma: {report.deviceId} | {new Date(report.completedAt).toLocaleTimeString()}
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '26px', fontWeight: 'bold', color: report.isAllPassed ? 'var(--safe)' : 'var(--uncertain)' }}>
                {report.healthScorePercent}%
              </div>
              <div style={{ fontSize: '11px', color: report.isAllPassed ? 'var(--safe)' : 'var(--uncertain)' }}>
                {report.isAllPassed ? 'Barcha bosqichlar o‘tdi' : 'Qisman tayyor'}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {report.steps.map((step) => (
              <div
                key={step.stepId}
                style={{
                  padding: '14px',
                  borderRadius: '8px',
                  background: step.status === 'passed' ? 'rgba(74, 222, 128, 0.05)' : 'rgba(239, 68, 68, 0.08)',
                  border: `1px solid ${step.status === 'passed' ? 'rgba(74, 222, 128, 0.2)' : 'rgba(239, 68, 68, 0.3)'}`,
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                  <div style={{ fontWeight: 'bold', fontSize: '14px', color: step.status === 'passed' ? 'var(--safe)' : 'var(--harmful)' }}>
                    {step.stepNumber}. {step.title}
                  </div>
                  <span style={{ fontSize: '12px', fontWeight: 600, color: step.status === 'passed' ? 'var(--safe)' : 'var(--harmful)' }}>
                    {step.status === 'passed' ? '✅ O‘TDI' : '❌ XATO'}
                  </span>
                </div>
                <div style={{ fontSize: '13px', color: 'var(--text)', marginBottom: step.actionableGuidance ? '8px' : '0' }}>
                  {step.detail}
                </div>
                {step.actionableGuidance && (
                  <div style={{ padding: '8px 10px', background: 'rgba(255,255,255,0.03)', borderRadius: '6px', fontSize: '12px', color: 'var(--uncertain)' }}>
                    💡 <b>Qanday hal qilish mumkin:</b> {step.actionableGuidance}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
