var stages = ['blank', 'seed', 'boom', 'mature', 'stable']; // rush
var stageModules = {};
stages.forEach(function(e,i,a) {
  stageModules[e] = require('stage.' + e );
    //console.log('loaded ' + e + ' stage.');
  });
var change = function(stage) {
  console.log('changing stage to ' + stage);
  return stage;
};

var stage = function(room) {
  if ( Memory.rooms[room.name] === undefined) {
    console.log('new room ' + room.name);
    Memory.rooms[room.name] = {};
  }
  const mroom = Memory.rooms[room.name];
  var current = mroom.stage || 'blank';
  const stageC = stageModules[current];
  if (stageC.levelUp) {
    current = stageModules[current].levelUp(room);
  }
  mroom.stage = current;
  return current;
};

module.exports = {
  stages: stageModules,
  stage: stage
};