var s = require('shared');

var isNear = function isNear(thing1, thing2) {
    return thing1.pos.getRangeTo(thing2) < 2;
}

 var linkLoop = function linkLoop(link) {
     const m = link.room.memory.links[link.id];
     var receiver;
     //console.log('running loop for Link ' + link.id + ' which is a ' + m.role);
     for (let otherLink in link.room.memory.links) {
         let oLink = Game.getObjectById(otherLink);
         //console.log('examining other link ' + oLink.id)
         if(isNear(oLink, link.room.storage)) {
             receiver = oLink;
             //console.log('found my receiver!');
         }
     }
     //console.log('found receiver ' + receiver.id);
     if (!m || !receiver) {
        link.room.memory.links[link.id] = {
            role: isNear(link, link.room.storage) ? 'receiver' : 'transmitter'
        };
     } else {
         //console.log('running loop for Link ' + link.id + ' which is a ' + m.role);
     
     switch (m.role) {
        case 'receiver':
            // console.log('link is a receiver');
            break;
        case 'transmitter':
            // console.log('link is a transmitter');
            if (link.energy == link.energyCapacity) {
                let err = link.transferEnergy(receiver);
                //console.log('transferring energy from link');
                //console.log(err);
            }
            break;
        case '':
        default:
            console.log('link has no role?!');
            break;
    }
     }
     return;
     var targets = [];
     //var f = tower.room.find;
     //console.log(tower.room.find(FIND_STRUCTURES, {filter: () => true}).length);
     var err = OK;
    targets = tower.room.find(FIND_HOSTILE_CREEPS);
    if (targets.length !== 0) err = tower.attack(targets[0]);
    if (targets.length === 0 ) {
        targets = tower.room.find(FIND_HOSTILE_STRUCTURES);
        if (targets.length !== 0) err = tower.attack(targets[0]);
    }
    if (targets.length === 0) {
        targets = tower.room.find(FIND_HOSTILE_CONSTRUCTION_SITES);
        if (targets.length !== 0) err = tower.attack(targets[0]);
    }
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
        targets = tower.room.find(FIND_STRUCTURES, {filter: (str) => str.hits < str.hitsMax && str.hits < 100000 });
        if (targets.length !== 0) {
            //console.log('found weak bldgs.');
            err = tower.repair(targets[0])
            
        };
    }
    //console.log('found targets: ' + targets.length);
    
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
    run: linkLoop
};