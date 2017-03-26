var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleDefective = require('role.defective');
var stageController = require('controller.stage');
var u = require('utils');
var s = require('shared.creep');

var debugStyle = {align: 'left'};
module.exports.loop = function () {
	u.setup();
	var stage = '';
	var spawn = s.getSpawn();
	var err = OK;
	if (spawn === undefined) {
		return OK;
	}
	if (Memory.fixedCreeps !== true) {
		u.fixCreepsInMemory();
		Memory.fixedCreeps = true;
	}
	for (var r in Game.rooms) {
		var room = Game.rooms[r];
		stage = stageController.stage(room);
		room.visual.text(r, 0.1, 0.5, debugStyle);
		room.visual.text(stage, 0.1, 1.0, debugStyle);
		room.visual.text('energy: ' + room.energyAvailable, 0.1, 1.5, debugStyle);
	}

	var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');
	var upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader');
	var stageC = stageController.stages[stage];

	if(harvesters.length < stageC.desiredHarvesters) {
		err = spawn.createCreep(stageC.harvester, undefined, {role: 'harvester'});
		if (err != OK) {
			s.structErr(spawn, err);
		}
	}
	if(upgraders.length < stageC.desiredUpgraders) {
       err = spawn.createCreep(stageC.upgrader, undefined, {role: 'upgrader', tenured: true, tenuredRole:'upgrader'});
       if (err != OK) {
           s.structErr(spawn, err);
       }
    }
	
	if(spawn.spawning) {
		var spawningCreep = Game.creeps[spawn.spawning.name];
		spawn.room.visual.text(
			'🛠️' + spawningCreep.memory.role,
			spawn.pos.x + 1,
			spawn.pos.y,
			{align: 'left', opacity: 0.8});
	}

	for(var name in Game.creeps) {
		var creep = Game.creeps[name];
		if (creep.ticksToLive < 120) {
			creep.memory.role = 'defective';
		}
		switch (creep.memory.role) {
			case 'harvester':
			roleHarvester.run(creep, stageC);
			break;
			case 'upgrader':
			roleUpgrader.run(creep, stageC);
			break;
			case 'builder':
			roleBuilder.run(creep, stageC);
			break;
			case 'defective':
			roleDefective.run(creep, stageC);
			break;
		}
	}
};
