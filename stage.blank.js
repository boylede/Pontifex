var levelUp = function levelUp(room) {
    if (room.controller.my) {
        return 'seed';
    } else {
        return 'blank';
    }
};
module.exports = {
    tasks: [],
    creeps: {},
    hitsWall: 1000,
    hitsRampart: 1000,
    name:'blank',
    levelUp: levelUp
};