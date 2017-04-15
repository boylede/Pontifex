var work = [WORK, WORK, WORK, WORK, WORK, MOVE, MOVE, MOVE, MOVE, CARRY];
var build = [WORK, MOVE, WORK, MOVE, WORK, MOVE, CARRY, MOVE, CARRY, MOVE,];
var heavy = [WORK, MOVE, WORK, MOVE, WORK, MOVE, WORK, WORK, WORK, WORK, WORK, CARRY];
var extract = [MOVE, WORK, WORK, WORK, WORK, WORK, CARRY];
var logistic = [CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY];
var defend = [MOVE, MOVE, ATTACK, ATTACK, ATTACK, ATTACK];
var scout = [MOVE]; // , CLAIM, MOVE, CLAIM
var raider = [MOVE, ATTACK];
module.exports = {
    desiredHarvesters: 0,
    desiredFatHarvesters: 2,
    desiredFatUpgraders: 1,
    desiredUpgraders: 0,
    desiredBuilders: 1,
    desiredSherpas: 4,
    desiredDefenders: 0,
    desiredScouts: 0,
    desiredRaiders: 0,
    harvester: work,
    scout: scout,
    raider: raider,
    fatHarvester: extract,
    fatUpgrader: heavy,
    upgrader: work,
    defender: defend,
    builder: build,
    sherpa: logistic,
    hitsWall: 250000,
    hitsRampart: 250000,
    name:'stable'
};