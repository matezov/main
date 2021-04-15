<?php

include('storage.php');

class RegistrationStorage extends Storage {

    public function __construct() {
        parent::__construct(new JsonIO('registrations.json'));
    }

    public function findUserName($username) {
        return $this->findMany(function ($data) use ($username) {
            return strpos($data['email'], $username) !== false;
        });
    }
}

class AppointmentStorage extends Storage {

    public function __construct() {
        parent::__construct(new JsonIO('appointments.json'));
    }
}