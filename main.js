const API_URL = 'http://localhost:3000/api';

// Get button elements
const encryptButton = document.querySelector('#encryptForm button');
const decryptButton = document.querySelector('#decryptForm button');

// Encrypt button click handler
encryptButton.addEventListener('click', async () => {
    const text = document.getElementById('textToEncrypt').value;
    const key = document.getElementById('encryptKey').value;
    
    if (!text || !key) {
        alert('Please fill in both text and key fields');
        return;
    }
    
    try {
        const response = await fetch(`${API_URL}/encrypt`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ text, key })
        });
        
        const data = await response.json();
        if (data.success) {
            document.getElementById('encryptedResult').value = data.result;
        } else {
            alert('Encryption failed: ' + data.error);
        }
    } catch (error) {
        alert('Error during encryption: ' + error.message);
    }
});

// Decrypt button click handler
decryptButton.addEventListener('click', async () => {
    const text = document.getElementById('textToDecrypt').value;
    const key = document.getElementById('decryptKey').value;
    
    if (!text || !key) {
        alert('Please fill in both text and key fields');
        return;
    }
    
    try {
        const response = await fetch(`${API_URL}/decrypt`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ text, key })
        });
        
        const data = await response.json();
        if (data.success) {
            document.getElementById('decryptedResult').value = data.result;
        } else {
            alert('Decryption failed: ' + data.error);
        }
    } catch (error) {
        alert('Error during decryption: ' + error.message);
    }
});