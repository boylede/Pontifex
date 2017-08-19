var stageController = require('controller.stage');
var rolesController = require('controller.roles');
var economy = require('controller.economy');
var immobileTower = require('immobile.tower');
var immobileLink = require('immobile.link');
var charterController = require('controller.charter');

var s = require('shared');

const attackersPresent = function attackersPresent(creep) { 
  return !creep.my && (creep.getActiveBodyparts(HEAL) > 0 || creep.getActiveBodyparts(ATTACK) > 0);
};

function runController(room, filter, controller) {
  var items = room.find(FIND_MY_STRUCTURES, { filter: filter });
  for (var i = items.length - 1; v >= 0; i--) {
    controller.run(items[i]);
  }
}

module.exports.loop = function () {
  s.setup();

  if ( Memory.fixedCreeps ) {
  	Memory.fixedCreeps = undefined;
  	Memory.resetCreeps = Game.time;
  } else if (Memory.resetCreeps < Game.time) {
    s.fixCreepsInMemory();
    Memory.resetCreeps = Game.time + 3000;
    console.log('reset creeps');
  }
  for (var r in Game.rooms) {
    const room = Game.rooms[r];
    let roomMem = room.memory;
    const spawn = room.find(FIND_STRUCTURES, { filter: { structureType: STRUCTURE_SPAWN } })[0];
    if (!roomMem.setup) {
      if (room.controller && room.controller.my && spawn) {
        Memory.spawns[spawn.name] = {
          id:spawn.id
        };
      }
      roomMem.sources = [];
      let roomSources = room.find(FIND_SOURCES);
      for (var sourceId in roomSources) {
        let src = roomSources[sourceId];
        let source = {id: src.id};
        let area = room.lookForAtArea(LOOK_TERRAIN, src.pos.y - 1, src.pos.x - 1, src.pos.y + 1, src.pos.x + 1, true);
        let freeCount = _.filter(area, (look) => {
          return look.terrain == 'plain';
        }).length;
        source.area = freeCount;
        roomMem.sources.push(source);
      }
      roomMem.setup = true;
    }

    let creeps = rolesController.countRoles(room);
    let err = OK;
    var role = '';

    if (room.controller && room.controller.my) {
      let stage = stageController.levelUp(room);
      let stageC = stageController.stageModule(stage);
      let canSafeMode = !room.controller.safeMode && !room.controller.safeModeCooldown && room.controller.safeModeAvailable > 0;
      let attackers = room.find(FIND_CREEPS, {
        filter: attackersPresent
      });
      let spawnPriority = false;
      if (attackers.length > 3) {
        if (canSafeMode) {
          room.controller.activateSafeMode();
        } else {
          spawnPriority = true;
        }
      }

      runController(room, { structureType: STRUCTURE_TOWER }, immobileTower);
      runController(room, { structureType: STRUCTURE_LINK }, immobileLink);

      if (spawn) {
        if (!roomMem.economyAnalysis || roomMem.economyAnalysis.next < Game.time) {
          roomMem.economyAnalysis = economy.analyze(room);
        }

        if(spawn.spawning) {
          let spawningCreep = Game.creeps[spawn.spawning.name];
          s.structSay(spawn, spawningCreep.memory.role);
        } else if (spawnPriority) {
          err = spawn.createCreep(stageC.creeps.defender.body, undefined, {role: 'defender'});
        } else {
          let spawned = false;
          for (role in creeps) {
            if (creeps.hasOwnProperty(role)) {
              if(stageC.creeps[role] && creeps[role].length < stageC.creeps[role].desired) {
                spawned = true;
                err = spawn.createCreep(stageC.creeps[role].body, undefined, {role: role});
                switch (err) {
                  case OK:
                  case ERR_NOT_ENOUGH_RESOURCES:
                  break;
                  default:
                  s.structErr(spawn, err);
                }
                break;
              }
            }
          }
          if(!spawned && roomMem.charter) {
            // temp conditional to patch running game
            if (!(roomMem.charter instanceof Array)) {
              roomMem.charter = [roomMem.charter];
            }
            if (roomMem.charter.length > 0)
            charterController.run(spawn, room, roomMem);
          }
        }
      }

      room.visual.text(r, 0.1, 0.5, s.debugStyle);
      room.visual.text(stage, 10.0, 0.5, s.debugStyle);
      room.visual.text('energy: ' + room.energyAvailable, 20.0, 0.5, s.debugStyle);
      let i = 0;
      for (var typ in creeps) {
        room.visual.text(typ + ': ' +creeps[typ].length, 0.1, 1.5 + (i * 0.75), s.debugStyle);
        i++;
      }
      i++;
      for (var econ in room.memory.economyAnalysis) {
        if (room.memory.economyAnalysis.hasOwnProperty(econ)) {
          room.visual.text(econ + ' : ' + room.memory.economyAnalysis[econ], 0.1, 1.5 + (i * 0.75), s.debugStyle);
          i++;
        }
      }
    }
    for (role in creeps) {
        for (var i = 0; i < creeps[role].length; i++) {
          let creep = creeps[role][i];
          rolesController.run(creep);
        }
      }
  }
};