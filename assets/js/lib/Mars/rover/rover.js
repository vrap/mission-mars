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

		console.log(nsRover.Rover.DIRECTION.NORTH);
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
		options = (Object.keys(options).length > 0) ? options : {};
		channel = 'rover.' + channel;

		/* Add rover instance to the options. */
		options.rover = this;
		/* Publish the event. */
		this.observer.publish(channel, [options]);

		/* Debug. */
		console.debug('Publish event : ', channel, options);
	};

	nsRover.Rover.prototype.move = function(direction, distance) {
		if (distance < 1 || distance > 2) {
			throw new Error('Distance can only be set to 1 or 2.');
		}

		var lastX = this.x,
			lastY = this.y,
			nextX = this.x,
			nextY = this.y;

		if (direction == this.constructor.DIRECTION.EAST) {
			nextX += distance;
		}
		else if (direction == this.constructor.DIRECTION.WEST) {
			nextX -= distance;
		}
		else {
			if (direction == this.constructor.DIRECTION.NORTH || direction == this.constructor.DIRECTION.NORTH_EAST || direction == this.constructor.DIRECTION.NORTH_WEST) {
				nextY += distance;

				if (direction == this.constructor.DIRECTION.NORTH_EAST) {
					nextX += distance;
				}
				else if (direction == this.constructor.DIRECTION.NORTH_WEST) {
					nextX -= distance;
				}
			}
			else if (direction == this.constructor.DIRECTION.SOUTH || direction == this.constructor.DIRECTION.SOUTH_EAST || direction == this.constructor.DIRECTION.SOUTH_WEST) {
				nextY -= distance;

				if (direction == this.constructor.DIRECTION.SOUTH_EAST) {
					nextX += distance;
				}
				else if (direction == this.constructor.DIRECTION.SOUTH_WEST) {
					nextX -= distance;
				}
			}
		}

		console.log(nextX, nextY);
		if (this.map._squares[nextX] && this.map._squares[nextX][nextY]) {
			this.x = nextX;
			this.y = nextY;
		}
		else {
			throw new Error('The map is undiscovered here.');
		}

		this.publishEvent(
			'move',
			{
				direction: direction,
				distance: distance,
				lastX: lastX,
				lastY: lastY,
				newX: nextX,
				newY: nextY
			}
		);
	};

	nsRover.Rover.prototype.scanElevation = function(direction, distance) {
		this.publishEvent(
			'rover.scanElevation',
			{
				direction: direction,
				distance: distance,
				elevation: elevation
			}
		);
	};

	nsRover.Rover.prototype.scanMaterial = function(direction, distance) {
		this.publishEvent(
			'rover.scanMaterial',
			{
				direction: direction,
				distance: distance,
				material: material
			}
		);
	};
})();