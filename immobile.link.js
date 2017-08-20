var s = require('shared');

var isNear = function isNear(thing1, thing2) {
    return thing1.pos.getRangeTo(thing2) < 3;
};

var linkLoop = function linkLoop(room, link) {
    var err = OK;
    const roomMem = room.memory;
    if (roomMem.links === undefined) {
        roomMem.links = {};
    }
    const m = roomMem.links[link.id];
    var receivers = [];
    if (!m) {
        room.memory.links[link.id] = {
            role: (isNear(link, room.storage) || isNear(link, room.controller) ) ? 'receiver' : 'transmitter'
        };
    } else {
        for (var otherLink in roomMem.links) {
            let oLink = Game.getObjectById(otherLink);
            if(oLink) {
                if (roomMem.links[otherLink].role == 'receiver') {
                    receivers.push(oLink);
                }
            } else {
               roomMem.links[otherLink] = undefined;
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
if (err != OK && err != ERR_TIRED) {
    console.log('error with link ' +link.id + ' : ' + err);
}
return;
};

module.exports = {
    run: linkLoop
};