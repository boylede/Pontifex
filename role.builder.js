var s = require('shared');
var NSO = {id:null};
var isNear = function isNear(thing1, thing2) {
    return thing1.pos.getRangeTo(thing2) < 2;
};
var getTarget = function(creep) {
    //console.log('getting targets for ' + creep.name);

    var targets = creep.room.find(FIND_CONSTRUCTION_SITES, {
			filter: (str) => str.structureType == STRUCTURE_WALL || (str.structureType == STRUCTURE_STORAGE && str.my)
		});
		
// 	if (targets.length === 0) {
// 		targets = creep.room.find(FIND_STRUCTURES, {
// 			filter: (str) => { return str.hits < str.hitsMax && str.structureType != STRUCTURE_WALL && str.structureType != STRUCTURE_RAMPART}
// 		});
// 	}
		//console.log(str.hits + ' : ' + str.hitsMax + ' : ' + str.type);
	//console.log('found ' + targets.length + ' weak structures');
            
	if (targets.length === 0) {
		targets = creep.room.find(FIND_CONSTRUCTION_SITES, {
			filter: (str) => str.my
		});
	}
	
	if (targets.length === 0) {
		targets = creep.room.find(FIND_STRUCTURES, {
			filter: (str) => { return str.hits < str.hitsMax && str.structureType != STRUCTURE_WALL && str.structureType != STRUCTURE_RAMPART}
		});
	}
	
// 	if (targets.length === 0) {
//         targets = creep.room.find(FIND_STRUCTURES, {
//             filter: (structure) => {
//                 return  (structure.structureType == STRUCTURE_TOWER) && structure.energy < structure.energyCapacity;
//             }
//         });
//     }
	
	if (targets.length === 0) {
	    targets = creep.room.find(FIND_STRUCTURES, {
			filter: (str) => { return str.structureType == STRUCTURE_RAMPART && str.hits < 250000;}
		});
	}
	if (targets.length === 0) {
	    targets = creep.room.find(FIND_STRUCTURES, {
			filter: (str) => { return str.structureType == STRUCTURE_WALL && str.hits < 250000;}
		});
	}
	//targets = _.sortBy(targets, [(v)=> v.progressTotal - v.progress]);
	let target = creep.pos.findClosestByRange(targets);
	creep.memory.targetWas = target.structureType + ' at ' + target.pos.x + ',' + target.pos.y;
	return target;
};

var getSource = function(creep) {
    var sources = creep.room.find(FIND_DROPPED_ENERGY, {filter: (resource) => resource.type = RESOURCE_ENERGY && creep.pos.getRangeTo(resource) < 6});
    //console.log('found ' + sources.length + ' dropped energy.');
    //if (sources.length === 0) {
    // let target = Game.getObjectById(creep.memory.target);
    // var sources = creep.room.find(FIND_STRUCTURES, {
    //     filter: (structure) => {
    //         return structure.structureType == STRUCTURE_CONTAINER  && structure.store[RESOURCE_ENERGY] > 0 && isNear(target, structure);
    //     }
    // });
    if (sources.length === 0) {
	sources = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_STORAGE || structure.structureType == STRUCTURE_CONTAINER) && structure.store[RESOURCE_ENERGY] > 0;
                    }
            });
    }
    if (sources.length === 0) {
	sources = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_SPAWN || structure.structureType == STRUCTURE_EXTENSION) && structure.energy > 0;
                    }
            });
    }
//     if (sources.length === 0) {
// 	sources = creep.room.find(FIND_STRUCTURES, {
//                     filter: (structure) => {
//                         return structure.structureType == STRUCTURE_CONTAINER  && structure.store[RESOURCE_ENERGY] > 0;
//                     }
//             });
//     }
    let source = creep.pos.findClosestByRange(sources);
    //creep.memory.sourceWas = source.structureType + ' at ' + source.pos.x + ',' + source.pos.y;
	return source;
};
var roleChange = function(creep, reason) {
	if (reason == ERR_NO_TARGETS) {
		console.log('can\'t find any construction sites');
		creep.memory.role = 'upgrader';
	} else {
		console.log('not enough energy - harvest!');
		//creep.memory.role = 'harvester';
		//creep.say('harvesting');
	}
};
var extract = function(creep, source) {
	var err;
	if (source instanceof Source) {
		err = creep.harvest(source);
	} else if (source instanceof Resource) {
	    err = creep.pickup(source);
	} else {
		err = creep.withdraw(source, RESOURCE_ENERGY);
		if ((err === OK && source.energy === 0) || (err === OK && source.store && source.store[RESOURCE_ENERGY] === 0)) {
		    creep.say('drained');
		    err = ERR_NOT_FOUND
		}
	}
	return err;
};
var deposit = function(creep, target) {
	var err;
// 	console.log(target);
	if (target instanceof StructureSpawn || target instanceof StructureExtension || target instanceof StructureStorage || target instanceof StructureContainer || target instanceof StructureWall || target instanceof StructureRampart || target instanceof StructureRoad) {
		err = creep.repair(target);
		if (err === OK && target.hits == target.hitsMax) {
		    creep.say('done');
		    err = ERR_NOT_FOUND;
		} 
	} else if (target instanceof StructureController) {
		err = creep.upgradeController(target);
	} else if (target instanceof ConstructionSite) {
	    err = creep.build(target);
	    if (err === OK && !(target instanceof ConstructionSite )) {
	        creep.say('done');
		    err = ERR_NOT_FOUND;
		}
	} else if (target instanceof StructureTower) {
	    err = creep.transfer(target, RESOURCE_ENERGY);
	    if (err === OK && target.storeCapacity == _.sum(target.store)) {
	        creep.say('done');
		    err = ERR_NOT_FOUND
		}
	} else {
	    err = ERR_NOT_FOUND;
	}
	return err;
};
var roleBuilder= {
	/** @param {Creep} creep **/
	run: function(creep) {
		var err = OK;
		var m = creep.memory;
		var energy = creep.carry.energy;
		var target = NSO;
		var source = NSO;
		//console.log('running role for ' + creep.name + ' : ' + m.role + ' : ' + m.last);

		if (m.target != null) {
			target = Game.getObjectById(m.target);
			if (target == null) {
			    m.target = null;
			}
		} else {
		    console.log(' ........'+ m.role + creep.name + ' lost its target.' );
			target = getTarget(creep);
			 m.target = target.id;
		}
		if (m.source !== null) {
			source = Game.getObjectById(m.source);
			if (source == null) {
			    m.source = null;
			}
		} else {
		    console.log(' ........'+ m.role + creep.name + ' lost its source.' );
			source = getSource(creep);
			if (source === undefined || source === null) {
			    return;
			}
			m.source = source.id;
		}

		if (m.depositing) {
			if (energy === 0) {
			    // done depositing, start extraction.
				creep.say('e^');
				m.depositing = false;
				source = getSource(creep);
				if (source === null) {
					console.log('Can\'t find any ' + m.role + ' sources for ' + creep.name + '.');
					m.source = null;
					//return roleChange(creep, ERR_NO_SOURCE);
				} else {
					m.source = source.id;
				}
			} else {
			    // not done depositing, deposit again
				err = deposit(creep, target);
				switch (err) {
					case ERR_NOT_IN_RANGE:
					creep.moveTo(target, {visualizePathStyle: {stroke: '#0095ff', opacity:0.6, lineStyle:'dotted'}});
					break;
					case OK:
					break;
					case ERR_NOT_ENOUGH_ENERGY:
				        console.log(creep.name + ' no energy for ' + target.id + ' from ' + source.id);
					case ERR_NOT_FOUND:
					    // no target or target no longer valid
					    //m.depositing = false;
					    target = getTarget(creep);
					    if (target == null) {
					        console.log('Can\'t find any ' + m.role + ' targets for ' + creep.name + '.');
					        m.target = null;
					    } else {
					        m.target = target.id;
					    }
					    break;
					default:
					s.creepErr(creep, err);
					break;
				}
			}
		} else {
		    //not depositing, we're extracting!
			if (energy == creep.carryCapacity) {
			    // done extracting, switch to depositing
				creep.say('dv');
				m.depositing = true;
				target = getTarget(creep);
				if (target == null ) {
					console.log('Can\'t find any ' + m.role + ' targets for ' + creep.name + '.');
					m.target = null;
				} else {
					m.target = target.id;
				}
			} else {
			    // lets EXTRACT!!
				err = extract(creep, source);
				switch (err) {
					case ERR_NOT_IN_RANGE:
					creep.moveTo(source, {visualizePathStyle: {stroke: '#f1e05a', opacity:0.6, lineStyle:'dotted'}});
					break;
					case OK:
					break;
					case ERR_BUSY:
					break
					case ERR_NOT_ENOUGH_ENERGY:
					case ERR_NOT_FOUND:
				        console.log(creep.name + ' no energy for extract from ' + source.id + ' to ' + target.id);
				        source= getSource(creep);
					    if (source == null) {
					        console.log('Can\'t find any ' + m.role + ' sources for ' + creep.name + '.');
					        m.source = null;
					    } else {
					        m.source = source.id;
					    }
				        break;
					default:
					s.creepErr(creep, err);
					break;
				}
			}
		}
		if (!target) {
		    console.log(creep.name + ' has an issue with its target, previously ' + m.targetWas);
		    creep.say('!');
		    m.target = null;
		} else {
		    m.target = target.id;
		}
		if (!source) {
		    console.log(creep.name + ' has an issue with its source, previously ' + m.sourceWas);
		    creep.say('!');
		    m.source = null;
		} else {
		    m.source = source.id;
		}
		return;
	}
};
	
	module.exports = roleBuilder;	