/*
built the first tower, now lets race to RCL level 4
goal: upgrade controller to level 4
*/

var harvester = [MOVE, WORK, MOVE, WORK, WORK, WORK, WORK];
var body = [WORK, MOVE, CARRY];
var upgrader = [MOVE, WORK, MOVE, WORK, WORK, WORK, WORK, MOVE, WORK, CARRY];
var carry = [MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY];
var defend = [MOVE, MOVE, ATTACK, ATTACK, ATTACK, ATTACK];

var levelUp = function levelUp(room) {
    let numTowers = room.find(FIND_MY_STRUCTURES, {filter: (str) => str.structureType == STRUCTURE_TOWER}).length;
    //let numExtensions = room.find(FIND_MY_STRUCTURES, {filter: (str) => str.structureType == STRUCTURE_EXTENSION}).length;
    //let numContainers = room.find(FIND_MY_STRUCTURES, {filter: (str) => str.structureType == STRUCTURE_CONTAINER}).length;
    if (room.controller.level > 3 && room.energyAvailable >= 800 && numTowers >= 1) {
        return '4a.settlement';
    } else {
        return '3c.base';
    }
};

module.exports = {
    creeps: {
        containerHarvester: {
            desired: 2,
            body: harvester
        },
        upgrader: {
            desired: 0,
            body: body
        },
        containerUpgrader: {
            desired: 2,
            body: upgrader
        },
        defender: {
            desired: 0,
            body: defend
        },
        sherpa: {
            desired: 2,
            body: carry
        },
        builder: {
            desired: 0,
            body: body
        }
    },
    hitsWall: 250000,
    hitsRampart: 250000,
    name:'3b.base',
    levelUp: levelUp
};