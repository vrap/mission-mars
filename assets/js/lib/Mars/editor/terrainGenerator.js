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

			for (var j = 0; j <= this._height; j++) {
				this._map[i][j] = {
					z: (this._zMin + this._zMax) /2,
					nature: 0
				};
			}
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