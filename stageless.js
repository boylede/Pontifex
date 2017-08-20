/* 
current function of individual stage files:
* store body descriptions for required roles
* determine when to upstage/downstage (what buildings are required, if economy is collapsing)
* store desired number and type of creeps
* determine desired wall / rampart hitpoints

the method to achieve the above is static so must be hand-created for each stage.
we will replace these methods with new logic:

1. determine body parts based on desired cost, speed, capability
2. dont determine which buildings are required, instead return what building to construct next.
3. dont determine if economy is collapsing, determine what we can afford to spend on new creeps based on recent rate of income
4. determine which creep type is needed most/next, if any
5. use a linear function to determine rampart & wall hits. 

finished so far: 
#1 - body descriptions = now a function
#2 - determine what building to build next, if any
#5 - hitpoints for walls / ramparts

*/

/*
#1 - next creep
*/
function newCreepBody(maxCost, walkSpeed, carryWorkRatio, maxWork, workPart) {
	var body = [];
	var nextPart = MOVE;
	var cost = 0;
	var nextCost = creepCost([nextPart]);
	var workParts = 0;
	var carryParts = 0;
	while (maxCost >= cost + nextCost && body.length <= MAX_CREEP_SIZE ) {
	    // console.log('adding a ' + nextPart + ' part');
		cost = cost + nextCost;
		// console.log('creep costs ' + cost);
		body.push(nextPart);
		if (determineWalkSpeed(body) > walkSpeed) {
			nextPart = MOVE;
		} else if (carryParts / workParts < carryWorkRatio) {
			nextPart = CARRY;
			carryParts++;
		} else if (workParts <= maxWork) {
			nextPart = workPart;
			workParts++;
		} else {
		    nextPart = TOUGH;
		}
		nextCost = creepCost([nextPart]);
		// console.log('want to add ' + nextPart);
		// console.log(body);
		
	}
	// console.log('final cost: ' + cost);
	return body;
}

function determineWalkSpeed(body) {
	var speed = body.length;
	for (var i = body.length - 1; i >= 0; i--) {
		if (body[i] == MOVE) {
			speed -= 2;
		}
	}
	if (speed < 0) {
	    speed = 0;
	}
	// console.log('creep will rest for ' + speed + ' ticks');
	return speed;
}

function countParts(body, part) {
	var parts = 0;
	for (var i = body.length - 1; i >= 0; i--) {
		if (body[i] == part) {
			parts++;
		}
	}
	return parts;
}

function creepCost(body) {
	var cost = 0;
	for (var i = body.length - 1; i >= 0; i--) {
		cost += BODYPART_COST[body[i]];
	}
	return cost;
}

function determineHitPoints(body) {
    return body.length * 100;
}

function countCreep(body) {
    const cost = creepCost(body);
    const fat = determineWalkSpeed(body);
    const hits = determineHitPoints(body);
    const works = countParts(body, WORK);
    const carryCap = countParts(body, CARRY) * CARRY_CAPACITY;
    // console.log(cost, fat, hits, works, carryCap);
    return {
        cost: cost,
        fatigue: fat,
        hitpoints: hits,
        works: works,
        capacity: carryCap
    };
}

const MAX_HARVESTER_WORK_PARTS = SOURCE_ENERGY_CAPACITY / (HARVEST_POWER * ENERGY_REGEN_TIME);
//     HARVEST_MINERAL_POWER: 1,
// CONTROLLER_MAX_UPGRADE_PER_TICK: 15,
// MAX_CREEP_SIZE 

function nextCreepBody(role, level, cost) {
    var maxEnergy = (CONTROLLER_STRUCTURES[STRUCTURE_EXTENSION][level] * EXTENSION_ENERGY_CAPACITY[level]) + (CONTROLLER_STRUCTURES[STRUCTURE_SPAWN][level] * SPAWN_ENERGY_CAPACITY);
    if (cost !== undefined && cost < maxEnergy) {
        maxEnergy = cost;
    }
	var body = false;
	// newCreepBody = function(maxCost, walkSpeed, carryWorkRatio, maxWork, workPart) {
		switch (role) {
			case 'harvester':
			body = newCreepBody(maxEnergy, 1, 1, 5, WORK);
			break;
			case 'containerHarvester':
			let energy = maxEnergy > 2000 ? 2000 : maxEnergy;
			body = newCreepBody(energy, 5, 0.2, 5, WORK);
			break;
			case 'upgrader':
			body = newCreepBody(maxEnergy, 1, 1, 50, WORK);
			break;
			case 'containerUpgrader':
			body = newCreepBody(maxEnergy, 5, 0.2, 50, WORK);
			break;
			case 'defender':
			body = newCreepBody(maxEnergy, 1, 0, 50, ATTACK);
			break;
			case 'sherpa':
			body = newCreepBody(maxEnergy, 1, 0, 50, CARRY);
			break;
			case 'builder':
			body = newCreepBody(maxEnergy, 1, 1, 50, WORK);
			break;
			case 'scout':
			body = [MOVE];
			break;
			case 'raider':
			body = newCreepBody(maxEnergy, 1, 0, 50, ATTACK);
			break;
			default:
			break;
		}
		return body;
}

/*
#2 - next building
*/

function countBuildings(room, structure) {
    return room.find(FIND_MY_STRUCTURES, {filter: str => str.structureType == structure}).length;
}

const STRUCTURE_PRIORITIES = [
    STRUCTURE_EXTENSION,
    STRUCTURE_SPAWN,
    STRUCTURE_CONTAINER,
    STRUCTURE_TOWER,
    STRUCTURE_STORAGE,
    STRUCTURE_LINK,
    STRUCTURE_EXTRACTOR,
    STRUCTURE_TERMINAL,
    STRUCTURE_LAB,
    STRUCTURE_OBSERVER,
    STRUCTURE_POWER_SPAWN,
    STRUCTURE_NUKER
    // STRUCTURE_POWER_BANK,
    // STRUCTURE_ROAD,
    // STRUCTURE_WALL,
    // STRUCTURE_CONTROLLER,
    // STRUCTURE_RAMPART,
    // STRUCTURE_KEEPER_LAIR,
    // STRUCTURE_PORTAL,
];

const nextBuilding = function nextBuilding(room) {
    const level = room.controller.level;
    var buildings = [];
    var priority = false;
    for (var structure in CONTROLLER_STRUCTURES) {
        if (CONTROLLER_STRUCTURES.hasOwnProperty(structure) && structure != STRUCTURE_ROAD && structure != STRUCTURE_WALL && structure != STRUCTURE_RAMPART) {
            let num = CONTROLLER_STRUCTURES[structure][level];
            if (countBuildings(room, structure) < num) {
                building.push(structure);
            }
        }
    }
    for (var i = 0; i < STRUCTURE_PRIORITIES.length; i++) {
        priority = STRUCTURE_PRIORITIES[i];
        if (buildings.indexOf(priority) !== -1) {
            break;
        }
    }
    return priority;
};

/*
#3 - spend rate 
*/

var ledgerPage = {};
const logEntry = function(room, amount) {
	const m = room.memory;
	if (ledgerPage[room.name] === undefined) {
		ledgerPage[room.name] = [0, 0, 0];
	}
	var ledger = ledgerPage[room.name];
	if (amount > 0) {
		ledger[0] += amount;
	} else {
		ledger[1] -= amount;
	}
	ledger[2]++;
};

const logRotate = function(room) {
	const m = room.memory;
	if (m.ledger) {
		m.ledger.push(ledgerPage);
		if (m.ledger.length > CREEP_CLAIM_LIFE_TIME) {
			m.ledger.splice(0, m.ledger.length - CREEP_CLAIM_LIFE_TIME);
		}
	}
};

function sumNegative(a, e, i) {
	a += e[1];
	return a;
}
function sumPositive(a, e, i) {
	a += e[0];
	return a;
}
function sum(a, e, i) {
	return a + e[0] - e[1];
}

const spendRate = function(room) {
	const m = room.memory;
	if (m.ledger) {
		return m.ledger.reduce(sumNegative, 0);
	}
};

const incomeRate = function(room) {
	const m = room.memory;
	if (m.ledger) {
		return m.ledger.reduce(sumPositive, 0);
	}
};

const logDelta = function(room) {
	const m = room.memory;
	if (m.ledger) {
		return m.ledger.reduce(sum, 0);
	}
};

const maxSpend = function(room) {
	//
};


/*

budgeting:
maintenance cost per tick (repairs + ramparts)
max income based on source count
number of sherpas required based on distance to storage unit OR to furthest building

sample budget:
building costs per tick: 15% = 3
savings if storage exists = 20% = 4
costs of creeps = ((max_energy* num_creeps) / 1500) / 20 
upgrading per tick = max remaining 

*/


/*
#4 - creep priority
*/

const nextCreepRole = function nextCreepRole(room, creeps) {
	var role = false;
	var energyRequired = 50;
	if (creeps.sherpa > 3) {
		if (creeps.harvester + creeps.containerHarvester < 2) {
			role = 'containerHarvester';
			energyRequired = 600;
		} else if (creeps.upgrader + creeps.containerUpgrader < 1) {
			role = 'containerUpgrader';
			energyRequired = 600;
		} else if (creeps.builder < 1) {
			role = 'builder';
			energyRequired = 600;
		}
	} else if (creeps.sherpa == 3) {
		role = 'sherpa';
		energyRequired = 100;
	} else {
		if (creeps.harvester < 2) {
			role = 'harvester';
			energyRequired = 200;
		} else if (creeps.upgrader < 1) {
			role = 'upgrader';
			energyRequired = 200;
		} else if (creeps.builder < 1) {
			role = 'builder';
			energyRequired = 200;
		} else {
			role = 'sherpa';
			energyRequired = 200;
		}
	}
	if (room.energyAvailable < energyRequired) {
		role = false;
	}
	return role;
};
// current harvest power vs sources -> have enough sherpas
// current sherpa power vs dependant creeps move speed
// current upgrade power vs level and economy status -> have enough sherpas
// current builder power vs unbuilt structures & unmaintained structures
// current mining power vs needed minerals / storage space

/*
#5 - hitpoints
*/
function cube(base) {
	return Math.pow(base, 3);
}
const hitpoints = function hitpoints(level) {
	// return Math.pow((level - starting_level) * multiplier, 3) + starting_hits;
	// return Math.pow((level - 3) * 134, 3) + 1000;
	var value = 100;
	switch(level) {
		case 1:
		break;
		case 2:
		value = 200;
		break;
		case 3:
		value = 1000;
		break;
		case 4:
		case 5:
		case 6:
		case 7:
		case 8: 
		value = Math.pow((level - 3) * 134, 3) + 1000;
		break;
		default:
		break;
	}
	return value;
};



/*
 module exports
*/

module.exports = {
    nextBuilding: nextBuilding,
    nextCreepBody: nextCreepBody,
    nextCreepRole: nextCreepRole,
    logEntry: logEntry,
    logRotate: logRotate,
    logDelta: logDelta,
};