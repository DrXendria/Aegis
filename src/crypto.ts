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

  // Convert buffer to base64
  const ciphertext = btoa(String.fromCharCode(...new Uint8Array(encryptedBuf)));
  const ivBase64 = btoa(String.fromCharCode(...iv));

  return { ciphertext, iv: ivBase64 };
};

// Decrypt ciphertext using the derived AES-GCM key
export const decryptData = async (ciphertextBase64: string, ivBase64: string, key: CryptoKey): Promise<string> => {
  try {
    const iv = new Uint8Array(atob(ivBase64).split('').map(c => c.charCodeAt(0)));
    const ciphertext = new Uint8Array(atob(ciphertextBase64).split('').map(c => c.charCodeAt(0)));

    const decryptedBuf = await window.crypto.subtle.decrypt(
      {
        name: "AES-GCM",
        iv: iv,
      },
      key,
      ciphertext
    );

    const dec = new TextDecoder();
    return dec.decode(decryptedBuf);
  } catch (error) {
    throw new Error("Invalid password or corrupted data.");
  }
};
