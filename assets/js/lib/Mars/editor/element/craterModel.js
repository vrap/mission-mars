(function() {
	var nsElements = using('mars.editor.element');

	/**
	 * [ description]
	 *
	 * @constructor
	 * @this {CraterModel}
	 */
	nsElements.CraterModel = function() {
		/* Inherit from parent, and call his constructor. */
		this.parent = this.__proto__.__proto__;
		this.parent.constructor.apply(this, arguments);
	};

	/**
	 * Inherit from Model class.
	 * 
	 * @this {CraterModel}
	 */
	nsElements.CraterModel.prototype.__proto__ = nsElements.Model.prototype;

	/**
	 * [ description]
	 *
	 * @this {CraterModel}
	 * @param  {int} width     [description]
	 * @param  {int} height    [description]
	 * @param  {array} materials [description]
	 */
	nsElements.CraterModel.prototype.create = function(width, height, materials) {
		/* Initialize the creation of the element. */
		this.parent.create(width, height, materials);

		/* Generate a crater. */
		for (var i = 0; i < this._element.length; i++) {
			for (var j = 0; j < this._element[0].length; j++) {
				this._element[i][j].z = 10;
			}
		}

		/* Return the element and clean the var. */
		return this._toJSON(true);
	};
})();