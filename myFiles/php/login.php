<?php

    function checkAccess(){
        if(isset($_POST["user"]) && $_POST["user"] != ""){
            //se entro in questo ramo allora i cookie non sono settati 
            setcookie("username", $_POST["user"], time()+3600);
            return true;
        }
        else return false;
    }

    //Per il logout
    if(isset($_POST["sign-out"])){
        setcookie("username", "", time());
        include('myFiles/page/login.html');
        die();
    }    
    //se i cookie sono sottati oppure la var $_POST è settata si saluta!
    if(isset($_COOKIE["username"]) || checkAccess()){     
        $user = isset($_POST["user"]) ? $_POST["user"] : $_COOKIE["username"];
    }
    //se non è settato -> PAGINA LOGIN
    else{
        include('myFiles/page/login.html');
        die();
    }
?>