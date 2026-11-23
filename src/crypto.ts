// Zero-Knowledge Architecture Cryptography Core
// Using Web Crypto API for high performance and native security without external dependencies.

// Utility to generate a random initialization vector
export const generateIV = () => window.crypto.getRandomValues(new Uint8Array(12));

// Utility to generate a salt for PBKDF2
export const generateSalt = () => window.crypto.getRandomValues(new Uint8Array(16));

// Derive an AES-GCM key from the master password using PBKDF2
export const deriveKeyFromMasterPassword = async (password: string, salt: Uint8Array): Promise<CryptoKey> => {
  const enc = new TextEncoder();
  const keyMaterial = await window.crypto.subtle.importKey(
    "raw",
    enc.encode(password),
    { name: "PBKDF2" },
    false,
    ["deriveBits", "deriveKey"]
  );

  return window.crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: salt as BufferSource,
      iterations: 600000, // OWASP recommended minimum for high security
      hash: "SHA-256",
    },
    keyMaterial,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"]
  );
};

const bytesToBase64 = (bytes: Uint8Array): string => {
  let binary = "";
  const chunkSize = 0x8000;
  for (let i = 0; i < bytes.length; i += chunkSize) {
    const chunk = bytes.subarray(i, i + chunkSize);
    binary += String.fromCharCode(...chunk);
  }
  return btoa(binary);
};

const base64ToBytes = (base64: string): Uint8Array => {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
};

// Encrypt plaintext using the derived AES-GCM key
export const encryptData = async (plaintext: string, key: CryptoKey): Promise<{ ciphertext: string, iv: string }> => {
  const iv = generateIV();
  const enc = new TextEncoder();
  const encryptedBuf = await window.crypto.subtle.encrypt(
    {
      name: "AES-GCM",
      iv: iv,
    },
    key,
    enc.encode(plaintext)
  );

  // Convert buffer to base64 safely (chunked to avoid call stack overflow on large payloads)
  const ciphertext = bytesToBase64(new Uint8Array(encryptedBuf));
  const ivBase64 = bytesToBase64(iv);

  return { ciphertext, iv: ivBase64 };
};

// Decrypt ciphertext using the derived AES-GCM key
export const decryptData = async (ciphertextBase64: string, ivBase64: string, key: CryptoKey): Promise<string> => {
  try {
    const iv = base64ToBytes(ivBase64);
    const ciphertext = base64ToBytes(ciphertextBase64);

    const decryptedBuf = await window.crypto.subtle.decrypt(
      {
        name: "AES-GCM",
        iv: iv as BufferSource,
      },
      key,
      ciphertext as BufferSource
    );

    const dec = new TextDecoder();
    return dec.decode(decryptedBuf);
  } catch (error) {
    throw new Error("Invalid password or corrupted data.");
  }
};
