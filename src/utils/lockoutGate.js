// Attempt lockout for the gated writeup.

export const STORAGE_KEY = '__dsh_g';
export const MAX_FAILS = 15;
export const SUSPEND_MS = [24 * 60 * 60 * 1000, 48 * 60 * 60 * 1000];

const DEFAULT_STATE = { v: 1, fails: 0, tier: 0, until: 0 };

function hasLocalStorage() {
  return typeof window !== 'undefined' && !!window.localStorage;
}

export function loadGateState() {
  if (!hasLocalStorage()) return { ...DEFAULT_STATE };
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...DEFAULT_STATE };
    const parsed = JSON.parse(window.atob(raw));
    if (!parsed || typeof parsed !== 'object') return { ...DEFAULT_STATE };
    return {
      v: 1,
      fails: Number(parsed.fails) || 0,
      tier: Number(parsed.tier) || 0,
      until: Number(parsed.until) || 0
    };
  } catch (error) {
    return { ...DEFAULT_STATE };
  }
}

export function saveGateState(state) {
  if (!hasLocalStorage()) return;
  try {
    const payload = { v: 1, fails: state.fails, tier: state.tier, until: state.until };
    window.localStorage.setItem(STORAGE_KEY, window.btoa(JSON.stringify(payload)));
  } catch (error) {
    // Storage unavailable — degrade quietly.
  }
}

export function clearGateState() {
  if (!hasLocalStorage()) return;
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    // ignore
  }
}

// Pure: applies one failed attempt and returns the next state.
export function registerFailure(state, now = Date.now()) {
  const next = { v: 1, fails: state.fails + 1, tier: state.tier, until: state.until };

  if (next.fails >= MAX_FAILS) {
    if (state.tier === 0) {
      next.tier = 1;
      next.until = now + SUSPEND_MS[0];
      next.fails = 0;
    } else if (state.tier === 1) {
      next.tier = 2;
      next.until = now + SUSPEND_MS[1];
      next.fails = 0;
    } else if (state.tier === 2) {
      next.tier = 3;
      next.until = 0;
      next.fails = 0;
    }
  }

  return next;
}

export function gateStatus(state, now = Date.now()) {
  if (state.tier === 3) return 'banned';
  if (state.until && now < state.until) return 'suspended';
  return 'open';
}
