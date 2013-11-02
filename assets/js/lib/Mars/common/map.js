(function() {
	var nsCommon = using('mars.common');

	/**
	 * [ description]
	 * @return {[type]} [description]
	 */
	nsCommon.Map = function(terrain) {
		/* Define attributes. */
		this._terrain = terrain;
		this._squares = [];

		this._init(this._terrain);
	};

	nsCommon.Map.prototype._init = function() {
		this._fromJSON();
	};

	/**
	 * [ description]
	 * @return {[type]} [description]
	 */
	nsCommon.Map.prototype._fromJSON = function() {
		JSON.parse(this._terrain);
	};
})();