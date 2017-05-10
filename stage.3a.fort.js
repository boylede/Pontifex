/*
Finally up to level 3, now we're cooking with grease! almost ready to build that tower.
goal: build 5 more extensions
*/

var harvester = [MOVE, WORK, WORK, WORK, WORK, WORK];
var body = [WORK, MOVE, CARRY];
// var upgrader = [MOVE, WORK, MOVE, WORK, MOVE, WORK, MOVE, CARRY];
var carry = [MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY];
var defend = [MOVE, MOVE, ATTACK, ATTACK, ATTACK, ATTACK];

const level = 3;
const maxEnergy = CONTROLLER_STRUCTURES[STRUCTURE_EXTENSION][level] * EXTENSION_ENERGY_CAPACITY[level];

var levelUp = function levelUp(room) {
    //let numTowers = room.find(FIND_MY_STRUCTURES, {filter: (str) => str.structureType == STRUCTURE_TOWER}).length;
    //let numExtensions = room.find(FIND_MY_STRUCTURES, {filter: (str) => str.structureType == STRUCTURE_EXTENSION}).length;
    //let numContainers = room.find(FIND_MY_STRUCTURES, {filter: (str) => str.structureType == STRUCTURE_CONTAINER}).length;
    if (room.energyAvailable >= maxEnergy) {
        return '3b.barracks';
    } else if (room.controller.level < level) {
        return '2a.outpost';
    } else {
        return '3a.fort';
    }
};

module.exports = {
    creeps: {
        containerHarvester: {
            desired: 2,
            body: harvester
        },
        upgrader: {
            desired: 1,
            body: body
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
            desired: 2,
            body: body
        }
    },
    hitsWall: 250000,
    hitsRampart: 250000,
    name:'3a.fort',
    levelUp: levelUp
};