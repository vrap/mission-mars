(function() {
    var nsCommon = using('mars.common');

    /**
     * Constructor
     */
    nsCommon.Map = function(terrain) {
	/* Define attributes. */
	this._terrain = {};
	this._squares = [];

	this._init(terrain);
    };

    /**
     * Initialize the map.
     */
    nsCommon.Map.prototype._init = function(terrain) {
	this._fromJSON(terrain);
    };

    /**
     * Hydrates map from values of a JSon.
     */
    nsCommon.Map.prototype._fromJSON = function(terrain) {
	try {
	    this._terrain = JSON.parse(terrain);
	}
	catch(e) {
	    throw new Error('Invalid JSON format');
	}

	this._squares = this._terrain.map;
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
     * need to be equals. 
     */
    nsCommon.Map.prototype.getHeight = function() {
	return this._squares[0].length;
    };

    /**
     * Obtains the value of an element of the map.
     * @param  {Integer} x Square's position X
     * @param  {Integer} y Square's position Y
     * @return {Array element}
     */
    nsCommon.Map.prototype.getSquare = function(x, y) {
	if (this._squares[x] && this._squares[x][y]) {
	    return this._squares[x][y];
	}
    };

    /**
     * Check the validity of a map.
     * @return {boolean}
     */
    nsCommon.Map.prototype.checkValidity = function() {
	if (this.getWidth() == this.getHeight()) {
	    for (var rowKey in this._squares) {
		var row = this._squares[rowKey];

		if (row.length != this.getWidth()) {
		    return false;
		}

		for (var columnKey in row) {
		    var column = row[columnKey];

		    if (column.hasOwnProperty('z') && column.hasOwnProperty('type')) {
			if (!isInt(column.z)) {
			    return false;
			}

			if (!isInt(column.type) || column.type < 0 || column.type > 5) {
			    return false;
			}
		    }
		    else {
			return false;
		    }
		}
	    }
	}
	else {

	    return false;
	}

	return true;
    };
})();
