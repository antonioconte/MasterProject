<?php
   header('Access-Control-Allow-Origin: *');
   include "myFiles/php/login.php";
   $avatar = "dist/img/avatar6.png";
   ?>
<!DOCTYPE html>
<html>
   <head>
      <meta http-equiv="pragma" content="no-cache" />
      <meta http-equiv="expires" content="-1" />
      <meta http-equiv="cache-control" content="no-cache" />
      <meta charset="utf-8">
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <link rel="shortcut icon" type="image/x-icon" href="dist/img/icon.ico" />
      <title>Pakkery</title>
      <meta content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" name="viewport">
      <!-- Bootstrap 3.3.6 -->
      <link rel="stylesheet" href="bootstrap/css/bootstrap.min.css">
      <!-- Font Awesome -->
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.5.0/css/font-awesome.min.css">
      <!-- Ionicons -->
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/ionicons/2.0.1/css/ionicons.min.css">
      <!-- Theme style -->
      <link rel="stylesheet" href="dist/css/AdminLTE.min.css">
      <link rel="stylesheet" href="dist/css/skins/skin-red.min.css">
      <link rel="stylesheet" href="myFiles/css/myCSS.css">
      <!--PACE-->
      <link rel="stylesheet" href="myFiles/css/pace.css">
      <script src="myFiles/js/pace.js"></script>
      
      <script src="myFiles/js/global.js"></script>
      <script src="myFiles/js/function.js"></script>
      <script src='//cdn.tinymce.com/4/tinymce.min.js'></script>
   </head>
   <body class="hold-transition skin-red fixed sidebar-mini">
      <div class="wrapper">
         <!-- Main Header -->
         <header class="main-header">
     
            <!-- Logo -->
            <a href="index.php" class="logo">
               <!-- logo for regular state and mobile devices -->
               <span class="logo-lg">
               Pakkery
               </span>
            </a>
          
      <!-- Sidebar toggle button-->
      <a href="#" class="sidebar-toggle" data-toggle="offcanvas" role="button">
        <span class="sr-only">Toggle navigation</span>
      </a>

      
           </header>
         <!-- Left side column. contains the logo and sidebar -->
         <aside class="main-sidebar">
                  <!-- <a href="#" class="sidebar-toggle" data-toggle="offcanvas" role="button">
        <span class="sr-only">Toggle navigation</span>
      </a>-->
            <!-- sidebar: style can be found in sidebar.less -->
            <section class="sidebar">
               <!-- Sidebar user panel (optional) -->
               <div class="user-panel">
                  <div class="pull-left image">
                     <img src="<?= $avatar ?>" class="img-circle" alt="User Image">
                  </div>
                  <div class="pull-left info">
                     <p><?= $user ?></p>
                      <form method="post" action="#">
                           <button href="#" class="btn btn-xs" name="sign-out" type="submit" style="color: white;"><i class="fa fa-sign-out" aria-hidden="true"></i>Sign out</button>
                      </form>
                  </div>
               </div>
               <ul class="user-panel">
                  <li style="padding-bottom: 7px !important">
                     <button type="button" id="newDoc" class="btn btn-block btn-success"><i class="fa fa-pencil"></i> New Document</button>         
                  </li>
                  <li>
                     <button type="button" id="newTemplate" class="btn btn-block btn-warning"><i class="fa fa-pencil"></i> New Template</button>         
                  </li>
               </ul>
               <!-- Sidebar Menu -->
               <ul class="sidebar-menu">
                  <li class="header">CONTENT</li>
                  <li class="treeview">
                     <a href="#"><i class="fa fa-folder-open-o"></i> <span>My template</span>
                     <span class="pull-right-container">
                     <i class="fa fa-angle-left pull-right"></i>
                     </span>
                     </a>
                     <ul class="treeview-menu myTempList">
                     </ul>
                  </li>
                  <li class="treeview">
                     <a href="#"><i class="fa fa-book"></i> <span>My docs</span>
                     <span class="pull-right-container">
                     <i class="fa fa-angle-left pull-right"></i>
                     </span>
                     </a>
                     <ul class="treeview-menu myDocList">
                     </ul>
                  </li>
                  <li class="header">Info current document</li>
                  <li>
                     <a data-toggle="modal" data-target="#modalMetaDati" href="#">
                     <i class="fa fa-circle-o text-red"></i>
                     <span class="info-doc">Select a document/template</span>
                     </a>
                  </li>
               </ul>
               <!-- /.sidebar-menu -->
            </section>
            <!-- /.sidebar -->
         </aside>
         <!-- Content Wrapper. Contains page content -->
         <div class="content-wrapper">
            <div id="container">
               <div class="content">
                     <h1 class="welcome">WELCOME TO PAKKERY</h1>
            </div>
         </div>
         <!-- /.content-wrapper -->
         <!--modal container-->
         <?php require_once('myFiles/page/modal.html'); ?>
         <!-- Control Sidebar -->
         <aside class="control-sidebar">
            <br>
            <div class="areaNotifiche"></div>
         </aside>
      </div>
      <!-- ./wrapper --> 
      <!-- jQuery 2.2.3 -->
      <script src="https://code.jquery.com/jquery-2.2.4.min.js"></script>
      <script src="plugins/slimScroll/jquery.slimscroll.min.js"></script>
      <!-- Bootstrap 3.3.6 -->
      <script src="bootstrap/js/bootstrap.min.js"></script>
      <!-- AdminLTE App -->
      <script src="dist/js/app.min.js"></script>
      <script src="myFiles/js/main.js"></script>
   </body>
</html>