<?php
    $pdo = new PDO("pgsql:host=localhost;dbname=LearnAndCook", "postgres", "Vorem2829");
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $structureQuery = "select
        c.id id,
        c.name name,
        c.description description,
        c.icon image
    from categories c";
        
    $structureStmt = $pdo->prepare($structureQuery);
    $structureStmt->execute();

    $response = $structureStmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode($response, JSON_UNESCAPED_UNICODE);
?>