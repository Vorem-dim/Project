<?php
    $pdo = new PDO("pgsql:host=localhost;dbname=LearnAndCook", "postgres", "Vorem2829");
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $recipeID = $_POST['id'] ?? 0;

    $structureQuery = "select
        s.id id,
        s.description description
    from steps s where s.id_recipe = :recipeID order by s.id";
        
    $structureStmt = $pdo->prepare($structureQuery);
    $structureStmt->execute(['recipeID' =>$recipeID]);

    $steps = $structureStmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode($steps, JSON_UNESCAPED_UNICODE);
?>