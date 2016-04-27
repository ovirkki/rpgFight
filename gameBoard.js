var eventHandler = require("./eventHandler");
var combat = require("./combat");
var _ = require("underscore");
var constants = require("./constants");

function Board(gameSize) {
    var widthHelperArray = _.range(gameSize.x);
    var heightHelperArray = _.range(gameSize.y);
    this.tiles = heightHelperArray.map(function(y) {
        return widthHelperArray.map(function(x) {
            return {
                coordinates: {
                    x: x,
                    y: y
                },
                occupant: undefined
            };
        });
    });
    this.initChangeListener();
}

Board.prototype.updateBoard = function(coordinates, operation, character) {
    if(operation === constants.tileUpdateOperation.ADDCHARACTER) {
        this.tiles[coordinates.y][coordinates.x].occupant = character;
    } else if(operation === constants.tileUpdateOperation.CLEAR) {
        this.tiles[coordinates.y][coordinates.x].occupant = undefined;
    } else if(operation === constants.tileUpdateOperation.DIE) {

    }
};

Board.prototype.isMoveAllowed = function(newCoordinates) {
    return newCoordinates.x >= 0 && newCoordinates.y < this.tiles.length &&
        newCoordinates.y >= 0 && newCoordinates.x < this.tiles[newCoordinates.y].length;
};

Board.prototype.isOccupiedByAliveEnemy = function(character, newCoordinates) {
    console.log("isOccupiedByAliveEnemy: " + JSON.stringify(newCoordinates));
    console.log("isOccupiedByAliveEnemy: occu" + JSON.stringify(this.tiles[newCoordinates.y][newCoordinates.x].occupant));
    console.log("isOccupiedByAliveEnemy: charid: " + character.id);
    return this.tiles[newCoordinates.y][newCoordinates.x].occupant !== undefined &&
        !this.tiles[newCoordinates.y][newCoordinates.x].occupant.isDead() &&
        this.tiles[newCoordinates.y][newCoordinates.x].occupant.id !== character.id;
};

Board.prototype.calculateDistance = function(startCoordinates, endCoordinates) {
    var xOffset = Math.abs(startCoordinates.x - endCoordinates.x);
    var yOffset = Math.abs(startCoordinates.y - endCoordinates.y);
    return xOffset + yOffset;
};

Board.prototype.initChangeListener = function() {
    var board = this; //Assign this to variable as it does not point to board object when called in Bacon stream onValue
    var moveStream = eventHandler.characterEventStream
    .filter(function(eventData) {
        return eventData.operation === constants.characterOperation.MOVE;
    })
    .onValue(function(event) {
        console.log("move event: " + JSON.stringify(event));
        board.updateBoard(event.eventData.data.oldCoordinates, constants.tileUpdateOperation.CLEAR);
        board.updateBoard(event.eventData.coordinates, constants.tileUpdateOperation.ADDCHARACTER, event.character);
    });
};

//module.exports.initBoard = initBoard;
module.exports = Board;