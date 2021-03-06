(function() {
	var nsMaterials = using('mars.common.material');

	/**
	 * Class Oter
	 * Represent the others materials with their color and thier id in JSon file.
	 */
	nsMaterials.Other = function() {
		this.id = 5;
		this.name = 'Other';
		this.textureColor = "#ab7f52";
		this.texture = THREE.ImageUtils.loadTexture('./assets/img/textures/sand.jpg');
		this.texture.magFilter = THREE.NearestFilter;
		this.texture.minFilter = THREE.LinearMipMapLinearFilter;
		this.probability = 0.07;

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
	nsMaterials.Other.prototype.getColor = function(wireframe, color) {
		if (true == color) {
			// Material color
			return new THREE.MeshPhongMaterial( { color: this.textureColor, wireframe: wireframe });
		}
		// Material texture image
		return new THREE.MeshPhongMaterial( { map: this.texture, wireframe: wireframe });
	};
})();