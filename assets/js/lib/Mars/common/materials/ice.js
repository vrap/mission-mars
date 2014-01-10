(function() {
	var nsMaterials = using('mars.common.material');

	/**
	 * Class Ice
	 * Represent the material ice with its color and its id in JSon file.
	 */
	nsMaterials.Ice = function() {
		this.id = 4;
		this.name = 'Ice';
		this.textureColor = "#e6e2df";
		this.texture = THREE.ImageUtils.loadTexture('./assets/img/textures/sand.jpg');
		this.texture.magFilter = THREE.NearestFilter;
		this.texture.minFilter = THREE.LinearMipMapLinearFilter;
		this.probability = 0.01;

		/* If already instancied, return instance (Singleton) */
		if (arguments.callee.instance) {
			return arguments.callee.instance;
		}
		else {
			arguments.callee.instance = this;
		}
	};

	nsMaterials.Ice.prototype.getColor = function(wireframe) {
		return new THREE.MeshPhongMaterial( { map: this.texture/*color: this.textureColor*/, wireframe: wireframe });
	};
})();