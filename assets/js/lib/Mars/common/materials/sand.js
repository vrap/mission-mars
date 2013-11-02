(function() {
	var nsMaterials = using('mars.common.material');

	/**
	 * Class Sand
	 * Represent the material sand with its color and its id in JSon file.
	 */
	nsMaterials.Sand = function() {
		this.id = 1;
		this.name = 'Sand';
		this.textureColor = "#E7D3C5";
		this.texture = 'sand.jpg';

		/* If already instancied, return instance (Singleton) */
		if (arguments.callee.instance) {
			return arguments.callee.instance;
		}
		else {
			arguments.callee.instance = this;
		}
	};
})();