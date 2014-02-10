(function() {
    var nsExplorer = using('mars.rover.speculator3000.module.explorer');
    var nsSpeculator = using('mars.rover.speculator3000');
    var nsRover = using('mars.rover');
    var nsCommon = using('mars.common');

    var xStartPosition = 0;
    var yStartPosition = 0;

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
		var xStartPosition = this.speculator.rover.x;
		var yStartPosition = this.speculator.rover.y;

		this.moveToNearestSide().then(function() {
			this.explore();
		}.bind(this));
	};

	nsExplorer.Explorer.prototype.explore = function() {
		this.verticalMove().then(function() {
			this.horizontalMove().then(function() {
				this.explore();
			}.bind(this));
		}.bind(this));
	};
	
	// Initialisation de la position
	nsExplorer.Explorer.prototype.moveToNearestSide = function() {
		var rover     = this.speculator.rover;
		var direction = null;

        if (rover.x < Math.round(rover.map.getWidth() / 2)) {
            direction = nsRover.Rover.DIRECTION.WEST;
        }
        else {   	
        	direction = nsRover.Rover.DIRECTION.EAST;
        }

        return promiseWhile(
	    	function() {
				if (direction == nsRover.Rover.DIRECTION.WEST) {
		    		if (rover.x > 2) {
						return true;
		    		}
				}
				else if (direction == nsRover.Rover.DIRECTION.EAST) {
		    		eastLimit = parseInt(rover.map.getWidth() - 2);
		    
		    		if (rover.x < eastLimit) {
						return true;
		    		}
				}
	    	}.bind(this),
	    	function() {
				return this.speculator.moveAndScan();
	    	}.bind(this)
		);
	};

	nsExplorer.Explorer.prototype.verticalMove = function() {
		var defer = Q.defer();
		var rover = this.speculator.rover;

		// true = gauche, false = droite
		var spawnSide = (xStartPosition < Math.round(rover.map.getWidth() / 2)) ? true : false;
		var roverSide = (rover.x < Math.round(rover.map.getWidth() / 2)) ? true : false;

		// Rover est sur spawnSide
		if (spawnSide && roverSide) {
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
		}
		// Rover n'est pas sur spawnSide
		else {
			rover.setDirection(nsRover.Rover.DIRECTION.SOUTH).then(function() {
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
		}

		return defer.promise;
	};

	nsExplorer.Explorer.prototype.horizontalMove = function(half) {
		var defer = Q.defer();
		var rover = this.speculator.rover;

		// Milieu côté gauche => go coté gauche
		if (rover.x == Math.round(rover.map.getWidth() / 2)) {
			return promiseWhile(
				function() {
					if (rover.x > 2) {
						return true;
					}
				}.bind(this),
				function() {
					return this.speculator.moveAndScan();
				}.bind(this)
			);
		}
		// Milieu côté droite => go coté droite
		else if (rover.x == Math.round((rover.map.getWidth() / 2) + 2)) {
			return promiseWhile(
				function() {
					if (rover.x < Math.round(rover.map.getWidth() - 2)) {
						return true;
					}
				}.bind(this),
				function() {
					return this.speculator.moveAndScan();
				}.bind(this)
			);
		}
		// Côté gauche => go milieu coté gauche
		else if (rover.x == 2) {
			return promiseWhile(
				function() {
					if (rover.x < Math.round((rover.map.getWidth() / 2) - 2)) {
						return true;
					}
				}.bind(this),
				function() {
					return this.speculator.moveAndScan();
				}.bind(this)
			);
		}
		// Côté droite => go milieu coté droite
		else if (rover.x == rover.map.getWidth() - 2) {
			return promiseWhile(
				function() {
					if (rover.x > Math.round((rover.map.getWidth() / 2) + 2)) {
						return true;
					}
				}.bind(this),
				function() {
					return this.speculator.moveAndScan();
				}.bind(this)
			);
		}

		return defer.promise;
	};




   /* nsExplorer.Explorer.prototype.start = function() {
		this.speculator.rover.setDirection(this.getNearestSide()).then(function() {
            this.moveToNearestSide().then(function() {
				this.explore();
	    	}.bind(this));
		}.bind(this));
    };

    nsExplorer.Explorer.prototype.getNearestSide = function() {
		var rover = this.speculator.rover;

        if (rover.x < Math.round(rover.map.getWidth() / 2)) {
            return nsRover.Rover.DIRECTION.WEST;
        }

        return nsRover.Rover.DIRECTION.EAST;
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
		    		eastLimit = parseInt(this.speculator.rover.map.getWidth() - 2);
		    
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

    nsExplorer.Explorer.prototype.upNorth = function() {
		var defer = Q.defer();
		var rover = this.speculator.rover;

		// EXECUTE EN 2eme
		rover.setDirection(nsRover.Rover.DIRECTION.SOUTH).then(function() {
		    var moves = [];
		    moves.push(rover.move());
		    moves.push(rover.move());
		    moves.push(rover.move());
		    moves.push(rover.move());
		    moves.push(rover.move());
			
			// EXECUTE EN 3eme

		    
		    // EXECUTE EN 5eme
		    Q.all(moves).then(function() {
				defer.resolve();

				// EXECUTE EN dernier

				if (this.getNearestSide() == nsRover.Rover.DIRECTION.EAST) {
					rover.setDirection(nsRover.Rover.DIRECTION.WEST);
				}
				else if (this.getNearestSide() == nsRover.Rover.DIRECTION.WEST) {
					rover.setDirection(nsRover.Rover.DIRECTION.EAST);
				}
		    }.bind(this));

		    // EXECUTE EN 4eme
		}.bind(this));	

		// EXECUTE EN 1er
		return defer.promise;
    };

    nsExplorer.Explorer.prototype.exploreHalfMapWidth = function() {
		var defer = Q.defer();
		var rover = this.speculator.rover;
		var stop  = false;

		// Moitié en venant de l'est
		/*if (rover.x == parseInt(rover.map.getWidth() / 2) && this.getNearestSide() == nsRover.Rover.DIRECTION.EAST) { console.log('if');
	    	rover.setDirection(nsRover.Rover.DIRECTION.WEST).then(function() {
				promiseWhile(
		    		function() {
						if (rover.x > 2) { console.log('STOP1');
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
		// Moitié en venant de l'ouest
		else if (rover.x == parseInt(rover.map.getWidth() / 2) && this.getNearestSide() == nsRover.Rover.DIRECTION.WEST) { console.log('else if 1');
	    	rover.setDirection(nsRover.Rover.DIRECTION.EAST).then(function() {
				promiseWhile(
		    		function() {
						if (rover.x < rover.map.getWidth() - 2) { console.log('STOP2');
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
		}*/
		// Rover coté est
		/*if (rover.x > parseInt(rover.map.getWidth() / 2)) {
			rover.setDirection(nsRover.Rover.DIRECTION.WEST).then(function() {
				promiseWhile(
		    		function() {
						if (/*rover.x > 2 && *///rover.x != parseInt(rover.map.getWidth() / 2) + 2) {
			    			/*return true;
						}
						else {
							alert('Moitie, bord le plus proche : ' + this.getNearestSide());
							stop = true;

							// Attention, il faut le bouger de la moitié

							this.upNorth().then(function() {
								this.speculator.rover.setDirection(this.getNearestSide()).then(function() {
            						this.moveToNearestSide().then(function() {
										this.explore();
	    							}.bind(this));
								}.bind(this));
							});
						}
		    		}.bind(this),
		    		function() { 
						return this.speculator.moveAndScan();
		    		}.bind(this)
				).then(function() {
					if (stop == false) {
			    		this.upNorth().then(function() {
							defer.resolve();
			   		 	}.bind(this));
			    	}
			    	else {
			    		stop = false;
			    	
			    	}
				}.bind(this));
	    	}.bind(this));
		}
		// Rover coté ouest
		else if (rover.x < rover.map.getWidth() / 2) {
			rover.setDirection(nsRover.Rover.DIRECTION.EAST).then(function() {
				promiseWhile(
		    		function() {
						if (/*rover.x < rover.map.getWidth() - 3 && *///rover.x != parseInt(rover.map.getWidth() / 2) - 2) {
			    			/*return true;
						}
						else {
							alert('Moitie, bord le plus proche : ' + this.getNearestSide());
							stop = true;

							this.upNorth().then(function() {
								this.speculator.rover.setDirection(this.getNearestSide()).then(function() {
            						this.moveToNearestSide().then(function() {
										this.explore();
	    							}.bind(this));
								}.bind(this));
							});
						}
		    		}.bind(this),
		    		function() {
						return this.speculator.moveAndScan();
		    		}.bind(this)
				).then(function() {
					if (stop == false) {
			    		this.upNorth().then(function() {
							defer.resolve();
			   		 	}.bind(this));
			    	}
			    	else {
			    		stop = false;


			    	}
				}.bind(this));
	    	}.bind(this));
		}


		/*
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
		}*/

		/*return defer.promise;
    };

    nsExplorer.Explorer.prototype.speculatedMovements = function() {
        return Math.round(this.speculator.rover.map.getWidth() * (this.speculator.rover.map.getHeight() / 5) - (4 * this.speculator.rover.map.getHeight()) - (4 * this.speculator.rover.map.getWidth()));
    };

    /* Add the explorer module to Speculator3000. */
    nsSpeculator.S3000.addModule(nsExplorer.Explorer);
})();