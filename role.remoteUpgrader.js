var s = require('shared');

var remoteUpgrader = {
    once: function() {
        // a function to run once per reset
    },
    loop: function() {
        // a function to run once per loop.
    },
    run: function(creep, stageC) {
        var err = OK;
        const m = creep.memory;
        const myController = Game.getObjectById(m.controller);
        const path = {visualizePathStyle: {plainCost: 1, swampCost: 1, stroke: '#ffaa00', opacity: 1.0}};
        if (myController) {
            err = creep.moveTo(myController, path);
        }

        let thisRoom = creep.room.name;
        if (Memory.rooms[room].ticksTravelTime === undefined) {
            Memory.rooms[room].ticksTravelTime = 1500 - creep.ticksToLive;
        }
        if (room == Memory.attack) {
            // creep.moveTo(creep.room.controller);
            // if (Memory.rooms[room].ticksTravelTime === undefined) {
            //     Memory.rooms[room] = {ticksTravelTime: 1500 - creep.ticksToLive};
            // }
            // Memory.attack = 'E22S83';
            //err = creep.signController(creep.room.controller, 'Planned Expansion');
            err = creep.moveTo(creep.room.controller, path);
            if(creep.pos.getRangeTo(creep.room.controller) < 2) {
                Memory.rooms[room].ticksTravelTimeToController = 1500 - creep.ticksToLive;
            }
            if(creep.getActiveBodyparts(CLAIM) > 0) {
                if (Game.gcl.level > 1) {
                    err = creep.claimController(creep.room.controller);
                } else {
                    err = creep.reserveController(creep.room.controller);
                }
            } else {
                creep.memory.role = 'builder';
            }
        } else {
            err = creep.moveTo(destination, path);
        }

        switch (err) {
            case ERR_FULL:
            case ERR_NOT_ENOUGH_ENERGY:
        //    case ERR_NOT_ENOUGH_RESOURCES:
        case ERR_TIRED:
        case OK:
        break;
        case ERR_NOT_IN_RANGE:
        creep.moveTo(creep.room.controller, path);
        break;
        default:
        s.creepErr(creep, err);
        break;
    }
    return OK;
}
};

module.exports = remoteUpgrader;