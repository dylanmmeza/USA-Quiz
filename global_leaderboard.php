<?php
    require_once "connection.php";
    $client_id = @$_COOKIE['id'];
    $sql_gl_table = "SELECT * FROM `stats` ORDER BY best_time, streak LIMIT 25";
    $result_gl_table = $conn->query($sql_gl_table);
    while ($data_gl = $result_gl_table->fetch_assoc()): ?>
        <tr>
            <td style = 'border-right: 1px dashed grey;'><?php echo $data_gl['username'] ?></td>
            <td style = 'border-right: 1px dashed grey;'><?php echo $data_gl['best_time'] ?></td>
            <td ><?php echo $data_gl['streak'] ?></td>
        </tr>
        <?php endwhile; ?>


