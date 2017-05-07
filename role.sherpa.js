var s = require('shared');
const moveOpts = {visualizePathStyle: {stroke: '#0095ff', opacity:0.6}};

function onlyThings(item) {
    const notInterested = [LOOK_FLAGS, LOOK_TERRAIN, LOOK_CREEPS, LOOK_MINERALS];
    return notInterested.indexOf(item.type) == -1;
}
function firstResource(container, isCreep) {
    const store = container[isCreep? 'carry' : 'store'];
    for (var key in store) {
        if (store.hasOwnProperty(key) && key != RESOURCE_ENERGY) {
            return key;
        }
    }
    return RESOURCE_ENERGY;
}

var getRoomsTargets = function(room) {
    var targets = [];
    var potentials = _.filter(room.lookAtArea(0, 0, 49, 49, true), onlyThings);
    var i = 0;
    const bucketNames = [
    'almostEmptyControllerContainer',
    'emptyExtensions',
    'emptyTowers',
    'emptyControllerContainer',
    'constructionSites',
    'roomStorage'
    ];
    const buckets = {};

    for (i = 0; i < bucketNames.length; i++) {
        const bucket = [];
        buckets[bucketNames[i]] = bucket;
        targets.push(bucket);
    }

    for (i = 0; i < potentials.length; i++) {
        let item = potentials[i];
        switch (item.type) {
            default:
            break;
        }
    }

    return targets;
};


var getTarget = function(creep, source) {
    var targets = [];

    if (source && source.structureType == STRUCTURE_LINK) {
        targets = creep.room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return structure.structureType == STRUCTURE_STORAGE && creep.pos.getRangeTo(structure) < 3 && structure.store[RESOURCE_ENERGY] < structure.storeCapacity;
            }
        });
    }

    if (_.sum(creep.carry) > creep.carry[RESOURCE_ENERGY]) {
        targets = [creep.room.storage];
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

var getSource = function(creep, target) {
    creep.memory.lowPriority = false;
    // var sources = creep.room.find(FIND_DROPPED_ENERGY, {filter: (resource) => {
    //     return resource.type != RESOURCE_ENERGY && !PathFinder.search(resource, creep, {ignoreCreeps: true, ignoreRoads:true, maxRooms:1, maxOps: 500}).incomplete;
    //     }
    // });
    // if (sources.length === 0) {
    //     sources = creep.room.find(FIND_DROPPED_ENERGY, {
    //         filter: (resource) => !PathFinder.search(resource, creep, {ignoreCreeps: true, ignoreRoads:true, maxRooms:1, maxOps: 500}).incomplete
    //     });
    // }
    // if (sources.length === 0) {
        var sources = creep.room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return  structure.structureType == STRUCTURE_LINK && structure.energy > 0 && s.isNear(structure, creep.room.storage);
            }
        });
    // }
    if (sources.length === 0) {
        sources = creep.room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                var stored = _.sum(structure.store);
                return  structure.structureType == STRUCTURE_CONTAINER && stored > structure.store[RESOURCE_ENERGY];
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
        creep.memory.lowPriority = true;
    }
    return creep.pos.findClosestByRange(sources);
};

var extract = function(creep, source) {
    var err;
    if (source instanceof Resource) {
        err = creep.pickup(source);
    } else if (source instanceof StructureContainer) {
        err = creep.withdraw(source, firstResource(source, false));
    } else {
        err = creep.withdraw(source, RESOURCE_ENERGY);
        if (err === OK && source.store && source.store[RESOURCE_ENERGY] === 0) {
            err = ERR_NOT_FOUND;
        }
    }
    return err;
};
var deposit = function(creep, target) {
    var err;
    // todo: distinguish store types and energy-only types - for "finished" analysis
    if (target instanceof StructureSpawn || target instanceof StructureExtension || target instanceof StructureContainer || target instanceof StructureTower) {
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
    } else if(target instanceof StructureStorage) {
        err = creep.transfer(target, firstResource(creep, true));
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
        case ERR_NOT_FOUND:
            mem = undefined;
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
        const m = creep.memory;
        const energy = creep.carry.energy;
        const carried = _.sum(creep.carry);
        var target;
        var source;
        var extracting = !m.depositing;

        if (extracting) {
            if (carried == creep.carryCapacity) {
                extracting = false;
            }
        } else {
            if (carried === 0) {
                extracting = true;
            }
        }

        m.depositing = !extracting;

        if (extracting) {
            target = Game.getObjectById(m.target);
            if (m.source && !m.lowPriority) {
                source = Game.getObjectById(m.source);
            }
            if (!source) {
                source = getSource(creep, target);
                m.source = undefined;
            }
            if (source) {
                err = extract(creep, source);
                m.source = errResponse(err, creep, source);
            }
        } else {
            source = Game.getObjectById(m.source);
            if (m.target) {
                target = Game.getObjectById(m.target);
            }
            if (!target) {
                target = getTarget(creep, source);
                m.target = undefined;
            }
            if (target) {
                err = deposit(creep, target);
                m.target = errResponse(err, creep, target);
            }
        }
        return OK;
    }
};

module.exports = roleSherpa;   