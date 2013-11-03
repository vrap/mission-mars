(function() {
	var nsCommon = using('mars.common');

	/**
	 * [ description]
	 * @return {[type]} [description]
	 */
	nsCommon.Map = function(terrain) {
		/* Define attributes. */
		this._terrain = {};
		this._squares = [];

		this._init(terrain);
	};

	nsCommon.Map.prototype._init = function(terrain) {
		this._fromJSON(terrain);
	};

	/**
	 * [ description]
	 * @return {[type]} [description]
	 */
	nsCommon.Map.prototype._fromJSON = function(terrain) {
		this._terrain = JSON.parse(terrain);
	};

	nsCommon.Map.prototype.getWidth = function() {
		return 10;
	};

	nsCommon.Map.prototype.getHeight = function() {
		return 10;
	};
})();