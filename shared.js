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
 var COOLERRORS = ['OK',            // 0
 'NOT MINE!',               // 1
 'NO WAY!',                 // 2
 'WHO?!',             // 3
 'BUSY!',                    // 4
 '404!',               // 5
 'POOR! SAD!',    // 6
 '403!',          // 7
 'FULL!',                    // 8
 'TOO FAR!',            // 9
 'WHAT?!',            //10
 'ZZZZZZ',                   //11
 'RAMSEY!'              //12
 ];

 var ERR_NO_SOURCE = -7281;
 var ERR_NO_TARGET = -7282;

var getSpawn = function() {
    var i;
    for (i in Game.spawns) {
        return Game.spawns[i];
    }
};

module.exports = {
    creepErr: function(creep, err) {
        var e = 0 - err;
        creep.say(COOLERRORS[e]);
    },
    roomErr: function(room, err) {
        var e = 0 - err;
        room.visual.text(COOLERRORS[e], 0.1, 3, debugStyle);
    },
    structErr: function(structure, err) {
        var e = 0 - err;
        structure.room.visual.text(COOLERRORS[e], structure.pos.x + 1, structure.pos.y + 0.25, debugStyle);
    },
    getSpawn: getSpawn
};