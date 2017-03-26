var s = require('shared');
var nerf = require('common.nerfHerder');

var getTarget = function(creep) {
	return creep.room.controller;
};

var getSource = function(creep) {
	var sources = creep.room.find(FIND_STRUCTURES, {
		filter: (structure) => {
			return (structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN || structure.structureType == STRUCTURE_CONTAINER) &&
				structure.energy > 0;
			}
	});
	return sources[0];
};
var roleChange = function(creep, reason) {
	/* KEEP - do not change roles of tenured creeps!
	if (creep.memory.tenured === true) {
		creep.say('tenured');
	} else {
		creep.memory.role = role;
		creep.say('new ' + role);
	}*/
};

var roleUpgrader = {
	/** @param {Creep} creep **/
	run: function(creep, stageC) {
		return nerf.herd(creep, stageC, getSource, getTarget, roleChange);
	}
};
module.exports = roleUpgrader;

/*
var roleUpgrader = {
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
*/
