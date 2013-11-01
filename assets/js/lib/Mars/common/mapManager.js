/**
 * The MapManager, contains maps.
 * @return {[type]} [description]
 */
function MapManager() {
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
MapManager.prototype.load = function(map, add) {
};

/**
 * Add map to the MapManager.
 * @param  {[type]} map [description]
 * @return {[type]}     [description]
 */
MapManager.prototype.add = function(map) {
	return this.mapList[this.mapList.push(map)];
};

/**
 * Remove a map to the MapManager.
 */
MapManager.prototype.remove = function(map) {
	var existingMap = this.mapList.filter(function(data) {
		return map == data;
	});

	console.log(existingMap);
};