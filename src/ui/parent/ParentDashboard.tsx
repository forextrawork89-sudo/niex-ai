import React, { useState } from 'react';
import { UIStateContainer, UIState } from '../common/UIStateContainer';
import { WhatChangedService, WhatChangedBlockState } from '../../domain/activity-ai/what-changed-service';
import { TAMPER_CAPABILITY_MATRIX } from '../../domain/privacy-trust/tamper-protection-service';

export type ParentSection =
  | 'home'
  | 'profile'
  | 'map'
  | 'rules'
  | 'security'
  | 'reports'
  | 'family'
  | 'privacy'
  | 'account'
  | 'help';

export const ParentDashboard: React.FC = () => {
  const [activeSection, setActiveSection] = useState<ParentSection>('home');
  const [uiState, setUiState] = useState<UIState>('idle');
  const [childName, setChildName] = useState('Jasur');
  const [childAge, setChildAge] = useState(15);
  const [screenTimeSpent, setScreenTimeSpent] = useState(95);
  const [screenTimeLimit, setScreenTimeLimit] = useState(120);
  const [batteryPercent, setBatteryPercent] = useState(82);
  const [currentZone, setCurrentZone] = useState('Maktab (Xavfsiz zona)');
  const [pinInput, setPinInput] = useState('');
  const [pinFeedback, setPinFeedback] = useState<string | null>(null);
  const [locationExportConsent, setLocationExportConsent] = useState(false);
  const [exportNotice, setExportNotice] = useState<string | null>(null);
  const [ticketType, setTicketType] = useState<'false_block' | 'dispute_monitoring' | 'technical_issue'>('false_block');
  const [ticketTitle, setTicketTitle] = useState('');
  const [ticketDesc, setTicketDesc] = useState('');
  const [ticketsList, setTicketsList] = useState<Array<{ id: string; title: string; type: string; status: string; deadline: string }>>([
    {
      id: 'tkt-001',
      title: 'khanacademy.org dars uchun kerak',
      type: 'false_block',
      status: 'in_review',
      deadline: '72 soat ichida (Qolgan: 48 soat)',
    },
  ]);

  // "What changed" block mock data
  const whatChangedService = new WhatChangedService();
  const whatChangedData: WhatChangedBlockState = whatChangedService.computeWhatChanged({
    guardianId: 'guardian-alisher',
    newApps: [{ appName: 'Duolingo English', installedAt: new Date(Date.now() - 3600000).toISOString() }],
    blocks: [{ domain: 'free-robux-click.net', blockedAt: new Date(Date.now() - 7200000).toISOString() }],
    permissionRequests: [{ target: 'Camera', requestedAt: new Date(Date.now() - 10800000).toISOString() }],
    capabilityChanges: [],
  });

  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketTitle.trim()) return;
    const newTkt = {
      id: `tkt-${Date.now().toString().slice(-4)}`,
      title: ticketTitle,
      type: ticketType,
      status: 'open',
      deadline: '72 soat ichida (FR-36 SLA)',
    };
    setTicketsList([newTkt, ...ticketsList]);
    setTicketTitle('');
    setTicketDesc('');
    alert('Chipta qabul qilindi! 72 soatlik SLA doirasida ko‘rib chiqiladi.');
  };

  const handleExport = (type: 'screen_time' | 'location_history') => {
    if (type === 'location_history' && !locationExportConsent) {
      alert('Joylashuv tarixi eksporti uchun maxsus rozilik katakchasini belgilang (FR-34)!');
      return;
    }
    setExportNotice(`Eksport arxivi muvaffaqiyatli tayyorlandi (ID: exp-${Date.now().toString().slice(-5)}). Audit jurnalida qayd etildi.`);
  };

  const navItems: Array<{ id: ParentSection; label: string; icon: string }> = [
    { id: 'home', label: 'Bosh sahifa', icon: '🏠' },
    { id: 'profile', label: 'Bola profili', icon: '👤' },
    { id: 'map', label: 'Xarita & Zonalar', icon: '📍' },
    { id: 'rules', label: 'Qoidalar', icon: '🛡' },
    { id: 'security', label: 'Xavfsizlik & Karantin', icon: '🔒' },
    { id: 'reports', label: 'Hisobotlar', icon: '📊' },
    { id: 'family', label: 'Oila Suhbatlari', icon: '💬' },
    { id: 'privacy', label: 'Maxfiylik & Huquq', icon: '⚖️' },
    { id: 'account', label: 'Vasiylar & Telegram', icon: '⚙️' },
    { id: 'help', label: 'Yordam & Dispute', icon: '❓' },
  ];

  return (
    <div style={{ display: 'flex', minHeight: '85vh', background: 'var(--bg)', color: 'var(--text)', fontFamily: 'sans-serif' }}>
      {/* Sidebar Navigation */}
      <div style={{ width: '240px', background: 'var(--panel)', borderRight: '1px solid var(--border)', padding: '16px 12px' }}>
        <div style={{ padding: '0 8px 16px 8px', borderBottom: '1px solid var(--border)', marginBottom: '16px' }}>
          <div style={{ fontSize: '18px', fontWeight: 'bold', color: 'var(--accent)' }}>NIEX AI</div>
          <div style={{ fontSize: '12px', color: 'var(--muted)' }}>Ota-ona Boshqaruv Markazi</div>
          <div style={{ marginTop: '8px', padding: '6px 8px', background: 'rgba(255,255,255,0.04)', borderRadius: '6px', fontSize: '12px' }}>
            Farzand: <b>{childName}</b> ({childAge} yosh)
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '10px 12px',
                background: activeSection === item.id ? 'rgba(79, 140, 255, 0.15)' : 'transparent',
                color: activeSection === item.id ? 'var(--accent)' : 'var(--text)',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                textAlign: 'left',
                fontSize: '13px',
                fontWeight: activeSection === item.id ? 600 : 400,
              }}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </div>

        {/* UI State Selector for testing edge cases */}
        <div style={{ marginTop: '24px', padding: '12px', background: 'rgba(255,255,255,0.02)', borderRadius: '8px', border: '1px solid var(--border)' }}>
          <div style={{ fontSize: '11px', color: 'var(--muted)', marginBottom: '6px' }}>UI Test Holati:</div>
          <select
            value={uiState}
            onChange={(e) => setUiState(e.target.value as UIState)}
            style={{ width: '100%', padding: '4px 6px', background: 'var(--bg)', color: 'var(--text)', border: '1px solid var(--border)', borderRadius: '4px', fontSize: '12px' }}
          >
            <option value="idle">Oddiy (Normal)</option>
            <option value="loading">Yuklanmoqda (Loading)</option>
            <option value="empty">Bo‘sh (Empty)</option>
            <option value="permission_denied">Ruxsat berilmagan</option>
            <option value="unsupported">Qo‘llab-quvvatlanmaydi</option>
            <option value="offline">Oflayn (Offline)</option>
            <option value="stale">Eskirgan ma’lumot (Stale)</option>
            <option value="error">Xatolik (Error)</option>
          </select>
        </div>
      </div>

      {/* Main Content Area */}
      <div style={{ flex: 1, padding: '24px 32px', overflowY: 'auto' }}>
        <UIStateContainer state={uiState} onRetry={() => setUiState('idle')}>
          {/* SECTION 1: HOME */}
          {activeSection === 'home' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2 style={{ margin: 0, fontSize: '22px' }}>Salom, Alisher aka 👋</h2>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button
                    onClick={() => { setScreenTimeSpent(screenTimeSpent + 15); alert('Farzandga 15 daqiqa qo‘shildi!'); }}
                    style={{ padding: '8px 14px', background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '13px' }}
                  >
                    +15 daqiqa qo‘shish
                  </button>
                  <button
                    onClick={() => alert('Favqulodda qurilma to‘xtatildi (qulflangan). Favqulodda qo‘ng‘iroqlar ochiq qoladi.')}
                    style={{ padding: '8px 14px', background: 'rgba(239, 68, 68, 0.2)', color: 'var(--harmful)', border: '1px solid var(--harmful)', borderRadius: '6px', cursor: 'pointer', fontSize: '13px' }}
                  >
                    Qurilmani bloklash
                  </button>
                </div>
              </div>

              {/* Status Metric Cards */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
                <div style={{ background: 'var(--panel)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border)' }}>
                  <div style={{ fontSize: '12px', color: 'var(--muted)', marginBottom: '4px' }}>Batareya quvvati</div>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: batteryPercent < 20 ? 'var(--harmful)' : 'var(--safe)' }}>
                    🔋 {batteryPercent}%
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--muted)', marginTop: '4px' }}>Quvvatlash rejimi: Oddiy</div>
                </div>

                <div style={{ background: 'var(--panel)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border)' }}>
                  <div style={{ fontSize: '12px', color: 'var(--muted)', marginBottom: '4px' }}>Ekran vaqti (Bugun)</div>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: screenTimeSpent >= screenTimeLimit ? 'var(--harmful)' : 'var(--text)' }}>
                    ⏳ {screenTimeSpent} / {screenTimeLimit} daq
                  </div>
                  <div style={{ width: '100%', background: 'rgba(255,255,255,0.1)', height: '6px', borderRadius: '3px', marginTop: '6px' }}>
                    <div style={{ width: `${Math.min(100, (screenTimeSpent / screenTimeLimit) * 100)}%`, background: 'var(--accent)', height: '100%', borderRadius: '3px' }} />
                  </div>
                </div>

                <div style={{ background: 'var(--panel)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border)' }}>
                  <div style={{ fontSize: '12px', color: 'var(--muted)', marginBottom: '4px' }}>Hozirgi joylashuv</div>
                  <div style={{ fontSize: '16px', fontWeight: 'bold', color: 'var(--safe)' }}>📍 {currentZone}</div>
                  <div style={{ fontSize: '11px', color: 'var(--muted)', marginTop: '4px' }}>GPS aniqligi: 15 metr (aniq)</div>
                </div>

                <div style={{ background: 'var(--panel)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border)' }}>
                  <div style={{ fontSize: '12px', color: 'var(--muted)', marginBottom: '4px' }}>Xavfsizlik holati</div>
                  <div style={{ fontSize: '18px', fontWeight: 'bold', color: 'var(--safe)' }}>🛡 Himoya faol</div>
                  <div style={{ fontSize: '11px', color: 'var(--muted)', marginTop: '4px' }}>Bugun 1 ta zararli havola qaytarildi</div>
                </div>
              </div>

              {/* FR-45: What Changed Block */}
              <div style={{ background: 'var(--panel)', padding: '20px', borderRadius: '12px', border: '1px solid var(--border)', marginBottom: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <h3 style={{ margin: 0, fontSize: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span>⚡️</span> Oxirgi kirishingizdan buyon nimalar o‘zgardi? (FR-45)
                  </h3>
                  <span style={{ fontSize: '12px', color: 'var(--muted)' }}>Maksimal 5 ta muhim o‘zgarish</span>
                </div>

                {whatChangedData.isEmpty ? (
                  <div style={{ padding: '16px', color: 'var(--muted)', fontSize: '13px' }}>{whatChangedData.emptyMessage}</div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {whatChangedData.diffRows.map((row, idx) => (
                      <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', background: 'rgba(255,255,255,0.02)', borderRadius: '6px', fontSize: '13px' }}>
                        <div>
                          <b style={{ color: 'var(--accent)' }}>{row.title}:</b> {row.detail}
                        </div>
                        <span style={{ color: 'var(--muted)', fontSize: '11px' }}>{new Date(row.occurredAt).toLocaleTimeString()}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* SECTION 2: CHILD PROFILE */}
          {activeSection === 'profile' && (
            <div>
              <h2 style={{ margin: '0 0 16px 0', fontSize: '20px' }}>Farzand Profili va Yosh Toifalari</h2>
              <div style={{ background: 'var(--panel)', padding: '20px', borderRadius: '12px', border: '1px solid var(--border)', marginBottom: '20px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <label style={{ fontSize: '12px', color: 'var(--muted)' }}>Farzand ismi:</label>
                    <input
                      type="text"
                      value={childName}
                      onChange={(e) => setChildName(e.target.value)}
                      style={{ width: '100%', padding: '8px', marginTop: '4px', background: 'var(--bg)', border: '1px solid var(--border)', color: '#fff', borderRadius: '6px' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '12px', color: 'var(--muted)' }}>Yoshi:</label>
                    <input
                      type="number"
                      value={childAge}
                      onChange={(e) => setChildAge(parseInt(e.target.value, 10))}
                      style={{ width: '100%', padding: '8px', marginTop: '4px', background: 'var(--bg)', border: '1px solid var(--border)', color: '#fff', borderRadius: '6px' }}
                    />
                  </div>
                </div>

                <div style={{ marginTop: '20px', padding: '16px', background: 'rgba(79, 140, 255, 0.08)', borderRadius: '8px', border: '1px solid rgba(79, 140, 255, 0.2)' }}>
                  <h4 style={{ margin: '0 0 6px 0', color: 'var(--accent)' }}>Hozirgi Yosh Toifasi: Yoshlar guruhi C (15-17 yosh)</h4>
                  <p style={{ margin: '0 0 12px 0', fontSize: '13px', color: 'var(--text)' }}>
                    FR-41 talablariga ko‘ra, 15 yoshga to‘lganda bolaning shaxsiy hududini kengaytirish taklifi beriladi.
                    Tizim avtomatik emas, faqat ota-ona va bola o‘rtasida kelishuv asosida monitoring darajasini yumshatadi.
                  </p>
                  <button
                    onClick={() => alert('Yosh toifasi C bo‘yicha taklifnoma shakllantirildi va tasdiqlandi. 7 kunlik marshrut tarixi o‘chirildi, faqat oxirgi nuqta qoldirildi.')}
                    style={{ padding: '8px 14px', background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '12px' }}
                  >
                    Mustaqillik rejasini faollashtirish (FR-41)
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 3: MAP & SAFE ZONES */}
          {activeSection === 'map' && (
            <div>
              <h2 style={{ margin: '0 0 16px 0', fontSize: '20px' }}>Xarita va Xavfsiz Hududlar (Geofencing)</h2>
              <div style={{ background: 'var(--panel)', padding: '20px', borderRadius: '12px', border: '1px solid var(--border)', marginBottom: '20px' }}>
                <div style={{ height: '220px', background: 'rgba(0,0,0,0.3)', borderRadius: '8px', border: '1px dashed var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
                  <span style={{ fontSize: '42px', marginBottom: '8px' }}>🗺️</span>
                  <div style={{ fontSize: '14px', fontWeight: 'bold' }}>Toshkent shahri, Yunusobod tumani</div>
                  <div style={{ fontSize: '12px', color: 'var(--safe)', marginTop: '4px' }}>● Hozir Maktab xavfsiz zonasida (Gisterezis: R radius, chiqish 1.3R, kechikish 2 daqiqa)</div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '16px' }}>
                  <div style={{ padding: '12px', background: 'rgba(255,255,255,0.02)', borderRadius: '8px', border: '1px solid var(--border)' }}>
                    <div style={{ fontWeight: 'bold', fontSize: '13px' }}>🏫 17-maktab</div>
                    <div style={{ fontSize: '12px', color: 'var(--muted)' }}>Radius: 150 metr | Kirish: 08:15 da qayd etildi</div>
                  </div>
                  <div style={{ padding: '12px', background: 'rgba(255,255,255,0.02)', borderRadius: '8px', border: '1px solid var(--border)' }}>
                    <div style={{ fontWeight: 'bold', fontSize: '13px' }}>🏠 Uy hududi</div>
                    <div style={{ fontSize: '12px', color: 'var(--muted)' }}>Radius: 100 metr | Kutilayotgan yetib kelish: 15:30</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 4: RULES & SCHEDULES */}
          {activeSection === 'rules' && (
            <div>
              <h2 style={{ margin: '0 0 16px 0', fontSize: '20px' }}>Veb Qoidalar va Foydalanish Jadvali</h2>
              <div style={{ background: 'var(--panel)', padding: '20px', borderRadius: '12px', border: '1px solid var(--border)' }}>
                <h3 style={{ margin: '0 0 12px 0', fontSize: '15px' }}>Kategoriya cheklovlari:</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px' }}>
                  {[
                    { name: 'Kattalar uchun kontent (18+)', status: 'Bloklangan (Majburiy)', color: 'var(--harmful)' },
                    { name: 'Onlayn kazino va qimor (Gambling)', status: 'Bloklangan (Majburiy)', color: 'var(--harmful)' },
                    { name: 'Zararli fishing va yolg‘on saytlar', status: 'Bloklangan (AI tekshiruvi bilan)', color: 'var(--harmful)' },
                    { name: 'O‘yinlar va ko‘ngilochar platformalar', status: 'Dars vaqtida cheklangan (14:00-17:00)', color: 'var(--uncertain)' },
                  ].map((cat, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 12px', background: 'rgba(255,255,255,0.02)', borderRadius: '6px', fontSize: '13px' }}>
                      <span>{cat.name}</span>
                      <span style={{ color: cat.color, fontWeight: 'bold' }}>{cat.status}</span>
                    </div>
                  ))}
                </div>

                <h3 style={{ margin: '0 0 8px 0', fontSize: '15px' }}>Qoida sababi tushuntirishi (FR-40):</h3>
                <p style={{ margin: '0 0 16px 0', fontSize: '13px', color: 'var(--muted)' }}>
                  Bolaga qoidalar tushuntirilganda ota-ona sababi bolaning yoshiga mos yumshoq tilda yetkaziladi (maks. 200 belgi).
                </p>
                <input
                  type="text"
                  maxLength={200}
                  defaultValue="Darslarni yaxshi o‘zlashtirib olishing uchun o‘yin saytlariga tanaffus qildik."
                  style={{ width: '100%', padding: '10px', background: 'var(--bg)', border: '1px solid var(--border)', color: '#fff', borderRadius: '6px' }}
                />
              </div>
            </div>
          )}

          {/* SECTION 5: SECURITY & QUARANTINE */}
          {activeSection === 'security' && (
            <div>
              <h2 style={{ margin: '0 0 16px 0', fontSize: '20px' }}>Xavfsizlik Markazi va Karantin (FR-31, FR-32, FR-37)</h2>
              <div style={{ background: 'var(--panel)', padding: '20px', borderRadius: '12px', border: '1px solid var(--border)', marginBottom: '20px' }}>
                <h3 style={{ margin: '0 0 12px 0', fontSize: '15px' }}>Karantindagi Shubhali Fayllar</h3>
                <div style={{ padding: '12px', background: 'rgba(239, 68, 68, 0.05)', border: '1px solid rgba(239, 68, 68, 0.2)', borderRadius: '8px', marginBottom: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontWeight: 'bold', fontSize: '13px' }}>unknown-hack-script.sh.apk</div>
                      <div style={{ fontSize: '11px', color: 'var(--muted)' }}>SHA256: 8f4a...e12 | Hajmi: 4.2 MB | Manba: Telegram kanali</div>
                    </div>
                    <button
                      onClick={() => alert('Vasiy tasdig‘i bilan fayl karantindan qaytarildi (FR-32).')}
                      style={{ padding: '6px 12px', background: 'transparent', border: '1px solid var(--accent)', color: 'var(--accent)', borderRadius: '6px', cursor: 'pointer', fontSize: '12px' }}
                    >
                      Tiklashga ruxsat
                    </button>
                  </div>
                </div>

                <h3 style={{ margin: '16px 0 8px 0', fontSize: '15px' }}>Ruxsatsiz o‘chirishdan himoya (FR-37)</h3>
                <p style={{ margin: '0 0 12px 0', fontSize: '13px', color: 'var(--muted)' }}>
                  Qurilma rejimiga qarab ilovani o‘chirish yoki sozlamalarni o‘zgartirish 6 xonali PIN bilan himoyalanadi.
                  Ketma-ket 5 marta xato kiritilsa, 15 daqiqaga bloklanadi.
                </p>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input
                    type="password"
                    maxLength={6}
                    placeholder="6 xonali PIN"
                    value={pinInput}
                    onChange={(e) => setPinInput(e.target.value)}
                    style={{ padding: '8px', background: 'var(--bg)', border: '1px solid var(--border)', color: '#fff', borderRadius: '6px', width: '140px' }}
                  />
                  <button
                    onClick={() => {
                      if (pinInput === '123456') {
                        setPinFeedback('✅ PIN to‘g‘ri! Himoyalangan sozlamalar ochildi.');
                      } else {
                        setPinFeedback('❌ Noto‘g‘ri PIN. 5 marta xato blokirovkaga olib keladi.');
                      }
                    }}
                    style={{ padding: '8px 14px', background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '12px' }}
                  >
                    Tasdiqlash
                  </button>
                </div>
                {pinFeedback && <div style={{ marginTop: '8px', fontSize: '12px' }}>{pinFeedback}</div>}
              </div>
            </div>
          )}

          {/* SECTION 6: REPORTS & EXPORT */}
          {activeSection === 'reports' && (
            <div>
              <h2 style={{ margin: '0 0 16px 0', fontSize: '20px' }}>Hisobotlar va Ma’lumotlar Eksporti (FR-34)</h2>
              <div style={{ background: 'var(--panel)', padding: '20px', borderRadius: '12px', border: '1px solid var(--border)' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
                  <div style={{ padding: '16px', background: 'rgba(255,255,255,0.02)', borderRadius: '8px', border: '1px solid var(--border)' }}>
                    <div style={{ fontSize: '12px', color: 'var(--muted)' }}>Haftalik o‘rtacha ekran vaqti</div>
                    <div style={{ fontSize: '22px', fontWeight: 'bold', margin: '4px 0' }}>1 soat 45 daqiqa / kun</div>
                    <div style={{ fontSize: '11px', color: 'var(--safe)' }}>O‘tgan haftaga nisbatan -12% kamroq</div>
                  </div>
                  <div style={{ padding: '16px', background: 'rgba(255,255,255,0.02)', borderRadius: '8px', border: '1px solid var(--border)' }}>
                    <div style={{ fontSize: '12px', color: 'var(--muted)' }}>Ma’lumot uzilishlari (Data Gaps)</div>
                    <div style={{ fontSize: '22px', fontWeight: 'bold', margin: '4px 0' }}>1 marta</div>
                    <div style={{ fontSize: '11px', color: 'var(--muted)' }}>Seshanba kuni 2 soat telefon o‘chiq bo‘lgan (0 bilan adashtirilmagan)</div>
                  </div>
                </div>

                <h3 style={{ margin: '0 0 12px 0', fontSize: '15px' }}>Arxivni yuklab olish:</h3>
                <div style={{ padding: '16px', background: 'rgba(255,255,255,0.02)', borderRadius: '8px', border: '1px solid var(--border)' }}>
                  <div style={{ marginBottom: '12px' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={locationExportConsent}
                        onChange={(e) => setLocationExportConsent(e.target.checked)}
                      />
                      <span>Joylashuv tarixi eksporti uchun qo‘shimcha vasiy tasdig‘ini beraman (FR-34)</span>
                    </label>
                  </div>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button
                      onClick={() => handleExport('screen_time')}
                      style={{ padding: '8px 14px', background: 'rgba(255,255,255,0.1)', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '12px' }}
                    >
                      Ekran vaqti hisobotini yuklash (.json)
                    </button>
                    <button
                      onClick={() => handleExport('location_history')}
                      style={{ padding: '8px 14px', background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '12px' }}
                    >
                      To‘liq marshrut arxivini yuklash (.json)
                    </button>
                  </div>
                  {exportNotice && <div style={{ marginTop: '12px', color: 'var(--safe)', fontSize: '12px' }}>{exportNotice}</div>}
                </div>
              </div>
            </div>
          )}

          {/* SECTION 7: FAMILY & CONVERSATION */}
          {activeSection === 'family' && (
            <div>
              <h2 style={{ margin: '0 0 16px 0', fontSize: '20px' }}>Oila Suhbat Kartochkalari (FR-26)</h2>
              <div style={{ background: 'var(--panel)', padding: '20px', borderRadius: '12px', border: '1px solid var(--border)' }}>
                <div style={{ padding: '12px 16px', background: 'rgba(74, 222, 128, 0.1)', border: '1px solid var(--safe)', borderRadius: '8px', marginBottom: '16px' }}>
                  <div style={{ fontSize: '12px', color: 'var(--safe)', fontWeight: 'bold' }}>
                    🏥 Qat’iy diagnostikatsiz xulosa (FR-26 Kafolati):
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--text)', marginTop: '4px' }}>
                    Tizim bolaga hech qanday tibbiy, psixiatrik yoki xulq-atvor yorlig‘i yopishtirmaydi.
                    Barcha savollar oilada erkin muloqot va yaqinlikni qo‘llab-quvvatlash uchun faktlarga asoslangan.
                  </div>
                </div>

                <div style={{ background: 'rgba(255,255,255,0.02)', padding: '16px', borderRadius: '8px', border: '1px solid var(--border)' }}>
                  <h3 style={{ margin: '0 0 8px 0', fontSize: '16px', color: 'var(--accent)' }}>Haftalik 3 ta qiziqarli suhbat mavzusi:</h3>
                  <ol style={{ margin: 0, paddingLeft: '20px', fontSize: '14px', lineHeight: 1.8 }}>
                    <li>Bu hafta internetda yoki maktabda o‘zing uchun qiziqarli qaysi yangilikni o‘rganding?</li>
                    <li>Sevimli o‘yining yoki darsingda qanday yangi yutuqqa erishding va bu senga qanday hissiyot berdi?</li>
                    <li>Keyingi hafta qaysi qiziqarli loyiha yoki mashg‘ulot bilan birga shug‘ullanishimizni xohlaysan?</li>
                  </ol>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 8: PRIVACY & TRUST */}
          {activeSection === 'privacy' && (
            <div>
              <h2 style={{ margin: '0 0 16px 0', fontSize: '20px' }}>Maxfiylik va Huquqlar (FR-35, FR-44)</h2>
              <div style={{ background: 'var(--panel)', padding: '20px', borderRadius: '12px', border: '1px solid var(--border)' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
                  <div style={{ padding: '14px', background: 'rgba(74, 222, 128, 0.05)', border: '1px solid rgba(74, 222, 128, 0.2)', borderRadius: '8px' }}>
                    <h4 style={{ margin: '0 0 8px 0', color: 'var(--safe)' }}>✅ Yig‘iladigan ma’lumotlar:</h4>
                    <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '12px', lineHeight: 1.6, color: 'var(--muted)' }}>
                      <li>Sayt domenlari (parolsiz, tozalangan)</li>
                      <li>Ekran vaqti (ilova ishga tushish davomiyligi)</li>
                      <li>Xavfsiz zona kirish/chiqish hodisalari</li>
                      <li>SOS favqulodda signallari</li>
                    </ul>
                  </div>
                  <div style={{ padding: '14px', background: 'rgba(239, 68, 68, 0.05)', border: '1px solid rgba(239, 68, 68, 0.2)', borderRadius: '8px' }}>
                    <h4 style={{ margin: '0 0 8px 0', color: 'var(--harmful)' }}>🚫 HECH QACHON yig‘ilmaydi:</h4>
                    <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '12px', lineHeight: 1.6, color: 'var(--muted)' }}>
                      <li>Shaxsiy xabarlar (Telegram, SMS)</li>
                      <li>Yashirin kamera yoki mikrofon yozuvlari</li>
                      <li>Klaviaturada yozilgan matnlar (keylogger)</li>
                      <li>Biometrik yuzni tanish ma’lumotlari</li>
                    </ul>
                  </div>
                </div>

                <div style={{ borderTop: '1px solid var(--border)', paddingTop: '16px' }}>
                  <h4 style={{ margin: '0 0 6px 0' }}>18 yoshga to‘lganda nima sodir bo‘ladi?</h4>
                  <p style={{ margin: '0 0 12px 0', fontSize: '13px', color: 'var(--muted)' }}>
                    FR-35 bo‘yicha, foydalanuvchi 18 yoshga to‘lgan kuni barcha ota-ona monitoringi avtomatik to‘xtatiladi.
                  </p>
                  <button
                    onClick={() => alert('Barcha shaxsiy ma’lumotlar xavfsiz tarzda o‘chirildi (FR-35 Deletion Audit yaratildi).')}
                    style={{ padding: '8px 14px', background: 'rgba(239,68,68,0.2)', color: 'var(--harmful)', border: '1px solid var(--harmful)', borderRadius: '6px', cursor: 'pointer', fontSize: '12px' }}
                  >
                    Barcha ma’lumotlarni o‘chirish (Hisobni tozalash)
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 9: ACCOUNT & TELEGRAM */}
          {activeSection === 'account' && (
            <div>
              <h2 style={{ margin: '0 0 16px 0', fontSize: '20px' }}>Vasiylar va Telegram Boti</h2>
              <div style={{ background: 'var(--panel)', padding: '20px', borderRadius: '12px', border: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', gap: '20px', alignItems: 'center', marginBottom: '20px' }}>
                  <div style={{ width: '90px', height: '90px', background: '#fff', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#000', fontSize: '11px', fontWeight: 'bold' }}>
                    [QR-KOD]
                  </div>
                  <div>
                    <h3 style={{ margin: '0 0 6px 0', fontSize: '16px' }}>Telegram Tezkor Xabarnoma Boti</h3>
                    <p style={{ margin: '0 0 8px 0', fontSize: '13px', color: 'var(--muted)' }}>
                      Telegram orqali farzand statusi, qo‘shimcha vaqt so‘rovlari va SOS signallarini bir zumda qabul qiling.
                    </p>
                    <div style={{ fontSize: '12px', color: 'var(--accent)' }}>Ulanish kodi: <b>NX-9842</b></div>
                  </div>
                </div>

                <div style={{ padding: '12px', background: 'rgba(255,255,255,0.02)', borderRadius: '8px', border: '1px solid var(--border)' }}>
                  <h4 style={{ margin: '0 0 6px 0', fontSize: '14px' }}>Tinch rejim (Quiet Hours - FR-38):</h4>
                  <p style={{ margin: '0 0 10px 0', fontSize: '12px', color: 'var(--muted)' }}>
                    Kechasi 22:00 dan 07:00 gacha past darajali bildirishnomalar ovozsiz saqlanadi. Muhim SOS signallari doimo yetkaziladi.
                  </p>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px' }}>
                    <input type="checkbox" defaultChecked />
                    <span>Tinch rejimni faollashtirish</span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 10: HELP & SUPPORT */}
          {activeSection === 'help' && (
            <div>
              <h2 style={{ margin: '0 0 16px 0', fontSize: '20px' }}>Yordam, Shikoyatlar va E’tirozlar (FR-36)</h2>
              <div style={{ background: 'var(--panel)', padding: '20px', borderRadius: '12px', border: '1px solid var(--border)' }}>
                <form onSubmit={handleCreateTicket} style={{ marginBottom: '24px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '12px', marginBottom: '12px' }}>
                    <div>
                      <label style={{ fontSize: '12px', color: 'var(--muted)' }}>Murojaat turi:</label>
                      <select
                        value={ticketType}
                        onChange={(e) => setTicketType(e.target.value as 'false_block' | 'dispute_monitoring' | 'technical_issue')}
                        style={{ width: '100%', padding: '8px', marginTop: '4px', background: 'var(--bg)', border: '1px solid var(--border)', color: '#fff', borderRadius: '6px' }}
                      >
                        <option value="false_block">Noto‘g‘ri bloklangan sayt</option>
                        <option value="dispute_monitoring">Monitoring chegarasi bo‘yicha e’tiroz</option>
                        <option value="technical_issue">Texnik muammo / Nosozlik</option>
                      </select>
                    </div>
                    <div>
                      <label style={{ fontSize: '12px', color: 'var(--muted)' }}>Sarlavha:</label>
                      <input
                        type="text"
                        placeholder="Qisqacha mazmuni"
                        value={ticketTitle}
                        onChange={(e) => setTicketTitle(e.target.value)}
                        style={{ width: '100%', padding: '8px', marginTop: '4px', background: 'var(--bg)', border: '1px solid var(--border)', color: '#fff', borderRadius: '6px' }}
                      />
                    </div>
                  </div>
                  <div style={{ marginBottom: '12px' }}>
                    <label style={{ fontSize: '12px', color: 'var(--muted)' }}>Batafsil tushuntirish:</label>
                    <textarea
                      rows={3}
                      placeholder="Muammo haqida batafsil ma’lumot..."
                      value={ticketDesc}
                      onChange={(e) => setTicketDesc(e.target.value)}
                      style={{ width: '100%', padding: '8px', marginTop: '4px', background: 'var(--bg)', border: '1px solid var(--border)', color: '#fff', borderRadius: '6px' }}
                    />
                  </div>
                  <button
                    type="submit"
                    style={{ padding: '8px 16px', background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '13px' }}
                  >
                    Murojaat yuborish (72h SLA)
                  </button>
                </form>

                <h3 style={{ margin: '0 0 10px 0', fontSize: '15px' }}>Mening murojaatlarim:</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {ticketsList.map((tkt) => (
                    <div key={tkt.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 14px', background: 'rgba(255,255,255,0.02)', borderRadius: '6px', fontSize: '13px' }}>
                      <div>
                        <b>{tkt.title}</b>
                        <div style={{ fontSize: '11px', color: 'var(--muted)' }}>{tkt.type} | {tkt.deadline}</div>
                      </div>
                      <span style={{ color: 'var(--accent)', fontWeight: 'bold' }}>{tkt.status}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </UIStateContainer>
      </div>
    </div>
  );
};
