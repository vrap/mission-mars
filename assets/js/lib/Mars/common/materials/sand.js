(function() {
	var nsMaterials = using('mars.common.material');

	/**
	 * Class Sand
	 * Represent the material sand with its color and its id in JSon file.
	 */
	nsMaterials.Sand = function() {
		this.id = 1;
		this.name = 'Sand';
		this.textureColor = "#825c38";
		this.texture = THREE.ImageUtils.loadTexture('./assets/img/textures/sand.jpg');
		this.texture.magFilter = THREE.NearestFilter;
		this.texture.minFilter = THREE.LinearMipMapLinearFilter;
		this.probability = 0.4;

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
	nsMaterials.Sand.prototype.getColor = function(wireframe) {
		return new THREE.MeshPhongMaterial( { map: this.texture/*color: this.textureColor*/, wireframe: wireframe });
	};
})();