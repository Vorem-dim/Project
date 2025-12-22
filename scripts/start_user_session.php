<?php
    session_start();

    if (!isset($_SESSION['user'])) {
        $_SESSION['user'] = [
            'id' => null,
            'role' => 'guest',
            'authorized' => false
        ];
    }

    $response = $_SESSION['user'];

    echo json_encode($response, JSON_UNESCAPED_UNICODE);
?>