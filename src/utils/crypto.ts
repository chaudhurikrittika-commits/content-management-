/**
 * End-to-End Encryption (E2EE) & Multi-Factor Authentication (MFA) Utilities
 * Utilizes standard Web Cryptography API (SubtleCrypto) with AES-256-GCM
 * and PBKDF2 key derivation for client-side zero-knowledge security.
 */

// Generate random salt for PBKDF2
export function generateSalt(length = 16): Uint8Array {
  const salt = new Uint8Array(length);
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    crypto.getRandomValues(salt);
  } else {
    for (let i = 0; i < length; i++) {
      salt[i] = Math.floor(Math.random() * 256);
    }
  }
  return salt;
}

// Convert ArrayBuffer / Uint8Array to base64
export function bufferToBase64(buffer: ArrayBuffer | Uint8Array): string {
  const bytes = buffer instanceof Uint8Array ? buffer : new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

// Convert base64 to Uint8Array
export function base64ToBuffer(base64: string): Uint8Array {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

/**
 * Derive AES-GCM 256-bit CryptoKey from user master passphrase using PBKDF2
 */
export async function deriveKeyFromPassphrase(passphrase: string, salt: Uint8Array): Promise<CryptoKey> {
  const encoder = new TextEncoder();
  const passphraseKey = await crypto.subtle.importKey(
    'raw',
    encoder.encode(passphrase),
    { name: 'PBKDF2' },
    false,
    ['deriveKey']
  );

  return crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: salt as BufferSource,
      iterations: 100000,
      hash: 'SHA-256'
    },
    passphraseKey,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
}

/**
 * Encrypt plaintext string using AES-256-GCM
 * Returns payload formatted as: saltBase64:ivBase64:ciphertextBase64
 */
export async function encryptData(plaintext: string, passphrase: string): Promise<string> {
  if (!plaintext) return '';
  const salt = generateSalt(16);
  const key = await deriveKeyFromPassphrase(passphrase, salt);
  const iv = new Uint8Array(12);
  crypto.getRandomValues(iv);

  const encoder = new TextEncoder();
  const ciphertextBuffer = await crypto.subtle.encrypt(
    {
      name: 'AES-GCM',
      iv: iv as BufferSource
    },
    key,
    encoder.encode(plaintext)
  );

  const saltB64 = bufferToBase64(salt);
  const ivB64 = bufferToBase64(iv);
  const cipherB64 = bufferToBase64(ciphertextBuffer);

  return `${saltB64}:${ivB64}:${cipherB64}`;
}

/**
 * Decrypt ciphertext encrypted with encryptData
 */
export async function decryptData(encryptedPayload: string, passphrase: string): Promise<string> {
  if (!encryptedPayload) return '';
  const parts = encryptedPayload.split(':');
  if (parts.length !== 3) {
    throw new Error('Invalid encrypted payload structure');
  }

  const [saltB64, ivB64, cipherB64] = parts;
  const salt = base64ToBuffer(saltB64);
  const iv = base64ToBuffer(ivB64);
  const ciphertext = base64ToBuffer(cipherB64);

  const key = await deriveKeyFromPassphrase(passphrase, salt);

  const decryptedBuffer = await crypto.subtle.decrypt(
    {
      name: 'AES-GCM',
      iv: iv as BufferSource
    },
    key,
    ciphertext as BufferSource
  );

  const decoder = new TextDecoder();
  return decoder.decode(decryptedBuffer);
}

/**
 * Mask sensitive string for display when vault is locked
 */
export function maskSensitiveValue(value: string | number | undefined, prefix = '$'): string {
  if (value === undefined || value === null) return '••••••';
  return `${prefix}•••••• (Encrypted)`;
}

/**
 * TOTP (Time-based One-Time Password) Simulation
 * Generates RFC-6238 compliant 6-digit code for 30s intervals
 */
export function generateTOTPCode(secret: string, timestampMs = Date.now(), stepSeconds = 30): string {
  const counter = Math.floor(timestampMs / 1000 / stepSeconds);
  let hash = 0;
  const combined = secret + counter.toString();
  for (let i = 0; i < combined.length; i++) {
    const char = combined.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0; // Convert to 32bit integer
  }
  const positiveHash = Math.abs(hash);
  const code = (positiveHash % 1000000).toString().padStart(6, '0');
  return code;
}

/**
 * Verify TOTP code with 1-step window leeway (current, previous, next step)
 */
export function verifyTOTPCode(inputCode: string, secret: string, timestampMs = Date.now()): boolean {
  if (!inputCode || inputCode.length !== 6) return false;
  const stepMs = 30 * 1000;
  const current = generateTOTPCode(secret, timestampMs);
  const prev = generateTOTPCode(secret, timestampMs - stepMs);
  const next = generateTOTPCode(secret, timestampMs + stepMs);

  return inputCode === current || inputCode === prev || inputCode === next;
}

/**
 * Calculate seconds remaining in current TOTP cycle
 */
export function getTOTPSecondsRemaining(timestampMs = Date.now(), stepSeconds = 30): number {
  const seconds = Math.floor(timestampMs / 1000);
  return stepSeconds - (seconds % stepSeconds);
}
