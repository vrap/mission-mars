(function() {
	var nsVoyager = using('mars.rover.speculator3000.module.voyager');
	var nsSpeculator = using('mars.rover.speculator3000');
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

	/* Add the voyager module to Speculator3000. */
	nsSpeculator.S3000.addModule(nsVoyager.Voyager);
})();