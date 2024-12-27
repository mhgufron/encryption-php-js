<?php
namespace Crypto;

class KeyDerivation {
    private const ITERATIONS = 100000;
    private const HASH_ALGO = "sha256";
    private const KEY_LENGTH = 32;

    public static function deriveKey(string $password, string $salt): string {
        return hash_pbkdf2(
            self::HASH_ALGO,
            $password,
            $salt,
            self::ITERATIONS,
            self::KEY_LENGTH,
            true
        );
    }
}