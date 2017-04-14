var s = require('shared');

var scout = {
    run: function(creep, stageC) {
        var err = OK;
        var m = creep.memory;
        
        var destination = new RoomPosition(22, 32, Memory.attack);
        var path = {visualizePathStyle: {stroke: '#ffaa00', opacity: 1.0}};
        if (creep.room.name == Memory.attack) {
            //creep.moveTo(creep.room.controller);
            err = creep.signController(creep.room.controller, 'Kilroy was here.');
        } else {
            err = creep.moveTo(destination, path);
        }

        switch (err) {
            case ERR_FULL:
            case ERR_NOT_ENOUGH_ENERGY:
        //    case ERR_NOT_ENOUGH_RESOURCES:
            case ERR_TIRED:
            case OK:
                break;
            case ERR_NOT_IN_RANGE:
                creep.moveTo(creep.room.controller, path);
                break;
            default:
                s.creepErr(creep, err);
            break;
        }
        return OK;
    }
};

module.exports = scout;