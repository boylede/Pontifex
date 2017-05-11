var getTarget = function(creep) {
   // return Game.getObjectById( '58b88c59009566021e2cf455');
  var targets = creep.room.find(FIND_CREEPS, {filter: (cre) => !cre.my && cre.getActiveBodyparts(HEAL) > 0});
  if (targets.length === 0 ) {
        targets = creep.room.find(FIND_HOSTILE_CREEPS, {
            filter: (cre) => !cre.my && (cre.getActiveBodyparts(RANGED_ATTACK) > 0 || cre.getActiveBodyparts(ATTACK) > 0)
            
        });
    }
    if (targets.length === 0 ) {
        targets = creep.room.find(FIND_HOSTILE_CREEPS);
    }
    if (targets.length === 0 ) {
        targets = creep.room.find(FIND_HOSTILE_STRUCTURES);
    }
    if (targets.length === 0) {
        targets = creep.room.find(FIND_HOSTILE_CONSTRUCTION_SITES);
    }
    return targets[0];
};

var roleDefender = {
    run: function(creep) {
        var m = creep.memory;
        var target = getTarget(creep);
        //var f = creep.room.find;
        // targets = ;
        //console.log(target.name);
        var err = creep.attack(target); 
        if(err == ERR_NOT_IN_RANGE) {
            creep.moveTo(target, {visualizePathStyle: {stroke: '#FF0303', fill:'#ff0505'}});
        } else if (err != OK) {
            creep.say(err);
        }
    }
};

module.exports = roleDefender;