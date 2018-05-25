<?php

    $obj = json_decode(file_get_contents("php://input"), true);
    unlink("../../template/".$obj["title"].".html");
    
    $myfile = fopen("../../template/".$obj["title"].".html", "w");
    
    echo (int)fwrite($myfile, $obj["body"]);
?>
    