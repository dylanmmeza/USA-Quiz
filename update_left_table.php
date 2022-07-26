<?php
    require_once "connection.php";
    $client_id = @$_COOKIE['id'];
    if(@$_COOKIE['id']!= null){
        $sql_left_table = "SELECT * FROM `states` WHERE id = $client_id AND miss_count > 0 ORDER BY miss_count DESC, state_name LIMIT 25";
        $result_left_table = $conn->query($sql_left_table);
        while ($data = $result_left_table->fetch_assoc()): ?>
            <tr>
                <td><?php echo $data['state_name'] ?></td>
                <td style = 'border-left: 1px dashed white;'><?php echo $data['miss_count'] ?></td>
            </tr>
        <?php endwhile; }?>


