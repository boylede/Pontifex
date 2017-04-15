var s = require('shared');
 
var towerLoop = function towerLoop(tower) {
     //return;
     //console.log('test');
     var targets = [];
     //var f = tower.room.find;
     //console.log(tower.room.find(FIND_STRUCTURES, {filter: () => true}).length);
     var err = OK;
    targets = tower.room.find(FIND_CREEPS, {filter: (cre) => !cre.my && cre.getActiveBodyparts(HEAL) > 0});
    if (targets.length === 0 ) {
        targets = tower.room.find(FIND_HOSTILE_CREEPS);
    }
    if (targets.length === 0 ) {
        targets = tower.room.find(FIND_HOSTILE_STRUCTURES);
    }
    if (targets.length === 0) {
        targets = tower.room.find(FIND_HOSTILE_CONSTRUCTION_SITES);
    }
    if (targets.length !== 0) {
        err = tower.attack(targets[0]);
    } else {
    if (targets.length === 0) {
        targets = tower.room.find(FIND_MY_STRUCTURES, {filter: (str) => {str.hits < str.hitsMax && str.structureType != STRUCTURE_RAMPART} });
        if (targets.length !== 0) {
            err = tower.repair(targets[0])
            
        };
    }
    if (targets.length === 0) {
        targets = tower.room.find(FIND_STRUCTURES, {filter: (str) => str.hits < str.hitsMax && str.structureType != STRUCTURE_RAMPART && str.structureType != STRUCTURE_WALL});
        if (targets.length !== 0) {
            //console.log('found weak bldgs.');
            err = tower.repair(targets[0])
            
        };
    }
    if (targets.length === 0) {
        targets = tower.room.find(FIND_STRUCTURES, {filter: (str) => str.structureType == STRUCTURE_RAMPART && str.hits < str.hitsMax && str.hits < 100000 });
        if (targets.length !== 0) {
            //console.log('found weak bldgs.');
            err = tower.repair(targets[0])
            
        };
    }
    if (targets.length === 0) {
        targets = tower.room.find(FIND_STRUCTURES, {filter: (str) => str.hits < str.hitsMax && str.hits < 10000 });
        if (targets.length !== 0) {
            //console.log('found weak bldgs.');
            err = tower.repair(targets[0])
            
        };
    }
    if (targets.length === 0) {
        targets = tower.room.find(FIND_STRUCTURES, {filter: (str) => str.hits < str.hitsMax && str.hits < 50000 });
        if (targets.length !== 0) {
            //console.log('found weak bldgs.');
            err = tower.repair(targets[0])
            
        };
    }
    //console.log('found targets: ' + targets.length);
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
     
 }

module.exports = {
    run: towerLoop
};