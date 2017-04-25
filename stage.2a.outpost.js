var deBody = [MOVE, WORK, MOVE, WORK, CARRY];
var exBody = [MOVE, WORK, MOVE, WORK, MOVE, WORK, MOVE, CARRY];
var levelUp = function levelUp(room) {
//    let numExtensions = room.find(FIND_MY_STRUCTURES, {filter: (str) => str.structureType == STRUCTURE_EXTENSION}).length;
    let numContainers = room.find(FIND_STRUCTURES, {filter: (str) => str.structureType == STRUCTURE_CONTAINER}).length;
    if (room.energyAvailable >= 500 && numContainers >= 3) {
        if (room.controller.level > 2) {
            return 'mature';
        } else {
            return 'rush';
        }
    } else if (false ) {
//
    } else {
        return 'boom';
    }
};
module.exports = {
    tasks: [],
    creeps: {
        harvester: {
            desired: 2,
            body: exBody
        },
        containerHarvester: {
            desired: 0,
            body: exBody
        },
        upgrader: {
            desired: 1,
            body: deBody
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
            body: deBody
        }
    },
    // desiredHarvesters: 2,
    // desiredUpgraders: 1,
    // desiredBuilders: 0,
    // desiredSherpas: 1,
    // desiredDefenders: 0,
    // harvester: exBody,
    // upgrader: deBody,
    // defender: [MOVE, ATTACK, MOVE, ATTACK],
    // builder:deBody,
    // sherpa: [MOVE, CARRY, MOVE, CARRY],
    hitsWall: 2000,
    hitsRampart: 2000,
    name:'boom',
    levelUp: levelUp
};