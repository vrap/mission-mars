(function() {
	var nsEditor   = using('mars.editor');
	var nsElements = using('mars.editor.elements');

	/**
	 * TerrainGenerator
	 * "Static class" to generate a terrain.
	 */

	/**
	 * [TerrainGenerator description]
	 * @type {Object}
	 */
	nsEditor.TerrainGenerator = {
		_width: null,
		_height: null,
		_zMin: null,
		_zMax: null,
		_materials: [],
		_elements: []
	};

	/**
	 * [ description]
	 * @return {[type]} [description]
	 */
	nsEditor.TerrainGenerator._createBase = function() {

		/* Base */
		for (var i = 0; i < this._width; i++) {
			this._map[i] = new Array();
			for (var j = 0; j < this._height; j++) {
				this._map[i][j] = { z: 0,
					nature: this._getFloorType()
				};
			}
		}

		/*--------------------*
		|	Elevation du z    |
		*--------------------*/


		console.log(this._width * this._height/12);
		/* Boucle général */
		var count = 0;
		while(count < Math.round(this._width * this._height/12) ){

			/* Tous les 2 tours inverser la map
			à l'aide d'un clone de la map */
			if(count % 2){
				for (var i = 0; i < this._width; i++) {
					for (var j = 0; j < this._height; j++) {
						this._map[i][j].z = reversMap[i][j].z;
					}
				}
			}else{
				for (var i = 0; i < this._width-1; i++) {
					if(i+1 >= this._width){
						for (var j = 0; j < this._height-1; j++) {
							if(j+1 >= this._height){
								this._map[j+1][j+1].z = reversMap[i][j].z;
							}
							
						}
					}
					
				}
			}

			/* Random des points à éléver sur la map */
			var width = getRandomInt(0, this._width );
			var height = getRandomInt(0, this._height);
			var startWidth = getRandomInt(0, this._width);
			var startHeight = getRandomInt(0, this._height);

			/* Élévation des points */
			for (var i = startWidth; i < width; i++) {
				for (var j = startHeight; j < height; j++) {
					this._map[i][j].z += 0.2;
				}
				height--; // <= pour avoir des dessins en diagonale
			}

			/* Random des points à diminuer sur la map */
			var width = getRandomInt(0, this._width );
			var height = getRandomInt(0, this._height);
			var startWidth = getRandomInt(0, this._width);
			var startHeight = getRandomInt(0, this._height);

			/* Diminution des points */
			for (var i = startWidth; i < width; i++) {
				for (var j = startHeight; j < height; j++) {
					this._map[i][j].z -= 0.2;
				}
				height--;

			}
			count++;

			/* Création du clone de la map */
			var reversMap = new Array();
			for (var i = 0; i < this._width; i++) {
				reversMap[i] = new Array();
				for (var j = 0; j < this._height; j++) {
					reversMap[i][j] = {z: this._map[j][i].z }
				}
			}
		}


		/*--------------------*
		|	Smoothing         |
		*--------------------*/

		var countPassages = 0;
		var nbPassage = 1;
		// Inisialisation des variables :
		var square1, square2, square3, square4, square5, square6, square7, square8, square9;
		var squareX, squareY;

		var count = 0;
		var squareMax = this._width * this._height;

		// Boucle pour parcourir le tableau
		while(count < squareMax){

			// Récupération d'un case au hazard dans la grille
			squareX = getRandomInt(3, this._width-3);
			squareY = getRandomInt(3, this._height-3);

			// Si la case est au bord de la map, la décalé.
			if(squareX <= 2){ squareX++; }
			if(squareY <= 2){ squareY++; }

			// Récupéation des coordonnée les 9 cases situé autour de la case séléctionnés
			// (la case selectionné c'est la 5)
			square1 = this._map[squareX-1][squareY-1].z;
			square2 = this._map[squareX][squareY-1].z;
			square3 = this._map[squareX-1][squareY-1].z;
			square4 = this._map[squareX-1][squareY].z;

			square5 = this._map[squareX][squareY].z;

			square6 = this._map[squareX+1][squareY].z;
			square7 = this._map[squareX-1][squareY+1].z;
			square8 = this._map[squareX][squareY+1].z;
			square9 = this._map[squareX+1][squareY+1].z;

			/***************************
			 	----- ----- -----
				|     |     |     |
				|   1 |   2 |   3 |
				 ----- ----- -----
				|     |     |     |
				|   4 |   5 |   6 |
				 ----- ----- -----
				|     |     |     |
				|   7 |   8 |   9 |
				 ----- ----- -----
			***************************/

			// Sur les case 2-4-8-9 attribution de nouvelle valeur en calculant la moyenne des valeurs des cases les entourants.
			// square 2
			this._map[squareX][squareY-1].z = (square1+square5+square3)/3;
			// square 4
			this._map[squareX-1][squareY].z = (square1+square5+square7)/3;
			// square 8
			this._map[squareX][squareY+1].z = (square5+square7+square9)/3;
			// square 6
			this._map[squareX+1][squareY].z = (square5+square3+square9)/3;

			// Gestion du nombre de passage
			if((count == squareMax-1) && (countPassages != nbPassage)){
				count = 0;
				countPassages++;
			}


			count++;
		}

	};

	/**
	 * [ description]
	 * @return {Integer} Id of the material
	 */
	nsEditor.TerrainGenerator._getFloorType = function () {
		var rand = (Math.floor((Math.random()*100)+this._materialsProbabilitySum())) / 100;

		for (var i=0; i< this._materials.length; i++) {
			var probaMax = 0;
			for (var j = 0; j < i+1; j++) {
				probaMax += this._materials[j].probability;
			}

			if (rand <= probaMax) {
				return this._materials[i].id;
			}
		}

		return 6; // Material 6 by default
	};

	/**
	 * [ description]
	 * @return { Int } The sum of materials probabilities
	 */
	nsEditor.TerrainGenerator._materialsProbabilitySum = function() {
		var sum = 0;

		for (var i in this._materials) {
			sum += this._materials[i].probability;
		}

		return sum;
	};

	/**
	 * [ description]
	 * @return {[type]} [description]
	 */
	nsEditor.TerrainGenerator._pushMaterial = function() {

	};

	nsEditor.TerrainGenerator._createElements = function() {

		for (var elementKey in this._elements) {
			var element = this._elements[elementKey];

			var sizeX = getRandomInt(10, 100);
			var sizeY = getRandomInt(10, 100);

			var test = element.create(sizeX, sizeY);
			var objectTest = JSON.parse(test);

			var posX = getRandomInt(0,100);
			var posY = getRandomInt(0,100);

			this._pushElement(objectTest, 10, 10);

			// var sizeX = getRandomInt(0, 50);
			// var sizeY = getRandomInt(0, 50);

			// var test = element.create(sizeX, sizeY);
			// var objectTest = JSON.parse(test);

			// var posX = getRandomInt(0,100);
			// var posY = getRandomInt(0,100);

			// this._pushElement(objectTest, posX, posY);


		}

	};

	/**
	 * [ description]
	 * @return {[type]} [description]
	 */
	nsEditor.TerrainGenerator._pushElement = function(element, x, y) {

		var elementHeight = element[0].length -1;
		var mapHeight = this._map[0].length -1;

		for (var i = 0; i < element.length; i++) {
			posX = i + x;
			if (posX <= this._map.length) {
				for (var j = 0; j < elementHeight; j++) {
					posY = j + y;
					if (posX <= mapHeight) {
						this._map[posX][posY].z += element[i][j].z;
						this._map[posX][posY].nature = element[i][j].nature;
					}
					
				}
			}
		}
	};

	/**
	 * [ description]
	 * @return {[type]} [description]
	 * @todo Set the scale correctly.
	 */
	nsEditor.TerrainGenerator._toJSON = function() {
		var map = {
			"echelle": 100,
			"lignes": this._map
		};

		return JSON.stringify(map);
	};

	/**
	 * [ description]
	 * 
	 * @param {array} materials
	 * @param {array} elements
	 * @param {int} width
	 * @param {int} height
	 * @param {int} zMin
	 * @param {int} zMax
	 * @return {object} Return a map in json format.
	 */
	nsEditor.TerrainGenerator.generate = function(materials, elements, width, height, zMin, zMax) {
		this._materials = materials;
		this._elements  = elements;
		this._width     = width;
		this._height    = height;
		this._zMin      = zMin;
		this._zMax      = zMax;

		this._map       = new Array();

		this._createBase();
		this._createElements();

		return this._toJSON();
	};
})();
