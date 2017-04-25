var deBody = [MOVE, WORK, MOVE, WORK, CARRY];
var exBody = [MOVE, WORK, MOVE, WORK, MOVE, WORK, MOVE, CARRY];
var levelUp = function levelUp(room) {
//    let numExtensions = room.find(FIND_MY_STRUCTURES, {filter: (str) => str.structureType == STRUCTURE_EXTENSION}).length;
    let numContainers = room.find(FIND_STRUCTURES, {filter: (str) => str.structureType == STRUCTURE_CONTAINER}).length;
    if (room.controller.level > 2 && room.energyAvailable >= 500 && numContainers >= 3) {
        return '3a.fort';
    } else {
        return '2b.bastion';
    }
};
module.exports = {
    tasks: [],
    creeps: {
        harvester: {
            desired: 0,
            body: exBody
        },
        containerHarvester: {
            desired: 2,
            body: exBody
        },
        upgrader: {
            desired: 0,
            body: deBody
        },
        containerUpgrader: {
            desired: 1,
            body: deBody
        },
        defender: {
            desired: 0,
            body: [MOVE, ATTACK, MOVE, ATTACK]
        },
        sherpa: {
            desired: 2,
            body: [MOVE, CARRY, MOVE, CARRY]
        },
        builder: {
            desired: 2,
            body: deBody
        }
    },
    hitsWall: 2000,
    hitsRampart: 2000,
    name:'2b.bastion',
    levelUp: levelUp
};