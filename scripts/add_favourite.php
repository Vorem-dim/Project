<?php
    $pdo = new PDO("pgsql:host=localhost;dbname=LearnAndCook", "postgres", "Vorem2829");
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $userID = $_POST['userID'] ?? '';
    $recipeID = $_POST['recipeID'] ?? '';

    if ($userID == '' or $recipeID == '') {
        $response = [
            'result' => false,
            'comment' => 'Bad params'
        ];

        echo json_encode($response, JSON_UNESCAPED_UNICODE);

        return;
    }
    
    $structureQuery = "insert into saved_recipes(id_recipe, id_user) values(:recipeID, :userID)";
        
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