var changeRole = function(creep, role) {
	if (creep.memory.tenured === true) {
		creep.say('⚡ ' + role);
	} else {
		creep.memory.role = role;
		creep.say(' ' + role);
		creep.memory.upgrading = false;
	}
	
};

var roleUpgrader = {
	/** @param {Creep} creep **/
	run: function(creep, stageController) {
		var m = creep.memory;

		if(m.upgrading && creep.carry.energy === 0) {
			m.upgrading = false;
			creep.say(' refill');
		}
		if(!m.upgrading && creep.carry.energy == creep.carryCapacity) {
			m.upgrading = true;
			creep.say('⚡ upgrade');
		}

		if(m.upgrading) {
			if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
				creep.moveTo(creep.room.controller, {visualizePathStyle: {stroke: '#ffffff'}});
			}
		} else if (creep.room.find(FIND_CONSTRUCTION_SITES, {filter: {my: true}}).length > 0 && !m.tenured) {
			changeRole(creep, 'builder');
		} else {
			var sources = creep.room.find(FIND_STRUCTURES, {
					filter: (structure) => {
						return (structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN || structure.structureType == STRUCTURE_CONTAINER) &&
							structure.energy > 0;
					}
			});
			var err = sources[0].transferEnergy(creep, creep.carryCapacity);
			if(err == ERR_NOT_IN_RANGE) {
				creep.moveTo(sources[0], {visualizePathStyle: {stroke: '#ffaa00'}});
			} else if (err == ERR_NOT_ENOUGH_ENERGY) {
				changeRole(creep, 'harvester');
			}
		}
	}
};

module.exports = roleUpgrader;