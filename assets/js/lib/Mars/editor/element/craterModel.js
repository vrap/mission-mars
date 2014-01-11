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
		this.parent.create.call(this, width, height, materials);

		var minSize = (width <= height) ? width : height;
		var z = getRandomInt(2, Math.round(this._zMax/2));

		var x_center = Math.round(width/2)-1,
			y_center = Math.round(height/2)-1,
			rayon =	Math.round(minSize/2)-1;

		while (rayon >= 1) {

			drawCircle (x_center, y_center, rayon, z, this._element);
			
			if (z >= this._zMin) {
				var z_temp = 1;
				z-=z_temp;
			}

			rayon--;
		}

		/* Return the element and clean the var. */
		return this._toJSON(true);
	};
})();
