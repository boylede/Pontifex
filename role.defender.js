var getTarget = function(creep) {
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
        var err = OK;
        var m = creep.memory;
        var target;
        
        if (m.target) {
            target = Game.getObjectById(m.target);
        }
        if (!target) {
        target = getTarget(creep);
        m.target = undefined;
        }

        if (target) {
            err = creep.attack(target);
            if (err == ERR_NO_BODYPART) {
                err = creep.rangedAttack(target);
            } 
            if(err == ERR_NOT_IN_RANGE) {
                creep.moveTo(target, {visualizePathStyle: {stroke: '#FF0303', fill:'#ff0505'}});
            } else if (err != OK) {
                creep.say(err);
            }
        } else {
            err = creep.moveTo(creep.room.controller);
        }
    }
};

module.exports = roleDefender;