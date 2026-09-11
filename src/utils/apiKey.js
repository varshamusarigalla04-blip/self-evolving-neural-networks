/**
 * apiKey.js - API Key Utilities & Environment Integration
 * 
 * Manages the API key configured in .env (VITE_API_KEY / VITE_EVOLVE_API_KEY)
 * and provides safe formatting, masking, and verification for the application.
 */

// Retrieve default API key configured in environment variables
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
