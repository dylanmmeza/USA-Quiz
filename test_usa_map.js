var allPaths = document.querySelectorAll('path') //List of path nodes (Indivdual states)
var StreakElement = document.getElementById("Streak_counter")
var score = document.getElementById("Correct_num")
var QuestionState = document.getElementById("question")
var tbody_bottom = document.getElementById('tbody_bottom');
var minutesLabel = document.getElementById("minutes");
var secondsLabel = document.getElementById("seconds");
var visited_map_list = []
var state_correct = []
var current_state = ''
var playable = true
var totalSeconds = 0;
var streak = 0
var best_streak = 0
var logged_in = false
var final_time = ""
var id = document.cookie
setInterval(setTime, 1000);
//JQuery Install
var script = document.createElement('script');
script.src = 'https://code.jquery.com/jquery-3.6.0.min.js';
document.getElementsByTagName('head')[0].appendChild(script);

//Add onClick Event Listener to all path tags 
//Also adds the State:Visited (bool),miss_count to list
for (let i = 0; i < allPaths.length; i++) {
    allPaths[i].addEventListener('click', check_if_equal);
    visited_map_list.push([allPaths[i].id, false, 0])
    state_correct.push(allPaths[i].id)
}


window.onload = function () {
    update_table();
    update_leaderboard();
    choose_state_question(Math.floor(Math.random() * (visited_map_list.length)))
    StreakElement.innerHTML = "Streak: " + "<text style='color:darkgreen'>" + streak + "</text>|" + "<text style='color:gold'>" + best_streak + "</text>"
};

function update_table() {
    if (id != 0) {
        $(document).ready(function () {
            $.ajax({
                type: "GET",
                url: "update_left_table.php",
                dataType: "html",
                success: function (data) {
                    $("#tbody_right").html(data);
                }
            });
        });
    }
    else {
        visited_map_list_sorted_by_misses = sort_by_miss_count(visited_map_list)
        rows = ''
        for (r = 0; r < 25; r++) {
            cell = ''
            if (visited_map_list_sorted_by_misses[r][2] > 0) {
                cell += "<td>" + visited_map_list_sorted_by_misses[r][0] + "</td>";
                cell += "<td>" + visited_map_list_sorted_by_misses[r][2] + "</td>";
                rows += "<tr>" + cell + '</tr>'
            }
            else {
                rows += "<tr><td>&nbsp</td><td>&nbsp</td></tr>"
            }
        }
        tbody_right.innerHTML = rows;
    }

    //Bottom Table
    var rows = ''
    visited_map_list.sort()
    for (r = 0; r < 5; r++) {
        var cell = ''
        for (c = 0; c < 10; c++) {
            if (visited_map_list[(r * 10) + c][1] == true) {
                cell += "<td bgcolor= 'green' style='color:white; font-weight: bolder; text-align: center;'>" + visited_map_list[(r * 10) + c][0] + "</td>";
            }
            else {
                cell += "<td bgcolor= 'red' style='color:black; font-weight: bolder; text-align: center;'>" + visited_map_list[(r * 10) + c][0] + "</td>";
            }
        }
        rows += '<tr>' + cell + '</tr>'
    }
    tbody_bottom.innerHTML = rows;
}

function choose_state_question() {
    if (state_correct.length > 0) {
        temp_val = Math.floor(Math.random() * state_correct.length)
        current_state = state_correct[temp_val]
        QuestionState.innerHTML = "State: " + "<text style='color:darkorange'>" + current_state + "</text>"
    }
    else {
        current_state = state_correct[0]
    }
}

function check_if_equal(elem) {

    //Update SQL
    var xml = new XMLHttpRequest()
    xml.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            console.log("This message is from database: " + this.responseText)
        }
    }
    xml.open("POST", "db.php", true)
    xml.setRequestHeader('Content-type', 'application/x-www-form-urlencoded')


    //main check to see if Selected State=Desired State
    if (current_state == elem.target.id) {
        for (let i = 0; i < state_correct.length; i++) {
            if (state_correct[i] == elem.target.id) {
                state_correct.splice(i, 1)
            }
        }
        visited_map_list.forEach(i => {
            if (i[0] == elem.target.id) {
                i[1] = true
                xml.send("state=" + current_state + "&miss_count=" + i[2])
            }
        })
        elem.target.style.fill = "green";
        streak += 1
        if (streak >= best_streak) {
            best_streak = streak
        }
        choose_state_question()
    }
    else {
        visited_map_list.forEach(i => {
            if (i[0] == current_state) {
                i[2] += 1
                xml.send("state=" + current_state + "&miss_count=" + 1)
            }
        })
        streak = 0
        if (state_correct.length > 0) {
            choose_state_question()
        }
    }


    //End of Event Actions (Updates)
    update_table()
    score.innerHTML = (50 - state_correct.length) + "/" + visited_map_list.length
    StreakElement.innerHTML = "Streak: " + "<text style='color:darkgreen'>" + streak + "</text>|" + "<text style='color:gold'>" + best_streak + "</text>"
    //End of Game 
    if (state_correct.length == 0) {
        end_of_game()
    }
}

function sort_by_miss_count(visited_map_list_temp) {
    for (let i = 0; i < visited_map_list_temp.length; i++) {

        //Inner pass
        for (let j = 0; j < visited_map_list_temp.length - i - 1; j++) {

            //Value comparison using ascending order

            if (visited_map_list_temp[j + 1][2] > visited_map_list_temp[j][2]) {

                //Swapping
                [visited_map_list_temp[j + 1], visited_map_list_temp[j]] = [visited_map_list_temp[j], visited_map_list_temp[j + 1]]
            }
        }
    };
    return visited_map_list_temp;
}

function setTime() {
    if (playable) {
        ++totalSeconds;
        secondsLabel.innerHTML = pad(totalSeconds % 60);
        minutesLabel.innerHTML = pad(parseInt(totalSeconds / 60));
    }
    else {
        secondsLabel.innerHTML = pad(totalSeconds % 60);
        minutesLabel.innerHTML = pad(parseInt(totalSeconds / 60));
    }
}

function pad(val) {
    var valString = val + "";
    if (valString.length < 2) {
        return "0" + valString;
    } else {
        return valString;
    }
}

function end_of_game() {
    playable = false
    QuestionState.classList.toggle("hidden")
    document.getElementById("game_over").style.visibility = 'visible'
    for (let i = 0; i < allPaths.length; i++) {
        allPaths[i].removeEventListener('click', check_if_equal);
    }
    final_time = pad(parseInt(totalSeconds / 60)) + ":" + pad(totalSeconds % 60)
    final_time_minutes.innerHTML = pad(parseInt(totalSeconds / 60))
    final_time_seconds.innerHTML = pad(totalSeconds % 60)
    // POST Game Results to SQL
    var xml = new XMLHttpRequest()
    xml.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            console.log("This message is from database POST game_over: " + this.responseText)
        }
    }
    xml.open("POST", "db.php", true)
    xml.setRequestHeader('Content-type', 'application/x-www-form-urlencoded')
    xml.send("streak=" + best_streak + "&best_time=" + final_time)
    //GET game_results_table
    update_leaderboard()
}

function update_leaderboard() {
    console.log(id)
    if (id != 0) {
        $(document).ready(function () {
            $.ajax({
                type: "GET",
                url: "personal_leaderboard.php",
                dataType: "html",
                success: function (data) {
                    $("#tbody_pl").html(data);
                }
            });
        });
    }

    $(document).ready(function () {
        $.ajax({
            type: "GET",
            url: "global_leaderboard.php",
            dataType: "html",
            success: function (data) {
                $("#tbody_gl").html(data);
            }
        });
    });

}

