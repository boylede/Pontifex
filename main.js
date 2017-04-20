var stageController = require('controller.stage');
var rolesController = require('controller.roles');
var immobileTower = require('immobile.tower');
var immobileLink = require('immobile.link');

var s = require('shared');

const attackersPresent = function attackersPresent(creep) { 
  return !creep.my && (creep.getActiveBodyparts(HEAL) > 0 || creep.getActiveBodyparts(ATTACK) > 0);
};

module.exports.loop = function () {
  PathFinder.use(true);
  s.setup();

  if ( Memory.fixedCreeps === false) {
    s.fixCreepsInMemory();
    Memory.fixedCreeps = true;
    console.log('fixed creeps');
  }
  for (var r in Game.rooms) {
    const room = Game.rooms[r];
    let stage = '';
    const spawn = room.find(FIND_STRUCTURES, { filter: { structureType: STRUCTURE_SPAWN } })[0];
    if (room.setup !== true) {
      if (room.controller && room.controller.my && spawn) {
        Memory.spawns[spawn.name] = {
          id:spawn.id
        };
      }
      room.memory.sources = [];
      let roomSources = room.find(FIND_SOURCES);
      for (var sourceId in roomSources) {
        let src = roomSources[sourceId];
        let source = {id: src.id};
        let area = room.lookForAtArea(LOOK_TERRAIN, src.pos.y - 1, src.pos.x - 1, src.pos.y + 1, src.pos.x + 1, true);
        let freeCount = _.filter(area, (look) => {
          return look.terrain == 'plain';
        }).length;
        source.area = freeCount;
        room.memory.sources.push(source);
      }
      room.setup = true;
    }

    let creeps = rolesController.countRoles(room);
    let stageC = stageController.stages[room.memory.stage];
    let err = OK;
    var role = '';

    if (room.controller && room.controller.my) {
      stage = stageController.stage(room);
      let canSafeMode = !room.controller.safeMode && !room.controller.safeModeCooldown && room.controller.safeModeAvailable > 0;
      let attackers = room.find(FIND_CREEPS, {
        filter: attackersPresent
      });
      if (canSafeMode && attackers.length > 3) {
        console.log('safe mode initiated');
        room.controller.activateSafeMode();
      }

      let towers = room.find(FIND_MY_STRUCTURES, { filter: { structureType: STRUCTURE_TOWER } });
      for (let tower in towers) {
        immobileTower.run(towers[tower]);
      }
      let links = room.find(FIND_MY_STRUCTURES, { filter: { structureType: STRUCTURE_LINK } });
      for (let link in links) {
        immobileLink.run(links[link]);
      }

      // let creeps = rolesController.countRoles(room);
      // let stageC = stageController.stages[room.memory.stage];
      // let err = OK;

      if (spawn) {
        if(spawn.spawning) {
          let spawningCreep = Game.creeps[spawn.spawning.name];
          s.structSay(spawn, spawningCreep.memory.role);
        } else {
          for (role in creeps) {
            if (creeps.hasOwnProperty(role)) {
              if(stageC.creeps[role] && creeps[role].length < stageC.creeps[role].desired) {
                err = spawn.createCreep(stageC.creeps[role].body, undefined, {role: role});
                if (err != OK) {
                  s.structErr(spawn, err);
                }
                break;
              }
            }
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
    } else {
      console.log('not my room ' + r);
    }
    for (role in creeps) {
        for (var i = 0; i < creeps[role].length; i++) {
          let creep = creeps[role][i];
          rolesController.run(creep, stageC);
        }
      }
  }
};