/*
we've upgraded our controller and need to build extensions to upgrade our creeps
goal: build 5 extensions. de-emphasize upgrading but don't stop.
*/
var upgrader = [WORK, MOVE, CARRY];
var body = [MOVE, CARRY, WORK, WORK];

const level = 2;
const maxEnergy = CONTROLLER_STRUCTURES[STRUCTURE_EXTENSION][level] * EXTENSION_ENERGY_CAPACITY[level];

var levelUp = function levelUp(room) {
//    let numExtensions = room.find(FIND_MY_STRUCTURES, {filter: (str) => str.structureType == STRUCTURE_EXTENSION}).length;
    // let numContainers = room.find(FIND_STRUCTURES, {filter: (str) => str.structureType == STRUCTURE_CONTAINER}).length;
    if (room.energyAvailable >= maxEnergy) {
        return '2b.bastion';
    } else {
        return '2a.outpost';
    }
};
module.exports = {
    tasks: [],
    creeps: {
        harvester: {
            desired: 2,
            body: body
        },
        containerHarvester: {
            desired: 0,
            body: body
        },
        upgrader: {
            desired: 1,
            body: upgrader
        },
        defender: {
            desired: 0,
            body: [MOVE, ATTACK, MOVE, ATTACK]
        },
        sherpa: {
            desired: 0,
            body: [MOVE, CARRY, MOVE, CARRY]
        },
        builder: {
            desired: 2,
            body: body
        }
    },
    hitsWall: 2000,
    hitsRampart: 2000,
    name: '2a.outpost',
    levelUp: levelUp
};