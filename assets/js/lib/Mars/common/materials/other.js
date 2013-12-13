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
		//this.texture = THREE.ImageUtils.loadTexture('./assets/img/textures/XXXX.jpg');
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
	nsMaterials.Other.prototype.getColor = function(wireframe) {
		return new THREE.MeshPhongMaterial( { /*map: this.texture*/color: this.textureColor, wireframe: wireframe });
	};
})();