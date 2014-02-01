(function() {
    var nsExplorer = using('mars.rover.speculator3000.module.explorer');
    var nsSpeculator = using('mars.rover.speculator3000');
    var nsRover = using('mars.rover');
    var nsCommon = using('mars.common');

    /**
     * Class constructor of explorer module.
     * The explorer module must explore the largest poosible area with the least possible movement.
     */
    nsExplorer.Explorer = function(s3000) {
        this.speculator = s3000;
    };

    /**
     * Name of the module.
     * @type {String}
     */
    nsExplorer.Explorer.prototype.name = 'explorer';

    /**
     * Example of onEnabled event triggered when explorer mode is enabled by S3000 on the rover.
     */
    nsExplorer.Explorer.prototype.onEnabled = function() {
        console.log('Explorer mode enabled');
    };

    /**
     * Example of onDisabled event triggered when explorer mode is disabled by S3000 on the rover.
     */
    nsExplorer.Explorer.prototype.onDisabled = function() {
        console.log('Explorer mode disabled');
    };

    /**
     * Start the explorer scenario.
     */
    nsExplorer.Explorer.prototype.start = function() {
	this.speculator.rover.setDirection(this.getNearestSide()).then(function() {
            this.moveToNearestSide().then(function() {
		this.explore();
	    }.bind(this));
	}.bind(this));
    };

    nsExplorer.Explorer.prototype.moveToNearestSide = function() {
	return promiseWhile(
	    function() {
		if (this.getNearestSide() == nsRover.Rover.DIRECTION.WEST) {
		    if (this.speculator.rover.x > 2) {
			return true;
		    }
		}
		else {
		    eastLimit = parseInt(this.speculator.rover.map.getWidth() -2);
		    if (this.speculator.rover.x < eastLimit) {
			return true;
		    }
		}
	    }.bind(this),
	    function() {
		return this.speculator.moveAndScan();
	    }.bind(this)
	);
    };

    nsExplorer.Explorer.prototype.explore = function() {
	var rover = this.speculator.rover;

	this.upNorth().then(function() {
	    promiseWhile(
		function() {
		    if (rover.y > 2) {
			return true;
		    }
		},
		function() {
		    return this.exploreHalfMapWidth();
		}.bind(this)
	    );
	}.bind(this));
    };

    nsExplorer.Explorer.prototype.exploreHalfMapWidth = function() {
	var defer = Q.defer();
	var rover = this.speculator.rover;

	if (rover.x == parseInt(rover.map.getWidth() - 2)) {
	    rover.setDirection(nsRover.Rover.DIRECTION.WEST).then(function() {
		promiseWhile(
		    function() {
			if (rover.x > 2) {
			    return true;
			}
		    }.bind(this),
		    function() {
			return this.speculator.moveAndScan();
		    }.bind(this)
		).then(function() {
		    this.upNorth().then(function() {
			defer.resolve();
		    }.bind(this));
		}.bind(this));
	    }.bind(this));
	}
	else if (rover.x == 2) {
	    rover.setDirection(nsRover.Rover.DIRECTION.EAST).then(function() {
		promiseWhile(
		    function() {
			if (rover.x < rover.map.getWidth() -2) {
			    return true;
			}
		    },
		    function() {
			return this.speculator.moveAndScan();
		    }.bind(this)
		).then(function() {
		    this.upNorth().then(function() {
			defer.resolve();
		    }.bind(this));
		}.bind(this));
	    }.bind(this));
	}

	return defer.promise;
    };

    nsExplorer.Explorer.prototype.upNorth = function() {
	var defer = Q.defer();
	var rover = this.speculator.rover;

	rover.setDirection(nsRover.Rover.DIRECTION.NORTH).then(function() {
	    var moves = [];
	    moves.push(rover.move());
	    moves.push(rover.move());
	    moves.push(rover.move());
	    moves.push(rover.move());
	    moves.push(rover.move());

	    Q.all(moves).then(function() {
		defer.resolve();
	    }.bind(this));
	}.bind(this));	

	return defer.promise;
    }

    nsExplorer.Explorer.prototype.getNearestSide = function() {
	var rover = this.speculator.rover;

        if (rover.x < Math.round(rover.map.getWidth() / 2)) {
            return nsRover.Rover.DIRECTION.WEST;
        }
        
        return nsRover.Rover.DIRECTION.EAST;
    };

    nsExplorer.Explorer.prototype.speculatedMovements = function() {
        return Math.round(this.speculator.rover.map.getWidth() * (this.speculator.rover.map.getHeight() / 5) - (4 * this.speculator.rover.map.getHeight()) - (4 * this.speculator.rover.map.getWidth()));
    };

    /* Add the explorer module to Speculator3000. */
    nsSpeculator.S3000.addModule(nsExplorer.Explorer);
})();
