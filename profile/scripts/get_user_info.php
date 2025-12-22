<?php
    session_start();

    $pdo = new PDO("pgsql:host=localhost;dbname=LearnAndCook", "postgres", "Vorem2829");
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $structureQuery = "select
        u.id id,
        u.first_name first_name,
        u.last_name last_name,
        u.birthday birthday,
        u.email email,
        u.role role,
        u.icon icon,
        0 recipes,
        count(distinct sr.id_recipe) saved,
	    count(distinct ur.id_review) reviews
    from users u
    left join saved_recipes sr on sr.id_user = u.id 
    left join user_reviews ur on ur.id_user = u.id
    where id = :id
    group by id, first_name, last_name, birthday, email, role, icon";
        
    $structureStmt = $pdo->prepare($structureQuery);
    $structureStmt->execute([":id" => $_SESSION['user']['id']]);

    $users = $structureStmt->fetchAll(PDO::FETCH_ASSOC);

    $response = $users[0];

    echo json_encode($response, JSON_UNESCAPED_UNICODE);
?>