(function() {
	var nsMaterials = using('mars.common.material');

	/**
	 * Class Ore
	 * Represent the material ore with its color and its id in JSon file.
	 */
	nsMaterials.Ore = function() {
		this.id = 5;
		this.name = 'Ore';
		this.textureColor = "#d2ab92";
		this.texture = 'ore.jpg';

		/* If already instancied, return instance (Singleton) */
		if (arguments.callee.instance) {
			return arguments.callee.instance;
		}
		else {
			arguments.callee.instance = this;
		}
	};
})();