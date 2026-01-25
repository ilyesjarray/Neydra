<?php
 $host=getenv('DB_HOST')?:'localhost';$db=getenv('DB_NAME')?:'neydra';$user=getenv('DB_USER')?:'root';$pass=getenv('DB_PASS')?:'';$conn=new mysqli($host,$user,$pass,$db);if($conn->connect_error)die("Connection failed: ".$conn->connect_error);$site_url=getenv('SITE_URL')?:'http://localhost';$usdt_wallet_address=getenv('USDT_WALLET')?:'0x0000000000000000000000000000000000000000';$admin_email=getenv('ADMIN_EMAIL')?:'admin@neydra.com';session_start();
?>
