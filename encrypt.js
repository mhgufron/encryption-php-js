import { encrypt, decrypt } from './crypto.js';

const encryptBtn = document.getElementById('encryptBtn');
const decryptBtn = document.getElementById('decryptBtn');
const textInput = document.getElementById('text');
const passwordInput = document.getElementById('password');
const resultOutput = document.getElementById('result');

encryptBtn.addEventListener('click', async () => {
  try {
    const text = textInput.value;
    const password = passwordInput.value;
    
    if (!text || !password) {
      alert('Please enter both text and password');
      return;
    }

    const encrypted = await encrypt(text, password);
    resultOutput.value = encrypted;
  } catch (error) {
    alert('Encryption failed: ' + error.message);
  }
});

decryptBtn.addEventListener('click', async () => {
  try {
    const text = textInput.value;
    const password = passwordInput.value;
    
    if (!text || !password) {
      alert('Please enter both text and password');
      return;
    }

    const decrypted = await decrypt(text, password);
    resultOutput.value = decrypted;
  } catch (error) {
    alert('Decryption failed: ' + error.message);
  }
});
