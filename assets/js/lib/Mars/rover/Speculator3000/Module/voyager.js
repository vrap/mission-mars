(function() {
    var nsVoyager = using('mars.rover.speculator3000.module.voyager');
    var nsSpeculator = using('mars.rover.speculator3000');
    var nsRover = using('mars.rover');
    var nsCommon = using('mars.common');

    /**
     * Class constructor of voyager module.
     * The voyager module make the rover move to a point B.
     */
    nsVoyager.Voyager = function(s3000) {
	this.speculator = s3000;
    };

    /**
     * Name of the module.
     * @type {String}
     */
    nsVoyager.Voyager.prototype.name = 'voyager';

    /**
     * Example of onEnabled event triggered when voyager mode is enabled by S3000 on the rover.
     */
    nsVoyager.Voyager.prototype.onEnabled = function() {
	console.log('Voyager mode enabled');
    };

    /**
     * Example of onDisabled event triggered when voyager mode is disabled by S3000 on the rover.
     */
    nsVoyager.Voyager.prototype.onDisabled = function() {
	console.log('Voyager mode disabled');
    };

    /**
     * Start the voyager scenario.
     */
    nsVoyager.Voyager.prototype.start = function() {
	var destination = arguments[0][0];
	var position = { x: this.speculator.rover.x, y: this.speculator.rover.y };
	var xDirection = nsRover.Rover.DIRECTION.WEST;
	var yDirection = nsRover.Rover.DIRECTION.SOUTH;

	if (position.x < destination.x) {
	    xDirection = nsRover.Rover.DIRECTION.EAST;
	}
	if (position.y < destination.y) {
	    yDirection = nsRover.Rover.DIRECTION.NORTH;
	}

	var randPosition = getRandomInt(0, 100);
	if (randPosition <= 50) {
	    this.speculator.rover.setDirection(xDirection);
	    this.moveAt('x', destination.x);
	    this.speculator.rover.setDirection(yDirection);
	    this.moveAt('y', destination.y);
	}
	else {
	    this.speculator.rover.setDirection(yDirection);
	    this.moveAt('y', destination.y);
	    this.speculator.rover.setDirection(xDirection);
	    this.moveAt('x', destination.x);
	}
    };

    nsVoyager.Voyager.prototype.moveAt = function(direction, destination) {
	var position = this.speculator.rover[direction];
	while (destination < position) {
	    var distance = ((position-destination) > 1) ? 2 : 1;

	    this.speculator.rover.move(distance);
	    position = this.speculator.rover[direction];
	}
    };

    /* Add the voyager module to Speculator3000. */
    nsSpeculator.S3000.addModule(nsVoyager.Voyager);
})();
