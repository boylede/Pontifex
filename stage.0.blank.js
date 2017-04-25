var levelUp = function levelUp(room) {
    if (room.controller.my) {
        return '1a.seed';
    } else {
        return '0.blank';
    }
};
module.exports = {
    tasks: [],
    creeps: {},
    hitsWall: 1000,
    hitsRampart: 1000,
    name: '0.blank',
    levelUp: levelUp
};