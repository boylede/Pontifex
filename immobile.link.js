var s = require('shared');

var isNear = function isNear(thing1, thing2) {
    return thing1.pos.getRangeTo(thing2) < 3;
};

var linkLoop = function linkLoop(link) {
    var err = OK;
    const room = link.room.memory;
    if (room.links === undefined) {
        room.links = {};
    }
    const m = room.links[link.id];
    var receivers = [];
    if (!m) {
        link.room.memory.links[link.id] = {
            role: (isNear(link, link.room.storage) || isNear(link, link.room.controller) ) ? 'receiver' : 'transmitter'
        };
    } else {
        for (var otherLink in room.links) {
            let oLink = Game.getObjectById(otherLink);
            if(oLink) {
                if (room.links[otherLink].role == 'receiver') {
                    receivers.push(oLink);
                }
            } else {
               room.links[otherLink] = undefined;
           }
       }
       if (receivers.length > 0) {
           receivers.sort((a, b) => a.energy - b.energy);
           if (m.role == 'transmitter') {
            if (link.energy == link.energyCapacity) {
                err = link.transferEnergy(receivers[0]);
            }
        }
    }
}
if (err != OK) {
    console.log('error with link ' +link.id + ' : ' + err);
}
return;
};

module.exports = {
    run: linkLoop
};