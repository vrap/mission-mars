(function() {
    var nsViewer = using('mars.viewer');
    

    /**
     * Constructor
     */
    nsViewer.Viewer = function(map) {
	this.map = map;
	this.viewers = {};
	this._allowedType = {
	    '2d': 'Viewer2D',
	    '3d': 'Viewer3D'
	};
    };

    /**
     * Check if the viewer is instanciated
     */
    nsViewer.Viewer.prototype.hasViewer = function(element) {
	if (this.viewers.hasOwnProperty(element)) {
	    return true;
	}

	return false;
    };

    /**
     * Instancy a viewer if it's available
     */
    nsViewer.Viewer.prototype.load = function(type, element, options, moved) {
	// Check if the viewer typr is available
	if (this._allowedType.hasOwnProperty(type)) {
	    type = this._allowedType[type];
	    // When the viewer is not already loaded
	    if (!this.hasViewer(element)) {
		this.viewers[element] = new nsViewer[type](this, element, options, moved);
		// Return new instance of viewer
		return this.viewers[element];
	    }
	}
    };

    /**
     * Load 2D Viewer
     */
    nsViewer.Viewer.prototype.load2D = function(element, options, moved) {
	return this.load('2d', element, options, moved);
    };

    /**
     * Load 3D Viewer
     */
    nsViewer.Viewer.prototype.load3D = function(element, options) {
	return this.load('3d', element, options);
    };
})();
