var s = require('shared');

var towerLoop = function towerLoop(room, tower) {
    var targets = [];
    var err = OK;
    targets = room.find(FIND_CREEPS, {filter: (cre) => !cre.my && cre.getActiveBodyparts(HEAL) > 0});
    if (targets.length === 0 ) {
        targets = room.find(FIND_HOSTILE_CREEPS);
    }
    if (targets.length === 0 ) {
        targets = room.find(FIND_HOSTILE_STRUCTURES);
    }
    if (targets.length === 0) {
        targets = room.find(FIND_HOSTILE_CONSTRUCTION_SITES);
    }
    if (targets.length !== 0) {
        err = tower.attack(targets[0]);
    } else {
        if (targets.length === 0) {
            targets = room.find(FIND_MY_STRUCTURES, {filter: (str) => str.hits < str.hitsMax && str.structureType != STRUCTURE_RAMPART});
        }
        if (targets.length === 0) {
            targets = room.find(FIND_STRUCTURES, {filter: (str) => str.hits < str.hitsMax && str.structureType != STRUCTURE_RAMPART && str.structureType != STRUCTURE_WALL});
        }
        if (targets.length === 0) {
            targets = room.find(FIND_STRUCTURES, {filter: (str) => str.structureType == STRUCTURE_RAMPART && str.hits < str.hitsMax && str.hits < 100000 });
        }
        if (targets.length === 0) {
            targets = room.find(FIND_STRUCTURES, {filter: (str) => str.hits < str.hitsMax && str.hits < 10000 });
        }
        if (targets.length === 0  && tower.energy > tower.energyCapacity / 2) {
            if (targets.length === 0) {
                targets = room.find(FIND_STRUCTURES, {filter: (str) => str.hits < str.hitsMax && str.hits < 250000 });
            }
            if (targets.length === 0) {
                targets = room.find(FIND_STRUCTURES, {filter: (str) => str.structureType == STRUCTURE_RAMPART && str.hits < str.hitsMax && str.hits < 400000 });
            }
            if (targets.length === 0) {
                targets = room.find(FIND_STRUCTURES, {filter: (str) => str.hits < str.hitsMax && str.hits < 1000000});
            }
        }
        if (targets.length !== 0) {
            targets.sort((a, b) => a.hits - b.hits);
            err = tower.repair(targets[0]);
            
        }
    }

    switch(err) {
        case OK:
        break;
        case ERR_NOT_ENOUGH_ENERGY:
        break;
        default:
        console.log('tower had error ' + err + ' with target ' + targets[0]);
    }
    return; 
};

module.exports = {
    run: towerLoop
};