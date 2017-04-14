var roles = ['builder', 'harvester', 'upgrader', 'defender', 'sherpa'];
var roleModules = {};
roles.forEach(function(e,i,a) {
  roleModules[e] = require('role.' + e );
    console.log('loaded ' + e + ' role.');
  });

var roleReversal = function() {
    
};

function countRole(role) {
    let creeps = _.filter(Game.creeps, (creep) => creep.memory.role == role);
    Memory.creepCounter[role] = creeps.length;
    return creeps;
}

var run = function (creep, stageC) {
    
};

module.exports = {
    roles: roles,
    roleReversal: roleReversal
};