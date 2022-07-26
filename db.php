<?php

require_once "connection.php";

@$username = $_POST['username'];
@$password = $_POST['password'];

if(isset($_POST["Login"])){
    $sql = "SELECT * FROM users WHERE Username = '$username' AND password = '$password'";
    $result =  $conn->query($sql);

    if($result -> num_rows > 0){
        $row = mysqli_fetch_assoc($result);
        setcookie('id',$row["id"],time()+(8400*30),"/");
        setcookie('username',$row["Username"]);
        $message="Logged in Successfully";
    }
    else{
        $sql_wrong_pass = "SELECT * FROM users WHERE Username = '$username'";
        $result_wrong_pass =  $conn->query($sql_wrong_pass);
        if($result_wrong_pass -> num_rows > 0){
            $message = "Wrong Password";
        }
        else{
            $message =  "Please Register First";
        }
    }
    header('Location:test_usa_map.php?message='.$message);
}

if(isset($_POST["Register"])){
    $sql_check = "SELECT * FROM users WHERE Username = '$username'";
    $reuslt_check = $conn->query($sql_check);
    if($reuslt_check -> num_rows>0){
        $message="Username Taken";
    }
    else{
    $sql = "INSERT INTO `users`(`Username`, `password`) VALUES ('$username','$password')";

    if($conn->query($sql)){
        $message =  "You are Registered/Logged In";
        $sql = "SELECT * FROM users WHERE Username = '$username' AND password = '$password'";
        $result =  $conn->query($sql);
        $row = mysqli_fetch_assoc($result);
        setcookie('id',$row["id"],time()+(8400*30),"/");
        setcookie('username',$row["Username"]);
    }
    else{
        $message =  "Registration Error";
    }
}    header('Location:test_usa_map.php?message='.$message);

}
if(isset($_POST["state"],$_POST["miss_count"])){
    $client_id = @$_COOKIE['id'];
    $state= $_POST['state'];
    $miss_count = $_POST["miss_count"];
    
    $sql = "SELECT * FROM `states` WHERE `id`='$client_id' AND `state_name`='$state'";
    $result = $conn->query($sql);

    if($result -> num_rows > 0){
        $sql = "UPDATE states SET miss_count = miss_count+'$miss_count' WHERE state_name = '$state' AND id = '$client_id'";
    }
    else{
        $sql = "INSERT INTO `states`(`id`, `state_name`, `miss_count`) VALUES ('$client_id','$state','$miss_count')";
    }
    $result = $conn->query($sql);
}

if(isset($_POST["streak"],$_POST["best_time"])){
    $client_id = @$_COOKIE['id'];
    $client_username = @$_COOKIE['username'];
    $streak= $_POST['streak'];
    $best_time = $_POST["best_time"];
    
    $sql = "INSERT INTO `stats`(`id`, `username`,`streak`, `best_time`) VALUES ('$client_id','$client_username','$streak','$best_time')";
    $result = $conn->query($sql);
    }

?>