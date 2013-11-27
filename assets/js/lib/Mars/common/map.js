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
		this._squares = this._terrain.lignes;
	};

	/**
	 * Return the width of the terrain, assume that it's equal to the number of
	 * propertie of the terrain object as each is a column.
	 */
	nsCommon.Map.prototype.getWidth = function() {
		return this._squares.length;
	};

	/**
	 * Return the height of the terrain, assume that it's equal to the
	 * number of propertie of the first line of the terrain. Each line
	 * need to be equals. We are substracting the result by one because
	 * of the properties begin to 0.
	 */
	nsCommon.Map.prototype.getHeight = function() {
		return this._squares[0].length -1;
	};
})();
