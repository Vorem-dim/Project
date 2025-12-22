<?php
    $pdo = new PDO("pgsql:host=localhost;dbname=LearnAndCook", "postgres", "Vorem2829");
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $recipeName = $_POST['recipeName'] ?? '';
    $recipeImage = $_POST['recipeImage']?? '';
    $recipeCalories = $_POST['recipeCalories'] ?? 0;
    $recipeTime = $_POST['recipeTime'] ?? 0;
    $recipeDescription = $_POST['recipeDescription'] ?? '';
    $cuisineName = $_POST['cuisineName'] ?? '';
    $cuisineImage = $_POST['cuisineImage'] ?? '';
    $cuisineDescription = $_POST['cuisineDescription'] ?? '';
    $isNewCuisine = boolval($_POST['isNewCuisine']) ?? false;
    $categoryName = $_POST['categoryName'] ?? '';
    $categoryDescription = $_POST['categoryDescription'] ?? '';
    $isNewCategory = boolval($_POST['isNewCategory']) ?? false;
    $steps = json_decode($_POST['steps'], true) ?? [];
    $ingredients = json_decode($_POST['ingredients'], true) ?? [];

    $structureQuery = "select COALESCE(max(id), 0) + 1 id from recipes";

    $structureStmt = $pdo->prepare($structureQuery);
    $structureStmt->execute();

    $recipeID = $structureStmt->fetchAll(PDO::FETCH_ASSOC)[0]['id'];

    if ($isNewCuisine) {
        $structureQuery = "select COALESCE(max(id), 0) + 1 id from cuisines";

        $structureStmt = $pdo->prepare($structureQuery);
        $structureStmt->execute();
    } else {
        $structureQuery = "select id from cuisines where name = :cuisineName";

        $structureStmt = $pdo->prepare($structureQuery);
        $structureStmt->execute(['cuisineName' => $cuisineName]);
    }

    $cuisineID = $structureStmt->fetchAll(PDO::FETCH_ASSOC)[0]['id'];

    if ($isNewCategory) {
        $structureQuery = "select COALESCE(max(id), 0) + 1 id from categories";

        $structureStmt = $pdo->prepare($structureQuery);
        $structureStmt->execute();
    } else {
        $structureQuery = "select id from categories where name = :categoryName";

        $structureStmt = $pdo->prepare($structureQuery);
        $structureStmt->execute(['categoryName' => $categoryName]);  
    }

    $categoryID = $structureStmt->fetchAll(PDO::FETCH_ASSOC)[0]['id'];

    $structureQuery = "insert into recipes(id, name, icon, description, calories, time)
        values(:recipeID, :recipeName, :recipeImage, :recipeDescription, :recipeCalories, :recipeTime)";
        
    $structureStmt = $pdo->prepare($structureQuery);
    $structureStmt->execute([
        'recipeID' => $recipeID,
        'recipeName' => $recipeName,
        'recipeImage' => $recipeImage,
        'recipeDescription' => $recipeDescription,
        'recipeCalories' => $recipeCalories,
        'recipeTime' => $recipeTime
    ]);

    if ($isNewCuisine) {
        $structureQuery = "insert into cuisines(id, name, description, icon)
            values(:cuisineID, :cuisineName, :cuisineDescription, :cuisineImage)";
            
        $structureStmt = $pdo->prepare($structureQuery);
        $structureStmt->execute([
            'cuisineID' => $cuisineID,
            'cuisineName' => $cuisineName,
            'cuisineDescription' => $cuisineDescription,
            'cuisineImage' => $cuisineImage
        ]);
    }

    if ($isNewCategory) {
        $structureQuery = "insert into categories(id, name, description, icon)
            values(:categoryID, :categoryName, :categoryDescription, :categoryImage)";
            
        $structureStmt = $pdo->prepare($structureQuery);
        $structureStmt->execute([
            'categoryID' => $categoryID,
            'categoryName' => $categoryName,
            'categoryDescription' => $categoryDescription,
            'categoryImage' => ''
        ]);
    }

    $structureQuery = "insert into recipe_categories(id_recipe, id_category)
        values(:recipeID, :categoryID)";
        
    $structureStmt = $pdo->prepare($structureQuery);
    $structureStmt->execute([
        'recipeID' => $recipeID,
        'categoryID' => $categoryID
    ]);

    $structureQuery = "insert into recipe_cuisines(id_recipe, id_cuisine)
        values(:recipeID, :cuisineID)";
        
    $structureStmt = $pdo->prepare($structureQuery);
    $structureStmt->execute([
        'recipeID' => $recipeID,
        'cuisineID' => $cuisineID
    ]);

    $structureQuery = "insert into steps(description, id_recipe) values";

    $dataSep = '';
    $executeParams = ['recipeID' => $recipeID];
    foreach($steps as $step) {
        $executeParams[':Description' . strval($step['number'])] = $step['description'];     

        $structureQuery = $structureQuery . $dataSep . '(:Description' . strval($step['number']) . ', :recipeID)';

        $dataSep = ',';
    }

    $structureStmt = $pdo->prepare($structureQuery);
    $structureStmt->execute($executeParams);

    $structureQuery = "select COALESCE(max(id), 0) + 1 id from ingredients";

    $structureStmt = $pdo->prepare($structureQuery);
    $structureStmt->execute();

    $newIngredientID = $structureStmt->fetchAll(PDO::FETCH_ASSOC)[0]['id'];

    $dataSepRI = '';
    $dataSepI = '';
    $structureQueryRI = "insert into recipe_ingredients(id_recipe, id_ingredient, count, unit) values";
    $structureQueryI = "insert into ingredients(id, name, icon) values";
    $executeParamsRI = ['recipeID' => $recipeID];
    $executeParamsI = [];

    $index = 0;
    foreach($ingredients as $ingredient) {
        $ingredientID = 0;

        if ($ingredient['isNew']) {
            $ingredientID = $newIngredientID;
            
            $executeParamsI['ID'.strval($index)] = $newIngredientID;
            $executeParamsI['name'.strval($index)] = $ingredient['name'];
            $executeParamsI['icon'.strval($index)] = $ingredient['image'];

            $structureQueryI = $structureQueryI . $dataSepI . '(:ID'.strval($index).', :name'.strval($index).', :icon'.strval($index).')';

            $newIngredientID++;

            $dataSepI = ',';
        }
        else {
            $structureQuery = "select id from ingredients where name = :name";

            $structureStmt = $pdo->prepare($structureQuery);
            $structureStmt->execute([':name' => $ingredient['name']]);

            if ($structureStmt->rowCount() > 0) {
                $ingredientID = $structureStmt->fetchAll(PDO::FETCH_ASSOC)[0]['id'];
            }
            else {
                $ingredientID = $newIngredientID;

                $executeParamsI['ID'.strval($index)] = $newIngredientID;
                $executeParamsI['name'.strval($index)] = $ingredient['name'];
                $executeParamsI['icon'.strval($index)] = '';

                $structureQueryI = $structureQueryI . $dataSepI . '(:ID'.strval($index).', :name'.strval($index).', :icon'.strval($index).')';

                $newIngredientID++;

                $dataSepI = ',';
            }
        }

        $executeParamsRI['ingredientID'.strval($index)] = $ingredientID;
        $executeParamsRI['count'.strval($index)] = $ingredient['amount'];
        $executeParamsRI['unit'.strval($index)] = $ingredient['unit'];

        $structureQueryRI = $structureQueryRI . $dataSepRI . '(:recipeID, :ingredientID'.strval($index).', :count'.strval($index).', :unit'.strval($index).')';

        $index++;
        $dataSepRI = ',';
    }

    $structureStmt = $pdo->prepare($structureQueryI);
    $structureStmt->execute($executeParamsI);

    $structureStmt = $pdo->prepare($structureQueryRI);
    $structureStmt->execute($executeParamsRI);

    $response = [
        'result' => true
    ];

    echo json_encode($response, JSON_UNESCAPED_UNICODE);
?>