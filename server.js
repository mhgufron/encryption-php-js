import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import crypto from 'crypto';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('dist'));

// Utility functions for encryption/decryption
function deriveKey(password, salt) {
    return crypto.pbkdf2Sync(password, salt, 100000, 32, 'sha256');
}

// Encryption endpoint
app.post('/api/encrypt', (req, res) => {
    try {
        const { text, key } = req.body;

        // Generate random IV and salt
        const iv = crypto.randomBytes(16);
        const salt = crypto.randomBytes(16);

        // Derive key using PBKDF2
        const derivedKey = deriveKey(key, salt);

        // Create cipher
        const cipher = crypto.createCipheriv('aes-256-cbc', derivedKey, iv);

        // Encrypt the text
        let encrypted = cipher.update(text, 'utf8');
        encrypted = Buffer.concat([encrypted, cipher.final()]);

        // Combine IV, salt, and encrypted data
        const result = Buffer.concat([iv, salt, encrypted]);

        // Convert to base64
        const base64Result = result.toString('base64');

        res.json({ success: true, result: base64Result });
    } catch (error) {
        console.error('Encryption error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Decryption endpoint
app.post('/api/decrypt', (req, res) => {
    try {
        const { text, key } = req.body;

        // Convert base64 to buffer
        const encryptedData = Buffer.from(text, 'base64');

        // Extract IV, salt, and encrypted content
        const iv = encryptedData.slice(0, 16);
        const salt = encryptedData.slice(16, 32);
        const encryptedContent = encryptedData.slice(32);

        // Derive key using PBKDF2
        const derivedKey = deriveKey(key, salt);

        // Create decipher
        const decipher = crypto.createDecipheriv('aes-256-cbc', derivedKey, iv);

        // Decrypt the content
        let decrypted = decipher.update(encryptedContent);
        decrypted = Buffer.concat([decrypted, decipher.final()]);

        // Convert to string
        const result = decrypted.toString('utf8');

        res.json({ success: true, result });
    } catch (error) {
        console.error('Decryption error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Serve the main application
app.get('/', (req, res) => {
    res.sendFile(join(__dirname, 'dist', 'index.html'));
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});