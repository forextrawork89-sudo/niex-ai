import { syncGet, syncSet } from './storage-engine';

export interface Notification {
  id: string;
  type: 'critical' | 'warning' | 'info' | 'success';
  title: string;
  body: string;
  read: boolean;
  action_url?: string;
  created_at: string;
  expires_at?: string;
}

const STORAGE_KEY = 'notifications';

function genId(): string {
  return `notif-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
}

function loadNotifications(): Notification[] {
  return syncGet<Notification[]>(STORAGE_KEY, []);
}

function saveNotifications(items: Notification[]): void {
  syncSet(STORAGE_KEY, items);
}

export function notify(params: Omit<Notification, 'id' | 'read' | 'created_at'>): Notification {
  const notif: Notification = {
    ...params,
    id: genId(),
    read: false,
    created_at: new Date().toISOString(),
  };

  const all = loadNotifications();
  all.unshift(notif);

  // Keep max 100 notifications
  if (all.length > 100) all.length = 100;

  saveNotifications(all);

  // Browser notification if critical
  if (params.type === 'critical' && 'Notification' in window && Notification.permission === 'granted') {
    new Notification(params.title, { body: params.body, icon: '🛡️' });
  }

  return notif;
}

export function getNotifications(unreadOnly = false): Notification[] {
  const all = loadNotifications();
  const now = new Date().toISOString();
  const valid = all.filter((n) => !n.expires_at || n.expires_at > now);
  return unreadOnly ? valid.filter((n) => !n.read) : valid;
}

export function markRead(id: string): void {
  const all = loadNotifications();
  const idx = all.findIndex((n) => n.id === id);
  if (idx !== -1) {
    all[idx].read = true;
    saveNotifications(all);
  }
}

export function markAllRead(): void {
  const all = loadNotifications();
  all.forEach((n) => (n.read = true));
  saveNotifications(all);
}

export function getUnreadCount(): number {
  return getNotifications(true).length;
}

export function clearNotifications(): void {
  saveNotifications([]);
}

// Escalation checks
export function checkEscalations(pendingCount: number, criticalCount: number): void {
  if (criticalCount > 0) {
    notify({
      type: 'critical',
      title: '🔴 CRITICAL feedback kutilmoqda',
      body: `${criticalCount} ta critical priority feedback ko'rib chiqilmagan. Zararli kontent bloklanmagan bo'lishi mumkin.`,
    });
  }

  if (pendingCount > 10) {
    notify({
      type: 'warning',
      title: '⚠️ Ko\'p pending feedback',
      body: `${pendingCount} ta feedback ko'rib chiqishni kutmoqda. Review queue to'lib ketgan.`,
    });
  }
}

export function requestBrowserNotificationPermission(): void {
  if ('Notification' in window && Notification.permission === 'default') {
    Notification.requestPermission();
  }
}
