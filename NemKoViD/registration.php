<?php

include('storages.php');

function validate($post, &$data, &$errors)
{
    if (!isset($post['name'])) {
        $errors['name'] = 'Nincs megadva név!';
    } else if (trim($post['name']) === '') {
        $errors['name'] = 'Nincs megadva név!';
    } else {
        $data['name'] = $post['name'];
    }

    if (!isset($post['adress'])) {
        $errors['adress'] = 'Nincs megadva értesítési cím!';
    } else if (trim($post['adress']) === '') {
        $errors['adress'] = 'Nincs megadva értesítési cím!';
    } else {
        $data['adress'] = $post['adress'];
    }

    if (!isset($post['email'])) {
        $errors['email'] = 'Nincs megadva e-mail!';
    } else if (trim($post['email']) === '') {
        $errors['email'] = 'Nincs megadva e-mail!';
    } else {
        $data['email'] = $post['email'];
    }
 
    if (!isset($post['TAJ']) || trim($post['TAJ']) === '') {
        $errors['TAJ'] = 'Nincs megadva TAJ-szám!';
    } else if (!filter_var($post['TAJ'], FILTER_VALIDATE_INT)) {
        $errors['TAJ'] = 'Hibás számformátum!';
    } else if (strlen((string)$post['TAJ']) !== 9) {
        $errors['TAJ'] = 'A TAJ szám 9 számjegyből áll!';
    } else {
        $data['TAJ'] = (int)$post['TAJ'];
    }

    if (!isset($post['password1']) || trim($post['password1']) === '' || !isset($post['password2']) || trim($post['password2']) === '') {
        $errors['password'] = 'Nincs megadva jelszó!';
    } else {
        $p1 = (string)$post['password1'];
        $p2 = (string)$post['password2'];
        if ($p1 !== $p2) {
            $errors['password'] = 'A megadott jelszók nem egyeznek!';
        } else {
            $data['password'] = (string)$post['password1'];
        }
    }
    $data['appointmentID'] = "";

    return count($errors) === 0;
}

$data = [];
$errors = [];

$success = false;

if (count($_POST) > 0) {
    if (validate($_POST, $data, $errors)) {
        $regstor = new RegistrationStorage();
        $regstor->add($data);
        $success = true;
        header('Location: login.php');
    }
}

?>

<!DOCTYPE html>
<html>

<head>
    <meta charset="utf-8">
    <title>NemKoViD - Regisztráció</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link href="style.css" rel="stylesheet" media="screen">

</head>
<body>
    <h1>Regisztráció oltásra</h1>
    <form action="" method="post">
        <table class="loginsignintable">
            <tr>
                <td class="regtdth">Teljes név:</td>
                <td class="regtdth"><input type="text" name="name" value="<?= $_POST['name'] ?? '' ?>"></td>
                <?php if (isset($errors['name'])) : ?>
                <td class="errortd"><?= $errors['name'] ?></td>
                <?php endif ?>
            </tr>
            <tr>
                <td class="regtdth">TAJ szám:</td>
                <td class="regtdth"><input type="number" name="TAJ" value="<?= $_POST['TAJ'] ?? '' ?>"></td>
                <?php if (isset($errors['TAJ'])) : ?>
                <td class="errortd"><?= $errors['TAJ'] ?></td>
                <?php endif ?>
            </tr>
            <tr>
                <td class="regtdth">Értesítési cím:</td>
                <td class="regtdth"><input type="text" name="adress" value="<?= $_POST['adress'] ?? '' ?>"></td>
                <?php if (isset($errors['adress'])) : ?>
                <td class="errortd"><?= $errors['adress'] ?></td>
                <?php endif ?>
            </tr>
            <tr>
                <td class="regtdth">E-mail:</td>
                <td class="regtdth"><input type="email" name="email" value="<?= $_POST['email'] ?? '' ?>"></td>
                <?php if (isset($errors['email'])) : ?>
                <td class="errortd"><?= $errors['email'] ?></td>
                <?php endif ?>
            </tr>
            <tr>
                <td class="regtdth">Jelszó:</td>
                <td class="regtdth"><input type="password" name="password1" value="<?= $_POST['password1'] ?? '' ?>"></td>
                <?php if (isset($errors['password'])) : ?>
                <td class="errortd"><?= $errors['password'] ?></td>
                <?php endif ?>
            </tr>
            <tr>
                <td class="regtdth">Jelszó megerősítése:</td>
                <td class="regtdth"><input type="password" name="password2" value="<?= $_POST['password2'] ?? '' ?>"></td>
                <?php if (isset($errors['password'])) : ?>
                <td class="errortd"><?= $errors['password'] ?></td>
                <?php endif ?>
            </tr>
            <tr>
                <td class="regtdth"></td>
                <td class="regtdth">
                    <button>Adatok rögzítése</button>
                </td>
            </tr>
        </table>
        
    </form>
    <?php if ($success) : ?>
        <p id="ok">Sikeres regisztráció</p>
    <?php endif ?>

    <form action="index.php" method="post" id="indexbtn">
        <button>Főoldal</button>
    </form>

</body>

</html>