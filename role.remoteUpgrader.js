var s = require('shared');
const moveOpts =  {visualizePathStyle: {stroke: '#ffaa00', opacity: 0.8}};

const errResponse = function errResponse(err, creep, goal, destination) {
    var mem = goal.id;
    switch (err) {
        case ERR_NOT_IN_RANGE:
        if (!destination) {
            err = creep.moveTo(goal, moveOpts);
        } else {
            err = cree.moveTo(destination, moveOpts);
        }
        break;
        case OK:
        case ERR_FULL:
        case ERR_NOT_ENOUGH_ENERGY:
        case ERR_TIRED:
        case ERR_BUSY:
        case ERR_NOT_FOUND:
        mem = undefined;
        break;
        default:
        creep.say('?');
        break;
    }
    return mem;
};

var remoteMiner = {
    run: function(creep) {
        var err = OK;
        const m = creep.memory;
        const energy = creep.carry.energy;
        const carried = _.sum(creep.carry);
        var goal;
        var last;
        var destination = getDestination(creep);
        var extracting = !m.depositing;
        var key = 'target';
        var getGoal = getTarget;

        if (extracting) {
            if (carried == creep.carryCapacity) {
                extracting = false;
            }
        } else {
            if (carried === 0) {
                extracting = true;
            }
        }

        m.depositing = !extracting;

        if (extracting) {
            last = Game.getObjectById(m.target);
            key = 'source';
            getGoal = getSource;
        } else {
            last = Game.getObjectById(m.source);
            // getGoal = getTarget;
        }

        if (m[key]) {
            goal = Game.getObjectById(m[key]);
        }
        if (!goal) {
            goal = getGoal(creep, last);
            m[key] = undefined;
        }
        if (goal) {
            err = extract(creep, goal);
            m[key] = errResponse(err, creep, goal, destination);
        }

        return OK;
    }
};

module.exports = remoteMiner;