<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

include 'db.php';

$data = json_decode(file_get_contents("php://input"), true);

if (!empty($data['email']) && !empty($data['password'])) {
    $email = $data['email'];
    $password = $data['password'];

    $stmt = $pdo->prepare("SELECT * FROM users WHERE email = ?");
    $stmt->execute([$email]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    // Vérifie le mot de passe (si tu ne hashes pas encore en base, fais une vérification simple $password === $user['password'])
    if ($user && ($password === $user['password'] || password_verify($password, $user['password']))) {
        
        // Compter les livres lus
        $stmtCount = $pdo->prepare("SELECT COUNT(*) as booksReadCount FROM user_reads WHERE user_id = ?");
        $stmtCount->execute([$user['id']]);
        $countResult = $stmtCount->fetch(PDO::FETCH_ASSOC);
        $booksCount = $countResult ? (int)$countResult['booksReadCount'] : 0;

        echo json_encode([
            "success" => true,
            "user" => [
                "id" => $user['id'],
                "name" => $user['name'],
                "email" => $user['email'],
                "booksReadCount" => $booksCount
            ]
        ]);
    } else {
        echo json_encode(["success" => false, "message" => "Email ou mot de passe incorrect."]);
    }
} else {
    echo json_encode(["success" => false, "message" => "Veuillez remplir tous les champs."]);
}
?>