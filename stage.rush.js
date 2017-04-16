var deBody = [MOVE, CARRY, WORK, WORK, MOVE];
var exBody = [MOVE, CARRY, WORK, WORK, WORK, MOVE, MOVE, MOVE];
module.exports = {
    tasks: [],
    creeps: {
        harvester: {
            desired: 3,
            body: exBody
        },
        containerHarvester: {
            desired: 0,
            body: [MOVE, CARRY, WORK]
        },
        upgrader: {
            desired: 1,
            body: deBody
        },
        defender: {
            desired: 0,
            body: [MOVE, ATTACK, MOVE, ATTACK]
        },
        sherpa: {
            desired: 0,
            body: [MOVE, CARRY, MOVE, CARRY]
        },
        builder: {
            desired: 0,
            body: deBody
        }
    },
    // desiredHarvesters: 3,
    // desiredUpgraders: 1,
    // desiredBuilders: 1,
    // desiredSherpas: 0,
    // desiredDefenders: 0,
    // harvester: exBody,
    // upgrader: deBody,
    // defender: [MOVE, ATTACK, MOVE, ATTACK],
    // builder:deBody,
    // sherpa: [MOVE, CARRY, MOVE, CARRY],
    hitsWall: 2000,
    hitsRampart: 2000,
    name:'rush'
};