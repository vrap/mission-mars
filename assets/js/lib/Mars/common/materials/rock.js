(function() {
	var nsMaterials = using('mars.common.material');

	/**
	 * [ description]
	 */
	nsMaterials.Rock = function() {
		this.name = 'Rock';
		this.texture = 'texture.png';

		/* If already instancied, return instance (Singleton) */
		if (arguments.callee.instance) {
			return arguments.callee.instance;
		}
		else {
			arguments.callee.instance = this;
		}
	};
})();