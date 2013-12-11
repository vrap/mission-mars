(function() {
	var nsElements = using('mars.editor.element');

	/**
	 * Constructor of the model elements.
	 *
	 * @constructor
	 * @param  {array} allowedMaterials An array of Material instance.
	 * @param  {int} zMin             The minimum z value.
	 * @param  {int} zMax             The maximum z value.
	 */
	nsElements.Model = function(allowedMaterials, zMin, zMax) {
		this._zMin = zMin;
		this._zMax = zMax;
		this._allowedMaterials = allowedMaterials;
	};

	/**
	 * Create an element regarding the model.
	 *
	 * @this {Model}
	 * @param  {int} width     Width of the element.
	 * @param  {int} height    Height of the element.
	 * @param  {array} materials Allowed materials for the element.
	 */
	nsElements.Model.prototype.create = function(width, height, materials) {
		/* Define default materials. */
		if (!materials) {
			materials = this._allowedMaterials;
		}

		/* Define element container. */
		this._element = new Array();

		/* Define current width. */
		this._width = (!(isNaN(parseInt(width)))) ? parseInt(width) : 0;
		this._height = (!(isNaN(parseInt(height)))) ? parseInt(height) : 0;

		/* Create an empty element.*/
		this._init();
	};

	/**
	 * Initialize the element by creating a "mini map" to create the element inside it.
	 *
	 * @this {Model}
	 */
	nsElements.Model.prototype._init = function() {

		for (var i = 0; i < this._width; i++) {
			this._element[i] = new Array();
			for (var j = 0; j < this._height; j++) {
				this._element[i][j] = {
					z: 0,
					nature: 1
				};
			}
		}
	};

	/**
	 * Return the generated element in json.
	 *
	 * @this {Model}
	 * @param  {bool} reset If defined to true reset the element values.
	 * @return {object} Return the element object.
	 */
	nsElements.Model.prototype._toJSON = function(reset) {
		var element = this._element;

		if (reset == true) {
			this._reset();
		}

		return JSON.stringify(element);
	};

	/**
	 * Remove value associated to the element generation from the model.
	 *
	 * @this {Model}
	 */
	nsElements.Model.prototype._reset = function() {
		this._element = null;
		this._width = 0;
		this._height = 0;
	};
})();
