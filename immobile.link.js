var s = require('shared');

var isNear = function isNear(thing1, thing2) {
    return thing1.pos.getRangeTo(thing2) < 2;
};

var linkLoop = function linkLoop(link) {
   const room = link.room.memory;
   if (room.links === undefined) {
       room.links = {};
   }
   const m = room.links[link.id];
   var receiver;
     //console.log('running loop for Link ' + link.id + ' which is a ' + m.role);
     for (let otherLink in link.room.memory.links) {
       let oLink = Game.getObjectById(otherLink);
         //console.log('examining other link ' + oLink.id)
         if(isNear(oLink, link.room.storage)) {
           receiver = oLink;
             //console.log('found my receiver!');
         }
     }
     //console.log('found receiver ' + receiver.id);
     if (!m || !receiver) {
        link.room.memory.links[link.id] = {
            role: isNear(link, link.room.storage) ? 'receiver' : 'transmitter'
        };
    } else {
         //console.log('running loop for Link ' + link.id + ' which is a ' + m.role);
         
         switch (m.role) {
            case 'receiver':
            // console.log('link is a receiver');
            break;
            case 'transmitter':
            // console.log('link is a transmitter');
            if (link.energy == link.energyCapacity) {
                let err = link.transferEnergy(receiver);
                //console.log('transferring energy from link');
                //console.log(err);
            }
            break;
            case '':
            /* falls through */
            default:
            console.log('link has no role?!');
            break;
        }
    }
    return;
};

module.exports = {
    run: linkLoop
};