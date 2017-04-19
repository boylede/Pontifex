var s = require('shared');
var NSO = {id:null};

var getTarget = function(creep, source) {
    var targets = [];
    
    if (source && source.structureType == STRUCTURE_LINK) {
        targets = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return structure.structureType == STRUCTURE_STORAGE && creep.pos.getRangeTo(structure) < 3 && structure.store[RESOURCE_ENERGY] < structure.storeCapacity;
                    }
                });
    }
    
    if (_.sum(creep.carry) > creep.carry.RESOURCE_ENERGY) {
        let home = Game.rooms.E18S84; // todo: what?
        targets = [home.storage];
        console.log('found something?!');
    }
                
    if (targets.length === 0) {
                targets = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return structure.structureType == STRUCTURE_CONTAINER && structure.store[RESOURCE_ENERGY] < creep.carryCapacity && s.isNear(structure.room.controller, structure);
                    }
                });
            }
    
    if (targets.length === 0) {
                targets = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN) &&
                            structure.energy < structure.energyCapacity;
                    }
            });
            }

//   var targets = creep.room.find(FIND_STRUCTURES, {
//                     filter: (structure) => {
//                         return (structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN) &&
//                             structure.energy < structure.energyCapacity;
//                     }
//             });
            
            
            if (targets.length === 0) {
                targets = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return  (structure.structureType == STRUCTURE_TOWER) && structure.energy < structure.energyCapacity;
                    }
                });
            }
            if (targets.length === 0) {
                targets = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return structure.structureType == STRUCTURE_CONTAINER && structure.store[RESOURCE_ENERGY] < structure.storeCapacity && s.isNear(structure.room.controller, structure);
                    }
                });
            }
            // if (targets.length === 0) {
            //     targets = creep.room.find(FIND_CONSTRUCTION_SITES, {
            //         filter: (structure) => {
            //             return  (structure.structureType == STRUCTURE_STORAGE && structure.my && s.isEnergyEnough(structure));
            //         }
            //     });
            // }
            // if (targets.length === 0) {
            //     targets = creep.room.find(FIND_STRUCTURES, {
            //         filter: (structure) => {
            //             return structure.structureType == STRUCTURE_CONTAINER && structure.store[RESOURCE_ENERGY] < structure.storeCapacity && s.isNear(structure.room.controller, structure);
            //         }
            //     });
            // }
            if (targets.length === 0) {
                targets = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return structure.structureType == STRUCTURE_STORAGE && structure.store[RESOURCE_ENERGY] < structure.storeCapacity;
                    }
                });
            }
    return creep.pos.findClosestByRange(targets);
};

var getSource = function(creep) {
    var sources = creep.room.find(FIND_DROPPED_ENERGY, {filter: (resource) => resource.type != RESOURCE_ENERGY}); // && resource.amount > 249, creep.carryCapacity
    //console.log('found ' + sources.length + ' dropped energy.');
    //if (sources.length === 0) {
       // var sources = creep.room.find(FIND_STRUCTURES, {
    //         filter: (structure) => {
    //             return  structure.structureType == STRUCTURE_CONTAINER && structure.store[RESOURCE_ENERGY] > 500 && !s.isNear(structure.room.controller, structure);
    //         }
    //      });
    //}
    if (sources.length === 0) {
        sources = creep.room.find(FIND_DROPPED_ENERGY, {
            filter: (resource) => resource.amount >= 2000
        });
    }
    if (sources.length === 0) {
        sources = creep.room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return  structure.structureType == STRUCTURE_LINK && structure.energy > 0 && s.isNear(structure, creep.room.storage);
            }
         });
    }
    if (sources.length === 0) {
        sources = creep.room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return  structure.structureType == STRUCTURE_CONTAINER && structure.store[RESOURCE_ENERGY] > creep.carryCapacity && !s.isNear(structure.room.controller, structure);
            }
         });
    }
    
    if (sources.length === 0) {
        sources = creep.room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return  structure.structureType == STRUCTURE_STORAGE && structure.store[RESOURCE_ENERGY] > 0;
            }
         });
    }
    if (sources.length === 0) {
        sources = creep.room.find(FIND_DROPPED_ENERGY);
    }
    return creep.pos.findClosestByRange(sources);
};
var roleChange = function(creep, reason) {

};
var extract = function(creep, source) {
    var err;
    if (source instanceof Resource) {
        err = creep.pickup(source);
    } else {
        err = creep.withdraw(source, RESOURCE_ENERGY);
        if (err === OK && source.store && source.store[RESOURCE_ENERGY] === 0) {
            creep.say('drained');
            err = ERR_NOT_FOUND;
        }
    }
    return err;
};
var deposit = function(creep, target) {
    var err;
    // todo: distinguish store types and energy-only types - for "finished" analysis
    if (target instanceof StructureSpawn || target instanceof StructureExtension || target instanceof StructureStorage || target instanceof StructureContainer || target instanceof StructureTower) {
        err = creep.transfer(target, RESOURCE_ENERGY);
        if (err == OK && target.energy == target.energyCapacity) {
            err = ERR_NOT_FOUND;
        }
    } else if (target instanceof ConstructionSite) {
        if (creep.pos == target.pos) {
            err = ERR_NOT_IN_RANGE;
        } else {
            err = creep.drop(RESOURCE_ENERGY);   
        }
    }
    /* else if (target instanceof StructureController) {
        err = creep.upgradeController(target);
    } else if (target instanceof ConstructionSite) {
        err = creep.build(target);
        if (err === OK && !(target instanceof ConstructionSite )) {
            creep.say('done');
            err = ERR_NOT_FOUND;
        }
    } else if (target instanceof StructureTower) {
        err = creep.transfer(target, RESOURCE_ENERGY);
        if (err === OK && target.storeCapacity == _.sum(target.store)) {
            creep.say('done');
            err = ERR_NOT_FOUND
        }
    } */ else {
        err = ERR_NOT_FOUND;
    }
    return err;
};
var roleSherpa = {
    run: function(creep) {
        var err = OK;
        var m = creep.memory;
        var energy = creep.carry.energy;
        var target = NSO;
        var source = NSO;
        //console.log('running role for ' + creep.name + ' : ' + m.role + ' : ' + m.last);

        if (m.target !== null && m.source !== null) {
            target = Game.getObjectById(m.target);
            source = Game.getObjectById(m.source);
            if (target === null || source === null) {
                //console.log('eff..');
                m.target = null;
                m.source = null;
                return;
            }
            
        } else {
            //console.log('lets avoid this ever happening to ..........'+ m.role + '.. ' + creep.name);
            target = getTarget(creep, false);
            source = getSource(creep, false);
        }

        if (m.depositing) {
            if (energy === 0) {
                // done depositing, start extraction.
                creep.say('e^');
                m.depositing = false;
                source = getSource(creep, false);
                if (source === null) {
                    console.log('Can\'t find any ' + m.role + ' sources for ' + creep.name + '.');
                    m.source = null;
                    return;
                    //return roleChange(creep, ERR_NO_SOURCE);
                } else {
                    m.source = source.id;
                }
            } else {
                // not done depositing, deposit again
                err = deposit(creep, target);
                switch (err) {
                    case ERR_NOT_IN_RANGE:
                    creep.moveTo(target, {visualizePathStyle: {stroke: '#0095ff', opacity:0.6}});
                    break;
                    case OK:
                    break;
                    case ERR_NOT_ENOUGH_ENERGY:
                    case ERR_NOT_FOUND:
                    case ERR_FULL:
                        // no target or target no longer valid
                        //m.depositing = false;
                        target = getTarget(creep, source);
                        if (target === null) {
                            console.log('Can\'t find any ' + m.role + ' targets for ' + creep.name + '.');
                            m.target = null;
                        } else {
                            m.target = target.id;
                        }
                        break;
                    default:
                    s.creepErr(creep, err);
                    break;
                }
            }
        } else {
            //not depositing, we're extracting!
            if (energy == creep.carryCapacity) {
                // done extracting, switch to depositing
                creep.say('dv');
                m.depositing = true;
                target = getTarget(creep, source);
                if (target === null ) {
                    console.log('Can\'t find any ' + m.role + ' targets for ' + creep.name + '.');
                    m.target = null;
                } else {
                    m.target = target.id;
                }
            } else {
                // lets EXTRACT!!
                err = extract(creep, source);
                switch (err) {
                    case ERR_NOT_IN_RANGE:
                    creep.moveTo(source, {visualizePathStyle: {stroke: '#f1e05a', opacity:0.6}});
                    break;
                    case OK:
                    break;
                    case ERR_BUSY:
                    break;
                    case ERR_NOT_ENOUGH_ENERGY:
                    case ERR_NOT_FOUND:
                        console.log(creep.name + ' no energy for extract from ' + source.id + ' to ' + target.id);
                        source= getSource(creep, target);
                        if (source === null) {
                            console.log('Can\'t find any ' + m.role + ' sources for ' + creep.name + '.');
                            m.source = null;
                        } else {
                            m.source = source.id;
                        }
                        break;
                    default:
                    s.creepErr(creep, err);
                    break;
                }
            }
        }
        if (target === undefined || target === null) {
            console.log(creep.name + ' has an issue with its target');
            creep.say('!');
            m.target = null;
        } else {
            m.target = target.id;
        }
        if (source === undefined || source === null) {
            console.log(creep.name + ' has an issue with its source');
            creep.say('!');
            m.source = null;
        } else {
            m.source = source.id;
        }
        return;
    }
};
    
module.exports = roleSherpa;   