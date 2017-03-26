var s = require('shared');
var nerf = require('common.nerfHerder');

var getTarget = function(creep) {
	var targets = creep.room.find(FIND_CONSTRUCTION_SITES, {
		filter: {my: true}
	});
	targets = _.sortBy(targets, [(v)=> v.progressTotal - v.progress]);
	return targets[0];
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
	if (reason == ERR_NO_TARGETS) {
		console.log('can\'t find any construction sites');
		creep.memory.role = 'upgrader';
	} else {
		console.log('not enough energy - harvest!');
		creep.memory.role = 'harvester';
		creep.say('harvesting');
	}
};

var roleBuilder= {
	/** @param {Creep} creep **/
	run: function(creep, stageC) {
		return nerf.herd(creep, stageC, getSource, getTarget, roleChange);
	}
};

module.exports = roleBuilder;
