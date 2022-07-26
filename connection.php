<?php
$servername = "localhost";
$username = "root";
$password = "";
$data_base_users= "users";

$conn = new mysqli($servername,$username,$password,$data_base_users);

if ($conn == true){
    // echo "Connected Successfully";
}

?>