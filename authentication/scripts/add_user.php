<?php
    $pdo = new PDO("pgsql:host=localhost;dbname=LearnAndCook", "postgres", "Vorem2829");
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $firstName = $_POST['firstName'] ?? '';
    $lastName = $_POST['lastName'] ?? '';
    $birthDate = $_POST['birthDate'] ?? '';
    $login = $_POST['login'] ?? '';
    $password = $_POST['password'] ?? '';
    $icon = 'https://cdn3.iconfinder.com/data/icons/service-staff/860/chef_cook_restaurant_cooking_staff-1024.png';

    $structureQuery = "select id from users where email = :login and password = :password";
        
    $structureStmt = $pdo->prepare($structureQuery);
    $structureStmt->execute([
        ':login' => $login,
        ':password' => $password
    ]);

    if ($structureStmt->rowCount() > 0) {
        $response = [
            'status' => 'success',
            'registration' => false,
            'message' => 'Данный пользователь уже существует'
        ];

        echo json_encode($response, JSON_UNESCAPED_UNICODE);
    } else {

        $structureQuery = "insert into users(first_name, last_name, birthday, email, password, role, icon)
            values(:first_name, :last_name, :birth_date, :login, :password, 'chef', :icon)";
            
        $structureStmt = $pdo->prepare($structureQuery);
        $structureStmt->execute([
            ':first_name' => $firstName,
            ':last_name' => $lastName,
            ':birth_date' => $birthDate,
            ':login' => $login,
            ':password' => $password,
            ':icon' => $icon
        ]);
        
        $response = [
            'status' => 'success',
            'registration' => true
        ];

        echo json_encode($response, JSON_UNESCAPED_UNICODE);
    }
?>