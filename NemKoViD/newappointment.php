<?php

include('storages.php');

function validate($post, &$data, &$errors)
{
    if (!isset($post['date'])) {
        $errors['date'] = 'Nincs megadva dátum!';
    } else if (trim($post['date']) === '') {
        $errors['date'] = 'Nincs megadva dátum!';
    } else {
        $data['date'] = $post['date'];
    }

    if (!isset($post['time'])) {
        $errors['time'] = 'Nincs megadva időpont!';
    } else if (trim($post['time']) === '') {
        $errors['time'] = 'Nincs megadva időpont!';
    } else {
        $data['time'] = $post['time'];
    }

    if (!isset($post['capacity']) || trim($post['capacity']) === '') {
        $errors['capacity'] = 'Nincs megadva a helyek száma!';
    } else if (!filter_var($post['capacity'], FILTER_VALIDATE_INT)) {
        $errors['capacity'] = 'Hibás számformátum!';
    } else {
        $data['capacity'] = (int)$post['capacity'];
        $data['freespace'] = (int)$post['capacity'];
    }

    $data['applicantID'] = [];

    return count($errors) === 0;
}

$data = [];
$errors = [];

if (count($_POST) > 0) {
    if (validate($_POST, $data, $errors)) {
        $appstore = new AppointmentStorage();
        $appstore->add($data);
        header('Location: index.php?id=admin');
    }
}

?>

<!DOCTYPE html>
<html>

<head>
    <meta charset="utf-8">
    <title>NemKoViD - Új időpont hozzáadása</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link href="style.css" rel="stylesheet" media="screen">
</head>
<body>
    <h1>Regisztráció oltásra</h1>
    <form action="" method="post">
        <table>
            <tr>
                <td>Dátum:</td>
                <td><input type="date" name="date" value="<?= $_POST['date'] ?? '' ?>"></td>
                <?php if (isset($errors['date'])) : ?>
                <td class="errortd"><?= $errors['date'] ?></td>
                <?php endif ?>
            </tr>
            <tr>
                <td>Óra:</td>
                <td><input type="time" name="time" value="<?= $_POST['time'] ?? '' ?>"></td>
                <?php if (isset($errors['time'])) : ?>
                <td class="errortd"><?= $errors['time'] ?></td>
                <?php endif ?>
            </tr>
            <tr>
                <td>Helyek száma:</td>
                <td><input type="number" name="capacity" value="<?= $_POST['capacity'] ?? '' ?>"></td>
                <?php if (isset($errors['capacity'])) : ?>
                <td class="errortd"><?= $errors['capacity'] ?></td>
                <?php endif ?>
            </tr>
        </table>
        <button>Időpont rögzítése</button>
    </form>
    <?php if ($success) : ?>
        <p id="ok">Sikeres regisztráció</p>
    <?php endif ?>

    <form action="index.php?id=admin" method="post" id="indexbtn">
        <button>Vissza a főoldalra</button>
    </form>

</body>

</html>