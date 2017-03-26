var s = require('shared');

var roleHarvester = {
	stop: function(creep) {
		//delete creep.harvesting;
		//delete creep.target;
		return OK;
	},
	/** @param {Creep} creep **/
	run: function(creep, stageC) {
		var err = OK;
		//creep.say('harvesting...');
		//todo: have creep store target in memory for quicker loops.
		if(creep.carry.energy < creep.carryCapacity) {
			var sources = creep.room.find(FIND_SOURCES);
			//creep.say(sources.length);
			err = creep.harvest(sources[0]);
			if(err == ERR_NOT_IN_RANGE) {
				creep.moveTo(sources[0], {visualizePathStyle: {stroke: '#ffaa00'}});
			} else if (err != OK) {
				s.creepErr(creep, err);
				
			}
		}
		else {
			var targets = creep.room.find(FIND_STRUCTURES, {
				filter: (structure) => {
					return (structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN || structure.structureType == STRUCTURE_CONTAINER) &&
					structure.energy < structure.energyCapacity;
				}
			});
			if(targets.length > 0) {
				if(creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
					creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
				}
			} else {
				creep.memory.role='builder';
			}
		}
		return OK;
	}
};

module.exports = roleHarvester;