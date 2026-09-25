export type Session = {
  phone: string;
  step: number;
  zoneId?: string;
  farmerName?: string;
  nationalId?: string;
  createdAt: number;
};

const globalStore = globalThis as unknown as { sessions: Map<string, Session> };
if (!globalStore.sessions) globalStore.sessions = new Map();

export function getSession(phone: string): Session {
  const existing = globalStore.sessions.get(phone);
  if (existing && Date.now() - existing.createdAt < 5 * 60 * 1000) return existing;
  const fresh: Session = { phone, step: 0, createdAt: Date.now() };
  globalStore.sessions.set(phone, fresh);
  return fresh;
}

export function saveSession(session: Session) {
  session.createdAt = Date.now();
  globalStore.sessions.set(session.phone, session);
}

export function clearSession(phone: string) {
  globalStore.sessions.delete(phone);
}
