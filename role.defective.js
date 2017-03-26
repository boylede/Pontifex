var roleDefective = {

	/** @param {Creep} creep 
	 * @param {} stageController
	 *
	**/
	run: function(creep, stageController) {
		var m = creep.memory;
		var destination = creep.room.find(FIND_MY_STRUCTURES, { filter: { structureType: STRUCTURE_SPAWN } })[0];
		var err = creep.transfer(destination, RESOURCE_ENERGY);
		if(err == ERR_NOT_IN_RANGE) {
			creep.moveTo(destination, {visualizePathStyle: {stroke: '#fa3333'}});
		} else if (err != OK && err != ERR_NOT_ENOUGH_RESOURCES) {
			creep.say(err);
		} else {
			if (creep.memory.tenured) {
				err = destination.renewCreep(creep);
				if (err == OK) {
					creep.say('whew!');
					console.log('rescucitated ' + creep.name);
					creep.memory.role = creep.memory.tenuredRole;
				} else {
					console.log(creep.name + ' was unable to be rescucitated because ' + err);
					//destination.recycleCreep(creep);
				}
			} else {
				destination.recycleCreep(creep);
				creep.say('goodbye!');
				console.log('recycled ' + creep.name);
			}
		}
	}
};

module.exports = roleDefective;