var serverAddress = "http://localhost:3000";
var socket, canvas;
var GAME_BOARD_WIDTH = 300;
var GAME_BOARD_HEIGHT = 300;
var gameHeight, gameWidth;

var pathToEmptyTileImg = "img/emptyTile.png";
var pathToPlayerImg = "img/Untitled.png";

function draw(gameData) {
    $("#gameBoard").css({ border: "1px solid black" });
    $("#gameBoard").prop("width", GAME_BOARD_WIDTH);
    $("#gameBoard").prop("height", GAME_BOARD_HEIGHT);
    canvas = document.getElementById("gameBoard");
    console.log("draw called");
    console.log(gameData);
    if (canvas.getContext){
        var ctx = canvas.getContext("2d");
        gameHeight = gameData.board.length;
        gameWidth = gameData.board[0].length;
        drawTiles(gameData.board);
        canvas.addEventListener('click', generateAction, false);
    } else {
        console.log("canvas not supported");
    }
}

function getUpperLeftCoordinate(xPos, yPos, rows, columns) {
    console.log("position: x: " + xPos + ",y: " + yPos);
    var heightOfTile = GAME_BOARD_HEIGHT / gameHeight;
    var widthOfTile = GAME_BOARD_WIDTH / gameWidth;
    var x = xPos * widthOfTile;
    var y = yPos * heightOfTile;
    console.log("X&Y: " + x + ", " + y);
    return {x: x, y: y};
}

function getXCoordinate(xPos, columns) { //gets x coordinate of upper left for tile
    return (xPos / columns) * GAME_BOARD_WIDTH;
}

function getYCoordinate(yPos, rows) { //gets y coordinate of upper left for tile
    return (yPos / rows) * GAME_BOARD_HEIGHT;
}

function addImageToTile(src, column, row) {
    var ctx = canvas.getContext("2d");

    var tileHeight = GAME_BOARD_HEIGHT / gameHeight;
    var tileWidth = GAME_BOARD_WIDTH / gameWidth;
    var x = Math.floor(column * tileWidth); //getXCoordinate(tile.coordinates.x, columns);
    var y = Math.floor(row * tileHeight);  //getYCoordinate(tile.coordinates.y, rows);
    var img = new Image();
    img.onload = function() {
        ctx.drawImage(img, x, y, tileWidth, tileHeight);
    };
    img.src = src;
}

function drawTiles(rowArray) {
    var ctx = canvas.getContext("2d");

    var tileHeight = GAME_BOARD_HEIGHT / gameHeight;
    var tileWidth = GAME_BOARD_WIDTH / gameWidth;
    //console.log("size: r: " + rows + ", c: " + columns);
    var tileArrays = rowArray.forEach(function(row) {
        return row.forEach(function(tile) {
            /*var x = Math.floor(tile.coordinates.x * tileWidth); //getXCoordinate(tile.coordinates.x, columns);
            var y = Math.floor(tile.coordinates.y * tileHeight);  //getYCoordinate(tile.coordinates.y, rows);
            var img = new Image();
            img.onload = function() {
                ctx.drawImage(img, x, y, tileWidth, tileHeight);
            };*/
            var src;
            if(!tile.occupant) {
                src = pathToEmptyTileImg;
            } else {
                src = pathToPlayerImg;
            }
            addImageToTile(src, tile.coordinates.x, tile.coordinates.y);

        });
    });
}

function renderCharacterEvent(data) {
    console.log("HERE!: " + JSON.stringify(data));
    if(data.tileOperation === "clear") {
        addImageToTile(pathToEmptyTileImg, data.coordinates.x, data.coordinates.y);
    } else if(data.tileOperation === "add") {
        addImageToTile(pathToPlayerImg, data.coordinates.x, data.coordinates.y);
    }
}

function getClickedTile(x, y) {

}

function moveLeft() {
    socket.emit("action", {
        operation: "move",
        data: {
            direction: "left"
        }
    });
}

function moveRight() {
    socket.emit("action", {
        operation: "move",
        data: {
            direction: "right"
        }
    });
}

function moveUp() {
    socket.emit("action", {
        operation: "move",
        data: {
            direction: "up"
        }
    });
}

function moveDown() {
    socket.emit("action", {
        operation: "move",
        data: {
            direction: "down"
        }
    });
}

function generateAction(event) {
    var x = event.clientX - canvas.offsetLeft;
    var y = event.clientY - canvas.offsetTop;
    console.log("X: " + x);
    console.log("Y: " + y);
}

function generateServerConnection() {
    socket = io(serverAddress);
}

function startGame() {
    socket.emit("startNewGame");
    $("#startGameButton").prop('disabled', true);
}
function quitGame() {
    socket.emit("quit");
}
//draw();
generateServerConnection();

function parseGameUpdate(data) {

    if(!data || !data.operation || !data.changedData) {
        console.log("No data to be parsed!");
        return;
    }
    console.log("Parsing gameUpdate, operation: " + data.operation);
    if (data.operation === "gameInit") {
        console.log("init game!");
        draw(data.changedData);
    } else if (data.operation === "characterEvent") {
        console.log("character event: " + JSON.stringify(data.changedData));
        renderCharacterEvent(data.changedData);
    }
}

function addSocketEventHandlers() {
    socket.on("connect", function(data) {
        //addMessage(data.message);
        console.log("connect event received!");
        $("#startGameButton").prop('disabled', false);
        //startGame();
        // Respond with a message including this clients' id sent from the server
        //socket.emit('i am client', {data: 'foo!', id: data.id});
    });

    socket.on("initGame", function(data) {
        console.log("game init received: " + data);
    });
    socket.on("log", function(logData) {
        //addMessage(logData);
        $("#logBox").append(logData + "\n");
        //logBox = document.getElementById("logBox");
        //logBox.appendChild(logData);
    });
    socket.on("gameUpdate", function(eventData) {
        //$("#gameField").append(JSON.stringify(eventData));
        parseGameUpdate(eventData);
    });
    socket.on('error', console.error.bind(console));
    socket.on('message', console.log.bind(console));
}


function addMessage(message) {
    var text = document.createTextNode(message),
        el = document.createElement('li'),
        messages = document.getElementById('messages');

    el.appendChild(text);
    messages.appendChild(el);
}

function initialize() {
    generateServerConnection();
    addSocketEventHandlers();
    //  draw();
}