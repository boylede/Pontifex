var debugStyle = {align: 'left'};
 var ERRORS = ['OK',            // 0
 'ERR_NOT_OWNER',               // 1
 'ERR_NO_PATH',                 // 2
 'ERR_NAME_EXISTS',             // 3
 'ERR_BUSY',                    // 4
 'ERR_NOT_FOUND',               // 5
 'ERR_NOT_ENOUGH_RESOURCES',    // 6
 'ERR_INVALID_TARGET',          // 7
 'ERR_FULL',                    // 8
 'ERR_NOT_IN_RANGE',            // 9
 'ERR_INVALID_ARGS',            //10
 'ERR_TIRED',                   //11
 'ERR_NO_BODYPART'              //12
 ];

var getSpawn = function() {
    var i;
    for (i in Game.spawns) {
        return Game.spawns[i];
    }
};

module.exports = {
    creepErr: function(creep, err) {
        var e = 0 - err;
        creep.say(ERRORS[e]);
    },
    roomErr: function(room, err) {
        var e = 0 - err;
        room.visual.text(ERRORS[e], 0.1, 3, debugStyle);
    },
    structErr: function(structure, err) {
        var e = 0 - err;
        structure.room.visual.text(ERRORS[e], structure.pos.x + 1, structure.pos.y + 0.25, debugStyle);
    },
    getSpawn: getSpawn
};