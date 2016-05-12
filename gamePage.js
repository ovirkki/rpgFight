var serverAddress = "http://localhost:3000";
var socket, canvas, ctx;
var GAME_BOARD_WIDTH = 500;
var GAME_BOARD_HEIGHT = 500;
var gameHeight, gameWidth;

var pathToEmptyTileImg = "img/emptyTile.png";
var pathToPlayerImg = "img/Untitled.png";

function draw(gameData) {
    addCharacters(gameData.characters);
    $("#gameBoard").prop("width", GAME_BOARD_WIDTH);
    $("#gameBoard").prop("height", GAME_BOARD_HEIGHT);
    canvas = document.getElementById("gameBoard");
    //console.log(gameData);
    if (canvas.getContext){
        ctx = canvas.getContext("2d");
        gameHeight = gameData.board.tiles.length;
        gameWidth = gameData.board.tiles[0].length;
        drawTiles(gameData.board.tiles);
        canvas.addEventListener('click', generateAction, false);
    } else {
        console.log("canvas not supported");
    }
}

function getPortraitSourceForCharacter(id) {
    var portraitId = id+1;
    return "img/player" + portraitId + ".png";
}

function getInitializedPlayerData(characterData) {
    var detailedData = $("<div>", {class: "detailedData"});
    var weaponData = $("<div>", {class: "weaponData"}).text("Weapon: " + characterData.inventory.using.weapon.name);
    var healthData = $("<div>", {class: "healthData"}).text("Health: ");
    var currentHealth = $("<span>", {class: "currentHealth"}).text(characterData.hitPoints.current).appendTo(healthData);
    var maxHealth = $("<span>", {class: "maxHealth"}).text("/" + characterData.hitPoints.max).appendTo(healthData);
    return detailedData.append(weaponData).append(healthData);
}

function addCharacters(characterArray) {
    console.log("characters: " + characterArray);
    characterArray.forEach(function(characterData) {
        var playerPortraitSource = getPortraitSourceForCharacter(characterData.id);
        var playerImgElement = $("<img>", {class: "player-img", "src": playerPortraitSource, "alt": ""});
        var playerElement = $("<div>", {id: "characterData-" + characterData.id, class: "characterData"});
        playerElement.append(playerImgElement).append(getInitializedPlayerData(characterData));
        console.log(JSON.stringify(characterData));
        $("#characters").append(playerElement);
    });
    $("#characterData-0").addClass("activeCharacter");
}

function getTileDataArrayForCtxDraw(column, row) {

    var tileHeight = GAME_BOARD_HEIGHT / gameHeight;
    var tileWidth = GAME_BOARD_WIDTH / gameWidth;
    var x = Math.floor(column * tileWidth);
    var y = Math.floor(row * tileHeight);
    return {
        x: x,
        y: y,
        width: tileWidth,
        height: tileHeight
    };
}

function addImageToTile(src, column, row) {

    var drawData = getTileDataArrayForCtxDraw(column, row);
    var img = new Image();
    img.onload = function() {
        ctx.drawImage(img, drawData.x, drawData.y, drawData.width, drawData.height);
    };
    img.src = src;
}

function clearTile(column, row) {
    var drawData = getTileDataArrayForCtxDraw(column, row);
    ctx.clearRect(drawData.x, drawData.y, drawData.width, drawData.height);
}

function drawTiles(rowArray) {

    var tileHeight = GAME_BOARD_HEIGHT / gameHeight;
    var tileWidth = GAME_BOARD_WIDTH / gameWidth;
    //console.log("size: r: " + rows + ", c: " + columns);
    var tileArrays = rowArray.forEach(function(row) {
        return row.forEach(function(tile) {
            var src;
            if(!tile.occupant) {

                //src = pathToEmptyTileImg;
            } else {
                src = getPortraitSourceForCharacter(tile.occupant.id);
                addImageToTile(src, tile.coordinates.x, tile.coordinates.y);
            }
            //addImageToTile(src, tile.coordinates.x, tile.coordinates.y);

        });
    });
}

function renderCharacterEvent(data) {
    if(data.tileOperation === "clear") {
        addImageToTile(pathToEmptyTileImg, data.coordinates.x, data.coordinates.y);
    } else if(data.tileOperation === "add") {
        addImageToTile(pathToPlayerImg, data.coordinates.x, data.coordinates.y);
    }
}

function renderMoveEvent(character, moveData) {
    //addImageToTile(pathToEmptyTileImg, eventData.data.oldCoordinates.x, eventData.data.oldCoordinates.y);
    clearTile(moveData.data.oldCoordinates.x, moveData.data.oldCoordinates.y);
    addImageToTile(getPortraitSourceForCharacter(character.id), moveData.coordinates.x, moveData.coordinates.y);
}

function renderAttackEvent() {
    console.log("ATTACK!: ");
}

function renderDamage(character, damageData) {
    console.log("render damage: " + "#characterData-" + character.id + ".currentHealth");
    $("#characterData-" + character.id + " .currentHealth").text(damageData.currentHitpoints);
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

function getClickedTile(event) {
    var rect = canvas.getBoundingClientRect();
    var x = event.clientX - rect.left;
    var y = event.clientY - rect.top;

    var column = Math.floor(gameWidth * x / GAME_BOARD_WIDTH);
    var row = Math.floor(gameHeight * y / GAME_BOARD_HEIGHT);
    return {
        x: column,
        y: row
    };
    //console.log("clicked coordinates: col: " + column + ", row: " + row);
}

function generateAction(event) {
    var coordinates = getClickedTile(event);
    if(event.shiftKey) {
        //attack
        console.log("attack to " + JSON.stringify(coordinates));
    } else {
        //move
        console.log("move to " + JSON.stringify(coordinates));
    }
    socket.emit("action", {
        coordinates: getClickedTile(event)
    });
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

function parseGameUpdate(newGamedata) {

    if(!newGamedata || !newGamedata.operation) {
        console.log("No game data to be parsed!");
        return;
    }
    console.log("Parsing gameUpdate, operation: " + newGamedata.operation);
    if (newGamedata.operation === "gameInit") {
        console.log("init game!");
        draw(newGamedata.eventData);
    } else if (newGamedata.operation === "nextTurn") {
        console.log("next turn!!!: " + JSON.stringify(newGamedata.eventData));
        $(".activeCharacter").removeClass("activeCharacter");
        $("#characterData-" + newGamedata.eventData.characterId).addClass("activeCharacter");
    }
}

function parseCharacterUpdate(data) {

    if(!data || !data.operation || !data.character) {
        console.log("No player data to be parsed!");
        return;
    }
    console.log("Parsing playerUpdate, operation: " + data.operation);
    if (data.operation === "move") {
        console.log("move event: " + JSON.stringify(data.eventData));
        renderMoveEvent(data.character, data.eventData);
    } else if (data.operation === "attack") {
        console.log("attack event: " + JSON.stringify(data));
        renderAttackEvent();
    } else if(data.operation === "getDamage") {
        console.log("getting damage: " + JSON.stringify(data));
        renderDamage(data.character, data.eventData);
    }
}

function addSocketEventHandlers() {
    socket.on("connect", function(data) {
        //addMessage(data.message);
        console.log("connect event received!");
        $("#startGameButton").prop('disabled', false);
    });

    socket.on("initGame", function(data) {
        console.log("game init received: " + data);
    });
    socket.on("gameUpdate", function(eventData) {
        //$("#gameField").append(JSON.stringify(eventData));
        parseGameUpdate(eventData);
    });
    socket.on("characterUpdate", function(eventData) {
        //$("#gameField").append(JSON.stringify(eventData));
        parseCharacterUpdate(eventData);
    });
    socket.on("log", function(logData) {
        $("#logBox").append(logData + "<br>");
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