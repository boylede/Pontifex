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

function loadAll() {
  stages.forEach(function(e,i,a) {
    stageModules[e] = require('stage.' + e );
      //console.log('loaded ' + e + ' stage.');
  });
}

var loadStage = function loadStage(name) {
  const prefix = 'stage.';
  if (stages.indexOf(name) != -1) {
    return require(prefix + name );
  } else {
    return require(prefix + stages[0]);
  }
  // stageModules[name] = require('stage.' + e );
  // return stageModules[name];
};

var levelUp = function levelUp(room) {
  if ( Memory.rooms[room.name] === undefined) {
    console.log('new room ' + room.name);
    Memory.rooms[room.name] = {};
  }
  const mroom = Memory.rooms[room.name];
  var current = mroom.stage || stages[0];
  const stageC = loadStage(current);
  if (stageC && stageC.levelUp) {
    current = stageC.levelUp(room);
  } else {
    current = stages[0];
  }
  mroom.stage = current;
  return current;
};

module.exports = {
  stageModule: loadStage,
  levelUp: levelUp,
};