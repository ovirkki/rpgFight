var constants = {
    eventStreams: {
        LOGGING: "logging",
        INPUT: "input",
        GAMEEVENT: "gameEvent"
    },
    gameSize: {
        SMALL: {
            x: 10,
            y: 10,
            enemies: 2
        }  ,
        MEDIUM: {
            x: 20,
            y: 20,
            enemies: 8
        }
    },
    tileUpdateOperation: {
        INIT: "init",
        ADD: "add",
        CLEAR: "clear",
        DIE: "die",
        ATTACK: "attack",
        GETDAMAGE: "getDamage"
    }
};

module.exports = constants;