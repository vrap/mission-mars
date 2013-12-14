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
		if (! (map instanceof nsCommon.Map)) {
			throw new Error('Map need to be an instance of Map.');
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

		/* Fill the memory with the squre of spawn. */
		nsRover.Rover.memory = {

		};
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
 	 * Pattern:
 	 *	{
 	 *		x1: { 			
 	 *			y1: {
 	 *				z: z1,	
 	 *				type: nature of the square,
 	 *				status: 0 (visited), 1 (inaccessible), -1 (yet unknown),
 	 *				adjacents: {
	 *					north: -1,
	 *					northEast: -1,
	 *					east: -1,
	 *					southEast: -1,
	 *					south: -1,
	 *					southWest: -1,
	 *					west: -1,
	 *					northWest: -1
 	 *				}
 	 *			}
 	 *		}
 	 *	}
 	 *
 	 * TODO: approve definive pattern
 	 */
	nsRover.Rover.memory = {};

	/**
	 * Fill the tank.
	 *
	 * @this {Rover}
	 */
	nsRover.Rover.prototype.fillTank = function() {
		this.tank = this.tankSize;

		this.publishEvent(
			'actions.fillTank',
			{
			}
		);
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
	nsRover.Rover.prototype.move = function(direction, distance) {
		if (distance < 1 || distance > 2) {
			throw new Error('Distance can only be set to 1 or 2.');
		}

		var square = this.getSquare(direction, distance);

		// If the rover is still within the limits of the map
		if (square !== null) {
			var lastX = this.x;
			var lastY = this.y;

			// Scan the elevation of the current square is free
			var currentSquareZ = square.z;

			this.x = square.x;
			this.y = square.y;

			for (var directionName in this.constructor.DIRECTION) {
				var directionCode = this.constructor.DIRECTION[directionName];

				if (directionCode == direction) {
					for (var moveCostName in this.constructor.MOVE_COST) {
						var moveCost = this.constructor.MOVE_COST[directionName],
							tankCost = (moveCost * distance);
							// The distance cost plus the tank cost from the elevation
							// Not activated yet because there is no test on slope (see above)
							// elevationCost = tankCost * (1 + slope);

						// Calculate the cost of travel and removes from tank
						if (tankCost <= this.tank) {
							this.tank -= tankCost;

							this.moves++;

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

							break;
						}
						else {
							throw new Error('You need more tank.');
						}
					}
				}
			}
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
			if (distance == 0 || distance == 1) {
				this.publishEvent(
					'scanElevation',
					{
						direction: direction,
						distance: distance,
						elevation: square.z
					}
				);
			}
			else if (distance >= 2) {
				var scanCost = 0.1 * distance;

				if (scanCost <= this.tank) {
					this.tank -= scanCost;

					this.publishEvent(
						'scanElevation',
						{
							direction: direction,
							distance: distance,
							elevation: square.z
						}
					);
				}
			}
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
			// If the current square is ice
			// TODO: update freely the memory
			if (square.type == 4) {
				this.fillTank();
			}

			if (distance == 0 && this.tank >= 0.1) {
				this.tank -= 0.1;

				this.publishEvent(
					'scanMaterial',
					{
						direction: direction,
						distance: distance,
						type: square.type
					}
				);
			}
			else if (distance == 1 && this.tank >= 0.2) {
				this.tank -= 0.2;

				this.publishEvent(
					'scanMaterial',
					{
						direction: direction,
						distance: distance,
						type: square.type
					}
				);
			}
			else if (distance == 2 && this.tank >= 0.4) {
				this.tank -= 0.4;

				this.publishEvent(
					'scanMaterial',
					{
						direction: direction,
						distance: distance,
						type: square.type
					}
				);
			}
		}
	};

	nsRover.Rover.prototype.deploySolarPanels = function() {
		this.tank  += (this.panelsCost * 2);
		this.moves += this.panelsCost;

		if (this.tank > this.tankSize) {
			this.tank = this.tankSize;
		}

		this.publishEvent(
			'actions.deploySolarPanels',
			{
			}
		);
	};
})();