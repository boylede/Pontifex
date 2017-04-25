var body = [MOVE, CARRY, WORK, WORK];
var levelUp = function levelUp(room) {
    let numSpawns = room.find(FIND_MY_STRUCTURES, {filter: (str) => str.structureType == STRUCTURE_SPAWN}).length;
    //let numExtensions = room.find(FIND_MY_STRUCTURES, {filter: (str) => str.structureType == STRUCTURE_EXTENSION}).length;
    if (numSpawns > 0 && room.controller.level > 1 && room.energyAvailable >= 500) {
        return 'boom';
    } else {
        return 'seed';
    }
};
module.exports = {
    tasks: [],
    creeps: {
        harvester: {
            desired: 2,
            body: body
        },
        upgrader: {
            desired: 1,
            body: body
        },
        defender: {
            desired: 0,
            body: [MOVE, ATTACK]
        },
        sherpa: {
            desired: 0,
            body: [MOVE, CARRY]
        },
        builder: {
            desired: 1,
            body: body
        }
    },
    hitsWall: 1000,
    hitsRampart: 1000,
    name:'seed',
    levelUp: levelUp
};