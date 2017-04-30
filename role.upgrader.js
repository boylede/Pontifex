var s = require('shared');

var getSource = function(creep) {
    var sources = creep.room.find(FIND_STRUCTURES, {
        filter: (structure) => {
            return (structure.structureType == STRUCTURE_CONTAINER || structure.structureType == STRUCTURE_STORAGE) &&
            structure.store[RESOURCE_ENERGY] >= creep.carryCapacity;
        }
    });
    if (sources.length === 0) {
        sources = creep.room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return (structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN) &&
                structure.energy >= creep.carryCapacity;
            }
        });
    }
    if (sources.length === 0) {
        sources = creep.room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return (structure.structureType == STRUCTURE_CONTAINER || structure.structureType == STRUCTURE_STORAGE);
            }
        });
    }
    if (sources.length === 0) {
        sources = creep.room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return (structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN);
            }
        });
    }
    if (sources.length === 0) {
        sources = creep.room.find(FIND_SOURCES);
    }
    
    if (sources.length === 0 ) {
        console.log('upgrader lost');
        creep.memory.role = 'defective';
        return;
    }
    return creep.pos.findClosestByRange(sources);
};

var roleUpgrader = {
    run: function(creep) {
        var m = creep.memory;

        if(m.upgrading && creep.carry.energy === 0) {
            m.upgrading = false;
        }
        if(!m.upgrading && creep.carry.energy == creep.carryCapacity) {
            m.upgrading = true;
        }

        if(m.upgrading) {
            if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller, {visualizePathStyle: {stroke: '#ffffff'}});
            }
        } else {
            var err;
            var source = getSource(creep);
            if (source) {
                if (source.structureType == STRUCTURE_CONTAINER || source.structureType == STRUCTURE_STORAGE || source.structureType == STRUCTURE_SPAWN || source.structureType == STRUCTURE_EXTENSION) {
                    err = creep.withdraw(source, RESOURCE_ENERGY);
                } else if (source.energy > 0) {
                    err = creep.harvest(source);
                } else {
                    err = source.transferEnergy(creep, creep.carryCapacity);
                }
                if(err == ERR_NOT_IN_RANGE) {
                    creep.moveTo(source, {visualizePathStyle: {stroke: '#ffaa00'}});
                }
            }
        }
    }
};

module.exports = roleUpgrader;