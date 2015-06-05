
var HUMAN_PLAYER = 1;
var COMPUTER_PLAYER = 2;

var board = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];

var humanWinCounter = 0;
var compWinCounter = 0;
var tiesCounter = 0;


function _detect_if_game_ended(board) {
    var gameState = 0; //game still going

    function _three_in_a_row(player) {
        if ((board[0][0] == player && board[0][1] == player && board[0][2] == player) ||
            (board[0][0] == player && board[1][0] == player && board[2][0] == player) ||
            (board[0][0] == player && board[1][1] == player && board[2][2] == player) ||
            (board[0][1] == player && board[1][1] == player && board[2][1] == player) ||
            (board[0][2] == player && board[1][2] == player && board[2][2] == player) ||
            (board[1][0] == player && board[1][1] == player && board[1][2] == player) ||
            (board[2][0] == player && board[2][1] == player && board[2][2] == player) ||
            (board[2][0] == player && board[1][1] == player && board[0][2] == player)) return true;
    }

    if (_three_in_a_row(HUMAN_PLAYER)) gameState = 1; //human win
    else if (_three_in_a_row(COMPUTER_PLAYER)) gameState = 2; //comp win

    else if (board[0][0] !== 0 && board[0][1] !== 0 && board[0][2] !== 0 &&
             board[1][0] !== 0 && board[1][1] !== 0 && board[1][2] !== 0 &&
             board[2][0] !== 0 && board[2][1] !== 0 && board[2][2] !== 0) {
        gameState = 3; //tie game
    }

    return gameState;
}

function _change_board_token(xAxis, yAxis, player) {
    if (board[xAxis][yAxis] === 0) {
        board[xAxis][yAxis] = player;
        _change_image(xAxis, yAxis, player);
        return true;
    } else if (player == 1) {
        alert(
            "FThat square is already occupied.  Please select another square."
        );
    }
    return false;
}

function _is_space_available(xAxis, yAxis, boardgame) {
    if (boardgame[xAxis][yAxis] === 0) {
        return true;
    }
    return false;
}

function _display_if_game_ended(gameState) {
    if (gameState == 1) {
        alert("You won, congratulations!");
        humanWinCounter++;
    } else if (gameState == 2) {
        alert("Gotcha!  I win!");
        compWinCounter++;
    } else if (gameState == 3) {
        alert("We tied.");
        tiesCounter++;
    }
    document.game.you.value = humanWinCounter;
    document.game.computer.value = compWinCounter;
    document.game.ties.value = tiesCounter;
}


function _change_image(xAxis, yAxis, player) {
    var id = xAxis.toString() + yAxis.toString();
    var value = "images/blank.jpg";

    if (player == 1) {
        value = "images/x.jpg";
    } else if (player == 2) {
        value = "images/o.jpg";
    }

    document.images.namedItem(id).src = value;
}

function _reset_board() {
    for (var xAxis = 0; xAxis <= 2; xAxis++) {
        for (var yAxis = 0; yAxis <= 2; yAxis++) {
            board[xAxis][yAxis] = 0;
            _change_image(xAxis, yAxis, 0)
            
        }
    }
}

function _comp_planner(treeDepth, isMaximizingPlayer) {
    var gameState = _detect_if_game_ended(board);
    
    if (gameState == 1) { //human won, we don't need this move info just the score
        return {
            score: treeDepth - 10,
            xMove: -1,
            yMove: -1
        };
    } else if (gameState == 2) { //computer won
        return {
            score: 10 - treeDepth,
            xMove: -1,
            yMove: -1
        };
    } else if (gameState == 3) { //tie
        return {
            score: 0,
            xMove: -1,
            yMove: -1
        };
    }
    var score = 0;
    var player = 3;
    //The game hasn't ended, so lets think about what the next move may be
    if (isMaximizingPlayer) { //computers turn
        score = -20; //initializes variable, immediately overridden on first score return
        daFunc = Math.max;
        player = COMPUTER_PLAYER;
    } else { // humans turn
        score = 20; //initializer, will be immediately overridden
        daFunc = Math.min; // returns the least value
        player = HUMAN_PLAYER;
    }
    var xMove = -1;
    var yMove = -1;

    //Get the score outcomes for the available board moves
    for (var xAxis = 0; xAxis <= 2; xAxis++) {
        for (var yAxis = 0; yAxis <= 2; yAxis++) { 
            var available = _is_space_available(xAxis, yAxis, board);
            if (available) {
                board[xAxis][yAxis] = player;
                var move = _comp_planner(1+treeDepth, !isMaximizingPlayer);
                var scoreFromMove = move.score;
                board[xAxis][yAxis] = 0;
                if (isMaximizingPlayer) {
                    if (scoreFromMove > score) {
                        //get the highest node in the tree move to get that score
                        xMove = xAxis;
                        yMove = yAxis;
                        score = scoreFromMove;
                    }
                } else {
                    if (scoreFromMove < score) {
                        xMove = xAxis;
                        yMove = yAxis;
                        score = scoreFromMove;
                    }
                }
            }
        }
    }
    return {
        score: score,
        xMove: xMove,
        yMove: yMove
    };
}

function _comp_choice() {
    isGameOver = _detect_if_game_ended(board);
    if (isGameOver > 0){
        _display_if_game_ended(isGameOver);   
    }
    nextMove = _comp_planner(0, true, -1, -1);
    xMove = nextMove.xMove;
    yMove = nextMove.yMove;
    _change_board_token(xMove, yMove, COMPUTER_PLAYER);

    _display_if_game_ended( _detect_if_game_ended(board) );
}

function your_choice(chName) {
    var first = parseInt( chName.charAt(0) );
    var last = parseInt( chName.charAt(1) );
    var gameState = _detect_if_game_ended(board);

    if (gameState !== 0) {
        alert(
        "The game has already ended. To play a new game click the Play Again button."
        );
    }
    if (gameState === 0) {
        legalMove = _change_board_token(first, last, HUMAN_PLAYER);
        if (legalMove) {
            gameState = _detect_if_game_ended(board);
            if (gameState === 0) {
                _comp_choice();    
            } else {
                _display_if_game_ended(gameState);
            }
        }
    }
}

function play_again_human() {
    _reset_board();
}

function play_again_computer() {
    _reset_board();
    _comp_choice();
}