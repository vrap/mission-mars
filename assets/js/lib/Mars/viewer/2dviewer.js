(function() {
	var nsViewer = using('mars.viewer');

	/**
	 * [ description]
	 * @return {[type]}         [description]
	 */
	nsViewer.Viewer2D = function(viewer, element, options) {
		this.viewer = viewer;
		this.element = element;
		this.options = (options) ? options : {};
	};
})();