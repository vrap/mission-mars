(function() {
	var nsMaterials = using('mars.common.material');

	/**
	 * Class Rock
	 * Represent the material rock with its color and its id in JSon file.
	 */
	nsMaterials.Rock = function() {
		this.id = 0;
		this.name = 'Rock';
		this.textureColor = "#5c442c";
		this.texture = THREE.ImageUtils.loadTexture('./assets/img/textures/sand.jpg');
		this.texture.magFilter = THREE.NearestFilter;
		this.texture.minFilter = THREE.LinearMipMapLinearFilter;
		this.probability = 0.3;

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
	nsMaterials.Rock.prototype.getColor = function(wireframe, color) {
		if (true == color) {
			// Material color
			return new THREE.MeshPhongMaterial( { color: this.textureColor, wireframe: wireframe });
		}
		// Material texture image
		return new THREE.MeshPhongMaterial( { map: this.texture, wireframe: wireframe });
	};
})();