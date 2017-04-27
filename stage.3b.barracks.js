/*
ready to build that tower
goal: build 1 tower
*/

var harvester = [MOVE, WORK, WORK, WORK, WORK, WORK];
var body = [WORK, MOVE, CARRY];
var builder = [MOVE, WORK, MOVE, WORK, MOVE, WORK, MOVE, WORK, MOVE, CARRY, CARRY];
var carry = [MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY];
var defend = [MOVE, MOVE, ATTACK, ATTACK, ATTACK, ATTACK];

/*
var work = [WORK, WORK, WORK, WORK, WORK, MOVE, MOVE, MOVE, MOVE, CARRY];
var heavy = [WORK, MOVE, WORK, MOVE, WORK, MOVE, WORK, WORK, WORK, WORK, WORK, CARRY];
var extract = [MOVE, WORK, WORK, WORK, WORK, WORK];
var logistic = [MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY];
var defend = [MOVE, MOVE, ATTACK, ATTACK, ATTACK, ATTACK];
*/
var levelUp = function levelUp(room) {
    let numTowers = room.find(FIND_MY_STRUCTURES, {filter: (str) => str.structureType == STRUCTURE_TOWER}).length;
    //let numExtensions = room.find(FIND_MY_STRUCTURES, {filter: (str) => str.structureType == STRUCTURE_EXTENSION}).length;
    //let numContainers = room.find(FIND_MY_STRUCTURES, {filter: (str) => str.structureType == STRUCTURE_CONTAINER}).length;
    if (room.energyAvailable >= 800 && numTowers >= 1) {
        return '3c.base';
    } else {
        return '3b.barracks';
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
            body: builder
        }
    },
    hitsWall: 250000,
    hitsRampart: 250000,
    name:'3b.barracks',
    levelUp: levelUp
};