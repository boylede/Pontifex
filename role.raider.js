var s = require('shared');

var getTarget = function getTarget(creep) {
    let target;
    let targets = [];
    
    targets = creep.room.find(FIND_HOSTILE_CREEPS);
    if (targets.length === 0) {
        targets = creep.room.find(FIND_HOSTILE_STRUCTURES, {filter: (str) => str.structureType == STRUCTURE_TOWER});
    }
    target = creep.pos.findClosestByRange(targets);
    return target;
};

var raider = {
    run: function(creep) {
        var err = OK;
        var m = creep.memory;
        var target;
        var destination = new RoomPosition(22, 32, Memory.attack);
        var path = {visualizePathStyle: {stroke: '#ff3322', opacity: 1.0}};
        if (creep.room.name == Memory.attack) {
            //creep.moveTo(creep.room.controller);
            //err = creep.signController(creep.room.controller, 'Kilroy was here.');
            target = getTarget(creep);
            creep.moveTo(target, path);
            err = creep.attack(target);
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
                break;
            default:
                s.creepErr(creep, err);
            break;
        }
        return OK;
    }
};

module.exports = raider;