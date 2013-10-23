(function() {
	var nsElements = using('mars.editor.element');

	/**
	 * [ description]
	 *
	 * @constructor
	 * @this {MountainModel}
	 */
	nsElements.MountainModel = function() {
		/* Inherit from parent, and call his constructor. */
		this.parent = this.__proto__.__proto__;
		this.parent.constructor.apply(this, arguments);
	};

	/**
	 * Inherit from Model class.
	 * 
	 * @this {MountainModel}
	 */
	nsElements.MountainModel.prototype.__proto__ = nsElements.Model.prototype;

	/**
	 * [ description]
	 *
	 * @this {MountainModel}
	 * @param  {int} width     [description]
	 * @param  {int} height    [description]
	 * @param  {array} materials [description]
	 */
	nsElements.MountainModel.prototype.create = function(width, height, materials) {
		if (!materials) {
			materials = this.allowedMaterials;
		}
	};
})();