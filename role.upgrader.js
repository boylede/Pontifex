var s = require('shared');
var roleUpgrader = {
    run: function(creep, stageController) {
        var m = creep.memory;

        if(m.upgrading && creep.carry.energy === 0) {
            m.upgrading = false;
            creep.say('refill');
        }
        if(!m.upgrading && creep.carry.energy == creep.carryCapacity) {
            m.upgrading = true;
            creep.say('upgrade');
        }

        if(m.upgrading) {
            if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller, {visualizePathStyle: {stroke: '#ffffff'}});
            }
        } else {
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
            var err;
            var source = creep.pos.findClosestByRange(sources);
            if (source) {
                if (source.energy > 0) {
                    err = creep.harvest(source);
                } else if (source.structureType == STRUCTURE_CONTAINER || source.structureType == STRUCTURE_STORAGE) {
                    err = creep.withdraw(source, RESOURCE_ENERGY);
                } else {
                    err = source.transferEnergy(creep, creep.carryCapacity);
                }

                if(err == ERR_NOT_IN_RANGE) {
                    creep.moveTo(source, {visualizePathStyle: {stroke: '#ffaa00'}});
                }
            }
            // else if (err == ERR_NOT_ENOUGH_ENERGY) {
            //     changeRole(creep, 'harvester');
            // } 
        }
    }
};

module.exports = roleUpgrader;