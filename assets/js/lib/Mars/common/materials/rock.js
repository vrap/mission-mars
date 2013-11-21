(function() {
	var nsMaterials = using('mars.common.material');

	/**
	 * Class Rock
	 * Represent the material rock with its color and its id in JSon file.
	 */
	nsMaterials.Rock = function() {
		this.id = 1;
		this.name = 'Rock';
		this.textureColor = "#6a6867";
		this.texture = 'rock.jpg';

		/* If already instancied, return instance (Singleton) */
		if (arguments.callee.instance) {
			return arguments.callee.instance;
		}
		else {
			arguments.callee.instance = this;
		}
	};
})();