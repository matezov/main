<?php

include('storages.php');

$applicantID = $_GET['applicantID'];
$appointmentID = $_GET['appointmentID'];


$appstore = new AppointmentStorage();
$appointment = $appstore->findById($appointmentID);

$regstor = new RegistrationStorage();


?>

<!DOCTYPE html>
<html>

<head>
    <meta charset="utf-8">
    <title>NemKoViD - Időpont részletei</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link href="style.css" rel="stylesheet" media="screen">
</head>
<body id="indexbody">
    <h2>Időpont:</h2>
    <table class="indextable">
        <tr>
            <td><?= $appointment['date'] ?></td>
            <td><?= $appointment['time'] ?></td>
        </tr>
    </table>

    <h2>Jelentkezett felhasználók:</h2>
    <table class="indextable">
        <tr>
            <th>Név</th>
            <th>TAJ</th>
            <th>E-mail</th>
        </tr>
        <?php foreach ($appointment['applicantID'] as $applicant) : ?>
        <tr>
            <td><?= $regstor->findById($applicant)['name'] ?></td>
            <td><?= $regstor->findById($applicant)['TAJ'] ?></td>
            <td><?= $regstor->findById($applicant)['email'] ?></td>
        </tr>
        <?php endforeach ?>
    </table>


    <form action="<?= "index.php?id=$applicantID" ?>" method="post" id="indexbtn">
        <button>Vissza a főoldalra</button>
    </form>

</body>

</html>