var stages = [
'0.blank',
'1a.seed',
'1b.foothold',
'2a.outpost',
'3a.fort',
'3b.base',
'4a.settlement',
'4b.town',
'5a.village',
'5b.city',
'6a.duchy',
'6b.principality'
];

var stageModules = {};
stages.forEach(function(e,i,a) {
  stageModules[e] = require('stage.' + e );
    //console.log('loaded ' + e + ' stage.');
  });

var stage = function(room) {
  if ( Memory.rooms[room.name] === undefined) {
    console.log('new room ' + room.name);
    Memory.rooms[room.name] = {};
  }
  const mroom = Memory.rooms[room.name];
  var current = mroom.stage || 'blank';
  const stageC = stageModules[current];
  if (stageC && stageC.levelUp) {
    current = stageModules[current].levelUp(room);
  } else {
    current = stages[0];
  }
  mroom.stage = current;
  return current;
};

module.exports = {
  stages: stageModules,
  stage: stage
};