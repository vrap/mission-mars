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

        this.speculator.observer.publish(
	    's3000.module.start.begin',
	    [{
		s3000: this.speculator
	    }]
	);

	this.voyage(destination, { mission: true })
	    .then(
		function() {
		    this.speculator.rover.removeBufferedActions();
		    this.speculator.observer.publish(
			's3000.module.start.end',
			[{
			    s3000: this.speculator,
			    status: true
			}]
		    );
		}.bind(this)
	    )
	    .fail(
		function() {
		    this.speculator.rover.removeBufferedActions();
		    this.speculator.observer.publish(
			's3000.module.start.end',
			[{
			    s3000: this.speculator,
			    status: false
			}]
		    );
		}.bind(this)
	    );
    };

    nsVoyager.Voyager.prototype.voyage = function(destination, options, defer) {
	if (typeof options != 'object') {
	    options = {
		autoLoadTank: true,
		escapeObstacle: true
	    };
	}
	else {
	    options.autoLoadTank = (options.autoLoadTank === false) ? false : true;
	    options.escapeObstacle = (options.escapeObstacle === false) ? false : true;
	}

	if (!defer) {
	    defer = Q.defer();
	}

	if (options.mission == true) {
	    defer.promise.mission = 'mission';
	}

	var currentPosition, invertedDirection, randPosition;
	var rover = this.speculator.rover;
	var position = { x: rover.x, y: rover.y };

	if (rover.x == destination.x && rover.y == destination.y) {
	    defer.resolve();

	    return defer.promise;
	}

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

	this.speculator.getDirectionFromPoint(destination.x, destination.y)
	    .then(
		function(data) {
		    this.speculator.rover.setDirection(data)
			.then(
			    function() {
				this.speculator.moveAndScan(true, false)
				    .then(
					function() {
					    this.voyage(destination, options, defer);
					}.bind(this)
				    )
				    .fail(
					function(data) {
					    data.destination = destination;

					    this.onError(data, options, defer)
						.then(
						    function() {
							this.voyage(destination, options, defer);
						    }.bind(this)
						)
						.fail(
						    function(data) {
							defer.reject(data);
						    }
						);
					}.bind(this)
				    );
			    }.bind(this)
			);
		}.bind(this)
	    );

	return defer.promise;
    };

    nsVoyager.Voyager.prototype.onError = function(data, options, missionDefer) {
	var defer = Q.defer();
	var rover = this.speculator.rover;

	if (data.error.message == rover.constructor.MESSAGE.E_NEED_MORE_TANK) {
	    rover.deploySolarPanels()
		.then(
		    function() {
			defer.resolve();
		    }.bind(this)
		);
	}
	else if (data.error.message == rover.constructor.MESSAGE.E_SLOPE_IS_TOO_IMPORTANT) {
	    var square = this.estimateBestMove(data.destination)[0];

	    if (options.escapeObstacle == true) {
		if (!square) {
		    defer.reject();
		}
		else {
		    this.voyage(square, {escapeObstacle: false })
			.then(
			    function() {
				defer.resolve();
			    }
			)
			.fail(
			    function() {
				defer.reject();
			    }
			);
		}
	    }
	    else {
		defer.reject();
	    }
	}
	else if (data.error.message == rover.constructor.MESSAGE.E_SLOPE_IS_TOO_IMPORTANT2) {
	    if (options.escapeObstacle == true) {
		var square = this.estimateBestMove(data.destination)[0];

		if (!square) {
		    defer.reject();
		}
		else {
		    console.log(square);
		    this.voyage(square, {debug: true, escapeObstacle: false})
			.then(
			    function() {
				defer.resolve();
			    }.bind(this)
			)
			.fail(
			    function() {
				defer.reject();
			    }.bind(this)
			);
		}
	    }
	    else {
		defer.reject();
	    }
	}
	else {
	    defer.reject(data);
	}

	return defer.promise;
    };

    nsVoyager.Voyager.prototype.estimateBestMove = function(destination) {
	var rover = this.speculator.rover;
	var availableSquares = rover.memory.getRange(
	    rover.x -1,
	    rover.y -1,
	    rover.x +1,
	    rover.y +1
	);
	var squareWeight = {};

	var averageSquare = 0;
	for (var key in availableSquares) {
	    var square = availableSquares[key];

	    if (square.x != rover.x && square.y != rover.y) {
		averageSquare += (destination.x - square.x) + (destination.y - square.y);
	    }
	}
	averageSquare /= (availableSquares.length -1)

	for (var key in availableSquares) {
	    var square = availableSquares[key];

	    if (square.x != rover.x && square.y != rover.y) {
		var currentSquare = rover.getSquare(rover.direction, 0);
		var slope = rover.calculateSlope(currentSquare.z, square.z);

		/* Calcul the distance relatively to the average. */
		var distance = (destination.x - square.x) + (destination.y - square.y);
		distance = averageSquare - distance;

		/**
		 * Calcul the score of the square.
		 *
		 * The calcul is based on the distance, the number of visited
		 * times and the elevation.
		 */
		var distanceScore = (-(distance) * 1.2);
		var slopeScore    = (-square.z);
		var visitedScore  = (-(square.visited * 10))

		var score = distanceScore + slopeScore + visitedScore;

		/* Only square with a low slope will be included. */
		if (slope <= 0.5 && slope >= -0.5 && square.visited <= 5) {
		    if (!squareWeight[score]) {
			squareWeight[score] = [];
		    }

		    squareWeight[score].push(square);
		}
	    }
	}

	highSquares = Math.max.apply(null, Object.keys(squareWeight));

	if (highSquares instanceof Array) {
	    if (highSquares.length >= 1) {
		return squareWeight[highSquares[Math.floor(Math.random() * highSquares.length)]];
	    }
	}
	else {
	    return squareWeight[highSquares];
	}

	return null;
    };

    /* Add the voyager module to Speculator3000. */
    nsSpeculator.S3000.addModule(nsVoyager.Voyager);
})();
