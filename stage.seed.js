var body = [MOVE, CARRY, WORK, WORK];
var levelUp = function levelUp(room) {
    let spawns = room.find(FIND_MY_STRUCTURES, {filter: (str) => str.structureType == STRUCTURE_SPAWN});
    //let numExtensions = room.find(FIND_MY_STRUCTURES, {filter: (str) => str.structureType == STRUCTURE_EXTENSION}).length;
    if (spawns > 0 && room.controller.level > 1) {
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
            desired: 0,
            body: body
        }
    },
    hitsWall: 1000,
    hitsRampart: 1000,
    name:'seed',
    levelUp: levelUp
};