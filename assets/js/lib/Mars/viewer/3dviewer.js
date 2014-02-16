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
    	this.MAP_RATIO = 1;
	this.RATIO_Z = 5;

    	this.positionMemory = new Array();

	this.element = element;
	this.options = (options) ? options : {};
	this.options.wireframe = this.options.wireframe || false;
	this.options.axis = this.options.axis || false;
	this.options.cameraControl = this.options.cameraControl || false;
	this.init();
    };

    /**
     * Intialization
     */
    nsViewer.Viewer3D.prototype.init = function() {
	/* 3D viewer initialization */
	this.viewer._observer.publish('viewer.3d.init', [{'progress': 0}]);

	// Initialize the scene.
	this.scene = new THREE.Scene();

	// Load every parts of the viewer
	this._loadLight();
	this.viewer._observer.publish('viewer.3d.init', [{'progress': 10}]);

	this._loadCamera();
	this.viewer._observer.publish('viewer.3d.init', [{'progress': 20}]);

	this._loadRenderer();
	this.viewer._observer.publish('viewer.3d.init', [{'progress': 30}]);

	this._loadSkyBox();
	this.viewer._observer.publish('viewer.3d.init', [{'progress': 40}]);

	this._loadMap();
	this.viewer._observer.publish('viewer.3d.init', [{'progress': 50}]);

	this._loadMaterials();
	this.viewer._observer.publish('viewer.3d.init', [{'progress': 60}]);

	this._loadControls();
	this.viewer._observer.publish('viewer.3d.init', [{'progress': 70}]);

	this._loadFog();
	this.viewer._observer.publish('viewer.3d.init', [{'progress': 80}]);

	this._loadAxis();
	this.viewer._observer.publish('viewer.3d.init', [{'progress': 90}]);

	// Run the refresh animation while.
	this.animate();
	this.viewer._observer.publish('viewer.3d.init', [{'progress': 100}]);
    };

    /**
     * If the option is enabled, add an axis helper at the origin of the map.
     */
    nsViewer.Viewer3D.prototype._loadAxis = function() {
	if (this.options.axis == true) {
	    /* Create an axis and add it to the scene. */
	    looker = new THREE.AxisHelper(5);
	    this.scene.add(looker);
	    
	    /* Define the line width of the axis. */
	    looker.material.linewidth = 3;
	    
	    /* Position the axis helper at the map origin. */
	    looker.position.x = -(parseInt(this.viewer.map.getWidth() /2) * this.MAP_RATIO);
	    looker.position.y = 10;
	    looker.position.z = -(parseInt(this.viewer.map.getHeight() /2) * this.MAP_RATIO);
	}
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
	this.controls.lookVertical = this.options.cameraControl;
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
    nsViewer.Viewer3D.prototype._loadCamera = function() {
	this.camera = new THREE.PerspectiveCamera(
	    75,
	    window.innerWidth / window.innerHeight,
	    1,
	    1000
	);

	/*this.camera.position.x = 0;
	  this.camera.position.y = 0;
	  this.camera.position.z = 0;*/
	this.camera.setLens( 12 );

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
		this.geometry.vertices[index].z = this.viewer.map._squares[i][j].z / this.RATIO_Z;
		this.positionMemory[i][j] = {
		    x : this.geometry.vertices[index].x,
		    y : this.geometry.vertices[index].y,
		    z : this.geometry.vertices[index].z
		}
		index++;
	    }
	}
    }

    /**
     * Add a sky box
     */
    nsViewer.Viewer3D.prototype._loadSkyBox = function() {
	var urls = [
	    './assets/img/sky2/4.jpg',
	    './assets/img/sky2/2.jpg',
	    './assets/img/sky2/6.jpg',
	    './assets/img/sky2/5.jpg',
	    './assets/img/sky2/1.jpg',
	    './assets/img/sky2/3.jpg'
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
  	if(this.options.cameraControl == false){
  	    this.camera.position.x = this.targetPositionX;
    	    this.camera.position.z = this.targetPositionZ;
    	    this.camera.position.y = this.targetPositionY / this.RATIO_Z;
    	    this.camera.lookAt(new THREE.Vector3(this.newtargetPositionX, this.targetPositionY / this.RATIO_Z, this.newtargetPositionZ));
  	}

	this.renderer.render(this.scene, this.camera);

    };


    nsViewer.Viewer3D.prototype.mapToThree = function(x, z) {
	var origin = -(parseInt(this.viewer.map.getWidth() /2) * this.MAP_RATIO);

	resultX = origin + (x * this.MAP_RATIO);
	resultZ = origin + (z * this.MAP_RATIO);

	return { x: resultX, z: resultZ };
    };

    /**
     * Animate the scene
     */
    nsViewer.Viewer3D.prototype.animate = function() {
	requestAnimationFrame(function() { this.animate(); }.bind(this));
	this.render();
    };

    nsViewer.Viewer3D.prototype.move = function(data){
	if (!data.error) {
	    var y = data.rover.map._terrain.map[data.lastX][data.lastY].z + 10;
	    var lastCoord = this.mapToThree(data.lastX, data.lastY);
	    var newCoord = this.mapToThree(data.newX, data.newY);

	    this.targetPositionX = lastCoord.x;
	    this.targetPositionZ = lastCoord.z;
	    this.targetPositionY = y;

	    this.newtargetPositionX = newCoord.x;
	    this.newtargetPositionZ = newCoord.z;
	}
    }
})();
