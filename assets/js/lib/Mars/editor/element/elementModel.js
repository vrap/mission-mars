(function() {
	var nsElements = using('mars.editor.element');

	/**
	 * [ description]
	 * @param  {array} allowedMaterials [description]
	 * @param  {int} zMin             [description]
	 * @param  {int} zMax             [description]
	 */
	nsElements.Model = function(allowedMaterials, zMin, zMax) {
		this.zMin = zMin;
		this.zMax = zMax;
		this.allowedMaterials = allowedMaterials;
	};
})();