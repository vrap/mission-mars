(function() {
	var nsRover = using('mars.rover');
	var nsCommon = using('mars.common');

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
		if (!(map instanceof nsCommon.Map)) {
			throw new Error('Map need to be an instance of Map.');
		}

		this.map = map;

		/* Define spawn position of the rover */
		this.x = (parseInt(x) >= 0) ? parseInt(x) : 0;
		this.y = (parseInt(y) >= 0) ? parseInt(y) : 0;

		/* Define tankSize and default energy level of the rover. */
		this.tankSize = (parseInt(tankSize) >= 0) ? parseInt(tankSize) : 0;
		this.tank = this.tankSize;

		/* Define the default direction of the Rover to North. */
		this.direction = nsRover.Rover.DIRECTION.NORTH;

		/* Retrieve an instance of the Observable. */
		this.observer = new nsCommon.Observable();

		/* Publish a spawn event. */
		this.publishEvent('spawn');
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

	nsRover.Rover.SENSOR_COST = {
		BELOW: 0.1,
		NEIGHBOR: 0.2,
		REMOTE: 0.4
	};

	/**
	 * Fill the tank.
	 *
	 * @this {Rover}
	 */
	nsRover.Rover.prototype.fillTank = function() {
		this.tank = this.tankSize;
	};

	/**
	 * Change rover direction.
	 * @param  {[type]} direction [description]
	 * @return {[type]}           [description]
	 */
	nsRover.Rover.prototype.setDirection = function(direction) {
		for (var directionName in this.constructor.DIRECTION) {
			var directionCode = this.constructor.DIRECTION[directionName];

			if (directionCode == direction) {
				var lastDirection = this.direction;
				this.direction = directionCode;

				this.publishEvent('direction', {lastDirection: lastDirection});
				break;
			}
		}
	};

	/**
	 * Publish an event.
	 * The event message will automatically contain an instance of the current rover and broadcaster to the "rover" channel.
	 *
	 * @param  {string} channel Subchannel where the event need to be published. (The channel will be prefixed by "rover.").
	 * @param  {object} options An object containing the params to sends when publishing the event.
	 */
	nsRover.Rover.prototype.publishEvent = function(channel, options) {
		/* Initialize default options. */
		options = (options && Object.keys(options).length > 0) ? options : {};
		channel = 'rover.' + channel;

		/* Add rover instance to the options. */
		options.rover = this;

		/* Publish the event. */
		this.observer.publish(channel, [options]);

		/* Debug. */
		console.debug('Publish event : ', channel, options);
	};

	/**
	 * [ description]
	 * @param  {[type]} direction [description]
	 * @param  {[type]} distance  [description]
	 * @return {[type]}           [description]
	 */
	nsRover.Rover.prototype.getSquare = function(direction, distance) {
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

		var square = this.map.getSquare(x, y);

		if (square) {
			return {
				x: x,
				y: y,
				z: square.z,
				type: square.nature
			};
		}

		return null;
	};

	/**
	 * [ description]
	 * @param  {[type]} direction [description]
	 * @param  {[type]} distance  [description]
	 * @return {[type]}           [description]
	 */
	nsRover.Rover.prototype.move = function(direction, distance) { //console.log(nsRover.Rover.MOVE_COST.NORTH);
		if (distance < 1 || distance > 2) {
			throw new Error('Distance can only be set to 1 or 2.');
		}

		var square = this.getSquare(direction, distance);

		// If the rover is still within the limits of the map
		// Manage here impossibilities travel? (moutain, crater, etc)
		if (square !== null) {
			var lastX = this.x;
			var lastY = this.y;

			this.x = square.x;
			this.y = square.y;

			for (var directionName in this.constructor.DIRECTION) {
				var directionCode = this.constructor.DIRECTION[directionName];

				if (directionCode == direction) {
					for (var moveCostName in this.constructor.MOVE_COST) {
						var moveCost = this.constructor.MOVE_COST[directionName];

						// Calculate the cost of travel and removes from tank
						this.tank -= (moveCost * distance); 

						break;
					}
				}
			}

			this.publishEvent(
				'move',
				{
					direction: direction,
					distance: distance,
					lastX: lastX,
					lastY: lastY,
					newX: this.x,
					newY: this.y
				}
			);
		}
		else {
			throw new Error('The map is undiscovered here.');
		}
	};

	nsRover.Rover.prototype.scanElevation = function(direction, distance) {
		if (distance < 0 || distance > 2) {
			throw new Error('Distance can only be set to 0 or 2.');
		}

		var square = this.getSquare(direction, distance);

		if (square === null) {
			throw new Error('The map is undiscovered here.');
		}
		else {
			this.publishEvent(
				'scanElevation',
				{
					direction: direction,
					distance: distance,
					elevation: square.z
				}
			);
		}
	};

	nsRover.Rover.prototype.scanMaterial = function(direction, distance) {
		if (distance < 0 || distance > 2) {
			throw new Error('Distance can only be set to 0 or 2.');
		}

		var square = this.getSquare(direction, distance);

		if (square === null) {
			throw new Error('The map is undiscovered here.');
		}
		else {
			this.publishEvent(
				'scanMaterial',
				{
					direction: direction,
					distance: distance,
					type: square.type
				}
			);
		}
	};
})();