/*
built all our stuff, lets race to level 6.
*/

var work = [WORK, WORK, WORK, WORK, WORK, MOVE, MOVE, MOVE, MOVE, CARRY];
var build = [WORK, MOVE, WORK, MOVE, WORK, MOVE, CARRY, MOVE, CARRY, MOVE,];
var heavy = [WORK, MOVE, WORK, MOVE, WORK, MOVE, WORK, WORK, WORK, WORK, WORK, CARRY];
var extract = [MOVE, WORK, WORK, WORK, WORK, WORK, CARRY];
var logistic = [CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY];
var defend = [TOUGH, TOUGH, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK];
var scout = [MOVE]; // , CLAIM, MOVE, CLAIM
var raider = [MOVE, ATTACK];

const level = 5;
const maxEnergy = CONTROLLER_STRUCTURES[STRUCTURE_EXTENSION][level] * EXTENSION_ENERGY_CAPACITY[level];

var levelUp = function levelUp(room) {
    //let numTowers = room.find(FIND_MY_STRUCTURES, {filter: (str) => str.structureType == STRUCTURE_TOWER}).length;
    //let numExtensions = room.find(FIND_MY_STRUCTURES, {filter: (str) => str.structureType == STRUCTURE_EXTENSION}).length;
    //let numContainers = room.find(FIND_MY_STRUCTURES, {filter: (str) => str.structureType == STRUCTURE_CONTAINER}).length;
    let numFarmers = room.find(FIND_MY_CREEPS, (creep) => creep.memory.role == 'containerHarvester' || creep.memory.role == 'harvester' ).length;

    if (room.controller.level > 5 && room.energyAvailable >= maxEnergy) {
        return '6a.duchy';
    } else if (room.controller.level < level || !(numFarmers >= 1 )) {
        return '4a.settlement';
    } else {
        return '5b.city';
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
            desired: 2,
            body: heavy
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
            desired: 0,
            body: build
        },
        scout: {
            desired: 0,
            body: scout
        },
        raider: {
            desired: 0,
            body: raider
        }
    },
    hitsWall: 1000000,
    hitsRampart: 1000000,
    name:'5b.city',
    levelUp: levelUp
};