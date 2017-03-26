var s = require('shared');

var nerfHerder = {
	/** @param {Creep} creep **/
	herd: function(creep, stageC, getSource, getTarget, roleChange) {
		var err = OK;
		var m = creep.memory;
		var target;
		var source;

		if (m.depositing === true && creep.carry.energy === 0) {
			m.depositing = false;
			source = getSource(creep);
			if (source === null) {
				console.log('Can\'t find any ' + m.role + ' sources for ' + creep.name + '.');
				m.source = null;
				return roleChange(creep, ERR_NO_SOURCE);
			} else {
				m.source = source.id;
			}
		} else if (creep.carry.energy == creep.carryCapacity) {
			m.depositing = true;
			target = getTarget(creep);
			if (target === null) {
				console.log('Can\'t find any ' + m.role + ' targets for ' + creep.name + '.');
				m.target = null;
				return roleChange(creep, ERR_NO_TARGET);
			} else {
				m.target = target.id;
			}
		}

		if (source === undefined) {
			source = Game.getObjectById(m.source);
		}
		if (target === undefined) {
			target = Game.getObjectById(m.target);
		}

		if(m.depositing) {
			/*if (target.hits < target.hitsMax) {
				err = creep.repair(target);
			} else */
			if (target instanceof StructureSpawn || target instanceof StructureExtension || target instanceof StructureStorage || target instanceof StructureContainer) {
				err = creep.transfer(target, RESOURCE_ENERGY);
			} else if (target instanceof StructureController) {
				err = creep.upgradeController(target);
			}

			switch (err) {
				case ERR_NOT_IN_RANGE:
					creep.moveTo(target, {visualizePathStyle: {stroke: '#0095ff'}});
					break;
				case OK:
					break;
				default:
					s.creepErr(creep, err);
					break;
			}
		} else {
			if (source instanceof Source) {
				err = creep.harvest(source);
			} else {
				err = creep.withdraw(source, RESOURCE_ENERGY);
			}
			switch (err) {
				case ERR_NOT_IN_RANGE:
					creep.moveTo(source, {visualizePathStyle: {stroke: '#f1e05a'}});
					break;
				case OK:
					break;
				default:
					s.creepErr(creep, err);
					break;
			}
		}
		return;
	}
};

module.exports = nerfHerder;
