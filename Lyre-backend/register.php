<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

include 'db.php';

$data = json_decode(file_get_contents("php://input"), true);

if (!empty($data['name']) && !empty($data['email']) && !empty($data['password'])) {
    // Vérifier si l'email existe déjà
    $check = $pdo->prepare("SELECT id FROM users WHERE email = ?");
    $check->execute([$data['email']]);
    if ($check->fetch()) {
        echo json_encode(["success" => false, "message" => "Cet email est déjà utilisé."]);
        exit;
    }

    $hashPassword = password_hash($data['password'], PASSWORD_DEFAULT);
    
    $stmt = $pdo->prepare("INSERT INTO users (name, email, password) VALUES (?, ?, ?)");
    if ($stmt->execute([$data['name'], $data['email'], $hashPassword])) {
        $newId = $pdo->lastInsertId();
        echo json_encode([
            "success" => true,
            "user" => [
                "id" => $newId,
                "name" => $data['name'],
                "email" => $data['email'],
                "booksReadCount" => 0
            ]
        ]);
    } else {
        echo json_encode(["success" => false, "message" => "Erreur lors de la création du compte."]);
    }
} else {
    echo json_encode(["success" => false, "message" => "Champs manquants."]);
}
?>