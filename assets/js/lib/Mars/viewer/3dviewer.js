(function() {
	var nsViewer = using('mars.viewer');

	/**
	 * [ description]
	 * @return {[type]}         [description]
	 */
	nsViewer.Viewer3D = function(viewer, element) {
		this.viewer = viewer;
		this.element = element;

		this.init();
	};

	nsViewer.Viewer3D.prototype.init = function() {
		// Initialize the scene.
		this.scene = new THREE.Scene();

		this._loadControls();
		this._loadLight();
		this._loadCamera();
		this._loadRenderer();

		// Add fog to the map.
		this.scene.fog = new THREE.FogExp2( 0xd3cfbe, 0.03 );
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
})();