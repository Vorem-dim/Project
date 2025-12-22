<?php
    session_start();

    $pdo = new PDO("pgsql:host=localhost;dbname=LearnAndCook", "postgres", "Vorem2829");
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $structureQuery = "select
        r.id id,
        r.name title,
        r.icon image,
        r.description description,
        r.calories calories,
        r.time time,
        COALESCE(ca.name, 'Без категории') category,
        COALESCE(c.id, 0) cuisine,
        COALESCE(avg(rv.score), 0) rating
    from recipes r
    left join recipe_categories rca on r.id = rca.id_recipe
    left join categories ca on ca.id = rca.id_category
    left join recipe_cuisines rc on r.id = rc.id_recipe
    left join cuisines c on c.id = rc.id_cuisine
    left join reviews rv on r.id = rv.id_recipe
    inner join saved_recipes sr on r.id = sr.id_recipe and sr.id_user = :userID
    group by r.id, title, image, r.description, calories, time, cuisine, category
    order by rating, title, time, r.id";
        
    $structureStmt = $pdo->prepare($structureQuery);
    $structureStmt->execute(['userID' => $_SESSION['user']['id']]);

    $response = $structureStmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode($response, JSON_UNESCAPED_UNICODE);
?>

<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Добавление ФИО</title>
    <link rel="stylesheet" href="Task1/style.css">
</head>
<body>
    <script>
        
    </script>
</body>
</html>