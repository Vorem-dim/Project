<?php
    $pdo = new PDO("pgsql:host=localhost;dbname=LearnAndCook", "postgres", "Vorem2829");
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $recipeID = $_POST['id'] ?? 0;

    $structureQuery = "select
        i.id id,
        i.name name,
        i.icon image,
        ri.count quantity,
        ri.unit unit
    from ingredients i
    inner join recipe_ingredients ri on i.id = ri.id_ingredient and ri.id_recipe = :recipeID
    order by i.id";
        
    $structureStmt = $pdo->prepare($structureQuery);
    $structureStmt->execute(['recipeID' =>$recipeID]);

    $ingredient = $structureStmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode($ingredient, JSON_UNESCAPED_UNICODE);
?>