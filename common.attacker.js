var s = require('shared');

var attacker = {
	run: function(creep, stageC, getRally, getTarget, getroleChange, action) {
		var err = OK;
		var m = creep.memory;
		var rally;
		var target;

		if (m.attacking === true && Memory.groups[m.group].attacking === false) {
			creep.say('retreat!');
			m.attacking = false;
			rally = getRally(creep);
			if (rally === null) {
				console.log('Can\'t find any ' + m.role + ' rally points for ' + creep.name + '.');
				m.rally = null;
				return roleChange(creep, ERR_NO_SOURCE);
			} else {
				m.rally = rally.id;
			}
		} else if (!m.attacking && Memory.groups[m.group].attacking) {
			creep.say('attack!');
			m.attacking = true;
			target = getTarget(creep);
			if (target === null) {
				console.log('Can\'t find any ' + m.role + ' targets for ' + creep.name + '.');
				m.target = null;
				return roleChange(creep, ERR_NO_TARGET);
			} else {
				m.target = target.id;
			}
		}

		if (rally === undefined) {
			if (m.rally === undefined) {
				rally = getRally(creep);
				m.rally = rally;
			} else {
				rally = m.rally;
			}
		}
		if (target === undefined) {
			if (m.target === undefined) {
				target = getrally(creep);
				m.target = target.id;
			} else {
				target = Game.getObjectById(m.target);
			}
		}

		if(m.attacking) {
			err = action(creep, target);

			switch (err) {
				case ERR_NOT_IN_RANGE:
				creep.moveTo(target, {visualizePathStyle: {stroke: '#0095ff'}});
				break;
				case OK:
				break;
				default:
				console.log(creep.name + ' failed.');
				s.creepErr(creep, err);
				break;
			}
		} else {
		// todo: something that allows healers to heal, 
		// non-attacking variants to get a callback;
	}
	return;
}
};

module.exports = attacker;
