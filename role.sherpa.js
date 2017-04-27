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
    if (targets.length === 0) {
        targets = creep.room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return structure.structureType == STRUCTURE_STORAGE && structure.store[RESOURCE_ENERGY] < structure.storeCapacity;
            }
        });
    }
    if (targets.length === 0) {
        targets = creep.room.find(FIND_CONSTRUCTION_SITES, {
            filter: (structure) => s.isEnergyEnough(structure)
        });
    }
    return creep.pos.findClosestByRange(targets);
};

var getSource = function(creep) {
    var sources = creep.room.find(FIND_DROPPED_ENERGY, {filter: (resource) => resource.type != RESOURCE_ENERGY}); // && resource.amount > 249, creep.carryCapacity
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
    } else {
        err = ERR_NOT_FOUND;
    }
    return err;
};
var errResponse = function errResponse(err, creep, goal) {
    var mem = goal.id;
    switch (err) {
        case ERR_NOT_IN_RANGE:
        err = creep.moveTo(goal, moveOpts);
        break;
        case OK:
        case ERR_FULL:
        case ERR_NOT_ENOUGH_ENERGY:
        case ERR_TIRED:
        case ERR_BUSY:
        break;
        default:
        creep.say('?');
        break;
    }
    return mem;
};
var roleSherpa = {
    run: function(creep) {
        var err = OK;
        var m = creep.memory;
        var energy = creep.carry.energy;
        var target = NSO;
        var source = NSO;

        if (m.target !== null && m.source !== null) {
            target = Game.getObjectById(m.target);
            source = Game.getObjectById(m.source);
            if (target === null || source === null) {
                m.target = null;
                m.source = null;
                return;
            }
            
        } else {
            target = getTarget(creep, false);
            source = getSource(creep, false);
        }

        if (m.depositing) {
            if (energy === 0) {
                creep.say('e^');
                m.depositing = false;
                source = getSource(creep, false);
                if (source === null) {
                    console.log('Can\'t find any ' + m.role + ' sources for ' + creep.name + '.');
                    m.source = null;
                    return;
                } else {
                    m.source = source.id;
                }
            } else {
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
            if (energy == creep.carryCapacity) {
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