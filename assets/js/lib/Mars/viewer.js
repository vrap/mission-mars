function viewer(element) {
	// Initialize the scene.
	this.scene = new THREE.Scene();
	this.element = $(element);

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

	// controls
	this.controls = new THREE.OrbitControls(this.camera);
	
	// add an ambient lighting
	var directionalLight = new THREE.DirectionalLight( 0xcca182, 0.9 );
	directionalLight.position.set( 0, 2, 0 );
	this.scene.add( directionalLight );

	// var spotLight = new THREE.SpotLight( 0xffffff );
	// spotLight.position.set( 100, 150, 500 );
	// spotLight.castShadow = true;
	// this.scene.add( spotLight );
	
	//brume
	//this.scene.fog = new THREE.FogExp2( 0xd3cfbe, 0.03 );

	// Create renderer, define the width/height and append to the dom.
	this.renderer = new THREE.WebGLRenderer({ antialias: false });
	this.renderer.setClearColor( 0xd3cfbe, 1 );
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
		wireframe: false,
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

	/*
	+ --------------------------------- +
	| 	Génération de l'image textures  |
	+ --------------------------------- +
	*/

	var colorArray = new Array();
	colorArray[0] = new Array("#ADF0F0", "#c9d3d3", "#cacdc9", "#cbc7c0", "#ccc1b7", "#cebcad",
		"#cfb6a4", "#d0b09b", "#d2ab92", "#c9a58f", "#c4a38e", "#bc9f8b", "#b39b89",
		"#aa9786", "#a29383", "#958d80", "#7b746a", "#756e64");

	colorArray[1] = new Array("#EDDED4", "#E7D3C5", "#ddc1ad", "#d2b8a6", "#c8b0a0", "#bda899",
		"#b3a093", "#a8988d", "#9e9086", "#89807a", "#7f7873", "#74706d", "#6a6867",
		"#5f6060", "#55585a", "#4b5054", "#43484C", "#3A3E41");

	colorArray[2] = new Array("#EDDED4", "#E7D3C5", "#ddc1ad", "#ccae9f", "#c4a599", "#bc9c92",
		"#b4928c", "#ac8985", "#a4807f", "#9b7778", "#936e71", "#8b646b", "#835b64",
		"#7b525e", "#734957", "#6b4050", "#593643", "#4D2E39");

	colorArray[3] = new Array("#D1B9A9", "#d4ae93", "#cfab91", "#c9a78e", "#c4a48c", "#bea08a",
		"#c4a48c", "#bea08a", "#b99d88", "#b39985", "#ad9583", "#a89281", "#a28e7e",
		"#9d8b7c", "#97877a", "#928478", "#928478", "#928478");

	// Initialisation du canvas
	c = document.getElementById("image");
	var ctx = c.getContext("2d");

	// Initialisation de la position de depard de desson
	var positionX = 0;
	var positionY = 0;
	var ValPixel = 10;
		
	// Parcour du tableau
	for (var i = 0; i < this.map.getHeight(); i++) {

		// Test quand on est plus sur la ligne du dépard.
		if(i != 0 ){
			positionY = positionY+ValPixel; // Dans ce cas valPixel est Ajouter a positionZ
			positionX = 0;	// et la positionX est remise à zero.				
		}

		var color;
		for (var b = 0; b < this.map.getWidth(); b++){
			// Gros truc just pour atribuer la couleur par rapport à l'altitude ..
			switch (this.map.map[i][b].z) 
				{ 
				case 14: 
					color = colorArray[3][0];
				break; 
				case 13: 
					color = colorArray[3][1];
				break; 
				case 12: 
					color = colorArray[3][2]; 
				break; 
				case 11: 
					color = colorArray[3][3]; 
				break; 
				case 10: 
					color = colorArray[3][4]; 
				break; 
				case 9: 
					color = colorArray[3][5];
				break; 
				case 8: 
					color = colorArray[3][6]; 
				break; 
				case 7: 
					color = colorArray[3][7]; 
				break;
				case 6: 
					color = colorArray[3][8]; 
				break; 
				case 5: 
					color = colorArray[3][9]; 
				break; 
				case 4: 
					color = colorArray[3][10]; 
				break; 
				case 3: 
					color = colorArray[3][11];
				break; 
				case 2: 
					color = colorArray[3][12]; 
				break; 
				case 1: 
					color = colorArray[3][13]; 
				break; 
				case 0: 
					color = colorArray[3][14]; 
				break; 
				case -1: 
					color = colorArray[3][15]; 
				break; 
				case -2: 
					color = colorArray[3][16]; 
				break; 
				case -3: 
					color = colorArray[3][17]; 
				break;
				}

			// Affichage d'un carré
			ctx.beginPath();      // Début du chemin
			ctx.moveTo(positionX,positionY);   // point depart
			ctx.lineTo(positionX,positionY+ValPixel);  // Un segment 
			ctx.lineTo(positionX+ValPixel,positionY+ValPixel);  // Un segment 
			ctx.lineTo(positionX+ValPixel,positionY);  // Un segment 
			ctx.closePath();      // Fermeture du chemin
			ctx.fillStyle = color; // couleur de remplissage
			ctx.fill();           // Remplissage

			positionX = positionX+ValPixel; // ValPixel est ajouter la positionXpour faire avencer le dessin

		}
	}


	// enregistrer l'image.
	var dataURL = c.toDataURL("image/png");
	$.ajax({
  	type: "POST",
  	url: "script.php",
  	data: { dataURL: dataURL }
	})

	/*
	+ --------------------------------- +
	| 	Rendu						    |
	+ --------------------------------- +
	*/	

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

	var texture = 'assets/img/textures/rock3.png';
	var material = new THREE.MeshLambertMaterial({
		wireframe: false,
		map: THREE.ImageUtils.loadTexture(texture)
	});

	this.mesh = new THREE.Mesh(this.geometry, material);
	this.mesh.rotation.x = Math.PI / 180 * (-90);
	this.scene.add(this.mesh);

};

viewer.prototype.render = function() {
	this.controls.update(1);
	this.renderer.render(this.scene, this.camera);
};