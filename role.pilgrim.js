var s = require('shared');
var moveOpts = {ignoreCreeps: true, plainCost: 1, swampCost: 1, visualizePathStyle: {stroke: '#ffaa00', opacity: 1.0}};

var errResponse = function errResponse(err, creep, goal) {
  var mem = goal.id;
  switch (err) {
    case ERR_NOT_IN_RANGE:
    err = creep.moveTo(goal, moveOpts);
    if (err != OK) {
      console.log("error in" + creep.name + " path or goal"); 
      mem = undefined;
    }
    break;
    case OK:
    case ERR_FULL:
    case ERR_NOT_ENOUGH_ENERGY:
    case ERR_TIRED:
    break;
    default:
    creep.say('?');
    break;
  }
  return mem;
};

var pilgrim = {
  run: function(creep, stageC) {
    var err = OK;
    var m = creep.memory;
    var home = Game.rooms[m.home];
    var charter;
    var goal;
    const carried = _.sum(creep.carry);

    if (home && home.memory.charter) {
      charter = home.memory.charter;
      if (creep.room.name == charter.destination) {
        creep.memory = charter.pilgrim;
      } else if (creep.room == home && charter.supply && carried < creep.carryCapacity) {
        goal = home.storage;
        err = creep.withdraw(goal, charter.supply);
        errResponse(err, creep, goal);
      } else {
        goal = charter.route[creep.room.name];
        err = creep.moveTo(goal.x, goal.y, moveOpts);
        errResponse(err, creep, goal);
      }
    }
    return OK;
  }
};

module.exports = pilgrim;