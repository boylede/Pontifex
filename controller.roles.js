var roles = [
'harvester',
'containerHarvester',
'sherpa',
'upgrader',
'containerUpgrader',
'builder',
'defender',
'scout',
'miner',
'defective',
'attacker',
'pilgrim'
];

var roleModules = {};

roles.forEach(function(e, i, a) {
  roleModules[e] = require('role.' + e);
    //console.log('loaded ' + e + ' role.');
  });

function _countRole(role) {
    let creeps = _.filter(Game.creeps, (creep) => creep.memory.role == role);
    return creeps;
}

function countRole(role, room) {
    let creeps = _.filter(Game.creeps, (creep) => creep.memory.role == role && creep.room == room);
    return creeps;
}

function countRoles(room) {
  let creeps = {};
  roles.forEach((e, i, a) => {
    creeps[e] = countRole(e, room);
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