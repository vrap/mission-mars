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

	this.voyage(destination);
    };

    nsVoyager.Voyager.prototype.voyage = function(destination) {
	var currentDirection, invertedDirection, randPosition;
	var position = { x: this.speculator.rover.x, y: this.speculator.rover.y };
	var xDirection = nsRover.Rover.DIRECTION.WEST;
	var yDirection = nsRover.Rover.DIRECTION.SOUTH;

	if (position.x < destination.x) {
	    xDirection = nsRover.Rover.DIRECTION.EAST;
	}
	if (position.y < destination.y) {
	    yDirection = nsRover.Rover.DIRECTION.NORTH;
	}

	randPosition = getRandomInt(0, 100);

	directions = {};
	directions[xDirection] = 'x';
	directions[yDirection] = 'y';

	if (randPosition > 100) {
	    currentDirection = xDirection;
	    invertedDirection = yDirection;
	}
	else {
	    currentDirection = yDirection;
	    invertedDirection = xDirection;
	}

	var result = false;
	var canContinue = true;
	var oldPosition = {x: this.speculator.rover.x, y: this.speculator.rover.y};
	while (canContinue) {
	    var rover = this.speculator.rover;

	    if (rover.x == destination.x && rover.y == destination.y) {
		result = true;
		break;
	    }

	    oldPosition = {x: rover.x, y: rover.y};

	    this.speculator.rover.setDirection(this.speculator.getDirectionFromPoint(destination.x, destination.y));

	    try {
		this.speculator.rover.move(1);
	    }
	    catch (e) {
		console.log(e);
	    }

	    if (rover.x == oldPosition.x && rover.y == oldPosition.y) {
		break;
	    }
	}

	if (result == true) {
	    console.log('Mission successfull !');
	}
	else {
	    console.log('Mission failed !');
	}
    };

    /* Add the voyager module to Speculator3000. */
    nsSpeculator.S3000.addModule(nsVoyager.Voyager);
})();
