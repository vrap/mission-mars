(function() {
    var nsRover  = using('mars.rover');
    var nsCommon = using('mars.common');
    var nsMemory = using('mars.rover.memory');

    /**
     * Represent a Rover.
     * 
     * @param  {mars.common.Map} map A map object where the rover need to spawn.
     * @param  {integer} x X position of the rover when spawning.
     * @param  {integer} y Y position of the rover when spawning
     * @param  {integer} tankSize Define the energy limit that the rover can handle.
     */
    nsRover.Rover = function(map, x, y, tankSize) {
	/* Check if the map is in the good format. */
	if (! (map instanceof nsCommon.Map)) {
	    throw new Error(nsRover.Rover.MESSAGE.E_INVALID_MAP);
	}

	this.map = map;

	/* Define spawn position of the rover */
	this.x = (parseInt(x) >= 0) ? parseInt(x) : 0;
	this.y = (parseInt(y) >= 0) ? parseInt(y) : 0;

	/* Define tankSize and default energy level of the rover. */
	this.tankSize = (parseInt(tankSize) >= 0) ? parseInt(tankSize) : 0;
	this.tank     = this.tankSize;

	/* Define the default direction of the Rover to North. */
	this.direction = nsRover.Rover.DIRECTION.NORTH;

	/* Retrieve an instance of the Observable. */
	this.observer = new nsCommon.Observable();

	/* Publish a spawn event. */
	this.publishEvent('spawn');

	/* Number of movements. */
	this.moves = 0;

	/* Cost of deploying solar panels. */
	this.panelsCost = 5;

	/* Define the duration of a round. */
	this.roundTime = 200;

	this.waitingStatus = false;
	this.waitingActions = [];

	/* Instanciate a memory object for the rover. */
	this.memory = new nsMemory.Memory();

	var spawnSquare = this.map.getSquare(x, y);

	if (spawnSquare) {
	    /* Add square to memory. */
	    this.memory.createOrUpdate(x, y, spawnSquare.z, spawnSquare.type, 0);
	}
    };
    
    /* Constant that represent the list of possible directions. */
    nsRover.Rover.DIRECTION = {
	NORTH: 0,
	NORTH_EAST: 1,
	EAST: 2,
	SOUTH_EAST: 3,
	SOUTH: 4,
	SOUTH_WEST: 5,
	WEST: 6,
	NORTH_WEST: 7
    };

    /* Energy cost for each movements (direction). */
    nsRover.Rover.MOVE_COST = {
		NORTH: 1,
		NORTH_EAST: 1.4,
		EAST: 1,
		SOUTH_EAST: 1.4,
		SOUTH: 1,
		SOUTH_WEST: 1.4,
		WEST: 1,
		NORTH_WEST: 1.4
    };

    /* Energy cost for each distance of sensor. */
    nsRover.Rover.SENSOR_COST = {
		MATERIALS: {
		    BELOW: 0,
		    NEIGHBOR: 0,
		    REMOTE: 0
		},
		ELEVATION: {
		    BELOW: 0,
		    NEIGHBOR: 0,
		    REMOTE: 0
		}
    };

    /* Messages constants. */
    nsRover.Rover.MESSAGE = {
		E_NEED_MORE_TANK: 0,
		E_SLOPE_IS_TOO_IMPORTANT: 1,
		E_MAP_UNDISCOVERED: 2,
		E_INVALID_DISTANCE: 3,
		E_INVALID_MAP: 4
    };

    /**
     * Get distance as a string.
     *
     * @this {Rover}
     * @param {integer} distance The distance to convert.
     * @return {string} The distance as a string.
     */
    nsRover.Rover.prototype.getDistanceAsString = function(distance) {
	switch (distance) {
	    case 0:
	    return 'BELOW';
	    break;
	    case 1:
	    return 'NEIGHBOR';
	    break;
	    default:
	    return 'REMOTE';
	    break;
	}
    };


    /**
     * Execute an action of the rover.
     * When you try to run a method of the Rover, this one is redirected to
     * "executeAction" that return a deferred and add the action to a buffer.
     * Each actions in the buffer will be executed one after another and the
     * associated callback will be resolved (or reject).
     *
     * @this {Rover}
     * @param {string} action Name of the method to call.
     * @param {array} [args] An array of args passed to the action.
     * @param {integer} [round=0] Number of round that take to the rover to execute the action.
     */
    nsRover.Rover.prototype.executeAction = function(action, args, round, priority) {
	var defer = Q.defer();

	/* Create an object of that contain all informations about the action. */
	var bufferedAction = {
	    dfd: defer,
	    method: action,
	    args: args,
	    round: (isNaN(parseInt(round))) ? 0 : parseInt(round)
	}

	/* Add the action to the buffer. */
	if (priority == true) {
	    this.waitingActions.unshift(bufferedAction);
	}
	else {
	    this.waitingActions.push(bufferedAction);
	}

	/* If the buffer is not currently executed, execute it. */
	if (this.waitingStatus === false) {
	    this.waitingStatus = true;
	    Q.nextTick(function() { this.executeBufferedAction() }.bind(this));
	}

	/* Return the promise. */
	return defer.promise;
    };

    /**
     * Execute an action from the buffer.
     * Check if an action is in the buffer and execute it. Wait for the time
     * round of the action and retry to call the action from the buffer.
     *
     * @this {Rover}
     */
    nsRover.Rover.prototype.executeBufferedAction = function() {
	/* If the buffer is not currently being to be executed stop here. */
	if (this.waitingStatus === true) {
	    /* If some actions are waiting inside the buffer. */
	    if (this.waitingActions.length > 0) {
		/* Retrieve the first action (oldest) of the buffer. */
		var action = this.waitingActions[0];
		/* Initialize the result of the action to null. */
		var result = null;

		/* Notify the deferred associated with the action that she's begining. */
		action.dfd.notify({progress: 0, data: action.args});

		/* Try to call the action and store the returned result. */
		try {
		    if (typeof action.args == 'object') {
			result = this[action.method].apply(this, action.args);
		    }
		    else {
			result = this[action.method].call(this);
		    }		    
		}
		catch (error) {
		    result = {error: error};
		}

		/**
		 * Notify the deferred that the action has been runned with the
		 * returned data and resolve the deferred.
		 */
		action.dfd.notify({progress: 100, data: result});

		if (result && result.error) {
		    action.dfd.reject(result);
		}
		else {
		    action.dfd.resolve(result);
		}

		/* Remove the action from the buffer. */
		this.waitingActions.splice(0, 1);

		/* Call again this function after waiting the number of round. */
		setTimeout(
		    function() {
			this.executeBufferedAction();
		    }.bind(this),
		    this.roundTime * action.round
		);
	    }
	    else {
		this.waitingStatus = false;
	    }
	}
    };

    /**
     * Publish an event.
     * The event message will automatically contain an instance of the current rover and broadcaster to the "rover" channel.
     *
     * @this {Rover}
     * @param  {string} channel Subchannel where the event need to be published. (The channel will be prefixed by "rover.").
     * @param  {object} options An object containing the params to sends when publishing the event.
     */
    nsRover.Rover.prototype.publishEvent = function(channel, options) {
	/* Initialize default options. */
	options = (options && Object.keys(options).length > 0) ? options : {};
	channel = 'rover.' + channel;

	/* Add rover instance to the options. */
	options.rover = this;

	/* Add channel name to the options. */
	options.channel = channel;

	/* Publish the event. */
	this.observer.publish(channel, [options]);

	/* Debug. */
	console.debug('Publish event : ', channel, options);
    };

    /**
     * Retrieve a square at a distance and direction relatively to the current position.
     *
     * @this {Rover}
     * @param  {integer} direction Direction of the rover.
     * @param  {integer} distance  Distance to seek.
     * @return {object}            Return an object containing informations about the square if exist; null otherwise.
     */
    nsRover.Rover.prototype.getSquare = function(direction, distance) {
	var square = this.getSquareFromDirection(direction, distance);
	var data = this.map.getSquare(square.x, square.y);

	if (data) {
	    /* Add square to memory. */
	    this.memory.createOrUpdate(data.x, data.y, data.z, data.type, 0);

	    return {
		x: square.x,
		y: square.y,
		z: data.z,
		type: data.type
	    };
	}

	return null;
    };

    nsRover.Rover.prototype.getSquareFromDirection = function(direction, distance) {
	var x = this.x;
	var y = this.y;

	switch (direction) {
	case this.constructor.DIRECTION.NORTH:
	    y += distance;
	    break;
	case this.constructor.DIRECTION.NORTH_EAST:
	    y += distance;
	    x += distance;
	    break;
	case this.constructor.DIRECTION.NORTH_WEST:
	    y += distance;
	    x -= distance;
	    break;
	case this.constructor.DIRECTION.SOUTH:
	    y -= distance;
	    break;
	case this.constructor.DIRECTION.SOUTH_EAST:
	    y -= distance;
	    x += distance;
	    break;
	case this.constructor.DIRECTION.SOUTH_WEST:
	    y -= distance;
	    x -= distance;
	    break;
	case this.constructor.DIRECTION.EAST:
	    x += distance;
	    break;
	case this.constructor.DIRECTION.WEST:
	    x -= distance;
	    break;
	}

	return {x: x, y: y};
    };

    /**
     * Calculate the slope between the current square and the destination square.
     * 
     * @param  {integer} currentZ      Current square elevation.
     * @param  {integer} destinationZ  Destination square elevation.
     * @param  {integer} distance      Distance in meters between current and destination square.
     * @return {integer}      		   The slope (in %).
     */
    nsRover.Rover.prototype.calculateSlop = function(currentZ, destinationZ, distance) {
	if (!distance) {
	    distance = 1;
	}

	distance = distance * 5;
	current = currentZ * 5;
	destination = destinationZ * 5;

	var slope = (destination - current) / distance;
	slope = Math.round(Math.abs(slope));

	return slope;
    };

    /**
     * Fill the tank.
     *
     * @this {Rover}
     * @todo Fill the tank with an amount of energy as a percent of the total.
     */
    nsRover.Rover.prototype.fillTank = function() {
	if (arguments.callee.caller == this.executeBufferedAction) {
	    this.tank = this.tankSize;
	}
	else {
	    return this.executeAction('fillTank', null, 0)
		.progress(function(data) {
		    if (data.progress == 0) {
			this.publishEvent('actions.fillTank.begin');
		    }
		    else if (data.progress == 100) {
			this.publishEvent('actions.fillTank.end');
		    }
		}.bind(this));
	}
    };

    /**
     * Get the current position of the rover.
     *
     * @this {Rover}
     * @return {object} An object of x and y position.
     */
    nsRover.Rover.prototype.getPosition = function() {
	if (arguments.callee.caller == this.executeBufferedAction) {
	    return {x: this.x, y: this.y };
	}
	else {
	    return this.executeAction('getPosition', null, 0);
	}
    };

    /**
     * Change rover direction.
     *
     * @this {Rover}
     * @param {integer} direction Need to be in nsRover.Rover.DIRECTION.
     * @return {object} An object containing the last direction.
     */
    nsRover.Rover.prototype.setDirection = function(direction) {
	if (arguments.callee.caller == this.executeBufferedAction) {
	    for (var directionName in this.constructor.DIRECTION) {
		var directionCode = this.constructor.DIRECTION[directionName];

		if (directionCode == direction) {
		    var lastDirection = this.direction;
		    this.direction = directionCode;

		    return {lastDirection: lastDirection};
		}
	    }
	}
	else {
	    return this.executeAction('setDirection', arguments, 0).progress(function(data) {
		if (data.progress == 0) {
		    this.publishEvent('direction.begin', data.data);
		}
		if (data.progress == 100) {
		    this.publishEvent('direction.end', data.data);
		}
	    }.bind(this));
	}
    };

    /**
     * Move the rover to a distance and direction relatively to the current position.
     * 
     * @this {Rover}
     * @return {object} Return an object with the last position and the new one.
     */
    nsRover.Rover.prototype.move = function() {
	if (arguments.callee.caller == this.executeBufferedAction) {
	    /* Retrieve the current direction of the rover to move on. */
	    var direction = this.direction;

	    var currentSquare = this.getSquare(direction, 0);
	    var destinationSquare = this.getSquare(direction, 1);

	    /* If the rover is still within the limits of the map. */
	    if (destinationSquare !== null) {
		var lastX = currentSquare.x;
		var lastY = currentSquare.y;
		var lastZ = currentSquare.z;

		for (var directionName in this.constructor.DIRECTION) {
		    var directionCode = this.constructor.DIRECTION[directionName];

		    if (directionCode == direction) {
			for (var moveCostName in this.constructor.MOVE_COST) {
			    var moveCost = this.constructor.MOVE_COST[directionName];
			    var slope = this.calculateSlop(lastZ, destinationSquare.z, 1);

			    var elevationCost = moveCost * (1 + slope);
			    var finalCost = elevationCost + moveCost;

			    /* Calculate the cost of travel and removes from tank. */
			    if (finalCost <= this.tank) {
				if (slope <= 1.5) {
				    /* Move the rover to the destination square. */
				    this.x = destinationSquare.x;
				    this.y = destinationSquare.y;

				    /* Increase movements and decrease the energy. */
				    this.moves++;
				    this.tank -= finalCost;

				    return {
					direction: direction,
					lastX: lastX,
					lastY: lastY,
					newX: this.x,
					newY: this.y
				    };
				}
				else {
				    throw new Error(nsRover.Rover.MESSAGE.E_SLOPE_IS_TOO_IMPORTANT);
				}

				break;
			    }
			    else {
				throw new Error(nsRover.Rover.MESSAGE.E_NEED_MORE_TANK);
			    }
			}
		    }
		}
	    }
	    else {
		throw new Error(nsRover.Rover.MESSAGE.E_MAP_UNDISCOVERED);
	    }
	}
	else {
	    return this.executeAction('move', arguments, 1).progress(function(data) {
		if (data.progress == 0) {
		    this.publishEvent('move.begin', data.data);
		}
		else if (data.progress == 100) {
		    this.publishEvent('move.end', data.data);
		}
	    }.bind(this));
	}
    };

    /**
     * Scan the elevation of a square at a distance and direction.
     *
     * @this {Rover}
     * @param {integer} direction Need to be in nsRover.Rover.DIRECTION.
     * @param {integer} distance The distance to scan the square.
     * @param {object} An object with the elevation of the scanned square.
     * @todo Retrieve the elevation of the square between the targeted one and the rover square when scanning at a distance of 2.
     */
    nsRover.Rover.prototype.scanElevation = function(direction, distance) {
	if (arguments.callee.caller == this.executeBufferedAction) {
	    if (distance < 0 || distance > 2) {
		throw new Error(nsRover.Rover.MESSAGE.E_INVALID_DISTANCE);
	    }

	    var square = this.getSquare(direction, distance);

	    if (square === null) {
		throw new Error(nsRover.Rover.MESSAGE.E_MAP_UNDISCOVERED);
	    }
	    else {
		if (this.memory.has(square.x, square.y, 'z')) {
		    return this.memory.get(square.x, square.y);
		}
		else {
		    var sensorCost = nsRover.Rover.SENSOR_COST.ELEVATION[this.getDistanceAsString(distance)];

		    if (sensorCost <= this.tank) {
			this.tank -= sensorCost;

			return {
			    direction: direction,
			    distance: distance,
			    elevation: square.z
			}
		    }
		    else {
			throw new Error(nsRover.Rover.MESSAGE.E_NEED_MORE_TANK);
		    }
		}
	    }
	}
	else {
	    return this.executeAction('scanElevation', arguments, 0).progress(function(data) {
		if (data.progress == 0) {
		    this.publishEvent('scanElevation.begin');
		}
		else if (data.progress == 100) {
		    this.publishEvent('scanElevation.end', data.data);
		}
	    }.bind(this));
	}
    };

    /**
     * Scan the material of a square at a distance and direction.
     *
     * @this {Rover}
     * @param {integer} direction Need to be in nsRover.Rover.DIRECTION.
     * @param {integer} distance The distance to scan the square.
     * @param {object} An object with the type of the scanned square.
     * @todo Retrieve the material of the square between the targeted one and the rover square when scanning at a distance of 2.
     */
    nsRover.Rover.prototype.scanMaterial = function(direction, distance) {
	if (arguments.callee.caller == this.executeBufferedAction) {
	    if (distance < 0 || distance > 2) {
		throw new Error(nsRover.Rover.MESSAGE.E_INVALID_DISTANCE);
	    }

	    var square = this.getSquare(direction, distance);

	    if (square === null) {
		throw new Error(nsRover.Rover.MESSAGE.E_MAP_UNDISCOVERED);
	    }
	    else {
		if (square.type == 4) {
		    this.fillTank();
		}

		if (this.memory.has(square.x, square.y, 'type')) {
		    return this.memory.get(square.x, square.y);
		}
		else {
		    var sensorCost = nsRover.Rover.SENSOR_COST.MATERIALS[this.getDistanceAsString(distance)];

		    if (sensorCost <= this.tank) {
			this.tank -= sensorCost;

			return {
			    direction: direction,
			    distance: distance,
			    type: square.type
			}
		    }
		    else {
			throw new Error(nsRover.Rover.MESSAGE.E_NEED_MORE_TANK);
		    }
		}
	    }
	}
	else {
	    return this.executeAction('scanMaterial', arguments, 0).progress(function(data) {
		if (data.progress == 0) {
		    this.publishEvent('scanMaterial.begin');
		}
		else if (data.progress == 100) {
		    this.publishEvent('scanMaterial.end', data.data);
		}
	    }.bind(this));
	}
    };

    /**
     * Deploy solar panel to regain some energy.
     *
     * @this {Rover}
     */
    nsRover.Rover.prototype.deploySolarPanels = function(priority) {
	if (arguments.callee.caller == this.executeBufferedAction) {
	    this.tank  += Math.round(10 * this.tankSize /100)
	    this.moves += this.panelsCost;

	    if (this.tank > this.tankSize) {
		this.fillTank();
	    }
	}
	else {
	    return this.executeAction('deploySolarPanels', arguments, 5, priority).progress(function(data) {
		if (data.progress == 0) {
		    this.publishEvent('actions.deploySolarPanels.begin');
		}
		else if (data.progress == 100) {
		    this.publishEvent('actions.deploySolarPanels.end');
		}
	    }.bind(this));
	}
    };

    /**
     * Scan materials and elevations.
     *
     * @this {Rover}
     * @todo Manage a scan material of 2 square which let us knowing the first square.
     */
    nsRover.Rover.prototype.fullScan = function(elevations, materials) {
	elevations = (elevations == false) ? false : true;
	materials  = (materials == false) ? false : true;

	if (elevations || materials) {
	    var deferreds = []

            for (var directionName in this.constructor.DIRECTION) {
		var direction = this.constructor.DIRECTION[directionName];

		if (elevations) {
		    deferreds.push(this.scanElevation(direction, 1));
		}

		if (materials) {
		    deferreds.push(this.scanMaterial(direction, 2));
		}
            }

	    return Q.all(deferreds);
	}
	else {
	    var defer = Q.defer();

	    defer.resolve();

	    return defer.promise;
	}
    };
})();
