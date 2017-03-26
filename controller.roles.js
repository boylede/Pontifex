var roles = ['builder', 'harvester', 'upgrader', 'defender', 'defective'];
var roleModules = {};
roles.forEach(function(e,i,a) {
  roleModules[e] = require('role.' + e );
	console.log('loaded ' + e + ' role.');
  });

var run = function (creep, stageC) {
	
};

module.exports = {
	roles: roleModules,
	roleTypes: roles,
	run: run
};