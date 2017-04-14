
var changeRole = function(creep, role) {
    if (creep.memory.tenured == true) {
        creep.say('⚡ ' + role);
    } else {
        //creep.memory.role = role;
        creep.say('🔄 ' + role);
        //creep.memory.upgrading = false;
        //require('role.' + role).run(creep, undefined);
    }
}

var roleUpgrader = {
    run: function(creep, stageController) {
        var m = creep.memory;

        if(m.upgrading && creep.carry.energy == 0) {
            m.upgrading = false;
            creep.say('🔄 refill');
	    }
	    if(!m.upgrading && creep.carry.energy == creep.carryCapacity) {
	        m.upgrading = true;
	        creep.say('⚡ upgrade');
	    }

	    if(m.upgrading) {
            if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller, {visualizePathStyle: {stroke: '#ffffff'}});
            }
        } else {
            var sources = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_CONTAINER || structure.structureType == STRUCTURE_STORAGE) &&
                            structure.store[RESOURCE_ENERGY] >= 50;
                    }
            });
            if (sources.length === 0) {
                sources = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN) &&
                            structure.energy >= 50;
                    }
                });
            }
            
            if (sources.length === 0 ) { 
                return creep.memory.role = 'lost';
                console.error('upgrader got out of room');
            }
            var err;
            var source = creep.pos.findClosestByRange(sources);
            if (source.structureType == STRUCTURE_CONTAINER || source.structureType == STRUCTURE_STORAGE) { 
                err = creep.withdraw(source, RESOURCE_ENERGY);
            } else {
                err = source.transferEnergy(creep, creep.carryCapacity);
            }
            if(err == ERR_NOT_IN_RANGE) {
                creep.moveTo(source, {visualizePathStyle: {stroke: '#ffaa00'}});
            } else if (err == ERR_NOT_ENOUGH_ENERGY) {
                changeRole(creep, 'harvester');
            } 
        }
	}
};

module.exports = roleUpgrader;