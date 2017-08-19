var getRoute = function getRoute(source, destination) {
	var routeOpt = {routeCallback: function(roomName, fromRoomName) {
        let parsed = /^[WE]([0-9]+)[NS]([0-9]+)$/.exec(roomName);
        let isHighway = (parsed[1] % 10 === 0) || 
                        (parsed[2] % 10 === 0);
        let isMyRoom = Game.rooms[roomName] &&
            Game.rooms[roomName].controller &&
            Game.rooms[roomName].controller.my;
        if (isHighway || isMyRoom) {
            return 1;
        } else {
            return 2.5;
        }
    }};
	var route = {};
	var routeArr = Game.map.findRoute(source, destination, routeOpt);

	for (var i = routeArr.length - 1; i >= 0; i--) {
		let step = routeAr[i];
		route[step.room] = step.exit; // first pilgrim to reach a room will act as a scout to get exit pos
	}
	return route;
};

var create = function create(room, name, destination, count, body, creep, resource) {
	// creates a new charter in this room, returns reference;
	var charter = {
        ready: false,
        name: name,
        body: body,
        role: 'pilgrim',
        count: 0,
        desired: count,
        destination: destination,
        supply: resource,
        route:getRoute(room.name, destination),
        pilgrim: creep
    };
	room.memory.charter.push(charter);
};

var run = function run(spawn, room, roomMem) {
	for (var i = roomMem.charter.length - 1; i >= 0; i--) {
		let charter = roomMem.charter[i];
		if(room.energyAvailable > 2000 && charter && charter.ready && charter.count <= charter.desired) {
			err = spawn.createCreep(charter.body, undefined, {role:charter.role, home: room.name, charter: i});
			switch (err) {
				case ERR_RCL_NOT_ENOUGH:
				case ERR_NOT_OWNER:
				case ERR_NAME_EXISTS:
				case ERR_BUSY:
				break;
				case ERR_NOT_ENOUGH_ENERGY:
				case ERR_INVALID_ARGS:
				s.structErr(spawn, err);
				break;
				default:
				charter.count++;
				console.log('spawning pilgrim #' + charter.count + ': ' + err + ' for ' + charter.name);
				break;
			}
			break;
		}
	}
};

module.exports = {
	run: run,
	create: create
};