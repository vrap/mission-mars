(function() {
	var nsEditor   = using('mars.editor');
	var nsElements = using('mars.editor.elements');

	var FLOOR_TYPES = [
		{
			id: 1, // Rock
			probability: 0.35
		},
		{
			id: 2, // Sand
			probability: 0.1
		},
		{
			id: 3, // Ice
			probability: 0.08
		},
		{
			id: 4, // Iron
			probability: 0.2
		},
		{
			id: 5, // Ore
			probability: 0.25
		},
		{
			id: 6, // Other
			probability: 0.02
		}
	];

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

			for (var j = 0; j <= this._height; j++) {
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
		var nb = (Math.floor((Math.random()*100)+1)) / 100;
		if (nb <= FLOOR_TYPES[0].probability) { 
			
			return FLOOR_TYPES[0].id; 
		} 
		if (nb <= FLOOR_TYPES[0].probability + FLOOR_TYPES[1].probability) {
			
			return FLOOR_TYPES[1].id;
		} 
		if (nb <= FLOOR_TYPES[0].probability + FLOOR_TYPES[1].probability + FLOOR_TYPES[2].probability) {
			
			return FLOOR_TYPES[2].id;
		}
		if (nb <= FLOOR_TYPES[0].probability + FLOOR_TYPES[1].probability + FLOOR_TYPES[2].probability + FLOOR_TYPES[3].probability) {
			
			return FLOOR_TYPES[3].id;
		}
		if (nb <= FLOOR_TYPES[0].probability + FLOOR_TYPES[1].probability + FLOOR_TYPES[2].probability + FLOOR_TYPES[3].probability + FLOOR_TYPES[4].probability) {
			
			return FLOOR_TYPES[4].id;
		}
		if (nb <= FLOOR_TYPES[0].probability + FLOOR_TYPES[1].probability + FLOOR_TYPES[2].probability + FLOOR_TYPES[3].probability + FLOOR_TYPES[4].probability + FLOOR_TYPES[5].probability ) {
			
			return FLOOR_TYPES[5].id;
		}
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

			var test = element.create(20, 20);
			var objectTest = JSON.parse(test);

			this._pushElement(objectTest, 50, 50);
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
						this._map[posX][posY] = element[i][j];
					}
				}
			}
		}
	};

	/**
	 * [ description]
	 * @return {[type]} [description]
	 */
	nsEditor.TerrainGenerator._toJSON = function() {
		return JSON.stringify(this._map);
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