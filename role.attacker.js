var s = require('shared');
const moveOpts = {visualizePathStyle: {stroke: '#0095ff', opacity:0.6}};

var getTarget = function(creep) {
  var targets = creep.room.find(FIND_CREEPS, {filter: (cre) => !cre.my && cre.getActiveBodyparts(HEAL) > 0});
    if (targets.length === 0 ) {
        targets = creep.room.find(FIND_HOSTILE_CREEPS);
    }
    if (targets.length === 0 ) {
        targets = creep.room.find(FIND_HOSTILE_STRUCTURES);
    }
    if (targets.length === 0) {
        targets = creep.room.find(FIND_HOSTILE_CONSTRUCTION_SITES);
    }
    if (targets.length === 0 ) {
        targets = creep.room.find(FIND_STRUCTURES, {filter: (str) => str.structureType != STRUCTURE_CONTROLLER});
    }
    return creep.pos.findClosestByRange(targets);
};

var errResponse = function errResponse(err, creep, goal) {
  var mem = goal.id;
  switch (err) {
    case ERR_NOT_IN_RANGE:
    err = creep.moveTo(goal, moveOpts);
    break;
    case OK:
        break;
    case ERR_FULL:
    case ERR_NOT_ENOUGH_ENERGY:
    case ERR_TIRED:
    case ERR_BUSY:
    case ERR_NOT_FOUND:
    mem = undefined;
    break;
    default:
    creep.say('?');
    break;
  }
  return mem;
};
var attacker = {
  run: function(creep) {
    var err = OK;
    const m = creep.memory;
    var target;
    if ( m.target) {
      target = Game.getObjectById(m.target);
    }
    if (!target && !m.singleTarget) {
      target = getTarget(creep);
      m.target = undefined;
    }
    if (target) {
      err = creep.attack(target);
      m.target = errResponse(err, creep, target);
    }
    return OK;
  }
};

module.exports = attacker;   