let numbers = new Array(16), moves = 0, time, intFirstMemNo, intSecondMemNo, intPreId, solves = 0;
let arrCollectedNums = new Array(16);
let hh = 0, mm = 0, ss = 0, x;
let data = {};

$(document).ready(function () {

    timeCounter();
    imageClick();
    getMemoryNums();

    $(".save-game-data").click(function () {
        saveGame();
    });
});

function imageClick(){
    $(".single-column").on("click", function handler() {
        //disabling click upto execution of this function
        $('.single-column').off('click');
        moves++;

        let id = $(this).attr('id');

        //getting memory number of clicked image
        let intCurMemNo = numbers[id], intPairNo;

        intPairNo=setImage(id,intCurMemNo);

        if (moves % 2 == 0) {
            $(".spn-moves").text(moves/2);
            setTimeout(function () {
                intSecondMemNo = intPairNo;
                if (intFirstMemNo != intSecondMemNo || id == intPreId) {
                    $("#img" + id).attr("src", "static/images/blank.png");
                    $("#img" + intPreId).attr("src", "static/images/blank.png");
                } else {
                    solves++;

                    
                    if(solves==8){
                        gameFinished();
                    }
                }

                //enabling click event on images
                $('.single-column').click(handler);
            }, 1000);
        } else {
            intFirstMemNo = intPairNo;
            intPreId = id;

            //enabling click event on images
            $('.single-column').click(handler);
        }
    });
}

function setImage(id,intCurNo){
    
        if (intCurNo > 7) {
            intPointImg = intCurNo - 8;
        } else {
            intPointImg = intCurNo;
        }
        $("#img" + id).attr("src", "static/images/pic" + intPointImg + ".png");

        return intPointImg;
}

function gameFinished(){
    
    clearInterval(x);

    time = $(".spn-timer").text();
    moves = moves / 2;//pair of click => one move

    data.numOfMoves = moves;
    data.timeTaken = time;
    console.log("data on game finish:", data);

    alert("You win the Game "+"\nmoves: " + moves + "\nTime taken:" + time);

    $(".player-det").removeClass("player-det-hide");
    
    //$(".spn-timer").text("00:00:00");
}

function saveGame(){
    if ($(".player-name").val() != "") {
        let playerName = $(".player-name").val();
        data.player = playerName;
        console.log("data on game save:", data);
        ajaxCall("post", data);
        $(".player-name").val("");
    } else {
        alert("Enter player name");
    }
}

function timeCounter() {
    x = setInterval(function () {
        if (ss < 59) {
            ss++;
        } else if (mm < 59) {
            ss = 0;
            mm++;
        } else if (hh < 11) {
            ss = 0;
            mm = 0;
            hh++;
        } else {
            ss = 0;
            mm = 0;
            hh = 0;
        }

        chh = hh < 10 ? "0" + hh : hh;
        cmm = mm < 10 ? "0" + mm : mm;
        css = ss < 10 ? "0" + ss : ss;
        time = chh + ":" + cmm + ":" + css;
        $(".spn-timer").text(time);
    }, 1000);
}

function getMemoryNums() {

    let intNumbers = new Array(16);

    for (let i = 0; i < 16; i++)
        intNumbers[i] = i;

    for (let i = 15, j = 0; i >= 0; i-- , j++) {
        let temp = getRandomArbitrary(i);
        numbers[j] = intNumbers[temp];
        intNumbers = intNumbers.slice(0, temp).concat(intNumbers.slice(temp + 1));
    }

    console.log(numbers);
}

function getRandomArbitrary(max) {
    return parseInt(Math.random() * max);
}

//common Ajax call function to send data to server side
function ajaxCall(method, data, path = "") {
    $.ajax({
        type: method,
        url: "http://localhost:8002/" + path,
        data: JSON.stringify(data),
        contentType: 'application/json',
        success: function (result) {
            if(result.msg=="game data saved"){
                console.log("game data saved");
            }
        }
    });
}