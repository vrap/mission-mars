(function() {
	var nsMaterials = using('mars.common.material');

	/**
	 * Class Sand
	 * Represent the material sand with its color and its id in JSon file.
	 */
	nsMaterials.Sand = function() {
		this.id = 2;
		this.name = 'Sand';
		this.textureColor = "#E7D3C5";
		this.probability = 0.1;

		/* If already instancied, return instance (Singleton) */
		if (arguments.callee.instance) {
			return arguments.callee.instance;
		}
		else {
			arguments.callee.instance = this;
		}
	};
})();