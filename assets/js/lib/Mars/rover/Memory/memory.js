(function() {
    var nsMemory = using('mars.rover.memory');
    var nsCommon = using('mars.common');

    /**
     * Class constructor of the memory.
     *
     * @constructor
     */
    nsMemory.Memory = function() {
	/**
 	 * Pattern 
 	 * [
 	 *   	{ 
 	 *			x0, y0, z0, type0, status0
 	 *   	}
 	 * ]
 	 *
	 * status: 0 (visited), 1 (inaccessible), -1 (yet unknown)
	 */
	this.memory = new Array();
    };

    /**
     * Check if a square is in the memory of if a property of a square exist.
     *
     * @this {Memory}
     * @param {integer} x Position of the square.
     * @param {integer} y Position of the square.
     * @param {string} [param] Name of the param to check if empty or not.
     * @return {bool} Return true if the property or square exist; otherwise false.
     */
    nsMemory.Memory.prototype.has = function(x, y, param) {
	var square = this.memory.filter(function(square) {
	    return (square.x == x && square.y == y);
	});

	if (square.length > 0) {
	    square = square[0];

	    if (param) {
		if (square[param]) {
		    return true;
		}

		return false;
	    }

	    return true;
	}

	return false;
    };

    /**
     * Read a square stored in memory, find by x and y position.
     * 
     * @this {Memory}
     * @param  {int}   x position of the square.
     * @param  {int}   y position of the square.
     * @return {array}   the square with all this properties.
     */
    nsMemory.Memory.prototype.get = function(x, y) {
	if (this.has(x, y)) {
	    var square = this.memory.filter(function(data) {
		return (data.x == x && data.y == y);
	    });

	    if (square.length > 0) {
		return square[0];
	    }
	}
    };

    /**
     * Read a range of squares stored in memory.
     *
     * @this {Memory}
     * @param {integer}  x1 position of the first square of the range.
     * @param {integer}  x2 position of the first square of the range.
     * @param {integer}  y1 position of the first square of the range.
     * @param {integer}  y2 position of the first square of the range.
     * @return {array} An array of squares.
     */
    nsMemory.Memory.prototype.getRange = function(x1, y1, x2, y2) {
	var squares = [];

	for (var i = x1; i <= x2; i++) {
	    for (var j = y1; j <= y2; j++) {
		var square = this.get(i, j);

		if (square) {
		    squares.push(this.get(i, j));
		}
	    }
	}

	return squares;
    };

    /**
     * Search a square in memory, find by x and y position, then update with
     * new properties or create it if does not exist.
     * 
     * @this {Memory}
     * @param  {integer}     x         position of the square.
     * @param  {integer}     y         position of the square.
     * @param  {integer}     z         elevation of the square.
     * @param  {integer}     type      nature of the square.
     * @param  {boolean}     visited   how much time the square has been visited.
     * @return {object}                Return the new/updated square.
     */
    nsMemory.Memory.prototype.createOrUpdate = function(x, y, z, type, visited) {
	if (x < 0 || y < 0) {
	    throw new Error('X and Y can only be set superior to 0.');
	}

	var square = {
	    x: x,
	    y: y,
	    z: null,
	    visited: 0
	};

	if (this.has(x, y)) {
	    square = this.get(x, y);
	}

	if (z != null) {
	    if (isNaN(parseInt(z))) {
		throw new Error('Z need to be an integer.');
	    }

	    square.z = z;
	}
	else {
	    square.z = square.z;
	}

	if (type != null) {
	    if (type < 0 || type > 6) {
		throw new Error('Type can only be set between 1 and 6.');
	    }

	    square.type = type;
	}
	else {
	   square.type = square.type;
	}

	if (visited != null) {
	    if (typeof visited != 'boolean') {
		throw new Error('Visited need to be a boolean.');
	    }

	    square.visited++;
	}
	else {
	    square.visited = square.visited;
	}

	if (!this.has(x, y)) {
	    this.memory.push(square);
	}

	return square;
    };

    /**
     * Search and delete a square in memory, find by x and y position.
     * 
     * @this {Memory}
     * @param  {integer}     x         position of the square.
     * @param  {integer}     y         position of the square.
     * @return {boolean}           true if modified, false otherwise.
     */
    nsMemory.Memory.prototype.delete = function(x, y) {
	if (x < 0 || y < 0) {
	    throw new Error('X and Y can only be set superior to 0.');
	}

	if (this.has(x, y)) {
	    var square = this.get(x, y);
	    square.z = null;
	    square.type = null;
	    square.visited = null;

	    return true;
	}

	return false;
    };

    /**
     * Empty all memory.
     *
     * @this {Memory}
     * @return {boolean} true if memory is empty, false otherwise.
     */
    nsMemory.Memory.prototype.reset = function() {
	this.memory = new Array();

	if (this.getSize() != 0) {
	    return false;
	}

	return true;
    };

    /**
     * Return the current size of memory.
     * 
     * @this {Memory}
     * @return {integer} number of squares stored in memory.
     */
    nsMemory.Memory.prototype.getSize = function() {
	return this.memory.length;
    };

    /**
     * Return all squares stored in memory.
     *
     * @this {Memory}
     * @return {array} array that contains all squares.
     */
    nsMemory.Memory.prototype.readAll = function() {
	return this.memory;
    };
})();
