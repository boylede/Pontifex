module.exports = {
	tasks: [],
	desiredHarvesters: 4,
	desiredDefenders: 10,
	harvester: [MOVE, MOVE, MOVE, CARRY, WORK, CARRY, WORK],
	defender: [MOVE, MOVE, ATTACK, MOVE, ATTACK],
	buildConstructionSites: buildConstructionSites,
	name:'boom'
};