(function() {
	var nsMaterials = using('mars.common.material');

	/**
	 * Class Rock
	 * Represent the material rock with its color and its id in JSon file.
	 */
	nsMaterials.Rock = function() {
		this.id = 0;
		this.name = 'Rock';
		this.textureColor = "#6a6867";
		this.probability = 0.35;

		/* If already instancied, return instance (Singleton) */
		if (arguments.callee.instance) {
			return arguments.callee.instance;
		}
		else {
			arguments.callee.instance = this;
		}
	};
	
	/**
	 * @param {boolean}
	 * @return {THREE.MeshBasicMaterial} Instance of THREE.MeshBasicMaterial with the texture color and wireframe
	 */
	nsMaterials.Rock.prototype.getColor = function(wireframe) {
		return new THREE.MeshBasicMaterial( { color: this.textureColor, wireframe: wireframe });
	};
})();