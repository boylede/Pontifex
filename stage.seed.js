var body = [MOVE, CARRY, WORK, WORK];
module.exports = {
    tasks: [],
    desiredHarvesters: 2,
    desiredUpgraders: 1,
    desiredBuilders: 0,
    desiredSherpas: 0,
    desiredDefenders:0,
    harvester: body,
    upgrader: body,
    defender: [MOVE, ATTACK],
    sherpa: [MOVE, CARRY],
    builder:body,
    hitsWall: 1000,
    hitsRampart: 1000,
    name:'seed'
};