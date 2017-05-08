/*
now that we have storage, we are set for level 5 
goal: accellerate to level 5
*/

var work = [WORK, WORK, WORK, WORK, WORK, MOVE, MOVE, MOVE, MOVE, CARRY];
var build = [WORK, MOVE, WORK, MOVE, WORK, MOVE, CARRY, MOVE, CARRY, MOVE,];
var heavy = [WORK, MOVE, WORK, MOVE, WORK, MOVE, WORK, WORK, WORK, WORK, WORK, CARRY];
var extract = [MOVE, WORK, WORK, WORK, WORK, WORK, CARRY];
var logistic = [CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY];
var defend = [TOUGH, TOUGH, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK];
var scout = [MOVE]; // , CLAIM, MOVE, CLAIM
var raider = [MOVE, ATTACK];

var levelUp = function levelUp(room) {
    //let numTowers = room.find(FIND_MY_STRUCTURES, {filter: (str) => str.structureType == STRUCTURE_TOWER}).length;
    //let numExtensions = room.find(FIND_MY_STRUCTURES, {filter: (str) => str.structureType == STRUCTURE_EXTENSION}).length;
    //let numContainers = room.find(FIND_MY_STRUCTURES, {filter: (str) => str.structureType == STRUCTURE_CONTAINER}).length;
    if (room.controller.level > 4 && room.storage !== undefined && room.energyAvailable >= 1300) {
        return '5a.village';
    } else {
        return '4b.town';
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
    hitsWall: 500000,
    hitsRampart: 500000,
    name:'4b.town',
    levelUp: levelUp
};