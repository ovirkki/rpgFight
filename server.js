var http = require('http');
var fs = require('fs');
var index = fs.readFileSync(__dirname + '/index.html');
var Promise = require("bluebird");
var logEvent = require("./eventHandler").logEvent;
var inputController = require("./inputController");
var socketio = require('socket.io');
var Bacon = require("baconjs").Bacon;
var gameHandler = require("./gameHandler");
var eventHandler = require("./eventHandler");

var io, server;
var PORT = 3000;

function initialize() {
    server = http.createServer(function(req, res) {
        var index = fs.readFileSync(__dirname + '/index.html');
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.end(/*index*/);
    });
    io = socketio.listen(server);
    server.listen(PORT);
    //inputController.initialize();
}

function initActionListeners(socket) {

    actions = Bacon.fromEventTarget(socket, "action").map(function(event) {
        console.log("Action!: " + event);
        return {
            character: getCharacterBySocketId(socket.id),
            action: event
        };
    });
    eventHandler.inputStream.merge(actions);
    socket.on("startNewGame", function() {
        console.log("Start new game event from socket!");
        gameHandler.startNewGame();
    });
    socket.on("action", function(data) {
        console.log("Action!");
        var inputObject = {
            //character: gameHandler.getCharacterBySocketId(socket.id),
            character: gameHandler.getActiveCharacter(),
            actionData: data
        };
        //eventHandler.newInput(inputObject);
        inputController.newInput(inputObject);
    });
}

function gameOngoingPromise() {
    initialize();
    return new Promise(function (resolve, reject) {
        // Emit welcome message on connection
        io.on('connection', function(socket) {
            logEvent("Connected: socket: " + socket.id);
            initActionListeners(socket);
            socket.on("disconnect", function() {
                console.log("disconnect!");
                //server.close();
                //resolve("Game ended due disconnection by " + socket.id);
            });
            socket.on("quit", function() {
                //socket.end("bye");
                resolve("Game ended by user");
            });
        });
    });
}

function sendLog(logData) {
    io.emit("log", logData);
}

function sendCharacterEvent(eventData) {
    io.emit("characterUpdate", eventData);
}

function sendGameEvent(eventData) {
    io.emit("gameUpdate", eventData);
}

function initGame(gameObject) {
    //io.emit("initGame", boardObject);
}

module.exports.initialize = initialize;
module.exports.startGame = gameOngoingPromise;
module.exports.startServerAndWaitForGameEvents = gameOngoingPromise;
module.exports.sendLog = sendLog;
module.exports.sendCharacterEvent = sendCharacterEvent;
module.exports.sendGameEvent = sendGameEvent;
module.exports.initGame = initGame;