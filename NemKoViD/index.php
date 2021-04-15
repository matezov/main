<?php

include('storages.php');

$text = "Ezen az oldalon koronavírus elleni oltásra lehet időpontot foglalni.";

$id = (isset($_GET['id'])) ? $_GET['id'] : NULL;
$month = (isset($_GET['month'])) ? $_GET['month'] : 1;

$prevmonth = ((int)$month === 1) ? 12 : ((int)$month - 1);
$nextmonth = ((int)$month === 12) ? 1 : ((int)$month + 1);

$appstore = new AppointmentStorage();
$appointments = $appstore->findAll();

$regstor = new RegistrationStorage();

function listByMonth($month, $appointments) {

    $list = [];

    foreach ($appointments as $a) {
        $time = strtotime($a['date']);
        $tm = date('m', $time);
        if ((int)$tm === (int)$month) {
            array_push($list, $a);
        }
    }
    return $list;
}

function isfull($a, $b)
{
    return ($a >= $b && $b > 0) ? 'notfull' : 'full';
}


function registrated($regstor, $id)
{
    if (($regstor->findById($id))['appointmentID'] !== '') {
        return true;
    }
    return false;
}

if (isset($_POST['appointmentcancellation'])) {
    $applicant = $regstor->findById($id);
    $selectedappointment = $appstore->findById($applicant['appointmentID']);
    
    foreach ($selectedappointment['applicantID'] as $apcID) {
        if ($apcID === $id) {
            if (($key = array_search($apcID, $selectedappointment['applicantID'])) !== false) {
                unset($selectedappointment['applicantID'][$key]);
            }
        }
    }
    $selectedappointment['freespace'] = (int)$selectedappointment['freespace'] + 1;
    $appstore->update($selectedappointment['id'], $selectedappointment);
    
    
    $applicant['appointmentID'] = '';
    $regstor->update($id, $applicant);
    header("Refresh:0");
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
    <h1>NemKoViD - Mondj nemet a koronavírusra!</h1>
    <h2><?= $text ?></h2>

    <table class="indextableforbtns">
        <tr class="indextrforbtns">
            <?php if ($id == NULL) : ?>
                <form action="registration.php">
                    <button class='indexbtn'>Regisztáció</button>
                </form>
                <form action="<?= "login.php?month=$month" ?>" method="post">
                    <button class='indexbtn'>Bejelentkezés</button>
                </form>
        </tr>
    <?php endif ?>
    <?php if ($id === 'admin') : ?>
        <form action="newappointment.php">
            <button class='indexbtn'>Új időpont meghirdetése</button>
        </form>
    <?php endif ?>
    <?php if ($id != NULL) : ?>
        <form action="index.php">
            <button class='indexbtn'>Kijelentkezés</button>
        </form>
    <?php endif ?>
    </tr>
    </table>

    <?php if ($id != NULL && $id !== 'admin' && registrated($regstor, $id)) : ?>
        <h2>LEFOGLALT IDŐPONT:</h2>
        <table class="indextable">
            <tr>
                <th>Dátum</th>
                <th>Idő</th>
                <th>Lemondás</th>
            </tr>
            <tr>
                <td><?= ($appstore->findById($regstor->findById($id)['appointmentID']))['date'] ?></td>
                <td><?= ($appstore->findById($regstor->findById($id)['appointmentID']))['time'] ?></td>
                <td>
                    <form action="" novalidate method="post">
                    <button name='appointmentcancellation' value="<?= $id ?>">Időpont lemondása</button>
                    <form action="" novalidate method="post">
                </td>
            </tr>
        </table>
    <?php endif ?>
    
    <h2>Időpontok (<?= $month ?>. hó):</h2>
    <table class="indextable">
        <tr>
            <th>Dátum</th>
            <th>Óra</th>
            <th>Szabad / összes hely</th>
            <?php if ($id === 'admin') : ?>
                <th>Időpont részletei</th>
            <?php endif ?>
            <?php if ($id !== 'admin') : ?>
                <th>Jelentkezés</th>
            <?php endif ?>
        </tr>
        <?php foreach (listByMonth($month, $appointments) as $appointment) : ?>

            <tr class="<?= isfull($appointment['capacity'], $appointment['freespace']) ?>">
                <td><?= $appointment['date'] ?></td>
                <td><?= $appointment['time'] ?></td>
                <td><?= $appointment['freespace'] ?>/<?= $appointment['capacity'] ?></td>
                <?php if ($id === 'admin' && $appointment['applicantID'] !== '') : ?>
                    <td>
                        <form action="<?= "appointmentdetails.php?applicantID=$id&appointmentID={$appointment['id']}" ?>" method="post">
                            <button name='detailsbtn'>Részletek</button>
                        </form>
                    </td>
                <?php endif ?>
                <?php if ($id == NULL && ($appointment['freespace'] > 0) && ($appointment['freespace'] <= $appointment['capacity'])) : ?>
                    <td>
                        <form action="<?= "login.php?month=$month" ?>" method="post">
                            <button>Jelentkezés</button>
                        </form>
                    <?php endif ?>
                    <?php if (
                        $id != NULL && $id !== 'admin' && ($appointment['freespace'] > 0) && ($appointment['freespace'] <= $appointment['capacity'])
                        && !registrated($regstor, $id)
                    ) : ?>
                    <td>
                        <form action="<?= "confirmapplication.php?applicantID={$id}&appointmentID={$appointment['id']}" ?>" method="post">
                            <button name='applybtnforregistered'>Jelentkezés</button>
                        </form>
                    </td>
                <?php endif ?>
            </tr>

        <?php endforeach ?>
    </table>
    <table class="indextableforbtns">
        <tr class="indextrforbtns">
            <form action="<?= "index.php?id={$id}&month={$prevmonth}" ?>" method="post">
                <button>előző hónap</button>
            </form>
            <form action="<?= "index.php?id={$id}&month={$nextmonth}" ?>" method="post">
                <button>következő hónap</button>
            </form>
        </tr>
    </table>

    

</body>

</html>