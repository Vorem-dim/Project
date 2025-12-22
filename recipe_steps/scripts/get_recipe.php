<?php
    $pdo = new PDO("pgsql:host=localhost;dbname=LearnAndCook", "postgres", "Vorem2829");
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $recipeID = $_POST['id'] ?? 0;

    $structureQuery = "select
        r.id id,
        r.name title,
        r.icon image,
        r.description description,
        r.calories calories,
        r.time time,
        COALESCE(ca.name, 'Без категории') category,
        COALESCE(c.name, 'Нет кухни') cuisine,
        COALESCE(avg(rv.score), 0) rating
    from recipes r
    left join recipe_categories rca on r.id = rca.id_recipe
    left join categories ca on ca.id = rca.id_category
    left join recipe_cuisines rc on r.id = rc.id_recipe
    left join cuisines c on c.id = rc.id_cuisine
    left join reviews rv on r.id = rv.id_recipe
    where r.id = :recipeID
    group by r.id, title, image, r.description, calories, r.time, category, cuisine";
        
    $structureStmt = $pdo->prepare($structureQuery);
    $structureStmt->execute(['recipeID' =>$recipeID]);

    $recipe = $structureStmt->fetchAll(PDO::FETCH_ASSOC)[0];

    echo json_encode($recipe, JSON_UNESCAPED_UNICODE);
?>