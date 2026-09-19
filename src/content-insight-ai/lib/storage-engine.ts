const DB_NAME = 'content_insight_ai';
const DB_VERSION = 2;

const STORES = [
  'feedback_reports',
  'chat_messages',
  'learning_entries',
  'training_dataset',
  'trained_models',
  'knowledge_nodes',
  'knowledge_edges',
  'content_fingerprints',
  'notifications',
  'user_sessions',
  'evaluation_queue',
] as const;

type StoreName = (typeof STORES)[number];

let dbInstance: IDBDatabase | null = null;

function openDB(): Promise<IDBDatabase> {
  if (dbInstance) return Promise.resolve(dbInstance);

  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);

    req.onupgradeneeded = () => {
      const db = req.result;
      for (const name of STORES) {
        if (!db.objectStoreNames.contains(name)) {
          const store = db.createObjectStore(name, { keyPath: 'id' });
          store.createIndex('created_at', 'created_at', { unique: false });
          if (name === 'feedback_reports') {
            store.createIndex('status', 'status', { unique: false });
            store.createIndex('type', 'type', { unique: false });
            store.createIndex('content_type', 'content_type', { unique: false });
          }
          if (name === 'knowledge_edges') {
            store.createIndex('from', 'from', { unique: false });
            store.createIndex('to', 'to', { unique: false });
          }
          if (name === 'content_fingerprints') {
            store.createIndex('fingerprint', 'fingerprint', { unique: false });
          }
          if (name === 'notifications') {
            store.createIndex('read', 'read', { unique: false });
          }
          if (name === 'evaluation_queue') {
            store.createIndex('priority', 'priority', { unique: false });
          }
        }
      }
    };

    req.onsuccess = () => {
      dbInstance = req.result;
      resolve(dbInstance);
    };

    req.onerror = () => reject(req.error);
  });
}

export async function dbPut<T extends { id: string }>(store: StoreName, item: T): Promise<T> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(store, 'readwrite');
    tx.objectStore(store).put(item);
    tx.oncomplete = () => resolve(item);
    tx.onerror = () => reject(tx.error);
  });
}

export async function dbGet<T>(store: StoreName, id: string): Promise<T | undefined> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(store, 'readonly');
    const req = tx.objectStore(store).get(id);
    req.onsuccess = () => resolve(req.result as T | undefined);
    req.onerror = () => reject(req.error);
  });
}

export async function dbGetAll<T>(store: StoreName): Promise<T[]> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(store, 'readonly');
    const req = tx.objectStore(store).getAll();
    req.onsuccess = () => resolve(req.result as T[]);
    req.onerror = () => reject(req.error);
  });
}

export async function dbDelete(store: StoreName, id: string): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(store, 'readwrite');
    tx.objectStore(store).delete(id);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

export async function dbGetByIndex<T>(store: StoreName, indexName: string, value: IDBValidKey): Promise<T[]> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(store, 'readonly');
    const idx = tx.objectStore(store).index(indexName);
    const req = idx.getAll(value);
    req.onsuccess = () => resolve(req.result as T[]);
    req.onerror = () => reject(req.error);
  });
}

export async function dbClear(store: StoreName): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(store, 'readwrite');
    tx.objectStore(store).clear();
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

export async function dbCount(store: StoreName): Promise<number> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(store, 'readonly');
    const req = tx.objectStore(store).count();
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

// localStorage fallback for sync operations (UI state)
export function syncGet<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(`cia_${key}`);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

export function syncSet<T>(key: string, value: T): void {
  localStorage.setItem(`cia_${key}`, JSON.stringify(value));
}
