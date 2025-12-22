<?php
    session_start();

    $pdo = new PDO("pgsql:host=localhost;dbname=LearnAndCook", "postgres", "Vorem2829");
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $structureQuery = "select id, first_name, last_name, birthday, email, role, icon from users where id = :id";
        
    $structureStmt = $pdo->prepare($structureQuery);
    $structureStmt->execute([":id" => $_SESSION['user']['id']]);

    $users = $structureStmt->fetchAll(PDO::FETCH_ASSOC);

    $response = $users[0];

    echo json_encode($response, JSON_UNESCAPED_UNICODE);
?>