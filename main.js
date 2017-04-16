var stageController = require('controller.stage');
var rolesController = require('controller.roles');
var immobileTower = require('immobile.tower');
var immobileLink = require('immobile.link');

var s = require('shared');

module.exports.loop = function () {
  PathFinder.use(true);
  s.setup();

  if ( Memory.fixedCreeps === false) {
    s.fixCreepsInMemory();
    Memory.fixedCreeps = true;
    console.log('fixed creeps');
  }
  for (let r in Game.rooms) {
    let room = Game.rooms[r];
    let stage = '';
    let spawn = room.find(FIND_STRUCTURES, { filter: { structureType: STRUCTURE_SPAWN } })[0];
    if (room.setup !== true) {
      if (room.controller.my && spawn) {
        Memory.spawns[spawn.name] = {
          id:spawn.id
        };
      }
      room.memory.sources = [];
      let roomSources = room.find(FIND_SOURCES);
      for (let sourceId in roomSources) {
        let src = roomSources[sourceId];
        let source = {id: src.id}
        let area = room.lookForAtArea(LOOK_TERRAIN, src.pos.y - 1, src.pos.x - 1, src.pos.y + 1, src.pos.x + 1, true);
        let freeCount = _.filter(area, (look) => {return look.terrain == 'plain'}).length;
        source.area = freeCount;
        room.memory.sources.push(source);
      }
      room.setup = true;
    }

    if (room.controller.my) {
      stage = stageController.stage(room);

      let towers = room.find(FIND_MY_STRUCTURES, { filter: { structureType: STRUCTURE_TOWER } });
      for (let tower in towers) {
        immobileTower.run(towers[tower]);
      }
      let links = room.find(FIND_MY_STRUCTURES, { filter: { structureType: STRUCTURE_LINK } });
      for (let link in links) {
        immobileLink.run(links[link]);
      }

      let creeps = rolesController.countRoles(room);
      let stageC = stageController.stages[room.memory.stage];
      let err = OK;

      if(spawn.spawning) {
        let spawningCreep = Game.creeps[spawn.spawning.name];
        s.structSay(spawn, spawningCreep.memory.role);
      } else {
        for (let role in creeps) {
          if(creeps[role].length < stageC['desired' + role]) {
            err = spawn.createCreep(stageC[role], undefined, {role: role});
            if (err != OK) {
              s.structErr(spawn, err);
            }
          }
        }
      }

      for (let role in creeps) {
        for (let i = 0; i < creeps[role].length; i++) {
          let creep = creeps[role][i];
          rolesController.run(creeps[i], stageC);
        }
      }

      let x = 24;
      let y = 11;
      room.visual.text(r, x+0.1, y+0.5, s.debugStyle);
      room.visual.text(stage, x+10.0, y+0.5, s.debugStyle);
      room.visual.text('energy: ' + room.energyAvailable, x+20.0, y+0.5, s.debugStyle);
      let i = 0;
      for (let typ in creeps) {
        room.visual.text(typ + ': ' +creeps[typ].length, x+0.1, y+1.5 + (i * 0.75), s.debugStyle);
        i++;
      }
    } else {
      console.log('not my room');
    }
  }
};