var stages = ['seed', 'rush', 'boom', 'mature', 'hostile'];
var stageModules = {};
stages.forEach(function(e,i,a) {
	stageModules[e] = require('stage.' + e );
});
var change = function(stage) {
	console.log('changing stage to ' + stage);
	return stage;
};
var stage = function(room) {
	if ( Memory.rooms[room.name] === undefined) {
		console.log('new room ' + room.name);
		Memory.rooms[room.name] = {
			creeps:[]
		};
	}
	var mroom = Memory.rooms[room.name];
	var current = mroom.stage || 'seed';
	switch(current) {
		case 'seed':
		if (room.controller) {
			if (room.controller.my) {
				if (Memory.rooms[room.name].creeps && Memory.rooms[room.name].creeps.length > 2) {
					current = change('boom');
				}
			} else {
				current = change('hostile');
			}
		} else {
			current = change('rogue');
		}
		break;
		case 'boom':
		break;
		case 'rush':
		break;
		case 'mature':
		break;
		case 'hostile':
		if (room.controller) {
			if (room.controller.my) {
				current = change('seed');
			}
		}
		break;
	}
	mroom.stage = current;
	return current;
};

module.exports = {
	stages: stageModules,
	stage: stage
};