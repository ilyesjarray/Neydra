<?php
error_reporting(E_ALL);ini_set('display_errors',0);set_error_handler(function($errno,$errstr,$errfile,$errline){header('Content-Type: application/json');echo json_encode(['error'=>$errstr,'code'=>$errno]);exit();});set_exception_handler(function($e){header('Content-Type: application/json');echo json_encode(['error'=>$e->getMessage()]);exit();});
?>
