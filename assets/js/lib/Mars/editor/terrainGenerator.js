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
		for (var i = 0; i < this._width; i++) {
			this._map[i] = new Array();
			for (var j = 0; j < this._height; j++) {
				this._map[i][j] = { z: (this._zMin + this._zMax) /2,
					nature: this._getFloorType()
				};
			}
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
