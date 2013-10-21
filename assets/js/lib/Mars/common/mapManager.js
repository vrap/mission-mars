var nsCommon = using('mars.common');

/**
 * The MapManager, contains maps.
 * @return {[type]} [description]
 */
nsCommon.MapManager = function() {
	// Contain the map list.
	this.mapList = new Array();

	initialize = function() {
		/**
		 * Add known map by the user.
		 */
	};

	initialize();
};

/**
 * Loading json into map object.
 * @param  {[type]} map [description]
 * @param  {[type]} add  [description]
 * @return {[type]}      [description]
 */
nsCommon.MapManager.prototype.load = function(map, add) {
};

/**
 * Add map to the MapManager.
 * @param  {[type]} map [description]
 * @return {[type]}     [description]
 */
nsCommon.MapManager.prototype.add = function(map) {
	return this.mapList[this.mapList.push(map)];
};

/**
 * Remove a map to the MapManager.
 */
nsCommon.MapManager.prototype.remove = function(map) {
	var existingMap = this.mapList.filter(function(data) {
		return map == data;
	});

	console.log(existingMap);
};