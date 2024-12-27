<?php

require_once 'crypto/Encryption.php';

use Crypto\Encryption;

header('Content-Type: application/json');

try {
    $data = json_decode(file_get_contents('php://input'), true);
    $action = $_GET['action'] ?? '';
    $text = $data['text'] ?? '';
    $password = $data['password'] ?? '';

    if (empty($text) || empty($password)) {
        throw new Exception('Both text and password are required');
    }

    switch ($action) {
        case 'encrypt':
            $result = Encryption::encrypt($text, $password);
            break;
        case 'decrypt':
            $result = Encryption::decrypt($text, $password);
            break;
        default:
            throw new Exception('Invalid action');
            break;
    }

    echo json_encode([
        'success' => true,
        'result' => $result
    ]);
} catch (Exception $e) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}