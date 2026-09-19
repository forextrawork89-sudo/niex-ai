import React, { useState, useRef } from 'react';
import { UIStateContainer, UIState } from '../common/UIStateContainer';
import { LinkCheckerService, LinkCheckResult } from '../../domain/web-safety/link-checker-service';

export type ChildView =
  | 'overview'
  | 'who_manages_me'
  | 'what_is_shared'
  | 'my_rules'
  | 'blocked_screen'
  | 'request_time'
  | 'check_in'
  | 'sos'
  | 'link_checker'
  | 'dispute';

export const ChildApp: React.FC = () => {
  const [activeView, setActiveView] = useState<ChildView>('overview');
  const [uiState, setUiState] = useState<UIState>('idle');
  const [screenTimeRemaining, setScreenTimeRemaining] = useState(25); // 25 minutes left
  const [linkInput, setLinkInput] = useState('');
  const [linkResult, setLinkResult] = useState<LinkCheckResult | null>(null);
  const [checkinLocation, setCheckinLocation] = useState('Maktab');
  const [checkinSuccess, setCheckinSuccess] = useState(false);
  const [timeReqMinutes, setTimeReqMinutes] = useState<15 | 30 | 60>(15);
  const [timeReqSent, setTimeReqSent] = useState(false);

  // SOS 3-second hold logic
  const [sosHolding, setSosHolding] = useState(false);
  const [sosProgress, setSosProgress] = useState(0);
  const [sosDispatched, setSosDispatched] = useState(false);
  const [sosSeenByGuardian, setSosSeenByGuardian] = useState(false);
  const holdTimerRef = useRef<NodeJS.Timeout | null>(null);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const startSosHold = () => {
    if (sosDispatched) return;
    setSosHolding(true);
    setSosProgress(0);

    const startTime = Date.now();
    progressIntervalRef.current = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min(100, (elapsed / 3000) * 100);
      setSosProgress(pct);
    }, 50);

    holdTimerRef.current = setTimeout(() => {
      clearInterval(progressIntervalRef.current as NodeJS.Timeout);
      setSosProgress(100);
      setSosHolding(false);
      setSosDispatched(true);
      // Simulate guardian acknowledgement after 5 seconds
      setTimeout(() => setSosSeenByGuardian(true), 5000);
    }, 3000);
  };

  const cancelSosHold = () => {
    if (sosDispatched) return;
    if (holdTimerRef.current) clearTimeout(holdTimerRef.current);
    if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
    setSosHolding(false);
    setSosProgress(0);
  };

  const linkChecker = new LinkCheckerService();

  const handleCheckLink = (e: React.FormEvent) => {
    e.preventDefault();
    if (!linkInput.trim()) return;
    const res = linkChecker.checkLink(linkInput);
    setLinkResult(res);
  };

  const handleSendCheckin = () => {
    setCheckinSuccess(true);
    setTimeout(() => setCheckinSuccess(false), 4000);
  };

  const handleSendTimeRequest = () => {
    setTimeReqSent(true);
    setTimeout(() => setTimeReqSent(false), 5000);
  };

  return (
    <div style={{ maxWidth: '480px', margin: '0 auto', background: '#12151e', color: '#e8e8ee', minHeight: '85vh', borderRadius: '16px', border: '1px solid var(--border)', overflow: 'hidden', display: 'flex', flexDirection: 'column', fontFamily: 'sans-serif' }}>
      {/* Child App Top Bar */}
      <div style={{ background: 'var(--panel)', padding: '14px 18px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ fontSize: '16px', fontWeight: 'bold', color: 'var(--accent)' }}>NIEX Himoya</div>
          <div style={{ fontSize: '11px', color: 'var(--muted)' }}>Salom, Jasur! Barchasi joyida.</div>
        </div>
        <button
          onClick={() => setActiveView('sos')}
          style={{
            padding: '6px 12px',
            background: 'rgba(239,68,68,0.2)',
            border: '1px solid var(--harmful)',
            color: 'var(--harmful)',
            borderRadius: '20px',
            cursor: 'pointer',
            fontSize: '12px',
            fontWeight: 'bold',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
          }}
        >
          <span>🆘</span> SOS
        </button>
      </div>

      {/* 5-minute pre-limit warning banner if time is running out */}
      {screenTimeRemaining <= 5 && (
        <div style={{ background: 'rgba(251, 191, 36, 0.2)', borderBottom: '1px solid var(--uncertain)', padding: '8px 16px', fontSize: '12px', color: 'var(--uncertain)', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span>⚠️</span>
          <span><b>Diqqat:</b> Ekran vaqti tugashiga 5 daqiqa qoldi! O‘yiningizni saqlab qo‘ying.</span>
        </div>
      )}

      {/* Main View Area */}
      <div style={{ flex: 1, padding: '16px', overflowY: 'auto' }}>
        <UIStateContainer state={uiState} onRetry={() => setUiState('idle')}>
          {/* VIEW: OVERVIEW */}
          {activeView === 'overview' && (
            <div>
              {/* Screen Time Remaining Card */}
              <div style={{ background: 'var(--panel)', padding: '18px', borderRadius: '12px', border: '1px solid var(--border)', textAlign: 'center', marginBottom: '16px' }}>
                <div style={{ fontSize: '12px', color: 'var(--muted)', marginBottom: '4px' }}>Bugungi qolgan vaqtingiz</div>
                <div style={{ fontSize: '32px', fontWeight: 'bold', color: screenTimeRemaining <= 5 ? 'var(--harmful)' : 'var(--accent)' }}>
                  {screenTimeRemaining} daqiqa
                </div>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '12px' }}>
                  <button
                    onClick={() => setActiveView('request_time')}
                    style={{ padding: '6px 14px', background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '12px' }}
                  >
                    Vaqt so‘rash
                  </button>
                  <button
                    onClick={() => setActiveView('check_in')}
                    style={{ padding: '6px 14px', background: 'rgba(74, 222, 128, 0.15)', color: 'var(--safe)', border: '1px solid var(--safe)', borderRadius: '6px', cursor: 'pointer', fontSize: '12px' }}
                  >
                    Men yetib keldim
                  </button>
                </div>
              </div>

              {/* Action Navigation Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '16px' }}>
                <button
                  onClick={() => setActiveView('who_manages_me')}
                  style={{ padding: '14px', background: 'var(--panel)', border: '1px solid var(--border)', borderRadius: '10px', color: '#fff', textAlign: 'left', cursor: 'pointer' }}
                >
                  <div style={{ fontSize: '20px', marginBottom: '4px' }}>👨‍👩‍👦</div>
                  <div style={{ fontSize: '13px', fontWeight: 'bold' }}>Kim boshqaradi?</div>
                  <div style={{ fontSize: '11px', color: 'var(--muted)' }}>Vasiy ma’lumotlari</div>
                </button>

                <button
                  onClick={() => setActiveView('what_is_shared')}
                  style={{ padding: '14px', background: 'var(--panel)', border: '1px solid var(--border)', borderRadius: '10px', color: '#fff', textAlign: 'left', cursor: 'pointer' }}
                >
                  <div style={{ fontSize: '20px', marginBottom: '4px' }}>🔍</div>
                  <div style={{ fontSize: '13px', fontWeight: 'bold' }}>Nimalar ko‘rinadi?</div>
                  <div style={{ fontSize: '11px', color: 'var(--muted)' }}>Shaffoflik kafolati</div>
                </button>

                <button
                  onClick={() => setActiveView('link_checker')}
                  style={{ padding: '14px', background: 'var(--panel)', border: '1px solid var(--border)', borderRadius: '10px', color: '#fff', textAlign: 'left', cursor: 'pointer' }}
                >
                  <div style={{ fontSize: '20px', marginBottom: '4px' }}>🔗</div>
                  <div style={{ fontSize: '13px', fontWeight: 'bold' }}>Havolani tekshirish</div>
                  <div style={{ fontSize: '11px', color: 'var(--muted)' }}>Xavfli sayt tekshiruvi</div>
                </button>

                <button
                  onClick={() => setActiveView('blocked_screen')}
                  style={{ padding: '14px', background: 'var(--panel)', border: '1px solid var(--border)', borderRadius: '10px', color: '#fff', textAlign: 'left', cursor: 'pointer' }}
                >
                  <div style={{ fontSize: '20px', marginBottom: '4px' }}>🚫</div>
                  <div style={{ fontSize: '13px', fontWeight: 'bold' }}>Nega bloklandi?</div>
                  <div style={{ fontSize: '11px', color: 'var(--muted)' }}>Cheklov sabablari</div>
                </button>
              </div>

              {/* Trust & Dispute Button */}
              <button
                onClick={() => setActiveView('dispute')}
                style={{ width: '100%', padding: '12px', background: 'rgba(255,255,255,0.03)', border: '1px dashed var(--border)', borderRadius: '10px', color: 'var(--muted)', cursor: 'pointer', fontSize: '12px' }}
              >
                ⚖️ Fikr yoki e’tiroz bildirish (72 soatlik javob kafolati)
              </button>
            </div>
          )}

          {/* VIEW: WHO MANAGES ME */}
          {activeView === 'who_manages_me' && (
            <div>
              <button onClick={() => setActiveView('overview')} style={{ background: 'none', border: 'none', color: 'var(--accent)', cursor: 'pointer', fontSize: '13px', marginBottom: '12px' }}>
                ← Ortga
              </button>
              <h3 style={{ margin: '0 0 12px 0', fontSize: '16px' }}>Kim meni boshqaradi?</h3>
              <div style={{ background: 'var(--panel)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                  <div style={{ width: '40px', height: '40px', background: 'var(--accent)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>
                    👨
                  </div>
                  <div>
                    <div style={{ fontWeight: 'bold', fontSize: '14px' }}>Alisher Karimov</div>
                    <div style={{ fontSize: '12px', color: 'var(--muted)' }}>Asosiy vasiy (Otasi) | +998 90 123 45 67</div>
                  </div>
                </div>
                <div style={{ fontSize: '12px', color: 'var(--muted)', lineHeight: 1.5 }}>
                  Ushbu vasiy sizning xavfsizligingizni ta’minlash va sog‘lom raqamli odatlarni shakllantirish uchun qoidalar o‘rnatgan.
                </div>
              </div>
            </div>
          )}

          {/* VIEW: WHAT IS SHARED */}
          {activeView === 'what_is_shared' && (
            <div>
              <button onClick={() => setActiveView('overview')} style={{ background: 'none', border: 'none', color: 'var(--accent)', cursor: 'pointer', fontSize: '13px', marginBottom: '12px' }}>
                ← Ortga
              </button>
              <h3 style={{ margin: '0 0 12px 0', fontSize: '16px' }}>Ota-onamga nimalar ko‘rinadi?</h3>
              <div style={{ background: 'var(--panel)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border)', marginBottom: '12px' }}>
                <h4 style={{ margin: '0 0 6px 0', color: 'var(--safe)', fontSize: '13px' }}>✅ Ko‘rinadigan ma’lumotlar:</h4>
                <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '12px', lineHeight: 1.6, color: 'var(--text)' }}>
                  <li>Qaysi saytlarga tashrif buyurilgani (parollar tozalanadi)</li>
                  <li>Telefoningizdan necha soat foydalanganingiz</li>
                  <li>Uyga yoki maktabga yetib borganingiz</li>
                  <li>Batareyangiz quvvati foizi</li>
                </ul>
              </div>
              <div style={{ background: 'var(--panel)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border)' }}>
                <h4 style={{ margin: '0 0 6px 0', color: 'var(--harmful)', fontSize: '13px' }}>🚫 Hech kimga ko‘rinmaydigan sirlar:</h4>
                <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '12px', lineHeight: 1.6, color: 'var(--muted)' }}>
                  <li>Telegram yoki WhatsApp yozishmalaringiz o‘qilmaydi</li>
                  <li>Mikrofon yashirin yozib olinmaydi</li>
                  <li>Kamera orqali yashirin surat olinmaydi</li>
                </ul>
              </div>
            </div>
          )}

          {/* VIEW: BLOCKED SCREEN */}
          {activeView === 'blocked_screen' && (
            <div>
              <button onClick={() => setActiveView('overview')} style={{ background: 'none', border: 'none', color: 'var(--accent)', cursor: 'pointer', fontSize: '13px', marginBottom: '12px' }}>
                ← Ortga
              </button>
              <div style={{ background: 'var(--panel)', padding: '20px', borderRadius: '12px', border: '1px solid var(--border)', textAlign: 'center' }}>
                <div style={{ fontSize: '42px', marginBottom: '8px' }}>🛑</div>
                <h3 style={{ margin: '0 0 8px 0', fontSize: '18px' }}>Ushbu sahifa vaqtincha cheklangan</h3>
                <p style={{ margin: '0 0 14px 0', fontSize: '13px', color: 'var(--muted)', lineHeight: 1.5 }}>
                  <b>Sabab:</b> Ota-onangiz bilan kelishilgan tartibga ko‘ra, o‘yin va ko‘ngilochar saytlar dars vaqtida ochilmaydi.
                </p>
                <div style={{ padding: '12px', background: 'rgba(255,255,255,0.02)', borderRadius: '8px', marginBottom: '16px', fontSize: '12px', color: 'var(--muted)' }}>
                  Sayt: <b>game-online-arena.com</b>
                </div>
                <button
                  onClick={() => alert('Vasiyingizga ushbu saytni 1 soatga ochish bo‘yicha so‘rov yuborildi!')}
                  style={{ width: '100%', padding: '10px', background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: 'bold' }}
                >
                  Kirishga ruxsat so‘rash (1 soatga)
                </button>
              </div>
            </div>
          )}

          {/* VIEW: REQUEST TIME */}
          {activeView === 'request_time' && (
            <div>
              <button onClick={() => setActiveView('overview')} style={{ background: 'none', border: 'none', color: 'var(--accent)', cursor: 'pointer', fontSize: '13px', marginBottom: '12px' }}>
                ← Ortga
              </button>
              <h3 style={{ margin: '0 0 12px 0', fontSize: '16px' }}>Qo‘shimcha vaqt so‘rash (FR-14)</h3>
              <div style={{ background: 'var(--panel)', padding: '18px', borderRadius: '12px', border: '1px solid var(--border)' }}>
                <div style={{ fontSize: '13px', color: 'var(--muted)', marginBottom: '12px' }}>Qancha vaqt kerak?</div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: '16px' }}>
                  {[15, 30, 60].map((m) => (
                    <button
                      key={m}
                      onClick={() => setTimeReqMinutes(m as 15 | 30 | 60)}
                      style={{
                        padding: '12px',
                        background: timeReqMinutes === m ? 'var(--accent)' : 'rgba(255,255,255,0.04)',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontWeight: 'bold',
                        fontSize: '14px',
                      }}
                    >
                      +{m} daq
                    </button>
                  ))}
                </div>
                <button
                  onClick={handleSendTimeRequest}
                  style={{ width: '100%', padding: '12px', background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: 'bold' }}
                >
                  Ota-onamga so‘rov yuborish
                </button>
                {timeReqSent && (
                  <div style={{ marginTop: '12px', padding: '8px', background: 'rgba(74, 222, 128, 0.1)', border: '1px solid var(--safe)', borderRadius: '6px', color: 'var(--safe)', fontSize: '12px', textAlign: 'center' }}>
                    ✅ So‘rov yuborildi! Ota-onangiz tasdiqlasa, vaqt avtomatik qo‘shiladi.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* VIEW: CHECK IN */}
          {activeView === 'check_in' && (
            <div>
              <button onClick={() => setActiveView('overview')} style={{ background: 'none', border: 'none', color: 'var(--accent)', cursor: 'pointer', fontSize: '13px', marginBottom: '12px' }}>
                ← Ortga
              </button>
              <h3 style={{ margin: '0 0 12px 0', fontSize: '16px' }}>"Men yetib keldim" (FR-22)</h3>
              <div style={{ background: 'var(--panel)', padding: '18px', borderRadius: '12px', border: '1px solid var(--border)' }}>
                <p style={{ margin: '0 0 12px 0', fontSize: '13px', color: 'var(--muted)' }}>
                  GPS aloqasi bo‘lmaganda ham vasiyingizga qayerda ekanligingizni xabar qilishingiz mumkin:
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
                  {['Maktab', 'Uy', 'Repetitor / To‘garak', 'Bobolarniki'].map((loc) => (
                    <button
                      key={loc}
                      onClick={() => setCheckinLocation(loc)}
                      style={{
                        padding: '10px 14px',
                        background: checkinLocation === loc ? 'rgba(79, 140, 255, 0.2)' : 'rgba(255,255,255,0.02)',
                        border: `1px solid ${checkinLocation === loc ? 'var(--accent)' : 'var(--border)'}`,
                        borderRadius: '8px',
                        color: '#fff',
                        textAlign: 'left',
                        cursor: 'pointer',
                        fontSize: '13px',
                      }}
                    >
                      📍 {loc}
                    </button>
                  ))}
                </div>
                <button
                  onClick={handleSendCheckin}
                  style={{ width: '100%', padding: '12px', background: 'var(--safe)', color: '#000', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: 'bold' }}
                >
                  Xabarni yuborish
                </button>
                {checkinSuccess && (
                  <div style={{ marginTop: '12px', color: 'var(--safe)', fontSize: '12px', textAlign: 'center' }}>
                    ✅ "{checkinLocation}"ga yetib kelganingiz ota-onangizga xabar qilindi!
                  </div>
                )}
              </div>
            </div>
          )}

          {/* VIEW: SOS EMERGENCY */}
          {activeView === 'sos' && (
            <div>
              <button onClick={() => setActiveView('overview')} style={{ background: 'none', border: 'none', color: 'var(--accent)', cursor: 'pointer', fontSize: '13px', marginBottom: '12px' }}>
                ← Ortga
              </button>
              <div style={{ background: 'var(--panel)', padding: '20px', borderRadius: '12px', border: '1px solid var(--border)', textAlign: 'center' }}>
                <h3 style={{ margin: '0 0 6px 0', fontSize: '18px', color: 'var(--harmful)' }}>Favqulodda SOS Signali (FR-23)</h3>
                <p style={{ margin: '0 0 16px 0', fontSize: '12px', color: 'var(--muted)' }}>
                  Xatoni oldini olish uchun tugmani <b>3 soniya</b> bosib turing.
                </p>

                {!sosDispatched ? (
                  <div>
                    <div
                      onMouseDown={startSosHold}
                      onMouseUp={cancelSosHold}
                      onTouchStart={startSosHold}
                      onTouchEnd={cancelSosHold}
                      style={{
                        width: '140px',
                        height: '140px',
                        margin: '0 auto 16px auto',
                        borderRadius: '50%',
                        background: sosHolding ? 'rgba(239,68,68,0.9)' : 'var(--harmful)',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        userSelect: 'none',
                        boxShadow: '0 0 25px rgba(239,68,68,0.4)',
                        transform: sosHolding ? 'scale(0.95)' : 'scale(1)',
                        transition: 'transform 0.1s',
                      }}
                    >
                      <span style={{ fontSize: '32px' }}>🆘</span>
                      <span style={{ fontSize: '13px', fontWeight: 'bold', color: '#fff', marginTop: '4px' }}>
                        {sosHolding ? `${Math.round((3000 * (100 - sosProgress)) / 1000) / 10}s` : 'BOSIB TUR'}
                      </span>
                    </div>

                    {sosHolding && (
                      <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', marginBottom: '12px' }}>
                        <div style={{ width: `${sosProgress}%`, height: '100%', background: 'var(--harmful)', borderRadius: '3px' }} />
                      </div>
                    )}
                  </div>
                ) : (
                  <div style={{ padding: '16px', background: 'rgba(239,68,68,0.15)', border: '1px solid var(--harmful)', borderRadius: '10px', marginBottom: '16px' }}>
                    <div style={{ fontSize: '20px', fontWeight: 'bold', color: 'var(--harmful)', marginBottom: '6px' }}>
                      🚨 SOS YUBORILDI!
                    </div>
                    <div style={{ fontSize: '12px', color: '#fff', marginBottom: '8px' }}>
                      Barcha vasiylarga Telegram, SMS va Push orqali geolokatsiyangiz bilan xabar yuborildi.
                    </div>
                    <div style={{ fontSize: '12px', color: sosSeenByGuardian ? 'var(--safe)' : 'var(--uncertain)', fontWeight: 'bold' }}>
                      {sosSeenByGuardian ? '✅ Ota-onangiz xabarni ko‘rdi (Tasdiqlandi)!' : '⏳ Vasiylarning ko‘rishi kutilmoqda...'}
                    </div>
                  </div>
                )}

                <div style={{ fontSize: '11px', color: 'var(--muted)', borderTop: '1px solid var(--border)', paddingTop: '12px' }}>
                  ⚠️ <i>Muhim eslatma: NIEX davlat tezkor favqulodda xizmatlari (112) o‘rnini bosmaydi. Hayot uchun xavf bo‘lsa, darhol 112 ga qo‘ng‘iroq qiling.</i>
                </div>
              </div>
            </div>
          )}

          {/* VIEW: LINK CHECKER */}
          {activeView === 'link_checker' && (
            <div>
              <button onClick={() => setActiveView('overview')} style={{ background: 'none', border: 'none', color: 'var(--accent)', cursor: 'pointer', fontSize: '13px', marginBottom: '12px' }}>
                ← Ortga
              </button>
              <h3 style={{ margin: '0 0 8px 0', fontSize: '16px' }}>Shubhali Havolani Tekshirish (FR-43)</h3>
              <p style={{ margin: '0 0 12px 0', fontSize: '12px', color: 'var(--muted)' }}>
                Sizga do‘stlaringiz yuborgan yoki internetda uchragan havolani bu yerga yopishtiring va xavfsizligini biling:
              </p>
              <form onSubmit={handleCheckLink} style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
                <input
                  type="text"
                  placeholder="https://havola-manzili..."
                  value={linkInput}
                  onChange={(e) => setLinkInput(e.target.value)}
                  style={{ flex: 1, padding: '10px', background: 'var(--panel)', border: '1px solid var(--border)', borderRadius: '8px', color: '#fff', fontSize: '13px' }}
                />
                <button
                  type="submit"
                  style={{ padding: '10px 16px', background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: 'bold' }}
                >
                  Tekshir
                </button>
              </form>

              {linkResult && (
                <div
                  style={{
                    padding: '16px',
                    borderRadius: '10px',
                    border: `1px solid ${
                      linkResult.verdict === 'safe'
                        ? 'var(--safe)'
                        : linkResult.verdict === 'blocked'
                        ? 'var(--harmful)'
                        : 'var(--uncertain)'
                    }`,
                    background: 'rgba(255,255,255,0.02)',
                  }}
                >
                  <div style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '6px' }}>
                    Xulosa: {linkResult.verdict === 'safe' ? '✅ Xavfsiz' : linkResult.verdict === 'blocked' ? '🛑 Xavfli!' : '⚠️ Noma’lum'}
                  </div>
                  <p style={{ margin: 0, fontSize: '13px', lineHeight: 1.5 }}>{linkResult.childExplanation}</p>
                </div>
              )}
            </div>
          )}

          {/* VIEW: DISPUTE & SUPPORT */}
          {activeView === 'dispute' && (
            <div>
              <button onClick={() => setActiveView('overview')} style={{ background: 'none', border: 'none', color: 'var(--accent)', cursor: 'pointer', fontSize: '13px', marginBottom: '12px' }}>
                ← Ortga
              </button>
              <h3 style={{ margin: '0 0 8px 0', fontSize: '16px' }}>Yordam va E’tiroz (FR-36)</h3>
              <div style={{ background: 'var(--panel)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border)' }}>
                <p style={{ margin: '0 0 12px 0', fontSize: '12px', color: 'var(--muted)' }}>
                  Agar biror sayt noto‘g‘ri bloklangan deb hisoblasangiz yoki monitoring sizga noqulaylik tug‘dirayotgan bo‘lsa, bu yerda shikoyat qoldirishingiz mumkin. Barcha murojaatlar 72 soat ichida ko‘rib chiqiladi.
                </p>
                <textarea
                  rows={3}
                  placeholder="Fikringizni yoki muammoni yozing..."
                  style={{ width: '100%', padding: '10px', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: '8px', color: '#fff', fontSize: '12px', marginBottom: '12px' }}
                />
                <button
                  onClick={() => alert('Murojaatingiz qabul qilindi (72 soatlik SLA kafolati bilan).')}
                  style={{ width: '100%', padding: '10px', background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '13px' }}
                >
                  Murojaatni jo‘natish
                </button>
              </div>
            </div>
          )}
        </UIStateContainer>
      </div>
    </div>
  );
};
