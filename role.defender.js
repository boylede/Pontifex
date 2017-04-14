var roleDefender = {
    run: function(creep, stageController) {
        var m = creep.memory;
        var targets = [];
        //var f = creep.room.find;
        targets = creep.room.find(FIND_HOSTILE_CREEPS);
        if (targets.length === 0 ) {
            targets = creep.room.find(FIND_HOSTILE_STRUCTURES);
            if (targets.length !== 0) err = tower.attack(targets[0]);
        }
        if (targets.length === 0) {
            targets = creep.room.find(FIND_HOSTILE_CONSTRUCTION_SITES);
            if (targets.length !== 0) err = tower.attack(targets[0]);
        }
        if (targets.length === 0) {
            targets = creep.room.find(FIND_FLAGS);
            //console.log('flags ' + targets.length);
            err = creep.moveTo(targets[0]);
            return;
        }
        var target = targets[0]
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