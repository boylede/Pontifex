var roleBuilder= {
	stop: function(creep) {
		//todo: remove builder-specific memory items.
	},
	/** @param {Creep} creep **/
	run: function(creep) {
		var m = creep.memory;
		var err = OK;
		var targets = [];
		
		if (m.building === true && creep.carry.energy === 0) {
			m.building = false;
		} else if (creep.carry.energy == creep.carryCapacity) {
			m.building = true;
			targets = creep.room.find(FIND_CONSTRUCTION_SITES, {
				filter: {my: true}
			});
			if (targets.length === 0) {
				console.log('can\'t find any construction sites');
				creep.memory.role = 'upgrader';
				delete m.target;
				return;
			} else {
				m.target = _.sortBy(targets, [(v)=> v.progress - v.progressTotal])[0].id;
			}
			//console.log(targets);
		}
		//creep.say(m.building? 'building' : 'notbuilding');
		
		if(m.building) {
			//todo: sort construction sites by energy required
			/*var targets = creep.room.find(FIND_CONSTRUCTION_SITES, {
				filter: {my: true}
			});*/
var target = Game.getObjectById(m.target);
if(target !== undefined) {
	err = creep.build(target);
	if(err == ERR_NOT_IN_RANGE) {
		creep.moveTo(target, {visualizePathStyle: {stroke: '#faafff'}});
	} else if (err == OK) {
		creep.say('️' + target.structureType);
	}
} else {
	console.log('no targets for building');
	creep.memory.role='upgrader';
	creep.say('upgrading');
}
}
else {
	creep.say('find energy!');
	var sources = creep.room.find(FIND_STRUCTURES, {
		filter: (structure) => {
			return (structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN) &&
			structure.energy > 0;
		}
	});
	err = sources[0].transferEnergy(creep, creep.carryCapacity);
	if(err == ERR_NOT_IN_RANGE) {
		creep.moveTo(sources[0], {visualizePathStyle: {stroke: '#ffaa00'}});
	} else if (err == ERR_NOT_ENOUGH_ENERGY) {
		console.log('not enough enery - havest!');
		creep.memory.role = 'harvester';
		creep.say('harvesting');
	}
}
}
};

module.exports = roleBuilder;