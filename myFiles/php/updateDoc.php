<?php

    $obj = json_decode(file_get_contents("php://input"), true);
    unlink("../documents/".$obj["title"].".html");
    
    $myfile = fopen("../documents/".$obj["title"].".html", "w");
    
    echo (int)fwrite($myfile, $obj["body"]);
?>
    