<?php
    session_start();

    $pdo = new PDO("pgsql:host=localhost;dbname=LearnAndCook", "postgres", "Vorem2829");
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $login = $_POST['login'] ?? '';
    $password = $_POST['password'] ?? '';

    $structureQuery = "select id, role from users where email = :login and password = :password";
        
    $structureStmt = $pdo->prepare($structureQuery);
    $structureStmt->execute([
        ':login' => $login,
        ':password' => $password
    ]);
    
    $response = [
        'status' => 'success',
        'authorization' => $structureStmt->rowCount() > 0,
    ];

    if ($response['authorization']) {
        $user = $structureStmt->fetchAll(PDO::FETCH_ASSOC)[0];

        $_SESSION['user']['id'] = $user['id'];
        $_SESSION['user']['role'] = $user['role'];
        $_SESSION['user']['authorized'] = true;

        $response['user'] = $user['id'];
    }

    echo json_encode($response, JSON_UNESCAPED_UNICODE);
?>