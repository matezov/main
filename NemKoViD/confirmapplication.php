<?php

include('storages.php');

$applicantID = $_GET['applicantID'];
$appointmentID = $_GET['appointmentID'];


$appstore = new AppointmentStorage();
$appointments = $appstore->findAll();
$appointment = $appstore->findById($appointmentID);

$regstor = new RegistrationStorage();
$applicant = $regstor->findById($applicantID);

$data = [];
$errors = [];

function confirmApplication($appstore, $regstor, $applicantID, $appointmentID) {
    $selectedappointment = $appstore->findById($appointmentID);
    array_push($selectedappointment['applicantID'], $applicantID);
    $selectedappointment['freespace'] = (int)$selectedappointment['freespace'] - 1;
    $appstore->update($selectedappointment['id'], $selectedappointment);

    $applicant = $regstor->findById($applicantID);
    $applicant['appointmentID'] = $selectedappointment['id'];
    $regstor->update($applicantID, $applicant);

    header("Location: index.php?id=$applicantID");
}

function validate($post, &$data, &$errors)
{
    if (!isset($post['radio'])) {
        $errors['radio'] = 'A továbblépéshez el kell fogadnod!';
    } else {
        $data['radio'] = $post['radio'];
    }

    return count($errors) === 0;
}

$data = [];
$errors = [];

if (array_key_exists('accept', $_POST)) {
    if (validate($_POST, $data, $errors)) {
        confirmApplication($appstore, $regstor, $applicantID, $appointmentID);
    }
}

?>

<!DOCTYPE html>
<html>

<head>
    <meta charset="utf-8">
    <title>NemKoViD - Mondj nemet a koronavírusra!</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link href="style.css" rel="stylesheet" media="screen">
</head>
<body id="indexbody">

    <h2>Jelentkező adatai:</h2>
    <table class="indextable">
        <tr>
            <td>Név:</td>
            <td><?= $applicant['name'] ?></td>
        </tr>
        <tr>
            <td>Cím:</td>
            <td><?= $applicant['adress'] ?></td>
        </tr>
        <tr>
            <td>TAJ:</td>
            <td><?= $applicant['TAJ'] ?></td>
        </tr>
    </table>

    <h2>Időpont:</h2>
    <table class="indextable">
        <tr>
            <td><?= $appointment['date'] ?></td>
            <td><?= $appointment['time'] ?></td>
        </tr>
    </table>

    <form action="" novalidate method="post">
        <input type="radio" name="radio" value="yes"> Elfogadom, hogy az oltásnak lehetnek mellékhatásai <br>
        <?php if (isset($errors['radio'])) : ?>
            <small class="error"><?= $errors['radio'] ?></small>
        <?php endif ?><br>
        <button name="accept">Elfogadom, jelentkezem</button>
    </form>

    <form action="<?= "index.php?id=$applicantID" ?>" method="post" id="indexbtn">
        <button>Vissza a főoldalra</button>
    </form>

</body>

</html>