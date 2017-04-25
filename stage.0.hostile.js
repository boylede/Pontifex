module.exports = {
	tasks: [],
	creeps: {
        harvester: {
            desired: 1,
            body: [MOVE, CARRY, WORK]
        },
        containerHarvester: {
            desired: 0,
            body: [MOVE, CARRY, WORK]
        },
        upgrader: {
            desired: 1,
            body: [MOVE, WORK]
        },
        defender: {
            desired: 0,
            body: [MOVE, ATTACK]
        },
        sherpa: {
            desired: 0,
            body: [MOVE, CARRY]
        },
        builder: {
            desired: 0,
            body: [MOVE, CARRY, WORK]
        }
    },
	// desiredHarvesters: 1,
	// desiredUpgraders: 1,
	// harvester: [MOVE, CARRY, WORK],
	// upgrader: [MOVE, WORK],
	// defender: [MOVE, ATTACK],
	name:'0.hostile'
};