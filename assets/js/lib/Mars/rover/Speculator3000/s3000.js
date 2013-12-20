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

			/* If the new activated module has a onEnabled method call it. */
			if (this.activeModule.onEnabled) {
				this.activeModule.onEnabled();
			}
		}
	};

	/**
	 * Deactivate the current active module.
	 */
	nsSpeculator.S3000.prototype.disableModule = function() {
		if (this.activeModule) {
			/* If the active module has a onDisabled method, call it. */
			if (this.activeModule.onDisabled) {
				this.activeModule.onDisabled();
			}

			/* Remove the module instance. */
			this.activeModule = null;
		}
	};
})();