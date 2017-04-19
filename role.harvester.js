var s = require('shared');
var getSource = function(creep) {
    var sources = creep.room.find(FIND_DROPPED_ENERGY, {filter: (resource) => resource.type = RESOURCE_ENERGY});
    if (sources.length === 0) {
        sources = creep.room.find(FIND_SOURCES, {
            filter: (src) => src.energy > 0
        });
    }
    if (sources.length > 0) {
        return creep.pos.findClosestByRange(sources);
    } else {
        console.log('no source here');
        return {};
    }
};
var roleHarvester = {
    run: function(creep, stageC) {
        var err = OK;
        var m = creep.memory;
        var source = getSource(creep);

        if(creep.carry.energy < creep.carryCapacity) {
            if (source.resourceType === undefined) {
                err = creep.harvest(source);
            } else {
                err = creep.pickup(source);
            }
            switch (err) {
                case ERR_NOT_IN_RANGE:
                creep.moveTo(source, {visualizePathStyle: {stroke: '#ffaa00'}});
                break;
                case ERR_FULL:
                source = null;
                break;
                case OK:
                break;
                default:
                s.creepErr(creep, err);
                break;
            }
        }
        else {
            var targets = creep.room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN) &&
                    structure.energy < structure.energyCapacity;
                }
            });
            if (targets.length === 0) {
                targets = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return  (structure.structureType == STRUCTURE_CONTAINER || structure.structureType == STRUCTURE_STORAGE) && structure.store[RESOURCE_ENERGY] < structure.storeCapacity;
                    }
                });
            }
            
            if (targets.length === 0) {
                targets = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return  (structure.structureType == STRUCTURE_TOWER) && structure.energy < structure.energyCapacity;
                    }
                });
            }
            
            if(targets.length > 0) {
                let target = creep.pos.findClosestByRange(targets);
                if(creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
                }
            } else {
                creep.say('^v^');
            }
        }
        return OK;
    }
};

module.exports = roleHarvester;