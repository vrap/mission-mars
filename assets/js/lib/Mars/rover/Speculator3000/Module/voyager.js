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

        this.speculator.observer.publish('s3000.module.start.begin');

	this.voyage(destination)
	    .then(
		function() {
		    this.speculator.rover.removeBufferedActions();
		    this.speculator.observer.publish('s3000.module.start.end', [{status: true}]);

		    console.log(this.speculator.rover.memory.readAll());
		}.bind(this)
	    )
	    .fail(
		function() {
		    this.speculator.rover.removeBufferedActions();
		    this.speculator.observer.publish('s3000.module.start.end', [{status: false}]);
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

	var currentPosition, invertedDirection, randPosition;
	var rover = this.speculator.rover;
	var position = { x: rover.x, y: rover.y };

	if (rover.x == destination.x && rover.y == destination.y) {
	    defer.resolve();

	    return;
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
					    this.onError(data)
						.then(
						    function() {
							this.voyage(destination, options, defer);
						    }.bind(this)
						)
						.fail(
						    function(data) {
							console.log('onError2');
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

    nsVoyager.Voyager.prototype.onError = function(data) {
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
	else {
	    console.log('onError', data.error.message);
	    defer.reject(data);
	}

	return defer.promise;
    };

    /* Add the voyager module to Speculator3000. */
    nsSpeculator.S3000.addModule(nsVoyager.Voyager);
})();
