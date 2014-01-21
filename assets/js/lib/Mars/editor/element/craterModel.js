(function() {
	var nsElements = using('mars.editor.element');

	/**
	 * Constructor
	 */
	nsElements.CraterModel = function() {
		/* Inherit from parent, and call his constructor. */
		this.parent = this.__proto__.__proto__;
		this.parent.constructor.apply(this, arguments);
	};

	/**
	 * Inherit from Model class.
	 */
	nsElements.CraterModel.prototype.__proto__ = nsElements.Model.prototype;

	/**
	 * Create a crater
	 *
	 * @param  {int} width
	 * @param  {int} height
	 * @param  {array} materials Materials availables for this element
	 */
	nsElements.CraterModel.prototype.create = function(width, height, materials) {
		/* Initialize the creation of the element. */
		this.parent.create.call(this, width, height, materials);

		var minSize = (width <= height) ? width : height,
			z = getRandomInt(2, Math.round(this._zMax/2)),
			x_center = Math.round(width/2)-1,
			y_center = Math.round(height/2)-1,
			rayon =	Math.round(minSize/2)-1;

		// Up Z value from the outside to the middle of the crater
		while (rayon >= 1) {
			drawCircle (x_center, y_center, rayon, z, this._element);
			// Reduce Z only if it's grater than  zMin to don't have a cone
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
