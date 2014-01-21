(function() {
	var nsElements = using('mars.editor.element');

	/**
	 * [ description]
	 *
	 * @constructor
	 * @this {HillModel}
	 */
	nsElements.HillModel = function() {
		/* Inherit from parent, and call his constructor. */
		this.parent = this.__proto__.__proto__;
		this.parent.constructor.apply(this, arguments);
	};

	/**
	 * Inherit from Model class.
	 * 
	 * @this {HillModel}
	 */
	nsElements.HillModel.prototype.__proto__ = nsElements.Model.prototype;

	/**
	 * Create an hill
	 *
	 * @this {HillModel}
	 * @param  {int} width
	 * @param  {int} height
	 * @param  {array} materials Allowed materials for this element
	 */
	nsElements.HillModel.prototype.create = function(width, height, materials) {
		// Create mini map from parent
		this.parent.create(width, height, materials);

		var minSize = (width <= height) ? width : height,
			z = getRandomInt(1, Math.round(this._zMax/10)),
			x_center = Math.round(width/2)-1,
			y_center = Math.round(height/2)-1,
			rayon =	Math.round(minSize/2)-1;

		while (rayon >= 1) {
			drawCircle (x_center, y_center, rayon, z, this._element);
			// Increase Z value			
			if (z <= this._zMax) {
				var z_temp = getRandomInt(1, 2);
				z+=z_temp;
			}
			rayon--;
		}
		/* Return the element and clean the var. */
		return this._toJSON(true);
	};
})();