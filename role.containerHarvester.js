var s = require('shared');

var findNearby = function(src, typ, filter){
    var area = src.room.lookForAtArea(typ, src.pos.y - 1, src.pos.x - 1, src.pos.y + 1, src.pos.x + 1, true);
    //console.log(area.length);
    //console.log(area[0].structure.structureType);
    var results = _.filter(area, filter);
    if (results[0]) {
        return results[0].structure;
    } else {
        return false;
    }
};

var freeSpace = function(src) {
    //todo: make this source-agnostic
    var area = src.room.lookForAtArea(LOOK_STRUCTURES, src.pos.y - 1, src.pos.x - 1, src.pos.y + 1, src.pos.x + 1, true);
    var free = _.filter(area, (str) => {
        let st = str.structure;
        console.log('looking for fat asses at ' + st.id);
        let fatHarvesters = st.room.find(FIND_MY_CREEPS, {filter: (creep) => {
            return creep.memory.role == 'fatHarvester' && creep.memory.container !== undefined && creep.memory.container == st.id;
        } });
        console.log('found ' + fatHarvesters.length);
        let result = st.structureType == STRUCTURE_CONTAINER && fatHarvesters.length === 0;
        return result;
    });
    var free_containers = [];
    for (var name in free) {
        free_containers.push(free[name].structure);
    }
    console.log('found ' + free_containers.length + ' free containers at ' + src.id);
    // return free[0].structure;
    return free_containers;
};


function onTop(creep, container) {
    return creep.pos == container.pos;
}

var immobileHarvester = {
    run: function(creep, stageC) {
        var err = OK;
        var m = creep.memory;
        var source;
        var container;
        //m.container = undefined;
        //m.source = undefined;
        if ( m.source === undefined || m.container === undefined) {
            let index = -1;
            let sources = creep.room.find(FIND_SOURCES, {});
            while ( container === undefined && index < sources.length) {
                index++;
                console.log('trying source ' + (index) + ' for ' + creep.name );
                source = sources[index];
                let containers = freeSpace(source);
                console.log('found ' + containers.length + ' containers free for ' + creep.name);
                container = containers[0];
                //index++;
            }
            
            
            // let sources = creep.room.find(FIND_SOURCES, {})
            // let index = ~~(Math.random() * sources.length );
            // console.log(sources);
            // console.log('setting source ' + index + ' for ' + creep.name);
            // source = sources[~~(Math.random * sources.length)];
            if (source !== undefined && container !== undefined) {
                console.log('selected source ' + index + ' for ' + creep.name);
                m.source = source.id;
                m.container = container.id;
            }
        } else {
            source = Game.getObjectById(m.source);
            container = Game.getObjectById(m.container);
            //console.log('remembered ' + m.source + ' for ' + creep.name);
        }
 /*
        if (m.container !== undefined) {
            container = Game.getObjectById(m.container);
 
        } else {
             container = freeSpace(source);
 
        }
*/
/*
        if (false && container !== undefined && container !== null) {
            m.container = container.id;
        } else {
            //console.log(' no free containers for ' + creep.name);
            return;
        }*/
        //console.log('looking for link near ' + creep.id);
        let link = findNearby(creep, LOOK_STRUCTURES, (str) => str.structure.structureType == STRUCTURE_LINK);
        //console.log(link);

        if (creep.pos.x == container.pos.x && creep.pos.y == container.pos.y) {
            err = creep.harvest(source);
            if (link) {
                //console.log('tying to use link ' + link.id);
                creep.withdraw(container, RESOURCE_ENERGY);
                creep.transfer(link, RESOURCE_ENERGY);
            } else {
                //console.log('found no links');
            }
        } else {
            err = creep.moveTo(container, {visualizePathStyle: {stroke: '#ffaa00'}});
        }

        switch (err) {
            case ERR_FULL:
                //creep.say('err?!')
                //break;
            case ERR_NOT_ENOUGH_ENERGY:
        //    case ERR_NOT_ENOUGH_RESOURCES:
            case ERR_TIRED:
            case OK:
                break;
            default:
                s.creepErr(creep, err);
            break;
        }
        return OK;
    }
};

module.exports = immobileHarvester;