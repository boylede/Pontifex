var s = require('shared');

var freeSpace = function(src) {
    //var src = creep.room.controller;
    var area = src.room.lookForAtArea(LOOK_STRUCTURES, src.pos.y - 1, src.pos.x - 1, src.pos.y + 1, src.pos.x + 1, true);
    var free = _.filter(area, (str) => {
        let st = str.structure;
        /*
        console.log('looking for fat asses at ' + st.id);
        let fatUpgraders = st.room.find(FIND_MY_CREEPS, {filter: (creep) => {
            return creep.memory.role == 'fatUpgrader' && creep.memory.container !== undefined && creep.memory.container == st.id;
        } });
        console.log('found ' + fatUpgraders.length);
        */
        let result = st.structureType == STRUCTURE_CONTAINER;// && fatUpgraders.length === 0;
        return result;
    });
    var free_containers = [];
    for (var name in free) {
        free_containers.push(free[name].structure);
    }
    console.log('found ' + free_containers.length + ' free containers at ' + src.id);
    // return free[0].structure;
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
        var container;

        if (m.container === undefined) {
            let index = -1;
            let containers = freeSpace(controller);
            console.log('found ' + containers.length + ' containers free for upgrader ' + creep.name);
            container = creep.pos.findClosestByRange(containers);
            if ( container !== undefined) {
                console.log('selected container for ' + creep.name);
                m.container = container.id;
                m.empty = false;
            }
        } else {
            container = Game.getObjectById(m.container);
        }
        if (!m.empty) {
            if (creep.pos.x == container.pos.x && creep.pos.y == container.pos.y) {
                if (creep.carry[RESOURCE_ENERGY] > 0) {
                    err = creep.upgradeController(controller);
                } else {
                    err = creep.withdraw(container, RESOURCE_ENERGY);
                }
            } else {
                err = creep.moveTo(container, {visualizePathStyle: {stroke: '#ffaa00'}});
            }

            switch (err) {
                case ERR_NOT_ENOUGH_RESOURCES:
                    m.empty = true;
                    // if (container.store.RESOURCE_ENERGY > 0) m.empty = false;
                    break;
                case ERR_TIRED:
                case ERR_BUSY:
                case OK:
                break;
                default:
                s.creepErr(creep, err);
                break;
            }
        } else {
            //console.log(container.store[RESOURCE_ENERGY] > 0);
            if (container.store[RESOURCE_ENERGY] > 0) m.empty = false;
        }
        return OK;
    }
};

module.exports = immobileUpgrader;