<?php

    $obj = json_decode(file_get_contents("php://input"), true);
    
    $myfile = fopen("../../template/".$obj["title"].".html", "w");
    
    echo fwrite($myfile, $obj["body"]);
    


?>