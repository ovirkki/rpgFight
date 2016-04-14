function initialize() {
    console.log("initialize ui Handler");
}

function printGameWorld(gameWorld) {
    gameWorld.board.forEach(function(row) {
        var rowString = "|";
        row.forEach(function(tile) {
            if (!tile.occupant) {
                rowString += " ";
            } else {
                rowString += "X";
            }
/*
            } else if (tile.occupant === "enemy") {
                rowString = rowString + "E";
            } else if (tile.occupant === "player") {
                rowString = rowString + "X";
            }
*/
            rowString += "|";
        });
        console.log(rowString);
    });
    console.log("Occupant 0, 0: " + JSON.stringify(gameWorld.board[0][0].occupant));
    console.log("First char on list: " + JSON.stringify(gameWorld.characters[0]));
}

function printCharacters() {
    gameWorld.characters.forEach(function(character) {
        console.log(character);
    });
}

module.exports.initialize = initialize;
module.exports.printGameWorld = printGameWorld;