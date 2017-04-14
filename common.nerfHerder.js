var s = require('shared');
var roles = require('controller.roles');

var nerfHerder = {
	herd: function(creep, getSource, getTarget, roleChange, extract, deposit) {
		var err = OK;
		var m = creep.memory;
		var energy = creep.carry.energy;
		var target;
		var source;

		if (m.role === m.last) {
			target = Game.getObjectById(m.target);
			source = Game.getObjectById(m.source);
		} else {
			target = getTarget(creep);
			source = getSource(creep);
			m.last = m.role;
		}

		m.last = m.role;

		if (m.depositing) {
			if (energy === 0) {
				creep.say('extract');
				m.depositing = false;
				source = getSource(creep);
				if (source === null) {
					console.log('Can\'t find any ' + m.role + ' sources for ' + creep.name + '.');
					m.source = null;
					return roleChange(creep, ERR_NO_SOURCE);
				} else {
					m.source = source.id;
				}
			} else {
				err = deposit(creep, target);
				switch (err) {
					case ERR_NOT_IN_RANGE:
					creep.moveTo(target, {visualizePathStyle: {stroke: '#0095ff'}});
					break;
					case OK:
					break;
					default:
					console.log(creep.name + ' : could not deposit : ' + s.errors[err]);
					s.creepErr(creep, err);
					break;
				}
			}
		} else {
			if (energy == creep.carryCapacity) {
				creep.say('deposit');
				m.depositing = true;
				target = getTarget(creep);
				if (target === null) {
					console.log('Can\'t find any ' + m.role + ' targets for ' + creep.name + '.');
					m.target = null;
					return roleChange(creep, ERR_NO_TARGET);
				} else {
					// todo: handle target === undefined or ensure it cant be
					m.target = target.id;
				}
			} else {
				err = extract(creep, source);
				switch (err) {
					case ERR_NOT_IN_RANGE:
					creep.moveTo(source, {visualizePathStyle: {stroke: '#f1e05a'}});
					break;
					case OK:
					break;
					default:
					console.log(creep.name + ' could not extract');
					s.creepErr(creep, err);
					break;
				}
			}
		}

		// if (source === undefined) {
		// 	if (m.source === undefined) {
		// 		source = getSource(creep);
		// 		m.source = source.id;
		// 	} else {
		// 		source = Game.getObjectById(m.source);
		// 	}
		// }
		// if (target === undefined) {
		// 	if (m.target === undefined) {
		// 		target = getSource(creep);
		// 		m.target = target.id;
		// 	} else {
		// 		target = Game.getObjectById(m.target);
		// 	}
		// }

		// if(m.depositing) {
		// 	err = deposit(creep, target);
		// 	switch (err) {
		// 		case ERR_NOT_IN_RANGE:
		// 		creep.moveTo(target, {visualizePathStyle: {stroke: '#0095ff'}});
		// 		break;
		// 		case OK:
		// 		break;
		// 		default:
		// 		console.log(creep.name + ' : could not deposit : ' + s.errors[err]);
		// 		s.creepErr(creep, err);
		// 		break;
		// 	}
		// } else {
		// 	err = extract(creep, source);
		// 	switch (err) {
		// 		case ERR_NOT_IN_RANGE:
		// 		creep.moveTo(source, {visualizePathStyle: {stroke: '#f1e05a'}});
		// 		break;
		// 		case OK:
		// 		break;
		// 		default:
		// 		console.log(creep.name + ' could not extract');
		// 		s.creepErr(creep, err);
		// 		break;
		// 	}
		// }
		return;
	}
};

module.exports = nerfHerder;
