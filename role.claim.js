var s = require('shared');
const moveOpts = {visualizePathStyle: {stroke: '#0095ff', opacity:0.6}};

var claim = {
  run: function(creep) {
    var err = OK;
    const m = creep.memory;

    err = creep.claim(creep.room.controller);
    creep.moveTo(goal, moveOpts);

    return OK;
  }
};

module.exports = claim;   