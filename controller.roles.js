var roles = [
'builder',
'harvester',
'upgrader',
'defender',
'sherpa',
'defective',
'containerHarvester',
'containerUpgrader',
'scout',
'raider'
];

var roleModules = {};

roles.forEach(function(e, i, a) {
  roleModules[e] = require('role.' + e);
    console.log('loaded ' + e + ' role.');
  });

function _countRole(role) {
    let creeps = _.filter(Game.creeps, (creep) => creep.memory.role == role);
    Memory.creepCounter[role] = creeps.length;
    return creeps;
}

function countRole(role, room) {
    let creeps = _.filter(Game.creeps, (creep) => creep.memory.role == role && creep.room == room);
    Memory.creepCounter[role] = creeps.length;
    return creeps;
}

function countRoles(room) {
  let creeps = {};
  roles.forEach((e, i, a) => {
    roles[e] = countRole(e, room);
  });
	return creeps;
}

var run = function (creep, stageC) {
	let roleC = roleModules[creep.memory.role];
	if (roleC) {
		return roleC.run(creep, stageC);
	} else {
		return;
	}
};

module.exports = {
    roles: roles,
//    role: roleModules,
    run: run,
    countRoles: countRoles,
//    countRole: countRole
};