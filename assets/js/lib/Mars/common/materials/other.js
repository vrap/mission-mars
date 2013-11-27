(function() {
	var nsMaterials = using('mars.common.material');

	/**
	 * Class Oter
	 * Represent the others materials with their color and thier id in JSon file.
	 */
	nsMaterials.Other = function() {
		this.id = 6;
		this.name = 'Other';
		this.textureColor = "#3A3E41";
		this.probability = 0.02;

		/* If already instancied, return instance (Singleton) */
		if (arguments.callee.instance) {
			return arguments.callee.instance;
		}
		else {
			arguments.callee.instance = this;
		}
	};
})();