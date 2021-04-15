<?php

include('storages.php');

$month = (isset($_GET['month'])) ? $_GET['month'] : 1;

function validate($post, &$data, &$errors) {
    if (!isset($post['username'])) {
        $errors['username'] = 'Meg kell adni a felhasználó nevet / e-mail címet!';
    } else if (trim($post['username']) === '') {
        $errors['username'] = 'Meg kell adni a felhasználó nevet / e-mail címet!';
    } else {
        $data['username'] = $post['username'];
    }

    if (!isset($post['password'])) {
        $errors['password'] = 'Meg kell adni a jelszót!';
    } else if (trim($post['password']) === '') {
        $errors['password'] = 'Meg kell adni a jelszót!';
    } else {
        $data['password'] = $post['password'];
    }

    return count($errors) === 0;
}

$regstor = new RegistrationStorage();
$registratedUsers = $regstor->findAll();

$data = [];
$errors = [];

if (count($_POST) > 0) {
    if (validate($_POST, $data, $errors)) {
        if ($data['username'] === 'admin@nemkovid.hu' && $data['password'] === 'admin') {
            header("Location: index.php?id=admin&month=$month");
        } else {
            $islegit = $regstor->findOne(['email' => $data['username']]);
            if ($islegit['password'] === $data['password']) {
                $id = $islegit['id'];
                header("Location: index.php?id=$id&month=$month");
            } else {
                $errors['unsuccessful'] = 'Hibás felhasználónév és/vagy jelszó!';
            }
        }
    }
}

?>

<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8">
        <title>NemKoViD - Bejelentkezés</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link href="style.css" rel="stylesheet" media="screen">
        <style>
            input + small {
                color: red;
            }
        </style>
    </head>
    <body>
        <h1>Bejelentkezés</h1>
        <?php if (isset($errors['unsuccessful'])) : ?>
            <p class='error'><?= $errors['unsuccessful'] ?></p>
        <?php endif ?>
        <form action="" method="post">
            <table class="loginsignintable">
                <tr>
                    <td class="regtdth">E-mail:</td>
                    <td class="regtdth"><input type="email" name="username"></td>
                    <?php if (isset($errors['username'])) : ?>
                    <td class="errortd"><?= $errors['username'] ?></td>
                    <?php endif ?>
                </tr>
                <tr>
                    <td class="regtdth">Jelszó:</td>
                    <td class="regtdth"><input type="password" name="password"></td>
                    <?php if (isset($errors['password'])) : ?>
                    <td class="errortd"><?= $errors['password'] ?></td>
                    <?php endif ?>
                </tr>
            </table>
            <button type="submit">Bejelentkezés</button>
        </form>

        <form action="<?= "index.php?month=$month" ?>" method="post" id="indexbtn">
        <button>Főoldal</button>
        </form>
    </body>
</html>