(function() {
    var nsExplorer = using('mars.rover.speculator3000.module.explorer');
    var nsSpeculator = using('mars.rover.speculator3000');
    var nsRover = using('mars.rover');
    var nsCommon = using('mars.common');

    var xStartPosition = 0;
    var yStartPosition = 0;
    var firstSideExplored = false;
    var firstSide = true;

    /**
     * Class constructor of explorer module.
     * The explorer module must explore the largest poosible area with the least possible movement.
     */
    nsExplorer.Explorer = function(s3000) {
        this.speculator = s3000;

		TOP = 2;
		RIGHT = parseInt(this.speculator.rover.map.getWidth() - 3);
		BOTTOM = parseInt(this.speculator.rover.map.getHeight() - 3);
		LEFT = 2;
		LEFTMIDDLE = parseInt(Math.round(this.speculator.rover.map.getWidth() / 2) - 3);
		RIGHTMIDDLE = parseInt(Math.round(this.speculator.rover.map.getWidth() / 2) + 2);
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
		xStartPosition = this.speculator.rover.x;
		yStartPosition = this.speculator.rover.y;

		this.moveToNearestSide().then(function() {
			this.explore();
		}.bind(this));
	};

	nsExplorer.Explorer.prototype.explore = function() {
		var rover = this.speculator.rover;

		// Stoping condition
		if (rover.x == xStartPosition && (
			rover.y == yStartPosition ||
			rover.y - yStartPosition == 1 ||
			rover.y - yStartPosition == 2 || 
			rover.y - yStartPosition == - 1 ||
			rover.y - yStartPosition == - 2) && firstSide == false) {
	    	return;
		}

		// Borders limits
		if (rover.x < LEFT) {
			rover.setDirection(nsRover.Rover.DIRECTION.RIGHT).then(function() {
				var moves = [];
				moves.push(rover.move());
				moves.push(rover.move());

				Q.all(moves).then(
					function() {
						defer.resolve();
					}.bind(this))
			}.bind(this));
		}
		else if (rover.x > RIGHT) {
			rover.setDirection(nsRover.Rover.DIRECTION.LEFT).then(function() {
				var moves = [];
				moves.push(rover.move());
				moves.push(rover.move());

				Q.all(moves).then(
					function() {
						defer.resolve();
					}.bind(this))
			}.bind(this));
		}
		else if (rover.y < TOP) {
			rover.setDirection(nsRover.Rover.DIRECTION.BOTTOM).then(function() {
				var moves = [];
				moves.push(rover.move());
				moves.push(rover.move());

				Q.all(moves).then(
					function() {
						defer.resolve();
					}.bind(this))
			}.bind(this));
		}
		else if (rover.y > BOTTOM) {
			rover.setDirection(nsRover.Rover.DIRECTION.TOP).then(function() {
				var moves = [];
				moves.push(rover.move());
				moves.push(rover.move());

				Q.all(moves).then(
					function() {
						defer.resolve();
					}.bind(this))
			}.bind(this));
		}

		if (rover.x == xStartPosition && rover.y == yStartPosition && firstSide) {
			firstSide = false;
		}

		this.verticalMove().then(function() {
			this.horizontalMove().then(function() {
				this.explore();
			}.bind(this));
		}.bind(this));
	};
	
	// Init the position
	nsExplorer.Explorer.prototype.moveToNearestSide = function() {
		var rover     = this.speculator.rover;
		var direction = null;
		// true = left, false = right
		var spawnSide = (xStartPosition < Math.round(rover.map.getWidth() / 2)) ? true : false;

		if (((rover.map.getHeight() - rover.y) % 2) == 0) {
			direction = nsRover.Rover.DIRECTION.WEST;
		}
		else {
			direction = nsRover.Rover.DIRECTION.EAST;
		}

		return promiseWhile(
			function() {
				if (direction == nsRover.Rover.DIRECTION.WEST) {
					if (spawnSide) {
						if (rover.x > LEFT) {
							return true;
						}
					}
					else {
						if (rover.x > RIGHTMIDDLE) {
							return true;
						}
					}
				}
				else if (direction == nsRover.Rover.DIRECTION.EAST) {
					if (spawnSide) {
						if (rover.x < LEFTMIDDLE) {
							return true;
						}
					}
					else {
						if (rover.x < RIGHT) {
							return true;
						}
					}
				}
			}.bind(this),
			function() { 
	    		rover.setDirection(direction);

				return this.speculator.moveAndScan().fail(
					function(data) {
						this.onError(data).then(
							function() {
								this.explore();
							}.bind(this)).fail(
							function(data) {
								defer.reject(data);
							})
					}.bind(this)
				);
	    	}.bind(this)
		);
	};

	nsExplorer.Explorer.prototype.verticalMove = function() {
		var defer = Q.defer();
		var rover = this.speculator.rover;

		// true = left, false = right
		var spawnSide = (xStartPosition < Math.round(rover.map.getWidth() / 2)) ? true : false;
		var roverSide = (rover.x < Math.round(rover.map.getWidth() / 2)) ? true : false;

		// Rover is on spawnSide
		if (spawnSide && roverSide || spawnSide == false && roverSide == false) {
			// Mettre à NORTH quand axes bon
			rover.setDirection(nsRover.Rover.DIRECTION.SOUTH).then(function() {
				var moves = [];
				
				for (var i = 0; i < 5; i++) {
					var tmp = rover.y - i;

					if (tmp > TOP) {
						moves.push(rover.move());
					}
				}
			
				Q.all(moves).then(
					function() {
						defer.resolve();
					}.bind(this)).fail(
						function(data) {
							this.onError(data).then(
								function() {
									this.explore();
								}.bind(this)).fail(
								function(data) {
									defer.reject(data);
								})
						}.bind(this));
			}.bind(this));
		}
		// Rover is not on spawnSide
		else {
			// Mettre à SOUTH quand axes bon
			rover.setDirection(nsRover.Rover.DIRECTION.NORTH).then(function() {
				var moves = [];
				
				for (var i = 0; i < 5; i++) {
					var tmp = rover.y + i;

					if (tmp < BOTTOM) {
						moves.push(rover.move());
					}
				}
			
				Q.all(moves).then(function() {
					defer.resolve();
				}.bind(this));
			}.bind(this));
		}

		return defer.promise;
	};

	nsExplorer.Explorer.prototype.horizontalMove = function() {
		var rover = this.speculator.rover;

		// Top left => move to right
		if (rover.y == TOP && (rover.x == LEFT || rover.x == LEFTMIDDLE)) {
			return promiseWhile(
				function() {
					if (rover.x < RIGHT) {
						rover.setDirection(nsRover.Rover.DIRECTION.EAST);

						return true;
					}
				}.bind(this),
				function() {
					return this.speculator.moveAndScan().fail(
						function(data) {
							this.onError(data).then(
								function() {
									this.explore();
								}.bind(this)).fail(
								function(data) {
									defer.reject(data);
								})
						}.bind(this)
					);
				}.bind(this)
			);
		}
		// Top right => move to left
		else if (rover.y == TOP && (rover.x == RIGHT || rover.x == RIGHTMIDDLE) && firstSideExplored == false) {
			firstSideExplored = true;

			return promiseWhile(
				function() {
					if (rover.x > LEFT) {
						rover.setDirection(nsRover.Rover.DIRECTION.WEST);

						return true;
					}
				}.bind(this),
				function() {
					return this.speculator.moveAndScan().fail(
						function(data) { 
							this.onError(data).then(
								function() {
									this.explore();
								}.bind(this)).fail(
								function(data) {
									defer.reject(data);
								})
						}.bind(this)
					);
				}.bind(this)
			);
		}
		// Bottom left => move to right
		else if (rover.y == BOTTOM && (rover.x == LEFT || rover.x == LEFTMIDDLE)) {
			return promiseWhile(
				function() {
					if (rover.x < RIGHT) {
						rover.setDirection(nsRover.Rover.DIRECTION.EAST);

						return true;
					}
				}.bind(this),
				function() {
					return this.speculator.moveAndScan().fail(
						function(data) {
							this.onError(data).then(
								function() {
									this.explore();
								}.bind(this)).fail(
								function(data) {
									defer.reject(data);
								})
						}.bind(this)
					);
				}.bind(this)
			);
		}
		// Bottom right => move to left
		else if (rover.y == BOTTOM && (rover.x == RIGHT || rover.y == RIGHTMIDDLE)) {
			return promiseWhile(
				function() {
					if (rover.x > LEFT) {
						rover.setDirection(nsRover.Rover.DIRECTION.WEST);

						return true;
					}
				}.bind(this),
				function() {
					return this.speculator.moveAndScan().fail(
						function(data) {
							this.onError(data).then(
								function() {
									this.explore();
								}.bind(this)).fail(
								function(data) {
									defer.reject(data);
								})
						}.bind(this)
					);
				}.bind(this)
			);
		}
		// Middle left => move to left
		else if (rover.x == LEFTMIDDLE) {
			return promiseWhile(
				function() {
					if (rover.x > LEFT) {
						rover.setDirection(nsRover.Rover.DIRECTION.WEST);

						return true;
					}
				}.bind(this),
				function() {
					return this.speculator.moveAndScan().fail(
						function(data) {
							this.onError(data).then(
								function() {
									this.explore();
								}.bind(this)).fail(
								function(data) {
									defer.reject(data);
								})
						}.bind(this)
					);
				}.bind(this)
			);
		}
		// Middle right => move to right
		else if (rover.x == RIGHTMIDDLE) {
			return promiseWhile(
				function() {
					if (rover.x < RIGHT) {
						rover.setDirection(nsRover.Rover.DIRECTION.EAST);

						return true;
					}
				}.bind(this),
				function() {
					return this.speculator.moveAndScan().fail(
						function(data) {
							this.onError(data).then(
								function() {
									this.explore();
								}.bind(this)).fail(
								function(data) {
									defer.reject(data);
								})
						}.bind(this)
					);
				}.bind(this)
			);
		}
		// Left => move to middle left
		else if (rover.x == LEFT) {
			return promiseWhile(
				function() {
					if (rover.x < LEFTMIDDLE) {
						rover.setDirection(nsRover.Rover.DIRECTION.EAST);
						
						return true;
					}
				}.bind(this),
				function() {
					return this.speculator.moveAndScan().fail(
						function(data) { 
							this.onError(data).then(
								function() {
									this.explore();
								}.bind(this)).fail(
								function(data) {
									defer.reject(data);
								})
						}.bind(this)
					);
				}.bind(this)
			);
		}
		// Right => move to middle right
		else if (rover.x == RIGHT) {
			return promiseWhile(
				function() {
					if (rover.x > RIGHTMIDDLE) {
						rover.setDirection(nsRover.Rover.DIRECTION.WEST);

						return true;
					}
				}.bind(this),
				function() {
					return this.speculator.moveAndScan().fail(
						function(data) {
							this.onError(data).then(
								function() {
									this.explore();
								}.bind(this)).fail(
								function(data) {
									defer.reject(data);
								})
						}.bind(this)
					);
				}.bind(this)
			);
		}
		else {
			var defer = Q.defer();

			return defer.promise;
		}
	};

	nsExplorer.Explorer.prototype.onError = function(data) {
		var defer = Q.defer();
		var rover = this.speculator.rover;

		if (data.error.message == rover.constructor.MESSAGE.E_NEED_MORE_TANK) {
			rover.deploySolarPanels().then(
				function() {
					defer.resolve();
				}.bind(this)
			);
		}
		else if (data.error.message == rover.constructor.MESSAGE.E_SLOPE_IS_TOO_IMPORTANT) {
			if (rover.direction == nsRover.Rover.DIRECTION.EAST) {
				this.removeBufferedActions();

				this.verticalMove().then(function() {
					this.start();
				}.bind(this));
			}
			else if (rover.direction == nsRover.Rover.DIRECTION.WEST) {
				this.removeBufferedActions();

				this.verticalMove().then(function() {
					this.start();
				}.bind(this));
			}
			else if (rover.direction == nsRover.Rover.DIRECTION.NORTH) {
				this.removeBufferedActions();

				this.horizontalMove().then(function() {
					this.start();
				}.bind(this));
			}
			else if (rover.direction == nsRover.Rover.DIRECTION.SOUTH) {
				this.removeBufferedActions();

				this.horizontalMove().then(function() {
					this.start();
				}.bind(this));
			}
		}
		else {
			defer.reject(data);
		}

		return defer.promise;
	};

    /* Add the explorer module to Speculator3000. */
    nsSpeculator.S3000.addModule(nsExplorer.Explorer);
})();