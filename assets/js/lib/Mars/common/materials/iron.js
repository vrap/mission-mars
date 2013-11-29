(function() {
	var nsMaterials = using('mars.common.material');

	/**
	 * Class Iron
	 * Represent the material iron with its color and its id in JSon file.
	 */
	nsMaterials.Iron = function() {
		this.id = 3;
		this.name = 'Iron';
		this.textureColor = "#C9A78E";
		this.probability = 0.2;

		/* If already instancied, return instance (Singleton) */
		if (arguments.callee.instance) {
			return arguments.callee.instance;
		}
		else {
			arguments.callee.instance = this;
		}
	};

	nsMaterials.Iron.prototype.getColor = function(wireframe) {
		return new THREE.MeshBasicMaterial( { color: this.textureColor, wireframe: wireframe });
	};
})();