<?php
namespace Crypto;

require_once 'KeyDerivation.php';

class Encryption {
    public static function encrypt(string $plaintext, string $password): string {
        try {
            $iv = random_bytes(16);
            $salt = random_bytes(16);
            
            $key = KeyDerivation::deriveKey($password, $salt);
            
            $encrypted = openssl_encrypt(
                $plaintext,
                'aes-256-cbc',
                $key,
                OPENSSL_RAW_DATA,
                $iv
            );

            // Combine IV, salt, and encrypted data
            $combined = $iv . $salt . $encrypted;
            
            return base64_encode($combined);
        } catch (\Exception $e) {
            throw new \Exception('Encryption failed: ' . $e->getMessage());
        }
    }

    public static function decrypt(string $encryptedData, string $password): string {
        try {
            $binaryData = base64_decode($encryptedData);
            
            $iv = substr($binaryData, 0, 16);
            $salt = substr($binaryData, 16, 16);
            $ciphertext = substr($binaryData, 32);
            
            $key = KeyDerivation::deriveKey($password, $salt);
            
            $decrypted = openssl_decrypt(
                $ciphertext,
                'aes-256-cbc',
                $key,
                OPENSSL_RAW_DATA,
                $iv
            );
            
            if ($decrypted === false) {
                throw new \Exception('Decryption failed');
            }
            
            return $decrypted;
        } catch (\Exception $e) {
            throw new \Exception('Decryption failed: ' . $e->getMessage());
        }
    }
}