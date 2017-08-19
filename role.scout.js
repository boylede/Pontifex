var s = require('shared');
var moveOpts = {plainCost: 1, swampCost: 1, visualizePathStyle: {stroke: '#ffaa00', opacity: 1.0}};

var errResponse = function errResponse(err, creep, goal) {
    var mem = goal;
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
        break;
    }
    return mem;
};

var scout = {
    run: function(creep) {
        var err = OK;
        var m = creep.memory;
        var destination;
        var room = creep.room.name;

        if (m.destination) {
            destination = new RoomPosition(m.destination.x, m.destination.y, m.destination.room);
            isThere = m.destination.room === room;
            if (destination) {
                err = creep.moveTo(destination, moveOpts);
                m.destination = errResponse(err, creep, destination);
            }
        }
        m.destination = errResponse(err, creep, destination);
        return OK;

    }
};

module.exports = scout;