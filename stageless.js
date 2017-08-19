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
	    console.log('adding a ' + nextPart + ' part');
		cost = cost + nextCost;
		console.log('creep costs ' + cost);
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
		console.log('want to add ' + nextPart);
		console.log(body);
		
	}
	console.log('final cost: ' + cost);
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
	console.log('creep will rest for ' + speed + ' ticks');
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
    console.log(cost, fat, hits, works, carryCap);
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

function nextCreep(role, level, cost) {
    var maxEnergy = (CONTROLLER_STRUCTURES[STRUCTURE_EXTENSION][level] * EXTENSION_ENERGY_CAPACITY[level]) + (CONTROLLER_STRUCTURES[STRUCTURE_SPAWN][level] * SPAWN_ENERGY_CAPACITY);
    if (cost !== undefined && cost < maxEnergy) {
        maxEnergy = cost;
    }
	var body = [MOVE];
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
 module exports
*/

module.exports = {
    nextBuilding: nextBuilding,
    nextCreep: nextCreep
};