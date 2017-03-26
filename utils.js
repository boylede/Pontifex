var currentVersion = '0.0.0.5';

var setup = function() {
	if (Memory.setup === undefined) {
		console.log('Setting up environment');
		Memory.rooms = {};
		Memory.flags = {};
		Memory.spawns = {};
		Memory.creeps = {};
		Memory.setup = true;
	}
};

var fixCreepsInMemory = function() {
	var contain = {};
	for (var creep in Game.creeps) {
		contain[creep] = Memory.creeps[creep];
	}
	delete Memory.creeps;
	Memory.creeps = contain;
	return OK;
};


module.exports = {
	setup: setup,
	currentVersion: currentVersion,
	fixCreepsInMemory: fixCreepsInMemory
};