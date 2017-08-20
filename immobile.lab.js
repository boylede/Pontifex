var s = require('shared');

const PROCESSOR = 1;
const STORAGE = 2;

function nearIds(room, lab) {
    // return all labs' ids near this one
    const x = lab.pos.x;
    const y = lab.pox.y;
    const structures = room.lookForAtArea(LOOK_MY_STRUCTURES, x - 2, y - 2, x + 2, y + 2, true);
    const labs = _.filter(structures, (str) => str.structure.structureType == STRUCTURE_LAB);
    return labs.map((e, i, a) => e.structure.id);
}

function newLab(room, lab) {
    return {
            role: STORAGE,
            near: nearIds(room, lab)
        };
}

function runReaction(lab, m) {
    var a = Game.getObjectById(m.input1);
    var b = Game.getObjectById(m.input2);
    return lab.runReaction(a, b);
}

function run(room, lab) {
    var err = OK;
    if (!room.labs) {
        room.labs = {};
    }
    const m = room.labs[lab.id];
    var processors = [];
    if (!m) {
        lab.room.memory.labs[lab.id] = newLab(room, lab);
    } else {
        switch (m.role) {
            case PROCESSOR:
            err = runReaction(lab, m);
            break;
            case STORAGE:
            break;
            default:
            break;
        }
    }
    if (err != OK && err != ERR_TIRED) {
        s.logErr(err, 'error with lab' );
    }
    return;
}

module.exports = {
    run: run
};