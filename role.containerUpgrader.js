var s = require('shared');

var freeSpace = function(src) {
    var free = _.filter(
        src.room.lookForAtArea(LOOK_STRUCTURES, src.pos.y - 2, src.pos.x - 2, src.pos.y + 2, src.pos.x + 2, true),
        (str) => str.structure.structureType == STRUCTURE_LINK && str.structure.energy > 0
        );
    if (free.length === 0) {
        free = _.filter(
        src.room.lookForAtArea(LOOK_STRUCTURES, src.pos.y - 2, src.pos.x - 2, src.pos.y + 2, src.pos.x + 2, true),
        (str) => str.structure.structureType == STRUCTURE_CONTAINER
        );
    }
    var free_containers = [];
    for (var name in free) {
        free_containers.push(free[name].structure);
    }
    return free_containers;
};

function onTop(creep, container) {
    return creep.pos == container.pos;
}

var immobileUpgrader = {
    run: function(creep) {
        var err = OK;
        var m = creep.memory;
        var controller = creep.room.controller;
        var container = creep.pos.findClosestByRange(freeSpace(controller));

        if (creep.pos.getRangeTo(container) <= 1) {
            if (creep.carry[RESOURCE_ENERGY] > 0) {
                err = creep.upgradeController(controller);
            } else {
                err = creep.withdraw(container, RESOURCE_ENERGY);
            }

            switch (err) {
                case ERR_NOT_ENOUGH_RESOURCES:
                case ERR_TIRED:
                case ERR_BUSY:
                case OK:
                break;
                default:
                s.creepErr(creep, err);
                break;
            }
        } else {
            creep.moveTo(container);
        }
        return OK;
    }
};

module.exports = immobileUpgrader;