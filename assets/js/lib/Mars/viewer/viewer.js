(function() {
	var nsViewer = using('mars.viewer');

	/**
	 * [ description]
	 * @return {[type]}         [description]
	 */
	nsViewer.Viewer = function(map) {
		this.map = map;
	};

	/**
	 * [ description]
	 * @return {[type]} [description]
	 */
	nsViewer.Viewer.prototype.load2D = function(element) {
		var viewer = new nsViewer.Viewer2D(this, element);

		return viewer;
	};

	/**
	 * [ description]
	 * @return {[type]} [description]
	 */
	nsViewer.Viewer.prototype.load3D = function(element) {
		var viewer = new nsViewer.Viewer3D(this, element);

		return viewer;
	};
})();