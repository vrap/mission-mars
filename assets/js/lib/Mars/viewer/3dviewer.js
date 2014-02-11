/**
 * Viwer 3D
 *
 * Configuration THREE library
 */
(function() {
	var nsViewer = using('mars.viewer'),
	 	nsMaterials = using('mars.common.material'),
    nsRover = using('mars.rover');

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
    	this.MAP_RATIO = 1.5;

    	this.positionMemory = new Array();

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
    	this._loadCamera(0, 5, 0); // Init camera's position on point North West
		this._loadRenderer();
		this._loadSkyBox();
		this._loadMap();
		this._loadMaterials();
		this._loadControls();
		this._loadFog();
		// Run the refresh animation while.
		this.animate();

		this.camera_x = 0;
        this.camera_y = 0;
        this.camera_z = 0;
        //camera.lookAt(new THREE.Vector3( 0, 50, (longueur_mur/2) ));

        this.camera.position.x = this.camera_x;
        this.camera.position.y = this.camera_y;
        this.camera.position.z = this.camera_z;

        this.targetPositionX = this.camera_x;
        this.targetPositionZ = this.camera_z;
        this.targetPositionY = this.camera_y;

        this.targetRotation = 0;
        this.targetRotationX = 0.6;

       	this.camera.rotation._x = 0;
        this.camera.rotation._y = 0;
        this.camera.rotation._z = 0;

        this.PI = Math.PI;

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
		this.renderer.setSize(window.innerWidth, window.innerHeight);
		this.element.appendChild(this.renderer.domElement);
	};

	/**
	 * Inits viewer controls
	 */
	nsViewer.Viewer3D.prototype._loadControls = function() {
		this.controls = new THREE.FirstPersonControls(this.camera, this.renderer.domElement);
		this.controls.movementSpeed = 0.001;
	    this.controls.lookSpeed = 0.001;
	    //this.controls.lookVertical = false;
	    this.controls.activeLook = true;
	    this.controls.control = this.options.cameraControl;
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
		this.camera.position.x = -75; // Frontward - Backward
		this.camera.position.y = 20; // Up - Down
		this.camera.position.z = -75; // Right - Left
		this.camera.setLens( 35 );
    	//this.camera.lookAt(new THREE.Vector3(-1.2*this.viewer.map.getWidth(), 10, this.viewer.map.getHeight())); // Point South West
		this.scene.add(this.camera);

	};

	/**
	 * Import the map in viewer
	 */
	nsViewer.Viewer3D.prototype._loadMap = function() {
		// Init plane
		this.geometry = new THREE.PlaneGeometry(
			// Size
			this.MAP_RATIO*(this.viewer.map.getWidth()),
      		this.MAP_RATIO*(this.viewer.map.getHeight()),
			// Vertices
			this.viewer.map.getWidth()-1,
			this.viewer.map.getHeight()-1
		);

		// Assign Z attribute
		var index = 0;
		for (var i = 0; i < this.viewer.map.getWidth(); i++) {

			this.positionMemory[i] = new Array();

			for (var j = 0; j < this.viewer.map.getHeight(); j++) {
				this.geometry.vertices[index].z = this.viewer.map._squares[i][j].z;

				if(index < 20){
					console.log(this.geometry.vertices[index]);
				}
				

				this.positionMemory[i][j] = {
					x : this.geometry.vertices[index].x,
					y : this.geometry.vertices[index].y,
					z : this.geometry.vertices[index].z
				}
				index++;
			}
		}

		console.log(this.positionMemory);
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
		  new THREE.CubeGeometry(this.viewer.map.getWidth()*2, this.viewer.map.getWidth()*2, this.viewer.map.getWidth()*2),
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

		var types = [];
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
				types.push(this.viewer.map._squares[i][j].type);
				types.push(this.viewer.map._squares[i][j].type);
			}
		}

		// Assign a material to each face
		for( var i = 0; i <= this.geometry.faces.length-1; i ++ ) {
			this.geometry.faces[ i ].materialIndex = types[i];
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
		this.controls.update(1);
		

		this.camera.position.x += ( this.targetPositionX - this.camera.position.x );
		this.camera.position.z += ( this.targetPositionZ - this.camera.position.z );
		this.camera.position.y += ( this.targetPositionY - this.camera.position.y );

		//console.log(this.camera.rotation);
		//this.camera.rotation._x += 0.23;
		//console.log(this.camera.rotation._x);

		// Le good
		// this.camera.rotation.y = this.targetRotation;
		// this.camera.rotation.x = 0.1111;
		// this.camera.rotation.z = 0.1111;

		//console.log(this.camera.rotation);
		//this.camera._x = 0.23;
		//this.camera.rotation.z = ( this.targetRotation - this.camera.rotation.y ) * 0.09;
		//this.camera.rotation.x = this.targetRotationX;

		this.renderer.render(this.scene, this.camera);

	};

	/**
	 * Animate the scene
	 */
	nsViewer.Viewer3D.prototype.animate = function() {
		requestAnimationFrame(function() { this.animate(); }.bind(this));
		this.render();
	};

	nsViewer.Viewer3D.prototype.move = function(data){
		console.log('in move');
		console.log('direction = ' + data.direction);

		var z = data.rover.map._terrain.map[data.newX][data.newY].z + 10;
		var d = 0.75 * this.viewer.map.getWidth() - (0.75 * this.viewer.map.getWidth()*2);
		var ratio = 3.08;

		// this.targetRotation = (-this.PI*6);
		// this.targetPositionX = d + (data.newX + ratio) ; // Frontward - Backward
		// this.targetPositionY = z; // Up - Down
		// this.targetPositionZ = d + (data.newY + ratio) ; // Right - Left

		this.targetPositionX = d + (data.newX + ratio); // Frontward - Backward
		this.targetPositionY  = z; // Up - Down
	    this.targetPositionZ = d + (data.newY + ratio); // Right - Left

   //  	switch (direction) {
			// case nsRover.Rover.DIRECTION.NORTH:

			// 	//this.targetRotationX = 0.06;
			// 	// this.camera.position.x = d + data.newX ; // Frontward - Backward
			// 	this.targetPositionY = z; // Up - Down
			// 	this.targetPositionZ = d + (data.newY + ratio); // Right - Left

			//     break;
			// case nsRover.Rover.DIRECTION.NORTH_EAST:

			// 	// ok
	  //       	//this.targetRotation = -2.403318379996192;
			// 	this.targetPositionX = d + (data.newX + ratio); // Frontward - Backward
			// 	this.targetPositionY  = z; // Up - Down
	  //       	this.targetPositionZ = d + (data.newY + ratio); // Right - Left

			//     break;
			// case nsRover.Rover.DIRECTION.NORTH_WEST:

			// 	this.targetPositionX = d + (data.newX + ratio) ; // Frontward - Backward
			// 	this.targetPositionY = z; // Up - Down
			// 	this.targetPositionZ = d + (data.newY + ratio) ; // Right - Left

			//     break;
			// case nsRover.Rover.DIRECTION.SOUTH:

			// 	//this.camera.position.x = d + data.newX ; // Frontward - Backward
			// 	this.targetPositionY = z; // Up - Down
			// 	this.targetPositionZ = d + (data.newY + ratio); // Right - Left

			//     break;
			// case nsRover.Rover.DIRECTION.SOUTH_EAST:

			// 	this.targetPositionX = d + (data.newX + ratio) ; // Frontward - Backward
			// 	this.targetPositionY = z; // Up - Down
			// 	this.targetPositionZ = d + (data.newY + ratio) ; // Right - Left

			//     break;
			// case nsRover.Rover.DIRECTION.SOUTH_WEST:

			// 	//this.targetRotation = 2.403318379996192;
			// 	this.targetPositionX = d + (data.newX + ratio); // Frontward - Backward
			// 	this.targetPositionY = z; // Up - Down
	  //       	this.targetPositionZ = d + (data.newY + ratio); // Right - Left

			//     break;
			// case nsRover.Rover.DIRECTION.EAST:

			// 	// ok
			// 	//this.targetRotation = -1.403318379996192 ;
			// 	this.targetPositionX = d + (data.newX + ratio) ; // Frontward - Backward
			// 	this.targetPositionY = z; // Up - Down
			// 	this.targetPositionZ = d + (data.newY + ratio) ; // Right - Left

			//     break;
			// case nsRover.Rover.DIRECTION.WEST:

			// 	//this.targetRotation = (-PI*2);
			// 	this.targetPositionX = d + data.newX ; // Frontward - Backward
			// 	this.targetPositionY = z; // Up - Down
			// 	//this.camera.position.z = d + (data.newY + ratio) ; // Right - Left

			//     break;
			// }

		

		//this.camera.setRotateX( getRandomInt(1, 10) + 89 );
		//this.camera.setRotateY( this.positionMemory[data.newX][data.newY].y + 89 );

	}

  /**
   * Change camera's position in the direction wanted.
   */
  nsViewer.Viewer3D.prototype.move_old = function(direction) {
    	if(false === this.options.cameraControl) {
	      switch(direction){
	        case nsRover.Rover.DIRECTION.NORTH:
	          this.controls.moveForward = true;
	          this.controls.moveBackward = false;
	          this.controls.moveRight = false;
	          this.controls.moveLeft = false;
	          break;
	        case nsRover.Rover.DIRECTION.SOUTH:
	          this.controls.moveForward = false;
	          this.controls.moveBackward = true;
	          this.controls.moveRight = false;
	          this.controls.moveLeft = false;
	          break;
	        case nsRover.Rover.DIRECTION.WEST:
	          this.controls.moveForward = false;
	          this.controls.moveBackward = false;
	          this.controls.moveRight = false;
	          this.controls.moveLeft = true;
	          break;
	        case nsRover.Rover.DIRECTION.EAST:
	          this.controls.moveForward = false;
	          this.controls.moveBackward = false;
	          this.controls.moveRight = true;
	          this.controls.moveLeft = false;
	          break;
	        case nsRover.Rover.DIRECTION.NORTH_EAST:
	          this.controls.moveForward = true;
	          this.controls.moveBackward = false;
	          this.controls.moveRight = true;
	          this.controls.moveLeft = false;
	          break;
	        case nsRover.Rover.DIRECTION.NORTH_WEST:
	          this.controls.moveForward = true;
	          this.controls.moveBackward = false;
	          this.controls.moveRight = false;
	          this.controls.moveLeft = true;
	          break;
	        case nsRover.Rover.DIRECTION.SOUTH_EAST:
	          this.controls.moveForward = false;
	          this.controls.moveBackward = true;
	          this.controls.moveRight = true;
	          this.controls.moveLeft = false;
	          break;
	        case nsRover.Rover.DIRECTION.SOUTH_WEST:
	          this.controls.moveForward = false;
	          this.controls.moveBackward = true;
	          this.controls.moveRight = false;
	          this.controls.moveLeft = true;
	          break;
	        default :
	          this.controls.moveForward = false;
	          this.controls.moveBackward = false;
	          this.controls.moveRight = false;
	          this.controls.moveLeft = false;
      		}
    	}
	};
})();
