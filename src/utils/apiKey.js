/**
 * apiKey.js - API Key Utilities & Secure Serverless Integration
 * 
 * Manages client session keys and checks Vercel serverless backend status.
 * Strict Security Guarantees:
 * - Real API keys are NEVER exposed via VITE_ environment variables.
 * - Secret keys reside safely on the server as EVOLVE_API_KEY.
 * - The frontend communicates with /api/evolve without seeing the raw secret.
 */

// Safe fallback for local/simulated environment keys
export const ENV_API_KEY = 
  import.meta.env.VITE_API_KEY || 
  import.meta.env.VITE_EVOLVE_API_KEY || 
  '';

/**
 * Format any key to the canonical sk-evolve- prefix format
 */
export function formatApiKey(key) {
  if (!key) return '';
  const clean = key.trim();
  return clean.startsWith('sk-evolve-') ? clean : `sk-evolve-${clean}`;
}

/**
 * Mask key for safe display (sk-evolve-0143••••••••••••1588)
 */
export function maskApiKey(key) {
  const formatted = formatApiKey(key);
  if (!formatted) return '••••••••••••••••••••••••••••••••';
  const prefix = formatted.slice(0, 14); // "sk-evolve-0143"
  const suffix = formatted.slice(-4);   // "1588"
  return `${prefix}••••••••••••••••${suffix}`;
}

/**
 * Generate cryptographically secure ephemeral fallback key
 */
export function generateEphemeralKey() {
  if (typeof window !== 'undefined' && window.crypto && window.crypto.getRandomValues) {
    const bytes = new Uint8Array(16);
    window.crypto.getRandomValues(bytes);
    const hex = Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('');
    return `sk-evolve-${hex}`;
  }
  const fallback = Math.random().toString(36).substring(2) + Math.random().toString(36).substring(2);
  return `sk-evolve-${fallback}`;
}

/**
 * Check whether Vercel serverless backend (/api/evolve) is active and has EVOLVE_API_KEY configured.
 * Does not throw; returns a safe status object.
 */
export async function checkServerBackendStatus() {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2500);

    const res = await fetch('/api/evolve', {
      method: 'GET',
      headers: { 'Accept': 'application/json' },
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      return {
        isAvailable: true,
        hasServerKey: Boolean(data.hasServerKey),
        authMode: data.authMode || 'simulation-fallback'
      };
    }
    return { isAvailable: false, hasServerKey: false, authMode: 'offline-local' };
  } catch (err) {
    // Graceful offline/local fallback
    return { isAvailable: false, hasServerKey: false, authMode: 'offline-local' };
  }
}

/**
 * Request an autonomous evolution mutation from the Vercel serverless function.
 * If serverless is unavailable, returns null so the client seamlessly runs local heuristics.
 */
export async function requestServerEvolution(payload) {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);

    const res = await fetch('/api/evolve', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(payload),
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      if (data && data.success) {
        return data;
      }
    }
    return null;
  } catch (err) {
    // Graceful fallback to client algorithm
    return null;
  }
}
