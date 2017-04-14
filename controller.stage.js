var stages = ['seed', 'boom', 'mature', 'boom', 'stable'];
var stageModules = {};
stages.forEach(function(e,i,a) {
  stageModules[e] = require('stage.' + e );
    //console.log('loaded ' + e + ' stage.');
  });
var change = function(stage) {
    console.log('changing stage to ' + stage);
    //stageModules[current].buildConstructionSites();
    return stage;
};
var stage = function(room) {
    //console.log('checking stage of ' + room.name);
  if ( Memory.rooms[room.name] === undefined) {
      console.log('new room ' + room.name);
    Memory.rooms[room.name] = {};
  }
  var mroom = Memory.rooms[room.name];
  //console.log(mroom.stage);
  var current = mroom.stage || 'seed';
  //return current;
//  console.log('managing stage ' + current);
let numExtensions = room.find(FIND_MY_STRUCTURES, {filter: (str) => str.structureType == STRUCTURE_EXTENSION}).length;
  switch(current) {
    case 'seed':
//        console.log('evaluating stage');
    if (room.controller) {
      if (room.controller.my) {
          if (room.energyAvailable >= 550 && numExtensions >= 5) {
          //if (Memory.rooms[room.name].creeps && Memory.rooms[room.name].creeps.length > 2) {
              current = change('boom');
          }
      }
    }
    break;
    case 'boom':
        if (room.energyAvailable < 50) {
            current = change('seed');
        } else if (room.energyAvailable >= 900 && numExtensions >= 12) {
            current = change('mature');
        }
            break;
    case 'rush':
    if (room.energyAvailable < 50) {
            current = change('seed');
        }
            break;
    case 'mature':
        if ( room.energyAvailable < 12) {
            current = change('seed');
        } else if (room.energyAvailable >= 800 && numExtensions >= 18) {
            current = change('stable');
        }
            break;
    case 'stable':
        if ( room.energyAvailable < 200) {
            current = change('mature');
        } else if (false && room.energyAvailable >= 1200 && numExtensions >= 18) {
            current = change('stable');
        }
            break;
  }
  mroom.stage = current;
  return current;
};

module.exports = {
  stages: stageModules,
  stage: stage
};