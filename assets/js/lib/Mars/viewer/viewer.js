(function() {
	var nsViewer = using('mars.viewer');

	/**
	 * [ description]
	 * @return {[type]}         [description]
	 */
	nsViewer.Viewer = function(map) {
		this.map = map;
		this.viewers = {};
		this._allowedType = {
			'2d': 'Viewer2D',
			'3d': 'Viewer3D'
		};
	};

	nsViewer.Viewer.prototype.hasViewer = function(element) {
		if (this.viewers.hasOwnProperty(element)) {
			return true;
		}

		return false;
	};

	nsViewer.Viewer.prototype.load = function(type, element) {
		if (this._allowedType.hasOwnProperty(type)) {
			type = this._allowedType[type];

			if (element instanceof HTMLDivElement) {
				if (!this.hasViewer(element)) {
					this.viewers[element] = new nsViewer[type](this, element);

					return this.viewers[element];
				}
			}
			else {
				throw new TypeError('DOM Element "' + element + '" does not exist');
			}
		}
	};

	/**
	 * [ description]
	 * @return {[type]} [description]
	 */
	nsViewer.Viewer.prototype.load2D = function(element) {
		return this.load('2d', element);
	};

	/**
	 * [ description]
	 * @return {[type]} [description]
	 */
	nsViewer.Viewer.prototype.load3D = function(element) {
		return this.load('3d', element);
	};
})();