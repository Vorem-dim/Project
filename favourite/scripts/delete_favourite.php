<?php
    session_start();

    $pdo = new PDO("pgsql:host=localhost;dbname=LearnAndCook", "postgres", "Vorem2829");
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $userID = $_SESSION['user']['id'];
    $recipeID = $_POST['recipeID'] ?? '';

    if ($userID == '' or $recipeID == '') {
        $response = [
            'result' => false,
            'comment' => 'Bad params'
        ];

        echo json_encode($response, JSON_UNESCAPED_UNICODE);

        return;
    }

    $structureQuery = "delete from saved_recipes where id_user = :userID and id_recipe = :recipeID";
        
    $structureStmt = $pdo->prepare($structureQuery);
    $structureStmt->execute([
        ':userID' => $userID,
        ':recipeID' => $recipeID
    ]);
    
    $response = [
        'result' => $structureStmt->rowCount() > 0
    ];

    echo json_encode($response, JSON_UNESCAPED_UNICODE);
?>