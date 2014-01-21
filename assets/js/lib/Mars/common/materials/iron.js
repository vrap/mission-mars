(function() {
	var nsMaterials = using('mars.common.material');

	/**
	 * Class Iron
	 * Represent the material iron with its color and its id in JSon file.
	 */
	nsMaterials.Iron = function() {
		this.id = 3;
		this.name = 'Iron';
		this.textureColor = "#43371f";
		this.texture = THREE.ImageUtils.loadTexture('./assets/img/textures/rock.jpg');
		this.texture.magFilter = THREE.NearestFilter;
		this.texture.minFilter = THREE.LinearMipMapLinearFilter;
		this.probability = 0.02;

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
	nsMaterials.Iron.prototype.getColor = function(wireframe, color) {
		if (true == color) {
			// Material color
			return new THREE.MeshPhongMaterial( { color: this.textureColor, wireframe: wireframe });
		}
		// Material texture image
		return new THREE.MeshPhongMaterial( { map: this.texture, wireframe: wireframe });
	};
})();