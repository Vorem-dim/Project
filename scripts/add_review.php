<?php
    $pdo = new PDO("pgsql:host=localhost;dbname=LearnAndCook", "postgres", "Vorem2829");
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $userID = $_POST['userID'] ?? '';
    $recipeID = $_POST['recipeID'] ?? '';
    $rating = $_POST['rating'] ?? '';
    $comment = $_POST['comment'] ?? '';

    $structureQuery = "select COALESCE(max(id), 0) id from reviews";
    
    $structureStmt = $pdo->prepare($structureQuery);
    $structureStmt->execute();

    $reviewID = $structureStmt->fetchAll(PDO::FETCH_ASSOC)[0]['id'] + 1;
    
    $structureQuery = "insert into reviews(id, score, comment, id_recipe, id_user) values(:id, :score, :comment, :recipeID, :userID)";
        
    $structureStmt = $pdo->prepare($structureQuery);
    $structureStmt->execute([
        ':id' => $reviewID,
        ':score' => $rating,
        ':comment' => $comment,
        ':recipeID' => $recipeID,
        ':userID' => $userID
    ]);

    $response = [
        'result' => $structureStmt->rowCount() > 0
    ];

    echo json_encode($response, JSON_UNESCAPED_UNICODE);
?>