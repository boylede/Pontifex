const debugStyle = {
    align: 'left'
};
const ERRORS = [
    'OK',                         // 0
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

const COOLERRORS = [
    'OK',            // 0
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

const energyAtLocation = function energyAtLocation(location) {
        var energy = src.room.lookForAt(LOOK_ENERGY, location);
        if (energy && energy[0]) {
            return energy[0].amount;
        } else {
            return 0;
        }
    };
module.exports = {
    currentVersion: '0.0.0.11',
    setup: function setup() {
        if (Memory.setup === undefined) {
            console.log('Setting up environment');
            Memory.rooms = {};
            Memory.flags = {};
            Memory.spawns = {};
            Memory.creeps = {};
            Memory.setup = true;
        }
        if ( Memory.fixedCreeps === false) {
            s.fixCreepsInMemory();
            Memory.fixedCreeps = true;
            console.log('fixed creeps');
        }
    },
    fixCreepsInMemory:  function fixCreepsInMemory() {
        var contain = {};
        for (var creep in Game.creeps) {
            contain[creep] = Memory.creeps[creep];
        }
        delete Memory.creeps;
        Memory.creeps = contain;
        return OK;
    },
    debugStyle: debugStyle,
    ERRORS: ERRORS,
    COOLERRORS:  COOLERRORS,
    ERR_NO_SOURCE:  -7281,
    ERR_NO_TARGET:  -7282,
    getSpawn:  function getSpawn() {
        var i;
        for (i in Game.spawns) {
            return Game.spawns[i];
        }
    },
    energyAtLocation:  energyAtLocation,
    isEnergyEnough:  function isEnergyEnough(constructionSite) {
        var required = constructionSite.progressTotal - constructionSite.progress;
        return required <= energyAtLocation(constructionSite);
    },
    isNear:  function isNear(thing1, thing2) {
        return thing1.pos.getRangeTo(thing2) < 2;
    },
    carousel:  function carousel(creep, typ, arr) {
        const len = arr.length;
        let targets = [];
        for (let i = 0; i < len; i++){
            const filter = {filter:arr[i]};
            targets = creep.room.find(typ, filter);
            if (targets.length !== 0) {
                break;
            }
        }
        return creep.pos.findClosestByRange(targets);
    },
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
        structure.room.visual.text(ERRORS[e], structure.pos.x, structure.pos.y + 4.5, debugStyle);
    },
    structSay: function(structure, err) {
        //var e = 0 - err;
        structure.room.visual.text(err, structure.pos.x, structure.pos.y + 3.5, debugStyle);
    }
};