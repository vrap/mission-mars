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

		this._loadLight();
		this._loadCamera();
		this._loadRenderer();
		this._loadMap();
		this._loadControls();

		// Add fog to the map.
		this.scene.fog = new THREE.FogExp2( 0xd3cfbe, 0.03 );

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
		
		// assign z to each case
		var index = 0;
		var natures = [];
		for (var i = 0; i < this.viewer.map.getWidth(); i++) {
			for (var j = 0; j < this.viewer.map.getHeight(); j++) {
				this.geometry.vertices[index].z = this.viewer.map._terrain[i][j].z;
				// Stock the nature map attribute in an array. Two times because each case is devided in two triangles
				natures.push(this.viewer.map._terrain[i][j].nature-1);
				natures.push(this.viewer.map._terrain[i][j].nature-1);
				index++;
			}
		}

		// materials
		var materials = []; 
		materials.push( new THREE.MeshBasicMaterial( { color: "#6A6867" }) ); // Rock color
		materials.push( new THREE.MeshBasicMaterial( { color: "#E7D3C5" }) ); // Sand color
		materials.push( new THREE.MeshBasicMaterial( { color: "#ADF0F0" }) ); // Ice color
		materials.push( new THREE.MeshBasicMaterial( { color: "#C9A78E" }) ); // Iron color
		materials.push( new THREE.MeshBasicMaterial( { color: "#d2ab92" }) ); // Ore color
		materials.push( new THREE.MeshBasicMaterial( { color: "#3A3E41" }) ); // Other color

		// assign a material to each face
		for( var i = 0; i < this.geometry.faces.length; i ++ ) {
			this.geometry.faces[ i ].materialIndex = natures[i];
		}

		var material = new THREE.MeshFaceMaterial( materials );
		/*var texture = 'assets/img/textures/rock3.png';
		var material = new THREE.MeshLambertMaterial({
			wireframe: false,
			map: THREE.ImageUtils.loadTexture(texture)
		});*/

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