<?php
    require_once "connection.php";
    $client_id = @$_COOKIE['id'];
    if($client_id != null){
        $sql_pl_table = "SELECT * FROM `stats` WHERE id = $client_id ORDER BY best_time, streak LIMIT 5";
        $result_pl_table = $conn->query($sql_pl_table);
        while ($data_pl = $result_pl_table->fetch_assoc()): ?>
            <tr>
                <td><?php echo $data_pl['best_time'] ?></td>
                <td style = 'border-left: 1px dashed grey;'><?php echo $data_pl['streak'] ?></td>
            </tr>
        <?php endwhile; }?>


