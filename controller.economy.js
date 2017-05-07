var version = 1;
var maintenanceCost = function maintenanceCost(room) {
  var hitsLostPerTick = 0;
  const structures = room.find(FIND_STRUCTURES);
  for (var i = structures.length - 1; i >= 0; i--) {
    const str = structures[i];
    switch(str.structureType) {
      case STRUCTURE_ROAD:
        if (str.hits > 5000) {
          // assume swampy
          hitsLostPerTick = hitsLostPerTick + (500 / 1000);
        } else {
          hitsLostPerTick = hitsLostPerTick + (100 / 1000);
        }
        break;
      case STRUCTURE_RAMPART :
        hitsLostPerTick = hitsLostPerTick + (300 / 100);
        break;
      case STRUCTURE_CONTAINER:
        hitsLostPerTick = hitsLostPerTick + (5000 / 500);
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
  return hitsLostPerTick;
};

var buildCosts = function buildCosts(room) {
  var hits = 0;
  var sites = room.find(CONSTRUCTION_SITES);
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

var maxIncome = function maxIncome(room) {
  return room.find(FIND_SOURCES).length * 10;
};

var creepCost = function creepCost(body) {
  var cost = 0;
  var life = 1500;
  for (var i = body.length - 1; i >= 0; i--) {
    switch(body[i]) {
      case WORK:
        cost += 100;
        break;
      case MOVE:
        cost += 50;
        break;
      case CARRY:
        cost += 50;
        break;
      case ATTACK:
        cost += 80;
        break;
      case RANGED_ATTACK:
        cost += 150;
        break;
      case HEAL:
        cost += 250;
        break;
      case CLAIM:
        cost += 600;
        life = 500;
        break;
      case TOUGH:
        cost += 10;
        break;
      default:
      break;
    }
  }
  return cost / life;
};

var creepsCost = function creepsCost(stageController) {
  var creepsCostPerTick = 0;
  for (var role in stageController.creeps) {
    if (stageController.hasOwnProperty(role)) {
      const creep = stageController.creeps[role].body;
      creepsCostPerTick = creepsCostPerTick + creepCost(creep);
    }
  }
  return creepsCostPerTick;
};

var simpleRoomMetric = function simpleRoomMetric(room) {
  const spawn = room.find(FIND_MY_SPAWNs)[0];
  const controller = room.controller;
  const furthestSource = room.find(FIND_SOURCES).sort((a, b) => room.findPath(b, controller).length - room.findPath(a, controller).length)[0];
  const furthestDistance = [room.findPath(spawn, furthestSource).length, room.findPath(controller.furthestSource)].sort((a, b) => b - a)[0];
  return furthestDistance;
};
var simpleRoomCost = function simpleRoomCost(room) {
  // represents the number of ticks it takes creeps to move to thier destinations
  const metric = simpleRoomMetric(room);
  console.log(room.name + ' has a simpleMetric of ' + metric);
  const costsPerTick = creepsCost(require(controller.stage).loadStage(room.stage)) + maintenanceCost(room) + buildCosts(room);
  console.log(room.name + ' costs ' + costsPerTick + ' per tick.');
  return costsPerTick;
};

var simpleRoomEfficiency = function simpleRoomEfficiency(room) {};

var analyze = function analyze(room) {
  room.memory.economyAnalysis = {
    version: version,
    costsPerTick: simpleRoomCost(room)
  };
};
module.exports = {
  analyze: analyze,
  maintenanceCost: maintenanceCost,
  creepsCost: creepsCost,
  buildCosts: buildCosts,
  creepCost: creepCost,
  maxIncome: maxIncome,
  simpleRoomMetric: simpleRoomMetric,
  simpleRoomCost: simpleRoomCost,
  verstion: version
};