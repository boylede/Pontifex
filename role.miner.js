var s = require('shared');
const moveOpts = {visualizePathStyle: {stroke: '#ffaa00'}};

function errResponse(err, creep, goal) {

    var mem = goal.id;
    switch (err) {
        case ERR_NOT_IN_RANGE:
        creep.moveTo(goal, moveOpts);
        break;
        case OK:
        case ERR_FULL:
        case ERR_NOT_ENOUGH_ENERGY:
        case ERR_TIRED:
        break;
        default:
        creep.say('?');
        console.log(err);
        break;
    }
    return mem;
}

function getSource(creep) {
    return creep.room.find(FIND_MINERALS)[0];
}

function getTarget(creep) {
    var targets = creep.room.find(FIND_STRUCTURES, {
        filter: (structure) => {
            const stored = structure.store ? _.sum(structure.store) : 0;
            return (structure.structureType == STRUCTURE_TERMINAL || structure.structureType == STRUCTURE_CONTAINER || structure.structureType == STRUCTURE_STORAGE) &&
            stored < structure.storeCapacity;
        }
    });
    return creep.pos.findClosestByPath(targets);
}

function firstOf(obj) {
    var ret = RESOURCE_ENERGY;
    for ( var key in obj) {
        if (obj.hasOwnProperty(key)) {
            if (obj[key]) {
                ret = key;
            }
        }
    }
    // console.log('found mineral in creep ' + ret);
    return ret;
}

var miner = {
    run: function(creep) {
        var err = OK;
        var m = creep.memory;
        var source;
        var target;
        var extracting =  !m.depositing;
        const carried = _.sum(creep.carry);
        const firstResource = firstOf(creep.carry);
        if (extracting) {
            if (carried >= creep.carryCapacity) {
                extracting = false;
            }
        } else {
            if (carried === 0) {
                extracting = true;
            }
        }

        m.depositing = !extracting;

        if (extracting) {
            if (m.source) {
                source = Game.getObjectById(m.source);
            }
            if (!source) {
                source = getSource(creep);
            }
            if (source) {
                err = creep.harvest(source);
                // console.log('harvesting from mineral');
                m.source = errResponse(err, creep, source);
            }
        } else {
            target = getTarget(creep);
            if (target) {
                // console.log('storing ' + carried + 'mineral ' + firstResource + ' at ' + target.structureType);
                // let resources = _.sum(creep.carry);
                err = creep.transfer(target, firstResource);
                m.target = errResponse(err, creep, target);
            }
        }
        return OK;
    }
};

module.exports = miner;