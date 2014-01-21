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

	/*
	 * 1. Déplacement vertical vers la destination final.
	 * 2. Si bloquer avant l'arriver, regarder dans quel position on est le plus proche de la destination (x ou y)
	 * 3. Avancer dans la direction la plus proche jusqu'à un obstacle ou l'arriver.
	 * 4. Changer de direction.
	 */
	var result = false;
	var canContinue = true;
	var oldPosition = {x: this.speculator.rover.x, y: this.speculator.rover.y};
	while (canContinue) {
	    var rover = this.speculator.rover;

	    if (rover.x == destination.x && rover.y == destination.y) {
		result = true;
		break;
	    }
	    if (rover.x == oldPosition.x && rover.y == oldPosition.y) {
		break;
	    }

	    oldPosition = {x: rover.x, y: rover.y};
	}

	if (result == true) {
	    console.log('Mission successfull !');
	}
	else {
	    console.log('Mission failed !');
	}
	/*
	var i = 0;
	while (this.speculator.rover.x != destination.x || this.speculator.rover.y != destination.y) {	    
	    var distance = ((position - destination) > 1) ? 2 : 1;

	    if (this.speculator.rover[directions[currentDirection]] == destination[directions[currentDirection]]) {
		currentDirection = invertedDirection;
		invertedDirection = this.speculator.rover.direction; 
	    }

	    this.speculator.rover.setDirection(currentDirection);

	    try {
		this.speculator.rover.move(distance);
	    }
	    catch (error) {
		invertedDirection = currentDirection;
		currentDirection = this.speculator.rover.direction;
	    }

	    console.log('moved to : ' + this.speculator.rover.x + ' / ' + this.speculator.rover.y);

	    i++;
	}
	*/
    };

    /* Add the voyager module to Speculator3000. */
    nsSpeculator.S3000.addModule(nsVoyager.Voyager);
})();
