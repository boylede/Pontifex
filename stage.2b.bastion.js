/*
Now that we've built some extenstions we can afford more powerful creeps
we want to slingshot to RCL 3 but it will take 45k points.
one of the big time-sinks at this point is slow creeps moving around,
so let's sidestep that by building containers and letting fast creeps
carry stuff around for slow workers.
goal: build 3 containers
*/
var upgrader = [WORK, MOVE, CARRY];
var body = [MOVE, WORK, MOVE, WORK, MOVE, WORK, MOVE, CARRY];

const level = 2;
const maxEnergy = CONTROLLER_STRUCTURES[STRUCTURE_EXTENSION][level] * EXTENSION_ENERGY_CAPACITY[level];

var levelUp = function levelUp(room) {
//    let numExtensions = room.find(FIND_MY_STRUCTURES, {filter: (str) => str.structureType == STRUCTURE_EXTENSION}).length;
    let numContainers = room.find(FIND_STRUCTURES, {filter: (str) => str.structureType == STRUCTURE_CONTAINER}).length;
    if (numContainers >= 3 && room.energyAvailable >= maxEnergy) {
        return '2c.encampment';
    } else {
        return '2b.bastion';
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
        containerUpgrader: {
            desired: 0,
            body: body
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
    name:'2b.bastion',
    levelUp: levelUp
};