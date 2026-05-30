import { createSignal } from 'solid-js';

const STORAGE_KEY = 'enzo-user-profile';

interface UserProfile {
  username: string;
  savedAt: number;
}

function loadProfile(): UserProfile | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch { /* ignore */ }
  return null;
}

const initial = loadProfile();
const [username, setUsernameSignal] = createSignal(initial?.username ?? '');
const [savedAt, setSavedAt] = createSignal(initial?.savedAt ?? 0);

export function getUsername() { return username(); }
export function getSavedAt() { return savedAt(); }

export function saveProfile(name: string) {
  const now = Date.now();
  setUsernameSignal(name);
  setSavedAt(now);
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ username: name, savedAt: now }));
}

export function clearProfile() {
  setUsernameSignal('');
  setSavedAt(0);
  localStorage.removeItem(STORAGE_KEY);
}
