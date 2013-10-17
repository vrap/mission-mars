function viewer(element) {
	// Initialize the scene.
	this.scene = new THREE.Scene();
	this.element = $(element);

	// Add a camera
	this.camera = new THREE.PerspectiveCamera(
		75,
		window.innerWidth / window.innerHeight,
		0.1,
		1000
	);

	this.camera.position.z = 10;
	this.scene.add(this.camera);

	// controls
	this.controls = new THREE.FirstPersonControls(this.camera, element);
	
	// add an ambient lighting
	var ambientLight = new THREE.AmbientLight(0xbbbbbb);
	this.scene.add(ambientLight);

	// Create renderer, define the width/height and append to the dom.
	this.renderer = new THREE.WebGLRenderer({ antialias: false });
	this.renderer.setSize(window.innerWidth, window.innerHeight);

	this.element.append(this.renderer.domElement);
};

viewer.prototype.load2 = function(map) {
	var geometry = new THREE.PlaneGeometry(
		map.getWidth(),
		map.getHeight(),
		map.getWidth(),
		map.getHeight()
	);
	var material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );

	var texture = 'assets/img/textures/grass.jpg';
	var material = new THREE.MeshLambertMaterial({
		wireframe: true,
		map: THREE.ImageUtils.loadTexture(texture)
	});
	var cube = new THREE.Mesh( geometry, material );

	this.scene.add(cube);
}
viewer.prototype.load = function(map) {
	if (map instanceof Map) {
		this.map = map;
	}
	else {
		throw new TypeError('Need a Map object.');
	}

	this.geometry = new THREE.PlaneGeometry(
		this.map.getWidth(),
		this.map.getHeight(),
		this.map.getWidth(),
		this.map.getHeight()
	);

	var index = 0;
	for (var i = 0; i < this.map.getWidth(); i++) {
		for (var j = 0; j < this.map.getHeight(); j++) {
			this.geometry.vertices[index].z = this.map.map[i][j].z;
			index++;
		}
	}

	var texture = 'assets/img/textures/grass.jpg';
	var material = new THREE.MeshLambertMaterial({
		wireframe: false,
		map: THREE.ImageUtils.loadTexture(texture)
	});

	this.mesh = new THREE.Mesh(this.geometry, material);
	this.mesh.rotation.x = Math.PI / 180 * (-90);
	this.scene.add(this.mesh);
/*
*/
};

viewer.prototype.render = function() {
	this.controls.update(1);
	this.renderer.render(this.scene, this.camera);
};