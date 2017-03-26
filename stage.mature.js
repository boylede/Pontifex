module.exports = {
	tasks: [],
	desiredHarvesters: 10,
	desiredUpgraders: 10,
	harvester: [MOVE, CARRY, MOVE, CARRY, MOVE, WORK],
	upgrader: [MOVE, WORK, WORK, MOVE],
	defender: [MOVE, ATTACK, ATTACK, RANGED_ATTACK, MOVE, MOVE],
	name:'mature'
};