import React from 'react';

export type UIState =
  | 'idle'
  | 'loading'
  | 'empty'
  | 'permission_denied'
  | 'unsupported'
  | 'offline'
  | 'stale'
  | 'error';

interface UIStateContainerProps {
  state: UIState;
  loadingMessage?: string;
  emptyTitle?: string;
  emptyMessage?: string;
  onEmptyAction?: () => void;
  emptyActionLabel?: string;
  permissionTitle?: string;
  permissionMessage?: string;
  onRequestPermission?: () => void;
  unsupportedMessage?: string;
  offlineMessage?: string;
  staleMessage?: string;
  errorMessage?: string;
  onRetry?: () => void;
  children: React.ReactNode;
}

export const UIStateContainer: React.FC<UIStateContainerProps> = ({
  state,
  loadingMessage = 'Yuklanmoqda...',
  emptyTitle = 'Ma’lumot mavjud emas',
  emptyMessage = 'Hozircha hech qanday yozuv topilmadi.',
  onEmptyAction,
  emptyActionLabel,
  permissionTitle = 'Ruxsat berilmagan',
  permissionMessage = 'Ushbu amalni bajarish uchun qurilma sozlamalarida kerakli ruxsatlarni faollashtiring.',
  onRequestPermission,
  unsupportedMessage = 'Ushbu imkoniyat ushbu operatsion tizim yoki qurilma rejimida qo‘llab-quvvatlanmaydi.',
  offlineMessage = 'Internet aloqasi yo‘q. Ko‘rsatilgan ma’lumotlar oxirgi saqlangan keshdan olingan.',
  staleMessage = 'Ma’lumotlar eskirgan bo‘lishi mumkin (oxirgi yangilanish 15 daqiqadan ko‘proq oldin).',
  errorMessage = 'Kutilmagan xatolik yuz berdi.',
  onRetry,
  children,
}) => {
  if (state === 'loading') {
    return (
      <div style={{ padding: '32px 16px', textAlign: 'center', color: 'var(--muted)' }}>
        <div
          style={{
            display: 'inline-block',
            width: '28px',
            height: '28px',
            border: '3px solid rgba(79, 140, 255, 0.2)',
            borderTopColor: 'var(--accent)',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            marginBottom: '12px',
          }}
        />
        <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
        <p style={{ margin: 0, fontSize: '14px' }}>{loadingMessage}</p>
      </div>
    );
  }

  if (state === 'empty') {
    return (
      <div
        style={{
          padding: '40px 20px',
          textAlign: 'center',
          background: 'rgba(255,255,255,0.02)',
          border: '1px dashed var(--border)',
          borderRadius: '12px',
          margin: '12px 0',
        }}
      >
        <div style={{ fontSize: '36px', marginBottom: '8px' }}>📂</div>
        <h4 style={{ margin: '0 0 6px 0', color: 'var(--text)', fontSize: '16px' }}>{emptyTitle}</h4>
        <p style={{ margin: '0 0 16px 0', color: 'var(--muted)', fontSize: '13px' }}>{emptyMessage}</p>
        {onEmptyAction && emptyActionLabel && (
          <button
            onClick={onEmptyAction}
            style={{
              padding: '8px 16px',
              background: 'var(--accent)',
              border: 'none',
              borderRadius: '8px',
              color: '#fff',
              cursor: 'pointer',
              fontSize: '13px',
              fontWeight: 500,
            }}
          >
            {emptyActionLabel}
          </button>
        )}
      </div>
    );
  }

  if (state === 'permission_denied') {
    return (
      <div
        style={{
          padding: '24px 20px',
          background: 'rgba(239, 68, 68, 0.08)',
          border: '1px solid rgba(239, 68, 68, 0.3)',
          borderRadius: '12px',
          margin: '12px 0',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
          <span style={{ fontSize: '24px' }}>🔒</span>
          <div>
            <h4 style={{ margin: '0 0 6px 0', color: 'var(--harmful)', fontSize: '15px' }}>{permissionTitle}</h4>
            <p style={{ margin: '0 0 12px 0', color: 'var(--text)', fontSize: '13px', lineHeight: 1.5 }}>
              {permissionMessage}
            </p>
            {onRequestPermission && (
              <button
                onClick={onRequestPermission}
                style={{
                  padding: '7px 14px',
                  background: 'var(--harmful)',
                  border: 'none',
                  borderRadius: '6px',
                  color: '#fff',
                  cursor: 'pointer',
                  fontSize: '12px',
                  fontWeight: 600,
                }}
              >
                Ruxsat berish ko‘rsatmasi
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (state === 'unsupported') {
    return (
      <div
        style={{
          padding: '20px',
          background: 'rgba(251, 191, 36, 0.08)',
          border: '1px solid rgba(251, 191, 36, 0.3)',
          borderRadius: '12px',
          margin: '12px 0',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
          <span style={{ fontSize: '22px' }}>ℹ️</span>
          <div>
            <h4 style={{ margin: '0 0 4px 0', color: 'var(--uncertain)', fontSize: '14px' }}>
              Qo‘llab-quvvatlanmaydigan rejim
            </h4>
            <p style={{ margin: 0, color: 'var(--muted)', fontSize: '13px', lineHeight: 1.4 }}>
              {unsupportedMessage}
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (state === 'error') {
    return (
      <div
        style={{
          padding: '24px 20px',
          background: 'rgba(239, 68, 68, 0.1)',
          border: '1px solid var(--harmful)',
          borderRadius: '12px',
          margin: '12px 0',
          textAlign: 'center',
        }}
      >
        <span style={{ fontSize: '32px' }}>⚠️</span>
        <h4 style={{ margin: '8px 0 6px 0', color: 'var(--harmful)', fontSize: '15px' }}>Xatolik yuz berdi</h4>
        <p style={{ margin: '0 0 14px 0', color: 'var(--text)', fontSize: '13px' }}>{errorMessage}</p>
        {onRetry && (
          <button
            onClick={onRetry}
            style={{
              padding: '7px 16px',
              background: 'transparent',
              border: '1px solid var(--harmful)',
              borderRadius: '6px',
              color: 'var(--harmful)',
              cursor: 'pointer',
              fontSize: '12px',
              fontWeight: 600,
            }}
          >
            Qayta urinish
          </button>
        )}
      </div>
    );
  }

  return (
    <div>
      {state === 'offline' && (
        <div
          style={{
            padding: '8px 12px',
            background: 'rgba(251, 191, 36, 0.15)',
            border: '1px solid var(--uncertain)',
            borderRadius: '8px',
            marginBottom: '12px',
            fontSize: '12px',
            color: 'var(--uncertain)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <span>📶</span> {offlineMessage}
        </div>
      )}
      {state === 'stale' && (
        <div
          style={{
            padding: '8px 12px',
            background: 'rgba(138, 143, 155, 0.15)',
            border: '1px solid var(--muted)',
            borderRadius: '8px',
            marginBottom: '12px',
            fontSize: '12px',
            color: 'var(--muted)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <span>⏰</span> {staleMessage}
        </div>
      )}
      {children}
    </div>
  );
};
