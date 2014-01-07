(function() {
	var nsSpeculator = using('mars.rover.speculator3000');
	var nsCommon = using('mars.common');

	/**
	 * Instance of Speculator AI.
	 *
	 * @param  {Rover} rover Rover instance to control.
	 */
	nsSpeculator.S3000 = function(rover, memory) {
		this.rover = rover;
		this.map = new Array();
		this.activeModule = null;
		this.report = new Object();
		this.memory = memory;

		/* Alias to the static propertie modules list. */
		this.modules = this.constructor.modules;

		/* Retrieve an instance of the Observable. */
		this.observer = new nsCommon.Observable();

		/* Register to rover events. */
		this.registerEvents();

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
	 * Register rovers events and call the onEvent method.
	 */
	nsSpeculator.S3000.prototype.registerEvents = function() {
		this.observer.subscribe('rover.*', function(event) {
			this.onEvent(event);
		}.bind(this));
	};

	/**
	 * Function called when a rover event is catched.
	 *
	 * @param  {object} event Contain data of the event.
	 */
	nsSpeculator.S3000.prototype.onEvent = function(event) {
		if (this.callModuleEvent('onEvent', event) !== false) {
			if (event.channel != 'rover.actions.deploySolarPanels') {
				if (this.rover.tank < this.sizeAlert) {
					if (this.callModuleEvent('onLowTankEvent') !== false) {
						this.onLowTankEvent();
					}
				}
			}
		}
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
	 * 
	 * 
	 * @return {[type]} [description]
	 */
	nsSpeculator.S3000.prototype.onLowTankEvent = function() {
		this.rover.deploySolarPanels();
	};
})();