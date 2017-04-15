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
              if(creeps[role].length < stageC[desired + role]) {
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

          if (false) {
            if(harvesters.length < stageC.desiredHarvesters) {
               err = spawn.createCreep(stageC.harvester, undefined, {role: 'harvester'});
               if (err != OK) {
                   s.structErr(spawn, err);
                   console.log('error while spawning Harvester.');
               }
            } else if(fatHarvesters.length < stageC.desiredFatHarvesters) {
               err = spawn.createCreep(stageC.fatHarvester, undefined, {role: 'fatHarvester'});
               if (err != OK) {
                   s.structErr(spawn, err);
                   console.log('error while spawning fatHarvester.');
               }
            } else if (sherpas.length < stageC.desiredSherpas) {
                err = spawn.createCreep(stageC.sherpa, undefined, {role: 'sherpa'});
                if (err != OK) {
                   s.structErr(spawn, err);
                   console.log('error while spawning Sherpa.');
                }
            } else if (upgraders.length < stageC.desiredUpgraders) {
                if (false) {
                    err = spawn.createCreep(stageC.upgrader, undefined, {role: 'upgrader', tenured: true, tenuredRole:'upgrader'});
                } else {
                    err = spawn.createCreep(stageC.upgrader, undefined, {role: 'upgrader'});
                }
               //err = spawn.createCreep(stageC.upgrader, undefined, {role: 'upgrader', tenured: true, tenuredRole:'upgrader'});
               if (err != OK) {
                   s.structErr(spawn, err);
                   console.log('error while spawning Upgrader.');
               }
            } else if (fatUpgraders.length < stageC.desiredFatUpgraders) {
                err = spawn.createCreep(stageC.fatUpgrader, undefined, {role: 'fatUpgrader'});
               if (err != OK) {
                   s.structErr(spawn, err);
                   console.log('error while spawning fatUpgrader.');
               }
            } else if (builders.length < stageC.desiredBuilders) {
               err = spawn.createCreep(stageC.builder, undefined, {role: 'builder'});
               if (err != OK) {
                   s.structErr(spawn, err);
                   console.log('error while spawning Builder.');
               }
            } else if (defenders.length < stageC.desiredDefenders) {
               err = spawn.createCreep(stageC.defender, undefined, {role: 'defender'});
               if (err != OK) {
                   s.structErr(spawn, err);
                   console.log('error while spawning Defender.');
               }
            } else if (scouts.length < stageC.desiredScouts) {
               err = spawn.createCreep(stageC.scout, undefined, {role: 'scout'});
               if (err != OK) {
                   s.structErr(spawn, err);
                   console.log('error while spawning Scout.');
               }
            } else if (false && raiders.length < stageC.desiredRaiders) {
               err = spawn.createCreep(stageC.raider, undefined, {role: 'raider'});
               if (err != OK) {
                   s.structErr(spawn, err);
                   console.log('error while spawning Raider.');
               }
            }
          }

          let x = 24;
          let y = 11;
          room.visual.text(r, x+0.1, y+0.5, s.debugStyle);
          room.visual.text(stage, x+10.0, y+0.5, s.debugStyle);
          room.visual.text('energy: ' + room.energyAvailable, x+20.0, y+0.5, s.debugStyle);
          var i = 0;
          for (var typ in Memory.creepCounter) {
              room.visual.text(typ + ': ' + Memory.creepCounter[typ], x+0.1, y+1.5 + (i * 0.75), s.debugStyle);
              i++;
          }
        } else {
          //
        }
    }

    for(var name in Game.creeps) {
        var creep = Game.creeps[name];
        /* if (creep.ticksToLive < 120) {
            creep.memory.role = 'defective';
        } */
        switch (creep.memory.role) {
            case 'harvester':
                roleHarvester.run(creep, stageC);
                break;
            case 'upgrader':
                roleUpgrader.run(creep, stageC);
                break;
            case 'builder':
                roleBuilder.run(creep, stageC);
                break;
            case 'defective':
                roleDefective.run(creep, stageC);
                break;
            case 'sherpa':
                roleSherpa.run(creep, stageC);
                break;
            case 'defender':
                roleDefender.run(creep, stageC);
                break;
            case 'fatHarvester':
                immobileHarvester.run(creep, stageC);
                break;
            case 'fatUpgrader':
                immobileUpgrader.run(creep, stageC);
                break;
            case 'scout':
                roleScout.run(creep, stageC);
                break;
            case 'raider':
                roleRaider.run(creep, stageC);
                break;
        }
    }
};