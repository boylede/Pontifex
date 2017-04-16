var work = [WORK, WORK, WORK, WORK, WORK, MOVE, MOVE, MOVE, MOVE, CARRY];
var heavy = [WORK, MOVE, WORK, MOVE, WORK, MOVE, WORK, WORK, WORK, WORK, WORK, CARRY];
var extract = [MOVE, WORK, WORK, WORK, WORK, WORK];
var logistic = [MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY];
var defend = [MOVE, MOVE, ATTACK, ATTACK, ATTACK, ATTACK];
module.exports = {
    creeps: {
        harvester: {
            desired: 0,
            body: work
        },
        containerHarvester: {
            desired: 1,
            body: extract
        },
        upgrader: {
            desired: 1,
            body: work
        },
        defender: {
            desired: 0,
            body: defend
        },
        sherpa: {
            desired: 2,
            body: logistic
        },
        builder: {
            desired: 0,
            body: work
        }
    },
    // desiredHarvesters: 0,
    // desiredFatHarvesters: 1,
    // desiredFatUpgraders: 0,
    // desiredUpgraders: 1,
    // desiredBuilders: 0,
    // desiredSherpas: 2,
    // desiredDefenders: 0,
    // harvester: work,
    // fatHarvester: extract,
    // fatUpgrader: heavy,
    // upgrader: work,
    // defender: defend,
    // builder: work,
    // sherpa: logistic,
    hitsWall: 250000,
    hitsRampart: 250000,
    name:'mature'
};