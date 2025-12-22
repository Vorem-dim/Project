<?php
    $pdo = new PDO("pgsql:host=localhost;dbname=LearnAndCook", "postgres", "Vorem2829");
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $structureQuery = "select name from cuisines";
        
    $structureStmt = $pdo->prepare($structureQuery);
    $structureStmt->execute();

    $cuisines = $structureStmt->fetchAll(PDO::FETCH_ASSOC);

    $response = $cuisines;

    echo json_encode($response, JSON_UNESCAPED_UNICODE);
?>