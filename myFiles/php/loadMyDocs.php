<?php

    function check($user, $file){
        $x = explode("[".$user."]", $file);
        if($x[0] == "") return true;
        else return false;
    }

    header('Content-Type: application/json'); //per la stampa in JSON
    //$user = $_GET["user"];
    $directory = "../documents/";
    $json = [];
    if (is_dir($directory)) {
        //Apro l'oggetto directory
        if ($directory_handle = opendir($directory)) {
            //Scorro l'oggetto fino a quando non è termnato cioè false
            while (($file = readdir($directory_handle)) !== false) {
            //Se l'elemento trovato è diverso da una directory
            //o dagli elementi . e .. lo visualizzo a schermo
            if((!is_dir($file))&($file!=".")&($file!=".."))
                array_push($json,$file);
            }
            //Chiudo la lettura della directory.
            closedir($directory_handle);
        }   
    }
    echo json_encode($json, JSON_PRETTY_PRINT);
?>