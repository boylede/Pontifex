/*
*/
var work = [WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, MOVE, MOVE, MOVE, MOVE, MOVE, CARRY];
var build = [WORK, MOVE, WORK, MOVE, WORK, MOVE, CARRY, MOVE, CARRY, MOVE,];
var extract = [MOVE, WORK, WORK, WORK, WORK, WORK, CARRY];
var logistic = [CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE];
var defend = [MOVE, MOVE, ATTACK, ATTACK, ATTACK, ATTACK];
var scout = [MOVE]; // , CLAIM, MOVE, CLAIM
var raider = [MOVE, ATTACK];

const level = 6;
const maxEnergy = CONTROLLER_STRUCTURES[STRUCTURE_EXTENSION][level] * EXTENSION_ENERGY_CAPACITY[level];

var levelUp = function levelUp(room) {
    let numTowers = room.find(FIND_MY_STRUCTURES, {filter: (str) => str.structureType == STRUCTURE_TOWER}).length;
    let numLinks = room.find(FIND_MY_STRUCTURES, {filter: (str) => str.structureType == STRUCTURE_LINK}).length;
    //let numContainers = room.find(FIND_MY_STRUCTURES, {filter: (str) => str.structureType == STRUCTURE_CONTAINER}).length;
    if (room.controller.level > 6 && numLinks >= 3 && room.energyAvailable >= maxEnergy) {
        console.log('construct additional pylons'); // need to make more levels
        return '6b.principality';
    } else if (room.controller.level < 6) {
        return '5a.village';
    } else {
        return '6b.principality';
    }
};

module.exports = {
    creeps: {
        harvester: {
            desired: 0,
            body: work
        },
        containerHarvester: {
            desired: 2,
            body: extract
        },
        upgrader: {
            desired: 0,
            body: work
        },
        containerUpgrader: {
            desired: 1,
            body: work
        },
        defender: {
            desired: 0,
            body: defend
        },
        sherpa: {
            desired: 4,
            body: logistic
        },
        builder: {
            desired: 1,
            body: build
        },
        scout: {
            desired: 0,
            body: scout
        },
        miner: {
            desired: 1,
            body: [MOVE, WORK, CARRY]
        }
    },
    hitsWall: 1000000,
    hitsRampart: 1000000,
    name:'6b.principality',
    levelUp: levelUp
};