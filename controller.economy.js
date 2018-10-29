var maintenanceCost = function maintenanceCost(room) {
  var hitsLostPerTick = 0.0;
  const structures = room.find(FIND_STRUCTURES);
  for (var i = structures.length - 1; i >= 0; i--) {
    const str = structures[i];
    switch(str.structureType) {
      case STRUCTURE_ROAD:
        if (str.hits > 5000) {
          // assume swampy
          hitsLostPerTick = hitsLostPerTick + 5; //(500 / 1000)
        } else {
          hitsLostPerTick = hitsLostPerTick + 1; //(100 / 1000)
        }
        break;
      case STRUCTURE_RAMPART :
        hitsLostPerTick = hitsLostPerTick + 30; //(300 / 100)
        break;
      case STRUCTURE_CONTAINER:
        hitsLostPerTick = hitsLostPerTick + 100; //(5000 / 500)
        break;
      // case STRUCTURE_WALL:
      // case STRUCTURE_TOWER:
      // case STRUCTURE_TERMINAL:
      // case STRUCTURE_POWER_SPAWN:
      // case STRUCTURE_POWER_BANK:
      // case STRUCTURE_OBSERVER:
      // case STRUCTURE_NUKER:
      // case STRUCTURE_LAB:
      // case STRUCTURE_STORAGE :
      // case STRUCTURE_LINK :
      // case STRUCTURE_EXTRACTOR:
      // case STRUCTURE_CONTROLLER :
      // case STRUCTURE_PORTAL :
      // case STRUCTURE_KEEPER_LAIR :
      // case STRUCTURE_SPAWN:
      // case STRUCTURE_EXTENSION:
      default:
        break;
    }
  }
  return hitsLostPerTick /  200; // 20 hits per unit energy * 10 to compensate for JS floating point ugly
};

var buildCosts = function buildCosts(room) {
  var hits = 0;
  var sites = room.find(FIND_CONSTRUCTION_SITES);
  for (var i = sites.length - 1; i >= 0; i--) {
    let site = sites[i];
    hits += site.progressTotal - site.progress;
  }
  if (hits > 10000) {
    return 50;
  } else {
    return hits / 200;
  }
};

var roleCosts = function roleCosts(room) {
  var roles = {};
  var energyPerTick = 0;
  room.find(FIND_MY_CREEPS, {filter:(creep) => {
    if (!roles[creep.memory.role]) {
      roles[creep.memory.role] = 0;
    }
    roles[creep.memory.role] += creep.getActiveBodyparts(WORK);
    }
  });
  for (var role in roles) {
    if (roles.hasOwnProperty(role)) {
      switch(role) {
        case 'builder':
          energyPerTick += 5 * roles[role];
          break;
        case 'upgrader':
          energyPerTick += roles[role];
          break;
        case 'containerUpgrader':
          energyPerTick += roles[role];
          break;
      }
    }
  }
  return energyPerTick;
};

var maxIncome = function maxIncome(room) {
  return room.find(FIND_SOURCES).length * 10;
};

var incomePerTick = function incomePerTick(room) {
    var minerParts = 0;
    var miners = room.find(FIND_MY_CREEPS, {filter:(creep) => {
        if(creep.memory.role == 'harvester' || creep.memory.role == 'containerHarvester') {
            minerParts += creep.getActiveBodyparts(WORK);
            return true;
        } else {
            return false;
        }
    }
    });
    if (minerParts >= 10) {
        minerParts = 10;
    }
    return minerParts * 2;
};

// var creepCost = function creepCost(body) {
//   var cost = 0;
//   var life = 1500;
//   for (var i = body.length - 1; i >= 0; i--) {
//     switch(body[i]) {
//       case WORK:
//         cost += 100;
//         break;
//       case MOVE:
//         cost += 50;
//         break;
//       case CARRY:
//         cost += 50;
//         break;
//       case ATTACK:
//         cost += 80;
//         break;
//       case RANGED_ATTACK:
//         cost += 150;
//         break;
//       case HEAL:
//         cost += 250;
//         break;
//       case CLAIM:
//         cost += 600;
//         life = 500;
//         break;
//       case TOUGH:
//         cost += 10;
//         break;
//       default:
//       break;
//     }
//   }
//   return cost / life;
// };

// var creepsCost = function creepsCost(stageController) {
//   var creepsCostPerTick = 0;
//   for (var role in stageController.creeps) {
//     if (stageController.hasOwnProperty(role)) {
//       const creep = stageController.creeps[role].body;
//       creepsCostPerTick = creepsCostPerTick + creepCost(creep);
//     }
//   }
//   return creepsCostPerTick;
// };

var simpleRoomMetric = function simpleRoomMetric(room) {
  const spawn = room.find(FIND_MY_SPAWNS)[0];
  const controller = room.controller;
  const furthestSource = room.find(FIND_SOURCES).sort((a, b) => {
    var bLen = room.findPath(b.pos, controller.pos).length;
    var aLen = room.findPath(a.pos, controller.pos).length;
    return bLen - aLen;
  })[0];
  const furthestDistance = [room.findPath(spawn.pos, furthestSource.pos).length, room.findPath(controller.pos, furthestSource.pos)].sort((a, b) => b - a)[0];
  return furthestDistance;
};
var simpleRoomCost = function simpleRoomCost(room) {
  // const metric = simpleRoomMetric(room);
  // console.log(room.name + ' has a simpleMetric of ' + metric);
//  const creeps = creepsCost(require('controller.stage').stageModule(room.stage));
  // console.log('cost of creeps ' + creeps);
  const buildings =  maintenanceCost(room);
  // console.log('cost of existing structures ' + buildings);
  // const construction = buildCosts(room);
  // console.log('cost of new structures ' + construction);
  const costsPerTick = buildings;
  // console.log(room.name + ' costs ' + costsPerTick + ' per tick.');
  return costsPerTick;
};

var simpleRoomEfficiency = function simpleRoomEfficiency(room) {};

var analyze = function analyze(room) {
  return {
    next: Game.time + 1500,
    costsPerTick: simpleRoomCost(room),
    productionPerTick: roleCosts(room),
    incomePerTick: incomePerTick(room),
    sourcesContained: containerCheck(room)
  };
};

var containerCheck = function(room) {
	// const containers = room.find(FIND_STRUCTURES, {filter: (str) => str.type == STRUCTURE_CONTAINER});
	const sources = room.find(FIND_SOURCES);
	const contained_sources = sources.filter((source) => source.pos.findInRange(FIND_STRUCTURES, 2, {filter: (str) => str.type == STRUCTURE_CONTAINER}));
	return sources.length() == contained_sources.length();

}

module.exports = {
  'analyze': analyze,
  maintenanceCost: maintenanceCost,
//  creepsCost: creepsCost,
  buildCosts: buildCosts,
  // creepCost: creepCost,
  maxIncome: maxIncome,
  simpleRoomMetric: simpleRoomMetric,
  simpleRoomCost: simpleRoomCost
};