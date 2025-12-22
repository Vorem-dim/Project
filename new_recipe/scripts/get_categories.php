<?php
    $pdo = new PDO("pgsql:host=localhost;dbname=LearnAndCook", "postgres", "Vorem2829");
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $structureQuery = "select name from categories";
        
    $structureStmt = $pdo->prepare($structureQuery);
    $structureStmt->execute();

    $categories = $structureStmt->fetchAll(PDO::FETCH_ASSOC);

    $response = $categories;

    echo json_encode($response, JSON_UNESCAPED_UNICODE);
?>