/*
during this stage we focus on getting the controller up to level 2. this only requires 200 points.
goal: get harvesters working, upgrader controller 200 points
*/
var body = [MOVE, CARRY, WORK, WORK];
var levelUp = function levelUp(room) {
    let numSpawns = room.find(FIND_MY_STRUCTURES, {filter: (str) => str.structureType == STRUCTURE_SPAWN}).length;
    //let numExtensions = room.find(FIND_MY_STRUCTURES, {filter: (str) => str.structureType == STRUCTURE_EXTENSION}).length;
    if (room.controller.level > 1 && numSpawns > 0 && room.energyAvailable >= 300) {
        return '2a.outpost';
    } else {
        return '1b.foothold';
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
    name:'1b.foothold',
    levelUp: levelUp
};