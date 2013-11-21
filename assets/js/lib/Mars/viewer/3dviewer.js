(function() {
	var nsViewer = using('mars.viewer');

	/**
	 * [ description]
	 * @return {[type]}         [description]
	 */
	nsViewer.Viewer3D = function(viewer, element, options) {
		this.viewer = viewer;
		this.element = element;
		this.options = (options) ? options : {};

		this.init();
	};

	nsViewer.Viewer3D.prototype.init = function() {
		// Initialize the scene.
		this.scene = new THREE.Scene();

		this._loadLight();
		this._loadCamera();
		this._loadRenderer();
		this._loadMap();
		this._loadControls();

		// Add fog to the map.
		if (!(isNaN(parseFloat(this.options.fog)))) {
			this.scene.fog = new THREE.FogExp2(0xd3cfbe, parseFloat(this.options.fog));
		}

		// Run the refresh animation while.
		this.animate();
	};

	nsViewer.Viewer3D.prototype._loadRenderer = function() {
		// Create renderer, define the width/height and append to the dom.
		this.renderer = new THREE.WebGLRenderer({ antialias: false });
		this.renderer.setClearColor( 0xd3cfbe, 1 );
		this.renderer.setSize(window.innerWidth, window.innerHeight);

		this.element.appendChild(this.renderer.domElement);
	};

	nsViewer.Viewer3D.prototype._loadControls = function() {
		this.controls = new THREE.OrbitControls(this.camera);
	};

	nsViewer.Viewer3D.prototype._loadLight = function() {
		// add an ambient lighting
		var directionalLight = new THREE.DirectionalLight( 0xcca182, 0.9 );
		directionalLight.position.set( 0, 2, 0 );
		this.scene.add( directionalLight );
	};

	nsViewer.Viewer3D.prototype._loadCamera = function() {
		// Add a camera
		this.camera = new THREE.PerspectiveCamera(
			100,
			window.innerWidth / window.innerHeight,
			0.7,
			1100
		);

		this.camera.position.z = 14;
		this.camera.setLens( 1, 2 );
		this.scene.add(this.camera);
	};

	nsViewer.Viewer3D.prototype._loadMap = function() {
		this.geometry = new THREE.PlaneGeometry(
			this.viewer.map.getWidth(),
			this.viewer.map.getHeight(),
			this.viewer.map.getWidth(),
			this.viewer.map.getHeight()
		);

		var index = 0;
		for (var i = 0; i < this.viewer.map.getWidth(); i++) {
			for (var j = 0; j < this.viewer.map.getHeight(); j++) {
				this.geometry.vertices[index].z = this.viewer.map._terrain[i][j].z;
				index++;
			}
		}

		var texture = 'assets/img/textures/rock3.png';
		var material = new THREE.MeshLambertMaterial({
			wireframe: true,
			map: THREE.ImageUtils.loadTexture(texture)
		});

		this.mesh = new THREE.Mesh(this.geometry, material); 
		this.mesh.rotation.x = Math.PI / 180 * (-90);
		this.scene.add(this.mesh);
	};

	nsViewer.Viewer3D.prototype.render = function() {
		this.controls.update(1);
		this.renderer.render(this.scene, this.camera);
	};

	nsViewer.Viewer3D.prototype.animate = function() {
		requestAnimationFrame(function() { this.animate(); }.bind(this));
		this.render();
	};
})();