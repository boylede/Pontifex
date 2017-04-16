var deBody = [MOVE, CARRY, WORK, WORK, MOVE];
var exBody = [MOVE, CARRY, WORK, WORK, WORK, MOVE, MOVE, MOVE];
module.exports = {
    tasks: [],
    creeps: {
        harvester: {
            desired: 2,
            body: exBody
        },
        containerHarvester: {
            desired: 0,
            body: exBody
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
            desired: 1,
            body: [MOVE, CARRY, MOVE, CARRY]
        },
        builder: {
            desired: 0,
            body: deBody
        }
    },
    // desiredHarvesters: 2,
    // desiredUpgraders: 1,
    // desiredBuilders: 0,
    // desiredSherpas: 1,
    // desiredDefenders: 0,
    // harvester: exBody,
    // upgrader: deBody,
    // defender: [MOVE, ATTACK, MOVE, ATTACK],
    // builder:deBody,
    // sherpa: [MOVE, CARRY, MOVE, CARRY],
    hitsWall: 2000,
    hitsRampart: 2000,
    name:'boom'
};