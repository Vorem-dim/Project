<?php
    $pdo = new PDO("pgsql:host=localhost;dbname=LearnAndCook", "postgres", "Vorem2829");
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $structureQuery = "select 0 id, 'Все' name, 'Рецепты со всех кухонь мира' description, 'https://i.pinimg.com/736x/4e/87/59/4e875913657997b1d32209a059fd2c7c.jpg' icon 
    union select id, name, description, icon from cuisines
    order by id";
        
    $structureStmt = $pdo->prepare($structureQuery);
    $structureStmt->execute();

    $cuisines = $structureStmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode($cuisines, JSON_UNESCAPED_UNICODE);
?>