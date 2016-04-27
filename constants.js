var constants = {
    eventStreams: {
        LOGGING: "logging",
        INPUT: "input",
        CHARACTEREVENT: "characterEvent",
        GAMEEVENT: "gameEvent"
    },
    inputOperation: {
        MOVE: "move"
    },
    gameSize: {
        SMALL: {
            x: 10,
            y: 10,
            players: 3
        }  ,
        MEDIUM: {
            x: 20,
            y: 20,
            players: 8
        }
    },
    gameOperation: {
        NEXTTURN: "nextTurn"
    },
    characterOperation: {
        MOVE: "move",
        ATTACK: "attack",
        DIE: "die",
        GETDAMAGE: "getDamage"
    },
    tileUpdateOperation: {
        INIT: "init",
        ADDCHARACTER: "add",
        CLEAR: "clear",
        ATTACK: "attack",
        GETDAMAGE: "getDamage"
    },
    weapon: {
        PISTOL: {
            range: 3,
            damage: 2,
            accuracy: 2
        },
        RIFLE: {
            range: 5,
            damage: 3,
            accuracy: 4
        }
    }
};

module.exports = constants;