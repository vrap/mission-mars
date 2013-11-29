(function() {
	var nsMaterials = using('mars.common.material');

	/**
	 * Class Ice
	 * Represent the material ice with its color and its id in JSon file.
	 */
	nsMaterials.Ice = function() {
		this.id = 4;
		this.name = 'Ice';
		this.textureColor = "#ADF0F0";
		this.probability = 0.08;

		/* If already instancied, return instance (Singleton) */
		if (arguments.callee.instance) {
			return arguments.callee.instance;
		}
		else {
			arguments.callee.instance = this;
		}
	};

	nsMaterials.Ice.prototype.getColor = function(wireframe) {
		return new THREE.MeshBasicMaterial( { color: this.textureColor, wireframe: wireframe });
	};
})();