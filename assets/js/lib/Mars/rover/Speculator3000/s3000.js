(function() {
	var nsSpeculator = using('mars.rover.speculator3000');
	var nsCommon = using('mars.common');

	/**
	 * Instance of Speculator AI.
	 *
	 * @param  {Rover} rover Rover instance to control.
	 */
	nsSpeculator.S3000 = function(rover) {
		this.rover = rover;
		this.map = new Array();
		this.activeModule = null;
		this.report = new Object();

		/* Alias to the static propertie modules list. */
		this.modules = this.constructor.modules;

		/* Retrieve an instance of the Observable. */
		this.observer = new nsCommon.Observable();

		/* Define default tank size alert. */
		this.setTankSizeAlert(10);
	};

	/**
	 * Static properties containing an array of available modules.
	 * 
	 * @type {Array}
	 */
	nsSpeculator.S3000.modules = new Array();

	/**
	 * Add a module to the module list.
	 * 
	 * @param  {Object} module A class definition of a module.
	 */
	nsSpeculator.S3000.addModule = function(module) {
		/* Add the module if not already loaded. */
		if (!this.prototype.hasModule(module.name)) {
			this.modules.push(module);
		}
	};

	/**
	 * Check if a module exist or not.
	 * 
	 * @param  {string} name Name of the module to check if exist.
	 * @return {object|boolean} Return the module class if exist, false instead.
	 */
	nsSpeculator.S3000.prototype.hasModule = function(name) {
		/* Filter on the modules list by the provided name and return the module if found. */
		var module = this.constructor.modules.filter(function(data) {
			return data.prototype.name == name;
		});

		return (module.length == 1) ? module[0] : false;
	};

	/**
	 * Enable a module.
	 * 
	 * @param  {string} name Name of the module to enable.
	 * @param  {boolean} [force=false] Force the activation of the module if already enabled.
	 */
	nsSpeculator.S3000.prototype.enableModule = function(name, force) {
		/* Check if the module exists. */
		if (this.hasModule(name)) {
			/* If the module is already the active one and force option is not set to true, halt. */
			if (this.activeModule && this.activeModule.name == name && force !== true) {
				return;
			}

			/* Disable the current activated module. */
			this.disableModule();

			/* Retrieve the module class and instanciate it. */
			var module = this.hasModule(name);
			this.activeModule = new module(this);

			/* Call the "onEnabled" module event. */
			this.callModuleEvent('onEnabled');
		}
	};

	/**
	 * Deactivate the current active module.
	 */
	nsSpeculator.S3000.prototype.disableModule = function() {
		/* Check if a module is activated. */
		if (this.activeModule) {
			/* Call the "onDisabled" module event. */
			this.callModuleEvent('onDisabled');

			/* Remove the module instance. */
			this.activeModule = null;
		}
	};

	/**
	 * Call a module method if exist.
	 * 
	 * @param  {string} name Name of the method to call.
	 * @param  {[array]} args An array of arguments to send to the method.
	 */
	nsSpeculator.S3000.prototype.callModuleEvent = function(name, args) {
		/* Check if a module is activated. */
		if (this.activeModule) {
			/* Check if the module event method exist. */
			if (this.activeModule[name]) {
				/* Call the module method. */
				return this.activeModule[name](args);
			}
		}

		return true;
	};

	/**
	 * Redefine the tank size alert in percent.
	 *
	 * @param  {integer} size The tank size alert in percent.
	 */
	nsSpeculator.S3000.prototype.setTankSizeAlert = function(size) {
		/* Transform the value to an integer. */
		size = parseInt(size);

		/* If the size is an integer. */
		if (!isNaN(size) && size >= 0) {
			/* Redefine the size. */
			this.sizeAlert = (size * this.rover.tankSize) /100;
		}
	};

        /**
	 * Start the module.
	 */
        nsSpeculator.S3000.prototype.start = function() {
                this.callModuleEvent('start', arguments);
        }

	/**
	 * When the tank is in a low energy state, deploy solar panels to regain the energy.
	 */
	nsSpeculator.S3000.prototype.onLowTankEvent = function() {
		return this.rover.deploySolarPanels();
	};

       /**
        * Retrieve the available sided direction of the rover when it is blocked.
        */
	nsSpeculator.S3000.prototype.getSideDirection = function() {
		var defer = Q.defer();

		switch (this.rover.direction) {
			case this.rover.constructor.DIRECTION.NORTH:
			case this.rover.constructor.DIRECTION.SOUTH:
				defer.resolve([
					this.rover.constructor.DIRECTION.EAST,
					this.rover.constructor.DIRECTION.WEST
				]);
			break;
			case this.rover.constructor.DIRECTION.EAST:
			case this.rover.constructor.DIRECTION.WEST:
				defer.resolve([
					this.rover.constructor.DIRECTION.NORTH,
					this.rover.constructor.DIRECTION.SOUTH
				]);
			break;
			case this.rover.constructor.DIRECTION.NORTH_EAST:
				defer.resolve([
					this.rover.constructor.DIRECTION.NORTH,
					this.rover.constructor.DIRECTION.EAST
				]);
			break;
			case this.rover.constructor.DIRECTION.NORTH_WEST:
				defer.resolve([
					this.rover.constructor.DIRECTION.NORTH,
					this.rover.constructor.DIRECTION.WEST
				]);
			break;
			case this.rover.constructor.DIRECTION.SOUTH_EAST:
				defer.resolve([
					this.rover.constructor.DIRECTION.SOUTH,
					this.rover.constructor.DIRECTION.EAST
				]);
			break;
			case this.rover.constructor.DIRECTION.SOUTH_WEST:
				defer.resolve([
					this.rover.constructor.DIRECTION.SOUTH,
					this.rover.constructor.DIRECTION.WEST
				]);
			break;
			default:
				defer.reject();
			break;
		}

		return defer.promise;
	};

       /**
        * Retrieve the direction of the rover to move on a point.
	*
	* @this {S3000}
	* @param integer x The "x" position of the destination to found.
	* @param integer y The "y" position of the destination to found.
	* @return integer The direction of the rover to move to the destination.
        */
	nsSpeculator.S3000.prototype.getDirectionFromPoint = function(x, y) {
		var defer = Q.defer();

		this.rover.getPosition().then(function(data) {
			var currentDirection = this.rover.direction;
			var currentPosition = data;
			var sideDirection = null;
			var topDirection  = null;

			if (currentPosition.x == x) {
				sideDirection = null;
			}
			else if (currentPosition.x > x) {
				sideDirection = this.rover.constructor.DIRECTION.WEST;
			}
			else {
				sideDirection = this.rover.constructor.DIRECTION.EAST;
			}

			if (currentPosition.y == y) {
				topDirection = null;
			}
			else if (currentPosition.y > y) {
				topDirection = this.rover.constructor.DIRECTION.SOUTH;
			}
			else {
				topDirection = this.rover.constructor.DIRECTION.NORTH;
			}
			if ((sideDirection != null && topDirection == null) || (topDirection != null && sideDirection == null)) {
			    direction = (sideDirection != null) ? sideDirection : topDirection;
			}
			else {
			    if (topDirection == this.rover.constructor.DIRECTION.NORTH) {
				direction = (sideDirection == this.rover.constructor.DIRECTION.EAST) ? this.rover.constructor.DIRECTION.NORTH_EAST : this.rover.constructor.DIRECTION.NORTH_WEST;
			    }
			    else if (topDirection == this.rover.constructor.DIRECTION.SOUTH) {
				direction = (sideDirection == this.rover.constructor.DIRECTION.EAST) ? this.rover.constructor.DIRECTION.SOUTH_EAST : this.rover.constructor.DIRECTION.SOUTH_WEST;
			    }
			}

			defer.resolve(direction);
		}.bind(this));

		return defer.promise;
	};

	nsSpeculator.S3000.prototype.fullScan = function() {
		return this.rover.fullScan();
	};

	nsSpeculator.S3000.prototype.moveAndScan = function() {
		var deferreds = []

		deferreds.push(this.rover.move());
		deferreds.push(this.fullScan());

		return Q.all(deferreds).fail(function(data) {
			alert('ERROR!!!!');
			console.log(data);
		});
	};
})();
