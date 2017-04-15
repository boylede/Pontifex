var s = require('shared');
var getSource = function(creep) {
    var sources = creep.room.find(FIND_DROPPED_ENERGY, {filter: (resource) => resource.type = RESOURCE_ENERGY});
    //console.log('found ' + sources.length + ' dropped energy.');
    if (sources.length === 0) {
    sources = creep.room.find(FIND_SOURCES, {
                    filter: (src) => src.energy > 0
            });
    }
    return sources[0];
};
var roleHarvester = {
    run: function(creep, stageC) {
        var err = OK;
        var m = creep.memory;
        var source = getSource(creep);
        // if (stageC.name == 'stable') {
        //     m.role = 'builder';
        //     return;
        // }
        // var source = Game.getObjectById(m.source);
        // if ( source == null) {
        //     if (m.savedSource !== undefined) {
        //         m.source = m.savedSource;
        //         source = Game.getObjectById(m.source);
        //     } else {
        //         source = getSource(creep);
        //         m.source = source.id;
        //     }
        // } else {
        //     source = Game.getObjectById(m.source);
        // }
        //creep.say('harvesting...');
        
        //todo: have creep store target in memory for quicker loops.
        if(creep.carry.energy < creep.carryCapacity) {
            //var sources = creep.room.find(FIND_SOURCES);
            //creep.say(sources.length);
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
                //console.log('hh ' + target.id);
                if(creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
                }
            } else {
                //creep.memory.role='builder';
                //console.log('nowhere to put resource');
                creep.say('^v^');
            }
        }
        return OK;
    }
};

module.exports = roleHarvester;