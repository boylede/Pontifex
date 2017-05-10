/*
We've got some containers so we can quickly upgrade to level 3
goal: upgrade controller to level 3
*/

var harvester = [MOVE, WORK, WORK, WORK, WORK, WORK];
var body = [WORK, MOVE, CARRY];
var upgrader = [MOVE, WORK, MOVE, WORK, MOVE, WORK, MOVE, CARRY];
var carry = [MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY];

const level = 2;
const maxEnergy = CONTROLLER_STRUCTURES[STRUCTURE_EXTENSION][level] * EXTENSION_ENERGY_CAPACITY[level];

var levelUp = function levelUp(room) {
//    let numExtensions = room.find(FIND_MY_STRUCTURES, {filter: (str) => str.structureType == STRUCTURE_EXTENSION}).length;
    let numContainers = room.find(FIND_STRUCTURES, {filter: (str) => str.structureType == STRUCTURE_CONTAINER}).length;
    if (room.controller.level > 2 && numContainers >= 3 && room.energyAvailable >= maxEnergy) {
        return '3a.fort';
    } else if (room.controller.level < level) {
        return '1a.seed';
    } else {
        return '2c.encampment';
    }
};
module.exports = {
    tasks: [],
    creeps: {
        harvester: {
            desired: 0,
            body: body
        },
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
            body: [MOVE, ATTACK, MOVE, ATTACK]
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
    hitsWall: 2000,
    hitsRampart: 2000,
    name:'2c.encampment',
    levelUp: levelUp
};