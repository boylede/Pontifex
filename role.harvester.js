var s = require('shared');
var nerf = require('common.nerfHerder');

var getTarget = function(creep) {
	var targets = creep.room.find(FIND_STRUCTURES, { filter: (structure) => {
		return (structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN || structure.structureType == STRUCTURE_CONTAINER) &&
		structure.energy < structure.energyCapacity; }
	});
	return targets[0];
};
var getSource = function(creep) {
    var sources = creep.room.find(FIND_SOURCES);
    console.log('found ' + sources.length + ' sources.');
	return sources[0];
};
var roleChange = function(creep, reason) {
	// function to be overridden by role
	// returns a role module, changes the screep to have that role.
	if (reason == ERR_NO_TARGET) {
		creep.memory.role='builder';
	}
};

var roleHarvester = {
	/** @param {Creep} creep **/
	run: function(creep, stageC) {
		return nerf.herd(creep, stageC, getSource, getTarget, roleChange);
	}
};

module.exports = roleHarvester;