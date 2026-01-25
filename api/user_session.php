<?php
require '../config.php';header('Content-Type: application/json');$action=$_GET['action']??'';if($action==='check'){echo json_encode(['logged_in'=>isset($_SESSION['user_id']),'plan'=>$_SESSION['plan']??'free']);}elseif($action==='logout'){session_destroy();echo json_encode(['status'=>'logged_out']);}
?>
