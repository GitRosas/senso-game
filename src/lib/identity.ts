'use client';

const ID_KEY = 'senso-player-id';
const NAME_KEY = 'senso-display-name';

/** A stable, anonymous device id (created lazily). */
export function getPlayerId(): string {
  if (typeof window === 'undefined') return 'server';
  let id = window.localStorage.getItem(ID_KEY);
  if (!id) {
    id =
      typeof crypto !== 'undefined' && 'randomUUID' in crypto
        ? crypto.randomUUID()
        : `anon-${Math.random().toString(36).slice(2)}-${Date.now().toString(36)}`;
    window.localStorage.setItem(ID_KEY, id);
  }
  return id;
}

export function getDisplayName(): string {
  if (typeof window === 'undefined') return '';
  return window.localStorage.getItem(NAME_KEY) ?? '';
}

export function setDisplayName(name: string): void {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(NAME_KEY, name.slice(0, 24));
}
