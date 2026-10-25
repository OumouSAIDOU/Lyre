<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once 'db.php';

$action = $_GET['action'] ?? '';
$method = $_SERVER['REQUEST_METHOD'];
$data = json_decode(file_get_contents("php://input"), true);
$id = $_GET['id'] ?? null;

// ==========================================
// 1. INSCRIPTION
// ==========================================
if ($action === 'register' && $method === 'POST') {
    $name = $data['name'] ?? '';
    $email = $data['email'] ?? '';
    $password = $data['password'] ?? '';

    if (empty($name) || empty($email) || empty($password)) {
        http_response_code(400);
        echo json_encode(["success" => false, "message" => "Tous les champs sont obligatoires."]);
        exit;
    }

    $check = $pdo->prepare("SELECT id FROM users WHERE email = ?");
    $check->execute([$email]);
    if ($check->fetch()) {
        http_response_code(400);
        echo json_encode(["success" => false, "message" => "Cet email est déjà utilisé."]);
        exit;
    }

    $hashedPassword = password_hash($password, PASSWORD_DEFAULT);
    $stmt = $pdo->prepare("INSERT INTO users (username, email, password) VALUES (?, ?, ?)");

    if ($stmt->execute([$name, $email, $hashedPassword])) {
        echo json_encode([
            "success" => true,
            "user" => [
                "id" => $pdo->lastInsertId(),
                "name" => $name,
                "email" => $email,
                "booksReadCount" => 0
            ]
        ]);
    } else {
        http_response_code(500);
        echo json_encode(["success" => false, "message" => "Erreur lors de la création du compte."]);
    }
    exit;
}

// ==========================================
// 2. CONNEXION
// ==========================================
if ($action === 'login' && $method === 'POST') {
    $email = $data['email'] ?? '';
    $password = $data['password'] ?? '';

    if (empty($email) || empty($password)) {
        http_response_code(400);
        echo json_encode(["success" => false, "message" => "Veuillez remplir tous les champs."]);
        exit;
    }

    $stmt = $pdo->prepare("SELECT * FROM users WHERE email = ?");
    $stmt->execute([$email]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($user && ($password === $user['password'] || password_verify($password, $user['password']))) {
        $stmtCount = $pdo->prepare("SELECT COUNT(*) as count FROM user_reads WHERE user_id = ?");
        $stmtCount->execute([$user['id']]);
        $resCount = $stmtCount->fetch(PDO::FETCH_ASSOC);

        echo json_encode([
            "success" => true,
            "user" => [
                "id" => $user['id'],
                "name" => $user['username'] ?? $user['name'] ?? 'Utilisateur',
                "email" => $user['email'],
                "booksReadCount" => $resCount ? (int)$resCount['count'] : 0
            ]
        ]);
    } else {
        http_response_code(401);
        echo json_encode(["success" => false, "message" => "Email ou mot de passe incorrect."]);
    }
    exit;
}

// ==========================================
// 3. GESTION DES LIVRES (BOOKS)
// ==========================================
if ($action === 'books' || $action === '') {
    
    if ($method === 'GET') {
        if ($id) {
            $stmt = $pdo->prepare("SELECT * FROM books WHERE id = ?");
            $stmt->execute([$id]);
            $book = $stmt->fetch(PDO::FETCH_ASSOC);
            if ($book) {
                echo json_encode($book);
            } else {
                http_response_code(404);
                echo json_encode(["error" => "Livre non trouvé"]);
            }
            exit;
        } else {
            $search = $_GET['search'] ?? '';
            $category = $_GET['category'] ?? '';

            $sql = "SELECT id, title, author, isbn, category, published_year, cover_url, description FROM books WHERE 1=1";
            $params = [];

            if (!empty($search)) {
                $sql .= " AND (title LIKE ? OR author LIKE ?)";
                $params[] = "%$search%";
                $params[] = "%$search%";
            }
            if (!empty($category)) {
                $sql .= " AND category = ?";
                $params[] = $category;
            }

            $sql .= " ORDER BY id DESC";
            $stmt = $pdo->prepare($sql);
            $stmt->execute($params);
            echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
            exit;
        }
    }

    if ($method === 'POST') {
        $sql = "INSERT INTO books (title, author, isbn, category, published_year, cover_url, description, content) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
        $stmt = $pdo->prepare($sql);
        
        try {
            $stmt->execute([
                $data['title'] ?? '',
                $data['author'] ?? '',
                $data['isbn'] ?? null,
                $data['category'] ?? null,
                $data['published_year'] ?? null,
                $data['cover_url'] ?? null,
                $data['description'] ?? null,
                $data['content'] ?? null
            ]);
            
            http_response_code(201);
            echo json_encode([
                "id" => $pdo->lastInsertId(), 
                "message" => "Livre ajouté avec succès"
            ]);
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(["error" => "Erreur lors de l'enregistrement : " . $e->getMessage()]);
        }
        exit;
    }

    if ($method === 'DELETE' && $id) {
        $stmt = $pdo->prepare("DELETE FROM books WHERE id = ?");
        $stmt->execute([$id]);
        echo json_encode(["message" => "Livre supprimé avec succès"]);
        exit;
    }
}

// ==========================================
// 4. GESTION DES LECTURES (USER_READS)
// ==========================================
if ($action === 'mark_read' && $method === 'POST') {
    try {
        $userId = $data['user_id'] ?? null;
        $bookId = $data['id'] ?? $data['book_id'] ?? null; // Sécurité sur l'ID du livre

        if (!$userId || !$bookId) {
            http_response_code(400);
            echo json_encode(["success" => false, "message" => "ID utilisateur ou livre manquant."]);
            exit;
        }

        // Vérifier si ce livre n'a pas déjà été marqué comme lu
        $check = $pdo->prepare("SELECT id FROM user_reads WHERE user_id = ? AND book_id = ?");
        $check->execute([$userId, $bookId]);
        
        if (!$check->fetch()) {
            $stmt = $pdo->prepare("INSERT INTO user_reads (user_id, book_id, read_at) VALUES (?, ?, NOW())");
            $stmt->execute([$userId, $bookId]);
        }

        // Renvoyer le nouveau compte total de livres lus
        $stmtCount = $pdo->prepare("SELECT COUNT(*) as count FROM user_reads WHERE user_id = ?");
        $stmtCount->execute([$userId]);
        $resCount = $stmtCount->fetch(PDO::FETCH_ASSOC);

        echo json_encode([
            "success" => true,
            "booksReadCount" => $resCount ? (int)$resCount['count'] : 0
        ]);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(["success" => false, "message" => "Erreur SQL : " . $e->getMessage()]);
    }
    
  exit;
}

// ==========================================
// 5. HISTORIQUE DES LECTURES UTILISATEUR
// ==========================================
if ($action === 'user_history' && $method === 'GET') {
    $userId = $_GET['user_id'] ?? null;

    if (!$userId) {
        http_response_code(400);
        echo json_encode(["success" => false, "message" => "ID utilisateur manquant."]);
        exit;
    }

    $stmt = $pdo->prepare("
        SELECT b.id, b.title, b.author, b.cover_url, b.category, ur.read_at 
        FROM user_reads ur 
        JOIN books b ON ur.book_id = b.id 
        WHERE ur.user_id = ? 
        ORDER BY ur.read_at DESC
    ");
    $stmt->execute([$userId]);
    $history = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        "success" => true,
        "history" => $history
    ]);
    exit;
}

// Route par défaut
http_response_code(404);
echo json_encode(["error" => "Route API non trouvée"]);
?>