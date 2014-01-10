(function() {
	var nsMemory = using('mars.rover.memory');
	var nsCommon = using('mars.common');

	/**
	 * Class constructor of the memory.
	 */
	nsMemory.Memory = function() {
		/**
 	 	 * Pattern 
 	 	 * [
 	 	 *   	{ 
 	 	 *			x0, y0, z0, type0, status0, adjacents: { north, northEast, east, southEast, 
 	 	 *											         south, southWest, west, northWest }
 	 	 *   	}
 	 	 * ]
 	 	 *
	 	 * status: 0 (visited), 1 (inaccessible), -1 (yet unknown)
	 	 */
		this.memory = new Array();
	};

	/**
	 * Add a square in memory.
	 * 
	 * @param  {int}     x         position of the square.
	 * @param  {int}     y         position of the square.
	 * @param  {float}   z         elevation of the square.
	 * @param  {int}     type      nature of the square.
	 * @param  {int}     status    state of the squre (0 (visited), 1 (inaccessible), -1 (yet unknown)).
	 * @param  {array}   adjacents state of 9 squares around.
	 * @return {boolean}           true if added, false otherwise.
	 *
	 * TODO: prefer square array in parameter?
	 */
	nsMemory.Memory.prototype.createEmplacement = function(x, y, z, type, status, adjacents) {
		if (x < 0 || y < 0) {
			throw new Error('X and Y can only be set superior to 0.');
		}

		if (type < 1 || type > 6) {
			throw new Error('Type can only be set between 1 and 6.');
		}

		if (status != 0 && status != 1 && status != -1) {
			throw new Error('Status can only be set between -1 and 1.');
		}

		var memorySize = this.getMemorySize();
		var square     = {
			x: x,
			y: y,
			z: z,
			type: type,
			status: status,
			adjacents: adjacents
		};

		this.memory.push(square);

		if (memorySize == this.getMemorySize()) {
			return false;
		}

		return true;
	};

	/**
	 * Read a square stored in memory, find by x and y position.
	 * 
	 * @param  {int}   x position of the square.
	 * @param  {int}   y position of the square.
	 * @return {array}   the square with all this properties.
	 */
	nsMemory.Memory.prototype.readEmplacement = function(x, y) {
		if (x < 0 || y < 0) {
			throw new Error('X and Y can only be set superior to 0.');
		}

		return this.memory.filter(function(square) {
  			return (square.x == x && square.y == y);
		});
	};

	/**
	 * Search a square in memory, find by x and y position, then update with new properties.
	 * 
	 * @param  {int}     x         position of the square.
	 * @param  {int}     y         position of the square.
	 * @param  {int}     z         elevation of the square.
	 * @param  {int}     type      nature of the square.
	 * @param  {int}     status    state of the squre (0 (visited), 1 (inaccessible), -1 (yet unknown)).
	 * @param  {array}   adjacents state of 9 squares around.
	 * @return {boolean}           true if modified, false otherwise.
	 */
	nsMemory.Memory.prototype.updateEmplacement = function(x, y, z, type, status, adjacents) {
		if (x < 0 || y < 0) {
			throw new Error('X and Y can only be set superior to 0.');
		}

		if (type < 1 || type > 6) {
			throw new Error('Type can only be set between 1 and 6.');
		}

		if (status != 0 && status != 1 && status != -1) {
			throw new Error('Status can only be set between -1 and 1.');
		}

		this.memory = this.memory.filter(function(square) {
    		if (square.x == x && square.y == y) {
    			square.z         = z;
    			square.type      = type;
    			square.status    = status;
    			square.adjacents = adjacents;

    			return true;
    		}
  		});

  		return false;
	};

	/**
	 * Search and delete a square in memory, find by x and y position.
	 * 
	 * @param  {int}     x         position of the square.
	 * @param  {int}     y         position of the square.
	 * @return {boolean}           true if modified, false otherwise.
	 */
	nsMemory.Memory.prototype.deleteEmplacement = function(x, y) {
		if (x < 0 || y < 0) {
			throw new Error('X and Y can only be set superior to 0.');
		}

		this.memory = this.memory.filter(function(square) {
    		if (square.x == x && square.y == y) {
    			square.z         = null;
    			square.type      = null;
    			square.status    = null;
    			square.adjacents = null;

    			return true;
    		}
  		});

  		return false;
	};

	/**
	 * Empty all memory.
	 *
	 * @return {boolean} true if memory is empty, false otherwise.
	 */
	nsMemory.Memory.prototype.resetMemory = function() {
		this.memory = new Array();

		if (this.getMemorySize() != 0) {
			return false;
		}

		return true;
	};

	/**
	 * Return the current size of memory.
	 * 
	 * @return {int} number of squares stored in memory.
	 */
	nsMemory.Memory.prototype.getMemorySize = function() {
		return this.memory.length;
	};
})();