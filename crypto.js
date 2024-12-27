async function getKeyMaterial(password) {
  const encoder = new TextEncoder();
  return await crypto.subtle.importKey(
    "raw",
    encoder.encode(password),
    { name: "PBKDF2" },
    false,
    ["deriveBits", "deriveKey"]
  );
}

async function getKey(keyMaterial, salt) {
  return await crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: salt,
      iterations: 100000,
      hash: "SHA-256"
    },
    keyMaterial,
    { name: "AES-CBC", length: 256 },
    true,
    ["encrypt", "decrypt"]
  );
}

export async function encrypt(plaintext, password) {
  try {
    const encoder = new TextEncoder();
    const keyMaterial = await getKeyMaterial(password);
    const iv = crypto.getRandomValues(new Uint8Array(16));
    const salt = crypto.getRandomValues(new Uint8Array(16));
    const key = await getKey(keyMaterial, salt);

    const encrypted = await crypto.subtle.encrypt(
      { name: "AES-CBC", iv },
      key,
      encoder.encode(plaintext)
    );

    // Combine IV, salt, and encrypted data
    const result = new Uint8Array([
      ...iv,
      ...salt,
      ...new Uint8Array(encrypted)
    ]);

    return btoa(String.fromCharCode(...result));
  } catch (error) {
    console.error('Encryption error:', error);
    throw error;
  }
}

export async function decrypt(encryptedData, password) {
  try {
    const decoder = new TextDecoder();
    const binaryData = new Uint8Array(
      atob(encryptedData)
        .split('')
        .map(char => char.charCodeAt(0))
    );

    const iv = binaryData.slice(0, 16);
    const salt = binaryData.slice(16, 32);
    const data = binaryData.slice(32);

    const keyMaterial = await getKeyMaterial(password);
    const key = await getKey(keyMaterial, salt);

    const decrypted = await crypto.subtle.decrypt(
      { name: "AES-CBC", iv },
      key,
      data
    );

    return decoder.decode(decrypted);
  } catch (error) {
    console.error('Decryption error:', error);
    throw error;
  }
}