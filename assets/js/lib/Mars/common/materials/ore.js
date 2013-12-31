(function() {
	var nsMaterials = using('mars.common.material');

	/**
	 * Class Ore
	 * Represent the material ore with its color and its id in JSon file.
	 */
	nsMaterials.Ore = function() {
		this.id = 2;
		this.name = 'Ore';
		this.textureColor = "#4c3515";
		this.texture = THREE.ImageUtils.loadTexture('./assets/img/textures/sand.jpg');
		this.texture.magFilter = THREE.NearestFilter;
		this.texture.minFilter = THREE.LinearMipMapLinearFilter;
		this.probability = 0.2;

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
	nsMaterials.Ore.prototype.getColor = function(wireframe) {
		return new THREE.MeshPhongMaterial( { map: this.texture/*color: this.textureColor*/, wireframe: wireframe });
	};
})();