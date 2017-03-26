/*
var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleDefective = require('role.defective'); */
var roles = require('controller.roles');
var stageController = require('controller.stage');
var s = require('shared');

var debugStyle = {align: 'left'};
module.exports.loop = function () {
	s.setup();
	var stage = '';
	var spawn = s.getSpawn();
	var err = OK;
	if (spawn === undefined) {
		return OK;
	}
	if (Memory.fixedCreeps !== true) {
		s.fixCreepsInMemory();
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
	} else if(upgraders.length < stageC.desiredUpgraders) {
       err = spawn.createCreep(stageC.upgrader, undefined, {role: 'upgrader', tenured: true, tenuredRole:'upgrader'});
       if (err != OK) {
           s.structErr(spawn, err);
       }
    }
	
	if(spawn.spawning) {
		var spawningCreep = Game.creeps[spawn.spawning.name];
		spawn.room.visual.text(
			'::' + spawningCreep.memory.role,
			spawn.pos.x + 1,
			spawn.pos.y,
			{align: 'left', opacity: 0.8});
	}

	for(var name in Game.creeps) {
		var creep = Game.creeps[name];
		if (creep.ticksToLive < 120) {
			creep.memory.role = 'defective';
		}
		var controller = roles.roles[creep.memory.role];
		if (controller) {
			controller.run(creep, stageC);
		} else {
			console.log('no controller for ' + creep.memory.role);
		}
	}
};
