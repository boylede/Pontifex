var body = [MOVE, CARRY, WORK, WORK];
module.exports = {
    tasks: [],
    creeps: {
        harvester: {
            desired: 2,
            body: body
        },
        upgrader: {
            desired: 1,
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
    name:'seed'
};