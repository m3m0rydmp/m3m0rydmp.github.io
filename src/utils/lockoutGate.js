// Client-side brute-force deterrent for the encrypted "Tricks of the Trade"
// writeup. This is a UX lockout only, not real security: the site is a
// static host, so nothing here survives clearing localStorage or an
// incognito window — the actual protection is the AES-256-GCM/PBKDF2 key.

export const STORAGE_KEY = '__dsh_g';
export const MAX_FAILS = 15;
export const SUSPEND_MS = [24 * 60 * 60 * 1000, 48 * 60 * 60 * 1000];

const DEFAULT_STATE = { v: 1, fails: 0, tier: 0, until: 0 };

function hasLocalStorage() {
  return typeof window !== 'undefined' && !!window.localStorage;
}

/**
 * Reads and decodes the persisted gate record. Missing/corrupt/unavailable
 * storage all fall back to a clean default state.
 * @returns {{v:number, fails:number, tier:number, until:number}}
 */
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

/**
 * Persists a gate state record, base64-obfuscated (not encrypted — just
 * not plaintext-visible in devtools at a glance).
 * @param {{v:number, fails:number, tier:number, until:number}} state
 */
export function saveGateState(state) {
  if (!hasLocalStorage()) return;
  try {
    const payload = { v: 1, fails: state.fails, tier: state.tier, until: state.until };
    window.localStorage.setItem(STORAGE_KEY, window.btoa(JSON.stringify(payload)));
  } catch (error) {
    // localStorage unavailable/full/blocked — fail silently, the panel
    // degrades to "no lockout persisted" rather than crashing.
  }
}

/** Removes the persisted gate record, returning a visitor to a clean slate. */
export function clearGateState() {
  if (!hasLocalStorage()) return;
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    // ignore
  }
}

/**
 * Applies one failed decrypt attempt to a gate state and returns the next
 * state. Pure — does not read or write storage. Callers are expected to
 * only invoke this when the current status is 'open'.
 * @param {{v:number, fails:number, tier:number, until:number}} state
 * @param {number} [now]
 * @returns {{v:number, fails:number, tier:number, until:number}}
 */
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
    // tier === 3 (already banned) is unreachable here since registerFailure
    // is only meant to be called while status is 'open'.
  }

  return next;
}

/**
 * Derives the current visitor-facing status from a gate state.
 * @param {{v:number, fails:number, tier:number, until:number}} state
 * @param {number} [now]
 * @returns {'open'|'suspended'|'banned'}
 */
export function gateStatus(state, now = Date.now()) {
  if (state.tier === 3) return 'banned';
  if (state.until && now < state.until) return 'suspended';
  return 'open';
}
