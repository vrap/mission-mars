/**
 * Viwer 3D
 *
 * Configuration THREE library
 */
(function() {
	var nsViewer = using('mars.viewer'),
	 	nsMaterials = using('mars.common.material');

	// Init materials
	var rock = new nsMaterials.Rock (),
		iron = new nsMaterials.Iron (),
		ice = new nsMaterials.Ice (),
		ore = new nsMaterials.Ore (),
		sand = new nsMaterials.Sand (),
		other = new nsMaterials.Other ();

	/**
	 * Constructor
	 */
	nsViewer.Viewer3D = function(viewer, element, options) {
		this.viewer = viewer;
		this.element = element;
		this.options = (options) ? options : {};
		this.options.wireframe = this.options.wireframe || false;
		this.options.cameraControl = this.options.cameraControl || false;
		this.init();
	};

	/**
	 * Intialization
	 */
	nsViewer.Viewer3D.prototype.init = function() {
		// Initialize the scene.
		this.scene = new THREE.Scene();
		// Load every parts of the viewer
		this._loadLight();
		this._loadCamera(-(0.8*this.viewer.map.getWidth()), 4, 0);
		this._loadRenderer();
		this._loadSkyBox();
		this._loadMap();
		this._loadMaterials();
		if(this.options.cameraControl) {
			this._loadControls();
		}
		this._loadFog();
		// Run the refresh animation while.
		this.animate();
	};

	/**
	 * Add fog to the map.
	 * User choose how much he wants fog.
	 */
	nsViewer.Viewer3D.prototype._loadFog = function() {
		if (!(isNaN(parseFloat(this.options.fog)))) {
			this.scene.fog = new THREE.FogExp2(0xd3cfbe, parseFloat(this.options.fog));
		}
	};

	/**
	 * Create renderer, define the width/height and append to the dom.
	 */
	nsViewer.Viewer3D.prototype._loadRenderer = function() {
		this.renderer = new THREE.WebGLRenderer();
		this.renderer.rendererSize = {width: window.innerWidth, height: window.innerHeight, quality: 100, maxQuality: 400, minQuality: 20};
		this.renderer.setSize(window.innerWidth, window.innerHeight);
		this.element.appendChild(this.renderer.domElement);
	};

	/**
	 * Inits viewer controls
	 */
	nsViewer.Viewer3D.prototype._loadControls = function() {
		this.controls = new THREE.FirstPersonControls(this.camera, this.renderer.domElement);
		this.controls.movementSpeed = 1;
    this.controls.lookSpeed = 0.001;
    this.controls.lookVertical = true;
    // Control camera if user wants it.
    this.controls.activeLook = this.options.cameraControl;
	};

	/**
	 * Add an ambient lighting.
	 */
	nsViewer.Viewer3D.prototype._loadLight = function() {
		var hemisphereLight = new THREE.HemisphereLight( 0xcca182, 0xd3a476, 0.9 );
		this.scene.add( hemisphereLight );
	};

	/**
	 * Add a camera
	 */
	nsViewer.Viewer3D.prototype._loadCamera = function(x, y, z) {
		this.camera = new THREE.PerspectiveCamera(
			75,
			window.innerWidth / window.innerHeight,
			1,
			1000
		);
		this.camera.position.x = x; // Frontward - Backward
		this.camera.position.y = y; // Up - Down
		this.camera.position.z = z; // Right - Left
		this.camera.setLens( 50 );
		this.camera.rotateOnAxis((new THREE.Vector3(0, 1, 0)).normalize(), degToRad(-90));
		this.scene.add(this.camera);
	};

	/**
	 * Import the map in viewer
	 */
	nsViewer.Viewer3D.prototype._loadMap = function() {
		// Init plane
		this.geometry = new THREE.PlaneGeometry(
			// Size
			1.5*(this.viewer.map.getWidth()),
			1.5*(this.viewer.map.getHeight()),
			// Vertices
			this.viewer.map.getWidth()-1,
			this.viewer.map.getHeight()-1
		);

		// Assign Z attribute
		var index = 0;
		for (var i = 0; i < this.viewer.map.getWidth(); i++) {
			for (var j = 0; j < this.viewer.map.getHeight(); j++) {
				this.geometry.vertices[index].z = this.viewer.map._squares[i][j].z;
				index++;
			}
		}
	}

	/**
	 * Add a sky box
	 */
	nsViewer.Viewer3D.prototype._loadSkyBox = function() {
		var urls = [
		  './assets/img/sky/4.jpg',
		  './assets/img/sky/2.jpg',
		  './assets/img/sky/6.jpg',
		  './assets/img/sky/5.jpg',
		  './assets/img/sky/1.jpg',
		  './assets/img/sky/3.jpg'
		];

		var cubemap = THREE.ImageUtils.loadTextureCube(urls); // load textures
		cubemap.format = THREE.RGBFormat;

		var shader = THREE.ShaderLib['cube']; // init cube shader from built-in lib
		shader.uniforms['tCube'].value = cubemap; // apply textures to shader

		// create shader material
		var skyBoxMaterial = new THREE.ShaderMaterial( {
		  fragmentShader: shader.fragmentShader,
		  vertexShader: shader.vertexShader,
		  uniforms: shader.uniforms,
		  depthWrite: false,
		  side: THREE.BackSide
		});

		// create skybox mesh
		var skybox = new THREE.Mesh(
		  new THREE.CubeGeometry(1000, 1000, 1000),
		  skyBoxMaterial
		);

		this.scene.add(skybox);
	}

	/**
	 * Add materials colors
	 */
	nsViewer.Viewer3D.prototype._loadMaterials = function() {
		// When a mesh already exists
		if(undefined !== this.mesh) {
			this.scene.remove(this.mesh);
		}

		var natures = [];
		// Materials
		var materials = []; 
		materials[rock.id] = rock.getColor(this.options.wireframe, false);
		materials[sand.id] = sand.getColor(this.options.wireframe, false);
		materials[ore.id] = ore.getColor(this.options.wireframe, false);
		materials[iron.id] = iron.getColor(this.options.wireframe, false);
		materials[ice.id] = ice.getColor(this.options.wireframe, false);
		materials[other.id] = other.getColor(this.options.wireframe, false);
		
		// Save colors
		for (var i = 0; i < this.viewer.map.getWidth()-1; i++) {
			for (var j = 0; j < this.viewer.map.getHeight()-1; j++) {
				natures.push(this.viewer.map._squares[i][j].nature);
				natures.push(this.viewer.map._squares[i][j].nature);
			}
		}

		// Assign a material to each face
		for( var i = 0; i <= this.geometry.faces.length-1; i ++ ) {
			this.geometry.faces[ i ].materialIndex = natures[i];
		}

		// Init the mesh
		var material = new THREE.MeshFaceMaterial( materials );
		this.mesh = new THREE.Mesh(this.geometry, material); 
		this.mesh.rotation.x = Math.PI / 180 * (-90);

		this.scene.add(this.mesh);
	};

	/**
	 * Renders the scene
	 */
	nsViewer.Viewer3D.prototype.render = function() {
		if(this.options.cameraControl) {
			this.controls.update(1);
		}
		this.renderer.render(this.scene, this.camera);
	};

	/**
	 * Animate the scene
	 */
	nsViewer.Viewer3D.prototype.animate = function() {
		requestAnimationFrame(function() { this.animate(); }.bind(this));
		this.render();
	};

	/**
	 * Move camera in the direction wanted.
	 */
	nsViewer.Viewer3D.prototype.move = function(direction) {
		switch(direction){
			case 'straight': 
				this.camera.position.x++; 
				break;
			case 'back': 
				this.camera.position.x--;
				break;
			case 'left':
				this.camera.position.z++; 
				this.camera.rotateOnAxis((new THREE.Vector3(0, 1, 0)).normalize(), degToRad(90));
				break;
			case 'right': 
				this.camera.position.z--; 
				this.camera.rotateOnAxis((new THREE.Vector3(0, 1, 0)).normalize(), degToRad(-90));
				break;
			case 'up':
				this.camera.rotateOnAxis((new THREE.Vector3(1, 0, 0)).normalize(), degToRad(45));
				break;
			case 'down': 
				this.camera.rotateOnAxis((new THREE.Vector3(1, 0, 0)).normalize(), degToRad(-45));
				break;
		}
	};
})();