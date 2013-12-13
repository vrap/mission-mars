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
		//this.controls = new THREE.OrbitControls(this.camera);
		this.controls = new THREE.FirstPersonControls(this.camera);
		this.controls.movementSpeed = 0.1;
        this.controls.lookSpeed = 0.002;
        this.controls.lookVertical = true;
        this.controls.activeLook = false;
	};

	nsViewer.Viewer3D.prototype._loadLight = function() {
		// add an ambient lighting
		var hemisphereLight = new THREE.HemisphereLight( 0xcca182, 0xd3a476, 0.9 );
		this.scene.add( hemisphereLight );
	};

	nsViewer.Viewer3D.prototype._loadCamera = function() {
		// Add a camera
		this.camera = new THREE.PerspectiveCamera(
			75,
			window.innerWidth / window.innerHeight,
			0.7,
			1100
		);
		this.camera.position.x = -30;
		this.camera.position.y = 1.5;
		this.camera.position.z = 0;
		this.camera.setLens( 1, 2 );
		this.scene.add(this.camera);
	};


	nsViewer.Viewer3D.prototype._loadMap = function() {
		this.geometry = new THREE.PlaneGeometry(
			60,
			60,
			this.viewer.map.getWidth()-1,
			this.viewer.map.getHeight()-1
		);
		
		var index = 0;
		var natures = [];
		// materials
		var materials = []; 
		materials[rock.id] = rock.getColor(true);
		materials[sand.id] = sand.getColor(true);
		materials[ore.id] = ore.getColor(true);
		materials[iron.id] = iron.getColor(true);
		materials[ice.id] = ice.getColor(true);
		materials[other.id] = other.getColor(true);
		
		// Assign Z attribute
		for (var i = 0; i < this.viewer.map.getWidth(); i++) {
			for (var j = 0; j < this.viewer.map.getHeight(); j++) {
				this.geometry.vertices[index].z = this.viewer.map._squares[i][j].z;
				index++;
			}
		}



		// Save colors
		for (var i = 0; i < this.viewer.map.getWidth()-1; i++) {
			for (var j = 0; j < this.viewer.map.getHeight()-1; j++) {
				natures.push(this.viewer.map._squares[i][j].nature);
				natures.push(this.viewer.map._squares[i][j].nature);
			}
		}

		// assign a material to each face
		for( var i = 0; i <= this.geometry.faces.length-1; i ++ ) {
			this.geometry.faces[ i ].materialIndex = natures[i];
		}

		var material = new THREE.MeshFaceMaterial( materials );

		this.mesh = new THREE.Mesh(this.geometry, material); 
		this.mesh.rotation.x = Math.PI / 180 * (-90);
		this.scene.add(this.mesh);



	};

	nsViewer.Viewer3D.prototype.render = function() {
		//this.renderer.setSize( 650, 650 );
		this.controls.update(1);
		this.renderer.render(this.scene, this.camera);
	};

	nsViewer.Viewer3D.prototype.animate = function() {
		requestAnimationFrame(function() { this.animate(); }.bind(this));
		this.render();
	};
})();
