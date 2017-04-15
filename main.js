var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleDefective = require('role.defective');
var roleSherpa = require('role.sherpa');
var roleDefender = require('role.defender');
var stageController = require('controller.stage');
var immobileTower = require('immobile.tower');
var immobileLink = require('immobile.link');
var immobileHarvester = require('immobile.harvester');
var immobileUpgrader = require('immobile.upgrader');
var roleScout = require('role.scout');
var roleRaider = require('role.raider');
var s = require('shared');

var debugStyle = {align: 'left'};

function countRole(role) {
    let creeps = _.filter(Game.creeps, (creep) => creep.memory.role == role);
    Memory.creepCounter[role] = creeps.length;
    return creeps;
}

module.exports.loop = function () {
    PathFinder.use(true);
    s.setup();
    var stage = '';
    var spawn = s.getSpawn();
    //s.structSay(spawn, 'hi');
    if (spawn === undefined) {
        return OK;
    }
    if ( Memory.fixedCreeps === false) {
        s.fixCreepsInMemory();
        Memory.fixedCreeps = true;
        console.log('fixed creeps');
    }
    for (var r in Game.rooms) {
        var room = Game.rooms[r];
        if (room.setup !== true) {
             //Memory.spawns = {};
            var SPAWNS = room.find(FIND_MY_STRUCTURES, { filter: { structureType: STRUCTURE_SPAWN } });
            for (let spawnName in SPAWNS) {
                Memory.spawns[SPAWNS[spawnName].name] = {id:SPAWNS[spawnName].id};
            }
            room.memory.sources = [];
            var roomSources = room.find(FIND_SOURCES);
            for (var sourceId in roomSources) {
                let src = roomSources[sourceId];
                let source = {id: src.id}
                let area = room.lookForAtArea(LOOK_TERRAIN, src.pos.y - 1, src.pos.x - 1, src.pos.y + 1, src.pos.x + 1, true);
                let freeCount = _.filter(area, (look) => {return look.terrain == 'plain'}).length;
                //console.log(area);
                source.area = freeCount;
                room.memory.sources.push(source);
            }
            room.setup = true;
        }
        
        
        stage = stageController.stage(room);
        //console.log(stage);
        let x = 24;
        let y = 11;
        room.visual.text(r, x+0.1, y+0.5, debugStyle);
        room.visual.text(stage, x+0.1, y+1.0, debugStyle);
        room.visual.text('energy: ' + room.energyAvailable, x+0.1, y+1.5, debugStyle);
        var i = 0;
        for (var typ in Memory.creepCounter) {
            room.visual.text(typ + ': ' + Memory.creepCounter[typ], x+0.1, y+2.25 + (i * 0.7), debugStyle);
            i++;
        }
        
        let towers = room.find(FIND_MY_STRUCTURES, { filter: { structureType: STRUCTURE_TOWER } });
        for (let tower in towers) {
            immobileTower.run(towers[tower]);
        }
        let links = room.find(FIND_MY_STRUCTURES, { filter: { structureType: STRUCTURE_LINK } });
        for (let link in links) {
            immobileLink.run(links[link]);
        }
    }

    // var workParts = 0;
    // do {
    //     let creepWorks = [];
    //     let nonHarvesters = 
    //     for (name in Game.creeps) {
    //         creepWorks.push(_.filter(Game.creeps[name].body, {filter: (body) => {
    //             return body == WORK
    //         } }).length);
    //     }
    //     workParts = _.sum(creepWorks);
    //     } while (false);
    var harvesters = countRole('harvester');
    var upgraders = countRole('upgrader');
    var builders = countRole('builder');
    var sherpas = countRole('sherpa');
    var defenders = countRole('defender');
    var fatHarvesters = countRole('fatHarvester');
    var fatUpgraders = countRole('fatUpgrader');
    var scouts = countRole('scout');
    var raiders = countRole('raider');
    
    
    var stageC = stageController.stages[spawn.room.memory.stage];
    //Memory.creepCounter = {harvesters: harvesters.length, upgraders: upgraders.length, builders: builders.length};
    // console.log(stageC.name);
    var err = OK;
    if(spawn.spawning) {
        var spawningCreep = Game.creeps[spawn.spawning.name];
        s.structSay(spawn,
            '🛠️' + spawningCreep.memory.role);
    } else if(harvesters.length < stageC.desiredHarvesters) {
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