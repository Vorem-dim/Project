<?php
    session_start();

    session_unset();

    $_SESSION['user'] = [
        'id' => null,
        'role' => 'guest',
        'authorized' => false
    ];
?>