/*
during this stage the controller is ours but we don't have a spawn yet
goal: build a spawn
*/
var body = [MOVE, CARRY, WORK, WORK];
var levelUp = function levelUp(room) {
    let numSpawns = room.find(FIND_MY_STRUCTURES, {filter: (str) => str.structureType == STRUCTURE_SPAWN}).length;
    //let numExtensions = room.find(FIND_MY_STRUCTURES, {filter: (str) => str.structureType == STRUCTURE_EXTENSION}).length;
    if (numSpawns > 0) {
        return '1b.foothold';
    } else  if (room.controller.level < 1) {
        return '0.blank';
    } else{
        return '1a.seed';
    }
};
module.exports = {
    tasks: [],
    creeps: {
        harvester: {
            desired: 0,
            body: body
        },
        upgrader: {
            desired: 0,
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
    name:'1a.seed',
    levelUp: levelUp
};