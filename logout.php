<?php
setcookie("id","",time()-(86400*30),"/");
setcookie("username","");

header("Location:test_usa_map.php");
?>